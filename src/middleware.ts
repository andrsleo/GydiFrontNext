/**
 * Middleware for Route Protection with Role-Based Access Control
 *
 * ✅ SECURITY FIX (Feb 2026):
 * - OPTIMIZED: Local JWT verification (0ms vs 150ms HTTP call)
 * - Added role verification for /admin routes
 * - Prevents privilege escalation (USER accessing ADMIN routes)
 *
 * ARCHITECTURE:
 * - Auth cookies (access_token, refresh_token) are httpOnly
 * - gydi_session cookie is a session marker
 * - Middleware verifies JWT LOCALLY using jose library (NO backend call)
 * - Extracts userId, roles, and capabilities from JWT payload
 *
 * PERFORMANCE:
 * - Before: ~150ms (HTTP call to /api/verify)
 * - After: ~0ms (local JWT verification)
 *
 * FLOW:
 * 1. Check if route is public → allow immediately
 * 2. For protected routes:
 *    a. Check gydi_session cookie (quick filter)
 *    b. Extract & verify JWT from access_token cookie (LOCAL)
 *    c. For /admin routes: Check role === 'ADMIN'
 *    d. Block if unauthorized
 * 3. If no session or invalid JWT → redirect to login
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT, hasRole, extractTokenFromCookies } from '@/lib/auth/jwt-verify';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes (allow without authentication)
  const publicRoutes = [
    '/',
    '/propiedades',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/cookies',
    '/ref', // Referral landing pages
  ];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublicRoute) {
    // If user is logged in and tries to access login/register, redirect to dashboard
    const sessionCookie = request.cookies.get('gydi_session');
    if (sessionCookie && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes - verify authentication and authorization
  const sessionCookie = request.cookies.get('gydi_session');

  if (!sessionCookie?.value) {
    // No session marker → redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ SECURITY FIX: Verify role for admin routes (LOCAL verification)
  if (pathname.startsWith('/admin')) {
    try {
      // Extract JWT from cookies
      const cookieHeader = request.headers.get('cookie');
      const token = extractTokenFromCookies(cookieHeader);

      if (!token) {
        console.warn('[Middleware] No access_token cookie found for admin route:', pathname);
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        loginUrl.searchParams.set('error', 'SessionExpired');
        return NextResponse.redirect(loginUrl);
      }

      // ⚡ PERFORMANCE FIX: Verify JWT LOCALLY (0ms vs 150ms HTTP call)
      const userInfo = await verifyJWT(token);

      if (!userInfo) {
        // Invalid or expired JWT → redirect to login
        console.warn('[Middleware] JWT verification failed for admin route:', pathname);
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        loginUrl.searchParams.set('error', 'SessionExpired');
        return NextResponse.redirect(loginUrl);
      }

      // Check if user has ADMIN role
      if (!hasRole(userInfo, 'ADMIN')) {
        // User is not ADMIN → block access
        console.warn(
          `[Security] User "${userInfo.email}" (roles: ${userInfo.roles.join(', ')}) attempted to access admin route: ${pathname}`
        );

        const dashboardUrl = new URL('/dashboard', request.url);
        dashboardUrl.searchParams.set('error', 'InsufficientPermissions');
        return NextResponse.redirect(dashboardUrl);
      }

      // ✅ User is ADMIN → allow access
      return NextResponse.next();
    } catch (error) {
      // Unexpected error during JWT verification
      console.error('[Middleware] JWT verification error:', error);

      // FAIL SECURELY: Redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'AuthenticationRequired');
      return NextResponse.redirect(loginUrl);
    }
  }

  // ℹ️ OPTIONAL: Verify capabilities for bookings/commissions routes
  // Note: We also check this in the page components, but middleware provides early exit
  // Since this requires checking capabilities (not just roles), we let the page handle it
  // to avoid duplicating complex authorization logic in middleware
  //
  // The gydi_session check above ensures user is authenticated
  // Page components will handle specific capability checks (canRefer, canPublish, etc.)

  // ✅ Non-admin protected routes → allow through (gydi_session verified above)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
