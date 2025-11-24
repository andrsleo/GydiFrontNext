/**
 * Referrals Dashboard Page
 * /dashboard/referrals
 */
import { Suspense } from 'react';
import { Link, MousePointerClick, TrendingUp, DollarSign } from 'lucide-react';
import { ReferralStatsCard } from '@/features/referrals/components';
import { Skeleton } from '@/components/ui/skeleton';
import { ReferralLinksSection } from './_components/referral-links-section';
import { ReferralStatsSection } from './_components/referral-stats-section';
import { EarningsSection } from './_components/earnings-section';

export const metadata = {
  title: 'Referrals - GYDI Dashboard',
  description: 'Manage your referral links and track your earnings',
};

export default function ReferralsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Referrals</h1>
        <p className="text-muted-foreground mt-2">
          Generate referral links, track clicks, and manage your earnings
        </p>
      </div>

      {/* Quick Stats */}
      <Suspense fallback={<StatsGridSkeleton />}>
        <ReferralStatsSection />
      </Suspense>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Links & Stats (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          <Suspense fallback={<div>Loading links...</div>}>
            <ReferralLinksSection />
          </Suspense>
        </div>

        {/* Right Column - Earnings (1/3) */}
        <div className="lg:col-span-1">
          <Suspense fallback={<div>Loading earnings...</div>}>
            <EarningsSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function StatsGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
  );
}