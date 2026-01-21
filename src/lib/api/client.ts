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
 */

import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import { getCsrfToken } from '@/lib/utils/csrf';

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
 * Request interceptor - Add authentication token and CSRF protection
 *
 * BACKEND-ONLY AUTHENTICATION STRATEGY:
 * 1. JWT Authentication:
 *    - Development: Use Authorization header with token from localStorage
 *    - Production: httpOnly cookies sent automatically via withCredentials
 *
 * 2. CSRF Protection:
 *    - For state-changing requests (POST, PUT, PATCH, DELETE), include CSRF token
 *    - Token is read from XSRF-TOKEN cookie (set by backend)
 *    - Token is sent in X-XSRF-TOKEN header (Spring Security convention)
 *    - Read-only requests (GET, HEAD, OPTIONS) don't need CSRF protection
 *
 * In production: backend sets httpOnly cookie, interceptor does NOTHING
 * In development: interceptor reads token from localStorage
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Skip adding token for public endpoints (exact matches only)
    const publicEndpoints = [
      '/api/v1/auth/login',
      '/api/v1/auth/register',
      '/api/v1/users/register', // User registration endpoint
      '/api/csrf', // CSRF token endpoint
      '/api/v1/auth/refresh', // Refresh token endpoint
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

    // Add CSRF token for state-changing requests
    // CSRF protection is only needed for requests that modify data
    const methodsRequiringCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'];
    const method = config.method?.toUpperCase();

    if (method && methodsRequiringCsrf.includes(method) && !isPublicEndpoint) {
      if (typeof window !== 'undefined') {
        // Get CSRF token from cookie
        const csrfToken = getCsrfToken();

        if (csrfToken) {
          // Add CSRF token to request header
          config.headers['X-XSRF-TOKEN'] = csrfToken;
        } else {
          // Log warning if CSRF token is missing for protected endpoint
          console.warn(
            `CSRF token not found for ${method} request to ${config.url}. ` +
            'The request may be rejected by the server. ' +
            'Call fetchCsrfToken() to obtain a token.'
          );
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
)

/**
 * Response interceptor - Handle errors and token refresh
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

    // Handle other errors
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 403:
          // Could be CSRF error or permission error
          const errorMessage = (error.response.data as any)?.message || '';
          const isCsrfError = errorMessage.toLowerCase().includes('csrf') ||
                             errorMessage.toLowerCase().includes('invalid csrf token');

          if (isCsrfError) {
            console.error('CSRF token validation failed:', error.response.data);
            // You could automatically retry the request with a new token here
            // For now, just log the error - the user should call fetchCsrfToken() manually
          } else {
            console.error('Permission denied:', error.response.data);
          }
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