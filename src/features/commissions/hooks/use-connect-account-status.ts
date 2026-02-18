/**
 * Connect Account Status Hook
 *
 * Query hook to fetch Stripe Connect account status for affiliates.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { commissionsApi } from '../api/commissions.api';

/**
 * Hook to fetch Stripe Connect account status
 *
 * Returns onboarding status, payout enablement, and verification status.
 *
 * @example
 * ```typescript
 * const { data, isLoading } = useConnectAccountStatus();
 *
 * if (data?.onboardingCompleted) {
 *   // Show success message
 * } else {
 *   // Show onboarding modal
 * }
 * ```
 */
export function useConnectAccountStatus() {
  return useQuery({
    queryKey: ['affiliates', 'connect', 'status'],
    queryFn: () => commissionsApi.getConnectAccountStatus(),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Retry once on failure
  });
}
