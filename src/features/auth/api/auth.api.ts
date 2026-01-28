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

import { apiClient, fetchCsrfToken, clearCsrfToken } from '@/lib/api/client';
import type { AuthUser } from '@/store/auth-store';

/**
 * Set a session marker cookie on the frontend domain (Vercel).
 *
 * In cross-origin setups (Vercel frontend → Railway backend), httpOnly auth cookies
 * are set on the backend domain and are NOT accessible from the frontend domain.
 * The Next.js middleware runs on Vercel's server and can only read Vercel-domain cookies.
 *
 * This marker cookie allows the middleware to know the user is authenticated
 * without needing to access the Railway-domain auth cookies.
 * Actual auth verification happens client-side via API calls to Railway.
 */
function setSessionMarker(user: { id: number; name: string; email: string }) {
  if (typeof document === 'undefined') return;
  // Encode minimal user info for middleware (NOT a security token)
  const value = encodeURIComponent(JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
  }));
  document.cookie = `gydi_session=${value}; path=/; max-age=86400; SameSite=Lax; Secure`;
}

/**
 * Clear the session marker cookie (logout).
 */
function clearSessionMarker() {
  if (typeof document === 'undefined') return;
  document.cookie = 'gydi_session=; path=/; max-age=0; SameSite=Lax; Secure';
}

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

    // ✅ Set session marker on frontend domain (for middleware route protection)
    // Cross-origin: httpOnly cookies are on Railway domain, middleware needs a Vercel-domain cookie
    setSessionMarker(data.user);
    console.log('[Auth] ✅ Session marker set on frontend domain');

    // Fetch CSRF token from response body and store in memory (Option B)
    try {
      await fetchCsrfToken();
    } catch (error) {
      console.error('[Auth] Failed to fetch CSRF token after login:', error);
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
      // Clear session marker on frontend domain
      clearSessionMarker();
      // Clear in-memory CSRF token
      clearCsrfToken();

      // Clean up any old tokens from storage (migration from old strategy)
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
