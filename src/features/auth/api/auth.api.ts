/**
 * Authentication API Client
 *
 * Handles all authentication-related API calls without NextAuth.
 * Backend controls 100% of authentication flow.
 *
 * Environment-based behavior:
 * - Development: Backend returns JSON with tokens, frontend stores in localStorage
 * - Production: Backend creates httpOnly cookies, returns user data only
 */

import { apiClient } from '@/lib/api/client';
import type { AuthUser } from '@/store/auth-store';

/**
 * Detect environment
 */
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response (from backend)
 */
export interface LoginResponse {
  user: {
    id: number;
    email: string;
    name: string; // Backend returns single name field (not firstName/lastName)
    phoneNumber?: string;
    roleNames: string[];
    accountVerified: boolean;
  };
  // Tokens only in development
  token?: string;
  refreshToken?: string;
}

/**
 * Verify response (from backend /api/v1/auth/verify)
 * Backend returns AuthResponse structure
 */
export interface VerifyResponse {
  tokenType: string;
  user: {
    id: number;
    email: string;
    name: string; // Single name field from JWT
    phoneNumber?: string;
    roleNames: string[];
    createdAt?: string;
  };
}

/**
 * Auth API
 */
export const authApi = {
  /**
   * Login
   *
   * All environments: Backend sets httpOnly cookies
   * Cookies are sent automatically via withCredentials: true
   */
  async login(credentials: LoginRequest): Promise<AuthUser> {
    const { data } = await apiClient.post<LoginResponse>(
      '/api/v1/auth/login',
      credentials
    );

    // ✅ COOKIES-ONLY STRATEGY
    // Backend always sets httpOnly cookies (local, dev, prod)
    // No need to store tokens manually - cookies are sent automatically

    // ✅ CRITICAL: Fetch CSRF token after successful login
    // CSRF token is required for all state-changing requests (POST, PUT, PATCH, DELETE)
    try {
      await apiClient.get('/api/v1/auth/csrf');
      console.log('[Auth] ✅ CSRF token fetched successfully after login');

      // Verify the cookie was set
      if (typeof document !== 'undefined') {
        const csrfCookie = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='));
        if (csrfCookie) {
          console.log('[Auth] ✅ CSRF token cookie confirmed:', csrfCookie.substring(0, 30) + '...');
        } else {
          console.warn('[Auth] ⚠️ CSRF token cookie NOT found after fetch');
        }
      }
    } catch (error) {
      console.error('[Auth] ❌ Failed to fetch CSRF token after login:', error);
      // Don't throw - login was successful, CSRF token fetch can fail
    }

    // Transform backend user to AuthUser format
    return {
      id: data.user.id.toString(),
      email: data.user.email,
      name: data.user.name || data.user.email, // Use name directly from backend
      role: (data.user.roleNames?.[0] as any) || 'USER',
      activePlan: 'FREE', // Default plan, should be fetched from backend
      capabilities: {
        canPublish: true,
        canRefer: true,
        canRent: true,
      },
      accountVerified: data.user.accountVerified,
    };
  },

  /**
   * Logout
   *
   * Development: Clear localStorage and call backend
   * Production: Call backend to clear cookies
   */
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint
      await apiClient.post('/api/v1/auth/logout');
    } finally {
      // ✅ Clean up any old tokens from storage (migration from old strategy)
      // Backend clears cookies automatically
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  },

  /**
   * Verify current session
   *
   * Calls backend /verify endpoint to check if token is still valid
   * Returns null if token is invalid or expired
   */
  async verify(): Promise<VerifyResponse | null> {
    try {
      const { data } = await apiClient.get<VerifyResponse>('/api/v1/auth/verify');
      return data;
    } catch (error) {
      // Token is invalid, expired, or not present
      return null;
    }
  },

  /**
   * Get current user from backend
   *
   * Fetches fresh user data from backend and transforms it to AuthUser format
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const verifyResponse = await this.verify();

      if (!verifyResponse || !verifyResponse.user) {
        return null;
      }

      // Transform backend user to AuthUser format (same as login)
      return {
        id: verifyResponse.user.id.toString(),
        email: verifyResponse.user.email,
        name: verifyResponse.user.name || verifyResponse.user.email, // Use name directly from backend
        role: (verifyResponse.user.roleNames?.[0] as any) || 'USER',
        activePlan: 'FREE', // Default plan, should be fetched from backend
        capabilities: {
          canPublish: true,
          canRefer: true,
          canRent: true,
        },
        accountVerified: true, // JWT tokens are only issued to verified users
      };
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  /**
   * Refresh token
   *
   * All environments: Backend reads refresh_token from httpOnly cookie
   * Backend returns new tokens and sets new cookies automatically
   */
  async refresh(): Promise<void> {
    // ✅ COOKIES-ONLY STRATEGY
    // Backend reads refresh_token from cookie, validates it,
    // generates new tokens, and sets new cookies automatically
    // No need to send refresh_token in body - it's in the cookie
    await apiClient.post('/api/v1/auth/refresh', {});
  },
};
