/**
 * TanStack Query hooks for Earnings
 */
'use client';

import { useQuery } from '@tanstack/react-query';
import { useIsAuthenticated } from '@/features/auth/hooks/use-auth';
import { getEarnings } from '../api/referrals-api';
import { referralKeys } from './use-referral-links';

/**
 * Hook to fetch earnings data
 */
export function useEarnings(currentPlan?: string) {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: [...referralKeys.earnings(), currentPlan],
    queryFn: () => {
      const token = localStorage.getItem('access_token') || undefined;
      return getEarnings(currentPlan, token);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: isAuthenticated, // Only fetch when authenticated
  });
}

/**
 * Hook to check if user is eligible for payout
 */
export function useIsEligibleForPayout() {
  const { data: earnings } = useEarnings();

  if (!earnings) {
    return false;
  }

  const MINIMUM_PAYOUT = 50;
  return earnings.approvedAmount >= MINIMUM_PAYOUT;
}

/**
 * Hook to format earnings by status
 */
export function useEarningsByStatus() {
  const { data: earnings } = useEarnings();

  if (!earnings) {
    return [];
  }

  return [
    {
      status: 'Pending',
      amount: earnings.pendingAmount,
      count: earnings.pendingCount,
      color: 'yellow',
    },
    {
      status: 'Approved',
      amount: earnings.approvedAmount,
      count: earnings.approvedCount,
      color: 'green',
    },
    {
      status: 'Paid',
      amount: earnings.paidAmount,
      count: earnings.paidCount,
      color: 'blue',
    },
  ];
}

/**
 * Hook to get next payout info
 */
export function useNextPayout() {
  const { data: earnings } = useEarnings();

  if (!earnings || !earnings.nextPayoutDate) {
    return null;
  }

  return {
    amount: earnings.nextPayoutAmount,
    date: new Date(earnings.nextPayoutDate),
    daysUntil: Math.ceil(
      (new Date(earnings.nextPayoutDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    ),
  };
}