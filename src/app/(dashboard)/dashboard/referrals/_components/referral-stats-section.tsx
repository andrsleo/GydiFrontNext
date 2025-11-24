/**
 * ReferralStatsSection - Display key metrics
 */
'use client';

import { Link, MousePointerClick, TrendingUp, DollarSign } from 'lucide-react';
import { ReferralStatsCard } from '@/features/referrals/components';
import { useReferralStats, useClicksGrowth } from '@/features/referrals/hooks';

export function ReferralStatsSection() {
  const { data: stats, isLoading } = useReferralStats();
  const clicksGrowth = useClicksGrowth();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <ReferralStatsCard
        title="Total Links"
        value={stats?.totalLinks || 0}
        description={`${stats?.activeLinks || 0} active`}
        icon={Link}
        isLoading={isLoading}
      />

      <ReferralStatsCard
        title="Total Clicks"
        value={stats?.totalClicks.toLocaleString() || 0}
        description="All-time clicks"
        icon={MousePointerClick}
        trend={
          clicksGrowth !== null
            ? {
                value: clicksGrowth,
                isPositive: clicksGrowth >= 0,
              }
            : undefined
        }
        isLoading={isLoading}
      />

      <ReferralStatsCard
        title="Conversions"
        value={stats?.totalConversions || 0}
        description={`${stats?.overallConversionRate.toFixed(1) || 0}% conversion rate`}
        icon={TrendingUp}
        isLoading={isLoading}
      />

      <ReferralStatsCard
        title="Total Earnings"
        value={`$${stats?.totalEarnings.toFixed(2) || '0.00'}`}
        description={`$${stats?.pendingCommissions.toFixed(2) || '0.00'} pending`}
        icon={DollarSign}
        isLoading={isLoading}
      />
    </div>
  );
}