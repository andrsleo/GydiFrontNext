/**
 * Middleware for Route Protection
 *
 * Backend-only authentication (no NextAuth).
 * Calls backend /verify endpoint to check if user is authenticated.
 *
 * Flow:
 * 1. Check if route is public - allow immediately
 * 2. For protected routes, call backend /verify
 * 3. Backend validates token (cookie in prod, header in dev)
 * 4. If valid, allow access; if not, redirect to login
 */

import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas (allow without authentication)
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
    return NextResponse.next();
  }

  // Protected routes - verify authentication with backend
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    // Prepare headers for backend /verify call
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Forward Authorization header if present (for development mode)
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Forward cookies to backend (critical for production)
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    // Call backend /verify endpoint
    const response = await fetch(`${apiUrl}/api/v1/auth/verify`, {
      method: 'GET',
      headers,
      credentials: 'include', // Send cookies
    });

    if (response.ok) {
      const data = await response.json();

      // Check if user has required role for admin routes
      if (pathname.startsWith('/admin')) {
        if (data.user?.role !== 'ADMIN') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }

      // User is authenticated - allow access
      return NextResponse.next();
    } else if (response.status === 401 || response.status === 403) {
      // Authentication/authorization failed - redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    } else {
      // Server error (500, etc.) - log and allow through (let error boundary handle it)
      console.error(`Backend /verify returned ${response.status} for ${pathname}`);
      // Don't redirect on server errors - let the app handle it
      return NextResponse.next();
    }
  } catch (error) {
    console.error('Middleware auth verification error:', error);
    // Network error - allow through (backend might be down temporarily)
    // Let the app handle the error instead of redirecting
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
