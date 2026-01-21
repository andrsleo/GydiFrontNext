/**
 * Authentication Provider
 *
 * React Context provider that:
 * - Verifies authentication on mount
 * - Fetches current user from backend
 * - Handles automatic token refresh
 * - Updates Zustand auth store
 *
 * This provider should wrap your app to ensure authentication state
 * is properly initialized when the app loads.
 *
 * BACKEND-ONLY AUTHENTICATION:
 * - Development: Reads token from localStorage
 * - Production: Backend reads from httpOnly cookies
 */

'use client';

import React, { useEffect, type ReactNode } from 'react';
import { useCurrentUser } from '../hooks/use-auth';
import { useAuthStore, useHasHydrated } from '@/store/auth-store';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 *
 * Wraps the application to manage authentication state.
 * Automatically fetches current user on mount and updates Zustand store.
 *
 * @example
 * // In app/layout.tsx or app/providers.tsx
 * import { AuthProvider } from '@/features/auth/providers/auth-provider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthProvider>
 *           {children}
 *         </AuthProvider>
 *       </body>
 *     </html>
 *   );
 * }
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const setLoading = useAuthStore((state) => state.setLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const currentUser = useAuthStore((state) => state.user);
  const hasHydrated = useHasHydrated();

  // Don't attempt to verify auth on auth pages (login, register, etc.)
  const isAuthPage =
    typeof window !== 'undefined' &&
    (window.location.pathname.startsWith('/login') ||
      window.location.pathname.startsWith('/register') ||
      window.location.pathname.startsWith('/forgot-password') ||
      window.location.pathname.startsWith('/reset-password'));

  // Check if there's a token (only on mount, not on every render)
  const [hasToken] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token') || document.cookie.includes('access_token');
  });

  // Only try to fetch user from backend if:
  // 1. Store has hydrated (loaded from localStorage)
  // 2. We're NOT on an auth page
  // 3. We have a token (from previous session)
  // Note: We verify even if currentUser exists in store to detect expired tokens
  const shouldVerifyAuth = hasHydrated && !isAuthPage && hasToken;

  // Fetch current user from backend
  const { data: fetchedUser, isLoading: isFetchingUser, error: fetchUserError } = useCurrentUser({
    retry: false,
    staleTime: Infinity,
    enabled: shouldVerifyAuth,
  });

  // Handle auth state after hydration
  useEffect(() => {
    // Wait for store to hydrate from localStorage
    if (!hasHydrated) {
      return;
    }

    // On auth pages, just stop loading
    if (isAuthPage) {
      setLoading(false);
      return;
    }

    // If we're verifying with backend
    if (shouldVerifyAuth) {
      if (!isFetchingUser) {
        // Backend verification complete
        if (fetchedUser) {
          // Valid token, set/update user
          setUser(fetchedUser);
        } else if (fetchUserError) {
          // ⚠️ Token expired or invalid - clean up stale data
          console.warn('Auth verification failed - clearing stale session data');
          logout(); // This clears user from store and localStorage
        }
        setLoading(false);
      }
      // Still loading, don't do anything
      return;
    }

    // At this point:
    // - Store has hydrated
    // - Not on auth page
    // - No token to verify
    // So we're definitely not authenticated
    setLoading(false);
  }, [hasHydrated, isAuthPage, shouldVerifyAuth, isFetchingUser, fetchedUser, fetchUserError, setUser, setLoading, logout]);

  // Optionally show a loading spinner while checking auth
  // Uncomment if you want to prevent flash of unauthenticated content
  // if (isLoading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  //     </div>
  //   );
  // }

  return <>{children}</>;
}

/**
 * HOC to protect routes with authentication
 *
 * Wraps a component to require authentication.
 * Redirects to login if user is not authenticated.
 *
 * @example
 * import { withAuth } from '@/features/auth/providers/auth-provider';
 *
 * function DashboardPage() {
 *   return <div>Protected Dashboard</div>;
 * }
 *
 * export default withAuth(DashboardPage);
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isLoading = useAuthStore((state) => state.isLoading);

    // Show loading while checking auth
    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      }
      return null;
    }

    // Render component if authenticated
    return <Component {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;

  return AuthenticatedComponent;
}

/**
 * HOC to protect routes with role-based access
 *
 * Wraps a component to require a specific role.
 * Redirects to unauthorized page if user doesn't have required role.
 *
 * @param requiredRole - The role required to access the component
 *
 * @example
 * import { withRole } from '@/features/auth/providers/auth-provider';
 *
 * function AdminPanel() {
 *   return <div>Admin Only</div>;
 * }
 *
 * export default withRole('ADMIN')(AdminPanel);
 */
export function withRole(requiredRole: string) {
  return function <P extends object>(
    Component: React.ComponentType<P>
  ): React.FC<P> {
    const RoleProtectedComponent: React.FC<P> = (props) => {
      const user = useAuthStore((state) => state.user);
      const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
      const isLoading = useAuthStore((state) => state.isLoading);

      // Show loading while checking auth
      if (isLoading) {
        return (
          <div className="flex h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        );
      }

      // Redirect to login if not authenticated
      if (!isAuthenticated || !user) {
        if (typeof window !== 'undefined') {
          window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
        }
        return null;
      }

      // Check if user has required role
      if (user.role !== requiredRole) {
        if (typeof window !== 'undefined') {
          window.location.href = '/unauthorized';
        }
        return null;
      }

      // Render component if authenticated and has required role
      return <Component {...props} />;
    };

    RoleProtectedComponent.displayName = `withRole(${requiredRole})(${Component.displayName || Component.name})`;

    return RoleProtectedComponent;
  };
}
