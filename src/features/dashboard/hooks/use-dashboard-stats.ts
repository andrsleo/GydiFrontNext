'use client';

import { useQuery } from '@tanstack/react-query';
import { getReferralStats, getEarnings } from '@/features/referrals/api/referrals-api';
import { bookingsApi } from '@/features/bookings/api/bookings.api';
import { commissionsApi } from '@/features/commissions/api/commissions.api';
import { dashboardKeys } from '@/lib/constants/query-keys';
import { useIsAuthenticated } from '@/features/auth/hooks/use-auth';
import type {
  AffiliateDashboardData,
  DashboardLoadingState,
  DashboardErrorState,
} from '../types';

/**
 * Hook for referral stats (clicks, conversions, active links).
 * staleTime: 5 min — these values change infrequently.
 *
 * Can be reused by the /referidos page independently.
 */
export function useDashboardReferralStats() {
  const isAuthenticated = useIsAuthenticated();
  return useQuery({
    queryKey: dashboardKeys.affiliateStats(),
    queryFn: () => getReferralStats(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: isAuthenticated,
  });
}

/**
 * Hook for earnings data (commissions history, pending, next payout).
 * staleTime: 5 min — financial data, no need to poll aggressively.
 *
 * Can be reused by the /ganancias page independently.
 */
export function useDashboardEarnings() {
  const isAuthenticated = useIsAuthenticated();
  return useQuery({
    queryKey: dashboardKeys.earnings(),
    queryFn: () => getEarnings(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: isAuthenticated,
  });
}

/**
 * Hook for affiliate booking stats (totalBookings, activeBookings, totalRevenue).
 * staleTime: 5 min.
 *
 * Can be reused by the /reservas page independently.
 */
export function useDashboardBookingStats() {
  const isAuthenticated = useIsAuthenticated();
  return useQuery({
    queryKey: dashboardKeys.bookingStats(),
    queryFn: () => bookingsApi.getAffiliateStats(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: isAuthenticated,
  });
}

/**
 * Hook for affiliate commission stats (totalEarned, pending, totalPaid).
 * staleTime: 5 min.
 *
 * Can be reused by the /ganancias page independently.
 */
export function useDashboardCommissionStats() {
  const isAuthenticated = useIsAuthenticated();
  return useQuery({
    queryKey: dashboardKeys.commissionStats(),
    queryFn: () => commissionsApi.getAffiliateStats(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: isAuthenticated,
  });
}

/**
 * Composite hook: Fetches ALL dashboard data in parallel.
 *
 * Designed for the dashboard overview page (/dashboard).
 * All 4 queries fire simultaneously — no waterfalling.
 * Each individual hook above can be imported directly by other pages
 * to reuse the same cached data without triggering duplicate requests.
 *
 * @example
 * const { data, loading, error } = useAffiliateDashboard();
 * data.referralStats?.totalClicks
 * data.earnings?.pendingAmount
 * loading.isAnyLoading
 * error.hasAnyError
 */
export function useAffiliateDashboard(): {
  data: AffiliateDashboardData;
  loading: DashboardLoadingState;
  error: DashboardErrorState;
} {
  const referralStats = useDashboardReferralStats();
  const earnings = useDashboardEarnings();
  const bookingStats = useDashboardBookingStats();
  const commissionStats = useDashboardCommissionStats();

  const data: AffiliateDashboardData = {
    referralStats: referralStats.data ?? null,
    earnings: earnings.data ?? null,
    bookingStats: bookingStats.data ?? null,
    commissionStats: commissionStats.data ?? null,
  };

  const loading: DashboardLoadingState = {
    isLoadingReferralStats: referralStats.isLoading,
    isLoadingEarnings: earnings.isLoading,
    isLoadingBookingStats: bookingStats.isLoading,
    isLoadingCommissionStats: commissionStats.isLoading,
    isAnyLoading:
      referralStats.isLoading ||
      earnings.isLoading ||
      bookingStats.isLoading ||
      commissionStats.isLoading,
  };

  const error: DashboardErrorState = {
    referralStatsError: referralStats.error as Error | null,
    earningsError: earnings.error as Error | null,
    bookingStatsError: bookingStats.error as Error | null,
    commissionStatsError: commissionStats.error as Error | null,
    hasAnyError: !!(
      referralStats.error ||
      earnings.error ||
      bookingStats.error ||
      commissionStats.error
    ),
  };

  return { data, loading, error };
}
