import { auth } from '@/lib/auth/auth.config';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Rutas públicas
  const publicRoutes = ['/', '/propiedades', '/login', '/register'];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // Rutas protegidas
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAdminRoute = pathname.startsWith('/admin');

  // Redirect a login si intenta acceder a dashboard sin auth
  if (!isAuthenticated && isDashboardRoute) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return Response.redirect(loginUrl);
  }

  // Redirect a dashboard si ya está auth e intenta ir a login
  if (isAuthenticated && pathname === '/login') {
    return Response.redirect(new URL('/dashboard', req.url));
  }

  // Control de acceso basado en roles
  if (isAdminRoute && req.auth?.user.role !== 'ADMIN') {
    return Response.redirect(new URL('/dashboard', req.url));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
