/**
 * Middleware for Route Protection
 *
 * Uses a lightweight session marker cookie to determine if user is authenticated.
 *
 * CROSS-ORIGIN ARCHITECTURE (Vercel → Railway):
 * - Auth cookies (access_token, refresh_token) are httpOnly on Railway's domain
 * - This middleware runs on Vercel's server and CANNOT access Railway-domain cookies
 * - Instead, after login the frontend sets a `gydi_session` cookie on Vercel's domain
 * - This middleware checks for that cookie to allow/deny access
 * - Actual auth verification happens client-side via API calls to Railway
 *   (where cookies ARE sent automatically with withCredentials: true)
 *
 * Flow:
 * 1. Check if route is public → allow immediately
 * 2. For protected routes, check for gydi_session cookie
 * 3. If cookie exists → allow through (client-side verifies actual auth)
 * 4. If no cookie → redirect to login
 */

import { NextRequest, NextResponse } from 'next/server';

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

  // Protected routes - check for session marker cookie
  const sessionCookie = request.cookies.get('gydi_session');

  if (!sessionCookie?.value) {
    // No session marker → user is not logged in → redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Session marker exists → allow through
  // Client-side hooks (useCurrentUser, useAuth) verify actual auth via Railway API
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
