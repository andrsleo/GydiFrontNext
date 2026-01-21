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
   * Development: Backend returns { user, token, refreshToken }
   * Production: Backend returns { user }, sets httpOnly cookies
   */
  async login(credentials: LoginRequest): Promise<AuthUser> {
    const { data } = await apiClient.post<LoginResponse>(
      '/api/v1/auth/login',
      credentials
    );

    // In development, store tokens in localStorage
    if (isDevelopment && data.token && data.refreshToken) {
      localStorage.setItem('access_token', data.token);
      localStorage.setItem('refresh_token', data.refreshToken);
    }
    // In production, backend has already set httpOnly cookies

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
      // Always clear localStorage in development
      if (isDevelopment) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
      // In production, backend has already cleared cookies
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
   * Development: Send refresh_token from localStorage
   * Production: Backend reads refresh_token from httpOnly cookie
   */
  async refresh(): Promise<void> {
    if (isDevelopment) {
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { data } = await apiClient.post('/api/v1/auth/refresh', {
        refreshToken,
      });

      // Store new tokens
      localStorage.setItem('access_token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken);
      }
    } else {
      // Production: Backend handles everything via cookies
      await apiClient.post('/api/v1/auth/refresh', {});
    }
  },
};
