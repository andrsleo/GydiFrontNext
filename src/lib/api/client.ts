/**
 * API Client Configuration
 *
 * Axios instance configured with interceptors for authentication,
 * error handling, and request/response transformation.
 *
 * COOKIES-ONLY AUTHENTICATION (All Environments):
 * - Backend always sets httpOnly cookies (local, dev, prod)
 * - Cookies sent automatically via withCredentials: true
 * - Next.js middleware requires cookies (can't read localStorage server-side)
 *
 * SECURITY NOTES:
 * - httpOnly cookies prevent XSS attacks (JavaScript cannot access)
 * - SameSite=Lax for localhost (same-origin protection)
 * - SameSite=None + Secure for production (cross-domain with HTTPS)
 * - CSRF protection required for cross-domain requests
 */

import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';

/**
 * Detect environment
 */
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Base API client
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CRITICAL: Send httpOnly cookies automatically
  timeout: 30000,
});

/**
 * Request interceptor - Add CSRF token for state-changing requests
 *
 * COOKIES-ONLY AUTHENTICATION STRATEGY:
 * - httpOnly cookies sent automatically via withCredentials: true
 * - Backend extracts token from cookie (priority) or Authorization header (fallback)
 * - No need to manually add Authorization header
 *
 * CSRF PROTECTION:
 * - Backend uses CSRF tokens for cross-domain requests (Vercel → Railway)
 * - CSRF tokens sent in X-XSRF-TOKEN header for POST/PUT/PATCH/DELETE
 * - GET requests don't need CSRF tokens (safe methods)
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Skip adding CSRF token for public endpoints
    const publicEndpoints = [
      '/api/v1/auth/login',
      '/api/v1/auth/register',
      '/api/v1/users/register', // User registration endpoint
      '/api/v1/auth/refresh', // Refresh token endpoint
      '/api/v1/auth/csrf', // CSRF token endpoint
    ];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.startsWith(endpoint)
    );

    // ✅ COOKIES-ONLY STRATEGY (All Environments)
    // httpOnly cookies are sent automatically via withCredentials: true
    // Backend extracts token from cookie (priority) or Authorization header (fallback)
    // No need to manually add Authorization header - cookies handle everything

    // ✅ Add CSRF token for state-changing requests
    const method = config.method?.toUpperCase();
    const requiresCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method || '');

    if (requiresCsrf && !isPublicEndpoint && typeof window !== 'undefined') {
      const csrfToken = getCsrfTokenFromCookie();

      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
        // console.log(`[API Client] ✅ CSRF token added for ${method} ${config.url}`); // Commented to reduce console noise
      } else {
        console.warn(
          `[API Client] ⚠️ CSRF token NOT FOUND for ${method} request to ${config.url}`
        );
        console.warn('[API Client] Available cookies:', document.cookie);
        console.warn('[API Client] Attempting to fetch CSRF token...');

        // Try to fetch CSRF token immediately
        await fetchCsrfToken();

        // Retry getting the token
        const retryToken = getCsrfTokenFromCookie();
        if (retryToken) {
          config.headers['X-XSRF-TOKEN'] = retryToken;
          // console.log('[API Client] ✅ CSRF token fetched and added successfully'); // Commented to reduce console noise
        } else {
          console.error('[API Client] ❌ Failed to obtain CSRF token. Request will likely fail with 403.');
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
)

/**
 * Extract CSRF token from cookie (XSRF-TOKEN)
 *
 * The CSRF token is set by the backend in a non-httpOnly cookie
 * so that JavaScript can read it and send it in the X-XSRF-TOKEN header.
 */
function getCsrfTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null; // SSR safety

  const csrfCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='));

  if (!csrfCookie) return null;

  const token = csrfCookie.split('=')[1];
  return decodeURIComponent(token);
}

/**
 * Fetch CSRF token from backend
 *
 * Call this on app initialization to ensure CSRF token cookie is set.
 * The backend will automatically set the XSRF-TOKEN cookie in the response.
 */
export async function fetchCsrfToken(): Promise<void> {
  try {
    await apiClient.get('/api/v1/auth/csrf');
  } catch (error) {
    console.error('[API Client] Failed to fetch CSRF token:', error);
    // Don't throw - app can still work without CSRF token for GET requests
  }
}

/**
 * Response interceptor - Handle errors, token refresh, and CSRF retries
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle token expiration (401) - Attempt refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        try {
          // ✅ COOKIES-ONLY REFRESH STRATEGY (All Environments)
          // Backend reads refresh_token from httpOnly cookie
          // Backend validates, generates new tokens, sets new cookies automatically
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/auth/refresh`,
            {}, // No body needed - refresh_token is in cookie
            { withCredentials: true }
          );

          // Retry the original request (cookies automatically sent)
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed - clean up session marker and old tokens
          if (typeof window !== 'undefined') {
            // Clear session marker cookie (cross-origin auth)
            document.cookie = 'gydi_session=; path=/; max-age=0; SameSite=Lax; Secure';
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
          window.location.href = '/login?error=SessionExpired';
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }

    // Handle CSRF token validation failure (403) - Retry once with new token
    if (error.response?.status === 403 && !originalRequest._csrfRetry) {
      originalRequest._csrfRetry = true;

      try {
        // Re-fetch CSRF token
        await fetchCsrfToken();

        // Retry original request with new CSRF token
        const newCsrfToken = getCsrfTokenFromCookie();
        if (newCsrfToken && originalRequest.method?.toUpperCase() !== 'GET') {
          originalRequest.headers['X-XSRF-TOKEN'] = newCsrfToken;
        }

        return apiClient(originalRequest);
      } catch (csrfError) {
        console.error('[API Client] CSRF token refresh failed:', csrfError);
        return Promise.reject(error);
      }
    }

    // Handle other errors
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 403:
          console.error('Permission denied (possibly CSRF validation failed):', error.response.data);
          break;
        case 404:
          console.error('Resource not found:', error.response.data);
          break;
        case 500:
          console.error('Server error:', error.response.data);
          break;
        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      console.error('Network error:', error.message);
    } else {
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Type-safe API request wrapper
 */
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>(config);
  return response.data;
}

/**
 * GET request helper
 */
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>({ ...config, method: 'GET', url });
}

/**
 * POST request helper
 */
export async function post<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiRequest<T>({ ...config, method: 'POST', url, data });
}

/**
 * PUT request helper
 */
export async function put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>({ ...config, method: 'PUT', url, data });
}

/**
 * PATCH request helper
 */
export async function patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>({ ...config, method: 'PATCH', url, data });
}

/**
 * DELETE request helper
 */
export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>({ ...config, method: 'DELETE', url });
}
