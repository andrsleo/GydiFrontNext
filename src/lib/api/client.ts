/**
 * API Client Configuration
 *
 * Axios instance configured with interceptors for authentication,
 * error handling, and request/response transformation.
 *
 * BACKEND-ONLY AUTHENTICATION:
 * - Production: Backend creates httpOnly cookies (XSS-proof)
 * - Development: Backend returns JSON, frontend stores in localStorage
 * - Backend controls 100% of authentication flow
 *
 * SECURITY NOTE:
 * - Backend uses JWT stateless authentication (NO CSRF tokens needed)
 * - CSRF protection is DISABLED in backend SecurityConfig
 * - Authentication via Authorization header (dev) or httpOnly cookies (prod)
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
  withCredentials: true, // CRITICAL: Send cookies automatically in production
  timeout: 30000,
});

/**
 * Request interceptor - Add JWT authentication token and CSRF token
 *
 * BACKEND-ONLY AUTHENTICATION STRATEGY:
 * - Development: Use Authorization header with JWT token from localStorage
 * - Production: httpOnly cookies sent automatically via withCredentials
 *
 * CSRF PROTECTION:
 * - Backend uses CSRF tokens for cross-domain requests (Vercel → Railway)
 * - CSRF tokens sent in X-XSRF-TOKEN header for POST/PUT/PATCH/DELETE
 * - GET requests don't need CSRF tokens (safe methods)
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Skip adding token for public endpoints (exact matches only)
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

    if (!isPublicEndpoint && typeof window !== 'undefined') {
      // ONLY in development: use Authorization header with token from localStorage
      if (isDevelopment) {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      // In production: httpOnly cookies are sent automatically via withCredentials
      // No need to add Authorization header - backend extracts token from cookie
    }

    // ✅ Add CSRF token for state-changing requests
    const method = config.method?.toUpperCase();
    const requiresCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method || '');

    if (requiresCsrf && !isPublicEndpoint && typeof window !== 'undefined') {
      const csrfToken = getCsrfTokenFromCookie();

      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      } else {
        console.warn(
          `[API Client] CSRF token not found for ${method} request to ${config.url}. ` +
          'Request may be rejected by server. Call /api/v1/auth/csrf to obtain token.'
        );
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
          if (isDevelopment) {
            // DEVELOPMENT: Send refresh_token from localStorage
            const refreshToken = localStorage.getItem('refresh_token');

            if (!refreshToken) {
              // No refresh token available - redirect to login
              window.location.href = '/login?error=SessionExpired';
              return Promise.reject(error);
            }

            // Call refresh endpoint
            const { data } = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/auth/refresh`,
              { refreshToken },
              { withCredentials: true }
            );

            // Store new tokens
            localStorage.setItem('access_token', data.token);
            if (data.refreshToken) {
              localStorage.setItem('refresh_token', data.refreshToken);
            }

            // Update Authorization header for retry
            originalRequest.headers.Authorization = `Bearer ${data.token}`;
          } else {
            // PRODUCTION: Backend reads refresh_token from httpOnly cookie
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/auth/refresh`,
              {},
              { withCredentials: true }
            );
            // Backend automatically updates cookies
            // No need to store anything in frontend
          }

          // Retry the original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed - clear tokens and redirect to login
          if (isDevelopment) {
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