/**
 * JWT Verification Utility for Middleware
 *
 * ✅ SECURITY FIX: Local JWT verification to eliminate HTTP calls
 *
 * PERFORMANCE IMPROVEMENT:
 * - Before: ~150ms (HTTP call to backend /verify)
 * - After: ~0ms (local verification with jose)
 *
 * IMPORTANT: JWT_SECRET must match the backend configuration
 * Backend: application.yml → jwt.secret
 * Frontend: .env.local → NEXT_PUBLIC_JWT_SECRET (or JWT_SECRET for server-side only)
 */

import { jwtVerify, JWTPayload } from 'jose';

/**
 * JWT Payload structure from backend
 */
export interface JWTClaims extends JWTPayload {
  sub: string;              // Email (username)
  userId: number;           // User ID
  subscriptionPlan?: string;
  canPublish?: boolean;
  canRefer?: boolean;
  canRent?: boolean;
  accountVerified?: boolean;
  iat: number;              // Issued at
  exp: number;              // Expiration
}

/**
 * Extracted user info from JWT
 */
export interface JWTUserInfo {
  userId: number;
  email: string;
  roles: string[];
  subscriptionPlan?: string;
  capabilities: {
    canPublish: boolean;
    canRefer: boolean;
    canRent: boolean;
  };
  accountVerified: boolean;
}

/**
 * Verifies JWT token locally without calling backend
 *
 * ✅ SECURITY FIX: Eliminates 150ms HTTP latency in middleware
 *
 * @param token - JWT token from cookie
 * @returns Parsed user info or null if invalid
 */
export async function verifyJWT(token: string): Promise<JWTUserInfo | null> {
  try {
    // Get JWT secret from environment
    // Note: In Edge Runtime (middleware), only NEXT_PUBLIC_ vars are available
    // For server-only secrets, use JWT_SECRET and verify in API routes instead
    const secret = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET;

    if (!secret) {
      console.error('[JWT Verify] JWT_SECRET not configured. Set JWT_SECRET or NEXT_PUBLIC_JWT_SECRET in .env.local');
      return null;
    }

    // Convert secret to Uint8Array (required by jose)
    const secretKey = new TextEncoder().encode(secret);

    // Verify token signature and expiration
    const { payload } = await jwtVerify<JWTClaims>(token, secretKey, {
      algorithms: ['HS256'], // Backend uses HMAC-SHA256
    });

    // Extract roles from token (backend includes roles as comma-separated string or array)
    const roles = extractRoles(payload);

    // Build user info
    return {
      userId: payload.userId,
      email: payload.sub, // Subject is email
      roles,
      subscriptionPlan: payload.subscriptionPlan,
      capabilities: {
        canPublish: payload.canPublish ?? false,
        canRefer: payload.canRefer ?? false,
        canRent: payload.canRent ?? false,
      },
      accountVerified: payload.accountVerified ?? false,
    };
  } catch (error) {
    // Invalid signature, expired, or malformed token
    if (error instanceof Error) {
      // Only log unexpected errors (not expiration)
      if (!error.message.includes('exp')) {
        console.warn('[JWT Verify] Token verification failed:', error.message);
      }
    }
    return null;
  }
}

/**
 * Extracts roles from JWT payload
 * Backend may send roles as string ("ROLE_ADMIN") or array ["ROLE_ADMIN"]
 */
function extractRoles(payload: JWTClaims): string[] {
  // Check if payload has roles claim
  const rolesRaw = (payload as any).roles || (payload as any).authorities;

  if (!rolesRaw) {
    return [];
  }

  // Handle array format
  if (Array.isArray(rolesRaw)) {
    return rolesRaw.map(role => {
      // Remove "ROLE_" prefix if present
      return typeof role === 'string'
        ? role.replace(/^ROLE_/, '')
        : String(role).replace(/^ROLE_/, '');
    });
  }

  // Handle string format (comma-separated)
  if (typeof rolesRaw === 'string') {
    return rolesRaw
      .split(',')
      .map(role => role.trim().replace(/^ROLE_/, ''));
  }

  return [];
}

/**
 * Checks if user has a specific role
 *
 * @param userInfo - User info from verifyJWT
 * @param role - Role to check (without "ROLE_" prefix, e.g., "ADMIN")
 */
export function hasRole(userInfo: JWTUserInfo | null, role: string): boolean {
  if (!userInfo) return false;
  return userInfo.roles.includes(role.toUpperCase());
}

/**
 * Extracts JWT token from cookies string
 *
 * @param cookieHeader - Cookie header from request
 * @param cookieName - Name of cookie containing JWT (default: "access_token")
 */
export function extractTokenFromCookies(
  cookieHeader: string | null,
  cookieName: string = 'access_token'
): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map(c => c.trim());
  const tokenCookie = cookies.find(c => c.startsWith(`${cookieName}=`));

  if (!tokenCookie) return null;

  return tokenCookie.substring(`${cookieName}=`.length);
}
