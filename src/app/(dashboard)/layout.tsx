/**
 * Dashboard Layout with Session Timeout Protection
 *
 * This layout wraps all dashboard pages and provides:
 * - Dashboard shell (sidebar, header, main content area)
 * - Stripe integration for payment processing
 * - Inactivity detection with automatic logout
 * - Session timeout warning modal
 *
 * Inactivity Timeout: 1 hour (configured in application.yml)
 * Warning Shown: After 59 minutes of inactivity
 * Auto-Logout: After 60 minutes (if warning ignored)
 */

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { StripeProvider } from '@/lib/stripe/stripe-provider';
import { SessionTimeoutProvider } from '@/features/auth/components/session-timeout-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StripeProvider>
      <SessionTimeoutProvider>
        <DashboardShell>
          <div className="flex flex-1 flex-col min-w-0">
            <DashboardHeader />
            <main className="flex-1 p-4 sm:p-6 min-w-0 overflow-x-hidden">{children}</main>
          </div>
        </DashboardShell>
      </SessionTimeoutProvider>
    </StripeProvider>
  );
}
