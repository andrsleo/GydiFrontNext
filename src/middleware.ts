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
  const publicRoutes = ['/', '/propiedades', '/login', '/register', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes - verify authentication with backend
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Prepare headers for backend /verify call
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // In development: send Authorization header if available
    // In production: cookies sent automatically
    if (isDevelopment && typeof window !== 'undefined') {
      const token = localStorage?.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
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
    } else {
      // Authentication failed - redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    console.error('Middleware auth verification error:', error);
    // On error, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
