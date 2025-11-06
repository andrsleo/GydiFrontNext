/**
 * API Client Configuration
 *
 * Axios instance configured with interceptors for authentication,
 * error handling, and request/response transformation.
 */

import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

/**
 * Base API client
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies automatically (for same-origin)
  timeout: 30000,
});

/**
 * Request interceptor - Add authentication token
 *
 * SECURITY STRATEGY:
 * - Development (localhost): Use Authorization header (cookies don't work cross-origin)
 * - Production (same domain): Use httpOnly cookies ONLY (more secure, XSS-proof)
 *
 * In production, backend sets httpOnly cookie and this interceptor does NOTHING.
 * The cookie is sent automatically by the browser with withCredentials: true.
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Skip adding token for public endpoints (exact matches only)
    const publicEndpoints = [
      '/api/v1/auth/login',
      '/api/v1/auth/register',
      '/api/v1/users/register', // User registration endpoint
    ];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.startsWith(endpoint)
    );

    if (!isPublicEndpoint && typeof window !== 'undefined') {
      const isDevelopment = process.env.NODE_ENV === 'development';

      // ONLY in development: use Authorization header (cross-origin workaround)
      if (isDevelopment) {
        try {
          const session = await getSession();
          if (session?.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
          }
        } catch (error) {
          console.error('Error getting session for API request:', error);
        }
      }
      // In production: httpOnly cookies are sent automatically via withCredentials
      // No need to add Authorization header - this prevents XSS attacks
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

    // Handle token expiration (401) - NextAuth auto-refresh handles this
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (typeof window !== 'undefined') {
        // Session expired or invalid - redirect to login
        // NextAuth will attempt refresh before this happens
        window.location.href = '/login?error=SessionExpired';
      }
      return Promise.reject(error);
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