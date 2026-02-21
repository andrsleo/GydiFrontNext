'use client';

/**
 * Dashboard Shell Component
 *
 * Main layout wrapper for dashboard pages.
 * Integrates the new Sidebar with role-based navigation.
 *
 * IMPORTANT: Waits for Zustand hydration before rendering to prevent
 * race conditions that cause menu items to disappear on page refresh.
 *
 * FIXED: Now uses AuthVerifier to sync cookies with Zustand store.
 * If cookies exist but store is empty, fetches user from backend.
 */

import { Sidebar } from '@/components/layout/sidebar';
import { DashboardSkeleton } from '@/components/layout/dashboard-skeleton';
import { AuthVerifier } from '@/components/auth/auth-verifier';
import { useUser } from '@/features/auth/hooks/use-auth';
import { useHasHydrated } from '@/store/auth-store';
import { normalizeRole } from '@/lib/utils/role';
import type { SubscriptionPlan } from '@/types/navigation';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  // Wait for Zustand to hydrate from localStorage
  const hasHydrated = useHasHydrated();

  // Get user from auth store
  const user = useUser();

  // Show skeleton while hydrating OR while AuthVerifier is fetching user
  if (!hasHydrated || !user) {
    return (
      <AuthVerifier>
        <DashboardSkeleton />
      </AuthVerifier>
    );
  }

  // Now we can safely use user data (hydration is complete)
  // Normalize role: Remove 'ROLE_' prefix if present (backend returns 'ROLE_USER', frontend expects 'USER')
  const userRole = normalizeRole(user.role);
  const subscriptionPlan = (user.activePlan as SubscriptionPlan) || 'FREE';

  return (
    <AuthVerifier>
      <div className="flex min-h-screen">
        {/* New Sidebar with role-based filtering */}
        <Sidebar
          userRole={userRole}
          subscriptionPlan={subscriptionPlan}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </div>
    </AuthVerifier>
  );
}
