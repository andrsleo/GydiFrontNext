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
 * CSRF PROTECTION (Option B+D):
 * - Option B: CSRF token fetched from response body (not cookie) and stored in memory
 *   Required for cross-origin (Vercel → Railway) where document.cookie can't read
 *   cookies set by a different domain.
 * - Option D: X-Requested-With: XMLHttpRequest header on all state-changing requests
 *   Defense in depth - custom headers require CORS preflight, blocking simple CSRF attacks.
 *
 * SECURITY NOTES:
 * - httpOnly cookies prevent XSS attacks (JavaScript cannot access)
 * - SameSite=Lax for localhost (same-origin protection)
 * - SameSite=None + Secure for production (cross-domain with HTTPS)
 * - CSRF token stored in memory (not accessible to XSS via cookies)
 */

import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';

/**
 * In-memory CSRF token storage (Option B: Synchronizer Token Pattern)
 *
 * Token is fetched from the backend response body and stored here.
 * This avoids the cross-origin cookie problem where document.cookie
 * cannot read cookies set by a different domain (Railway).
 */
let csrfToken: string | null = null;

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
 * Request interceptor - Add CSRF token and X-Requested-With for state-changing requests
 *
 * CSRF PROTECTION (Option B+D):
 * - B: Send CSRF token from memory in X-XSRF-TOKEN header
 * - D: Send X-Requested-With: XMLHttpRequest header (defense in depth)
 * - Both headers required for POST/PUT/PATCH/DELETE on non-public endpoints
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Public endpoints exempt from CSRF protection
    const publicEndpoints = [
      '/api/v1/auth/login',
      '/api/v1/auth/register',
      '/api/v1/users/register',
      '/api/v1/auth/refresh',
      '/api/v1/auth/csrf',
      '/api/v1/referrals/resolve',
    ];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.startsWith(endpoint)
    );

    // Add CSRF token + X-Requested-With for state-changing requests
    const method = config.method?.toUpperCase();
    const requiresCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method || '');

    if (requiresCsrf && !isPublicEndpoint) {
      // Option D: Always send X-Requested-With header
      config.headers['X-Requested-With'] = 'XMLHttpRequest';

      // Option B: Send CSRF token from memory
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      } else if (typeof window !== 'undefined') {
        // Token not in memory - fetch it (first request scenario)
        await fetchCsrfToken();
        if (csrfToken) {
          config.headers['X-XSRF-TOKEN'] = csrfToken;
        } else {
          console.warn(
            `[API Client] CSRF token not available for ${method} ${config.url}`
          );
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Fetch CSRF token from backend response body (Option B)
 *
 * The backend returns the CSRF token in the JSON response body:
 * { "token": "...", "headerName": "X-XSRF-TOKEN" }
 *
 * This works cross-origin because we read the token from the Axios response,
 * not from document.cookie (which can't access cookies from a different domain).
 */
export async function fetchCsrfToken(): Promise<void> {
  try {
    const { data } = await apiClient.get<{ token?: string; headerName?: string }>(
      '/api/v1/auth/csrf'
    );
    if (data.token) {
      csrfToken = data.token;
    }
  } catch (error) {
    console.error('[API Client] Failed to fetch CSRF token:', error);
  }
}

/**
 * Clear the in-memory CSRF token (call on logout)
 */
export function clearCsrfToken(): void {
  csrfToken = null;
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
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/auth/refresh`,
            {},
            { withCredentials: true }
          );

          // Retry the original request (cookies automatically sent)
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed - clean up session
          if (typeof window !== 'undefined') {
            document.cookie = 'gydi_session=; path=/; max-age=0; SameSite=Lax; Secure';
            clearCsrfToken();
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
        // Re-fetch CSRF token from response body
        await fetchCsrfToken();

        // Retry original request with new CSRF token + X-Requested-With
        if (csrfToken && originalRequest.method?.toUpperCase() !== 'GET') {
          originalRequest.headers['X-XSRF-TOKEN'] = csrfToken;
          originalRequest.headers['X-Requested-With'] = 'XMLHttpRequest';
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
          console.error('Permission denied:', error.response.data);
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
