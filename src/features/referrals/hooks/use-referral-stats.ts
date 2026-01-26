/**
 * TanStack Query hooks for Referral Statistics
 */
'use client';

import { useQuery } from '@tanstack/react-query';
import { useIsAuthenticated } from '@/features/auth/hooks/use-auth';
import { getReferralStats } from '../api/referrals-api';
import { referralKeys } from './use-referral-links';

/**
 * Hook to fetch referral statistics
 */
export function useReferralStats(affiliateId?: number) {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: [...referralKeys.stats(), affiliateId],
    queryFn: () => getReferralStats(affiliateId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Auto-refresh every 5 minutes
    enabled: isAuthenticated, // Only fetch when authenticated
  });
}

/**
 * Hook to calculate conversion rate
 */
export function useConversionRate() {
  const { data: stats } = useReferralStats();

  if (!stats || stats.totalClicks === 0) {
    return 0;
  }

  return (stats.totalConversions / stats.totalClicks) * 100;
}

/**
 * Hook to get clicks growth (last 30 days vs previous 30 days)
 */
export function useClicksGrowth() {
  const { data: stats } = useReferralStats();

  if (!stats) {
    return null;
  }

  // Simplified: compare last 30 days to total
  const previousClicks = stats.totalClicks - stats.clicksLast30Days;

  if (previousClicks === 0) {
    return stats.clicksLast30Days > 0 ? 100 : 0;
  }

  return ((stats.clicksLast30Days - previousClicks) / previousClicks) * 100;
}

/**
 * Hook to get top performing country
 */
export function useTopCountry() {
  const { data: stats } = useReferralStats();

  if (!stats || Object.keys(stats.clicksByCountry).length === 0) {
    return null;
  }

  const entries = Object.entries(stats.clicksByCountry);
  entries.sort((a, b) => b[1] - a[1]);

  return {
    code: entries[0][0],
    clicks: entries[0][1],
  };
}