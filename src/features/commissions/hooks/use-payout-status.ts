/**
 * Payout Status Hook
 *
 * Query hook to fetch affiliate PayPal payout configuration status.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { commissionsApi } from '../api/commissions.api';

/**
 * Hook to fetch affiliate payout status
 *
 * Returns whether the affiliate has configured their PayPal email for payouts.
 *
 * @example
 * ```typescript
 * const { data, isLoading } = usePayoutStatus();
 *
 * if (data?.onboardingCompleted) {
 *   // PayPal email is configured
 * } else {
 *   // Show PayPal email setup form
 * }
 * ```
 */
export function usePayoutStatus() {
  return useQuery({
    queryKey: ['affiliates', 'payout', 'status'],
    queryFn: () => commissionsApi.getPayoutStatus(),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
