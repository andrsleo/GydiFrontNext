import { DashboardShell } from '@/components/layout/dashboard-shell';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { StripeProvider } from '@/lib/stripe/stripe-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StripeProvider>
      <DashboardShell>
        <div className="flex flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </DashboardShell>
    </StripeProvider>
  );
}
