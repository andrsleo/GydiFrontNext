/**
 * Auth API Types
 *
 * TypeScript types aligned with backend DTOs for authentication.
 * These types correspond to Java records in the backend.
 */

/**
 * Login request (corresponds to LoginRequest.java)
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Refresh token request (corresponds to RefreshTokenRequest.java)
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * User data in auth response (corresponds to UserResponse.java)
 */
export interface AuthUser {
  id: number;
  email: string;
  name: string;
  phoneNumber: string | null;
  roleNames: string[];
  createdAt: string; // ISO 8601 date string
}

/**
 * Authentication response (corresponds to AuthResponse.java)
 *
 * Returned after successful login or token refresh.
 */
export interface AuthResponse {
  token: string;
  refreshToken: string | null;
  tokenType: string; // "Bearer"
  user: AuthUser;
}

/**
 * Logout request (optional params)
 */
export interface LogoutRequest {
  revokeAllDevices?: boolean;
}