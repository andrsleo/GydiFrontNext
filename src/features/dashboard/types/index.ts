import type { ReferralStats, Earnings } from '@/features/referrals/types';
import type { BookingStats } from '@/features/bookings/types';
import type { CommissionStats } from '@/features/commissions/types';

/**
 * Aggregated dashboard data for affiliate users
 */
export interface AffiliateDashboardData {
  referralStats: ReferralStats | null;
  earnings: Earnings | null;
  bookingStats: BookingStats | null;
  commissionStats: CommissionStats | null;
}

/**
 * Loading state for the full dashboard
 */
export interface DashboardLoadingState {
  isLoadingReferralStats: boolean;
  isLoadingEarnings: boolean;
  isLoadingBookingStats: boolean;
  isLoadingCommissionStats: boolean;
  isAnyLoading: boolean;
}

/**
 * Error state for the full dashboard
 */
export interface DashboardErrorState {
  referralStatsError: Error | null;
  earningsError: Error | null;
  bookingStatsError: Error | null;
  commissionStatsError: Error | null;
  hasAnyError: boolean;
}
