'use client';

/**
 * Auth Verifier Component
 *
 * Ensures the Zustand auth store is synchronized with backend cookies.
 *
 * PROBLEM SOLVED:
 * - User has valid cookies (access_token, refresh_token, gydi_session)
 * - But Zustand store has user: null (cleared localStorage)
 * - Result: Middleware allows access, but UI shows skeleton forever
 *
 * SOLUTION:
 * - Detect when cookies exist but store is empty
 * - Fetch user from backend (/api/v1/auth/verify)
 * - Update Zustand store with fresh user data
 * - If fetch fails (cookies expired), clear cookies and redirect to login
 *
 * This component should wrap protected routes to ensure auth state consistency.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/features/auth/hooks/use-auth';
import { useAuthStore, useHasHydrated } from '@/store/auth-store';
import { clearSessionMarker } from '@/features/auth/api/auth.api';

interface AuthVerifierProps {
  children: React.ReactNode;
}

/**
 * Checks if gydi_session cookie exists (indicates user should be logged in)
 */
function hasSessionCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.includes('gydi_session=');
}

export function AuthVerifier({ children }: AuthVerifierProps) {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Fetch user from backend (only runs when enabled)
  const { data: fetchedUser, isLoading, error } = useCurrentUser({
    // Only fetch if:
    // 1. Zustand has hydrated from localStorage
    // 2. Store has no user
    // 3. But gydi_session cookie exists (indicates user should be logged in)
    enabled: hasHydrated && !user && hasSessionCookie(),
    retry: false,
  });

  useEffect(() => {
    // Wait for hydration
    if (!hasHydrated) return;

    // Case 1: Store has user → everything is in sync
    if (user) return;

    // Case 2: No user in store AND no cookies → redirect to login
    if (!hasSessionCookie()) {
      router.push('/login');
      return;
    }

    // Case 3: Cookies exist but store is empty
    // → useCurrentUser will fetch user from backend (handled by React Query above)
    if (!isLoading && !fetchedUser && error) {
      // Clear everything
      clearSessionMarker();
      logout();
      router.push('/login?error=SessionExpired');
    }
  }, [hasHydrated, user, fetchedUser, isLoading, error, router, logout]);

  return <>{children}</>;
}
