/**
 * Affiliate Connect Onboarding Hook
 *
 * Mutation hook to initiate Stripe Connect onboarding for affiliates.
 * Returns onboarding URL to redirect user to Stripe.
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commissionsApi } from '../api/commissions.api';
import type { OnboardingLinkDto } from '../types';

/**
 * Hook to initiate Stripe Connect onboarding
 *
 * Returns mutation to call backend endpoint that generates Stripe onboarding link.
 *
 * @example
 * ```typescript
 * const { mutate, isPending } = useInitiateAffiliateOnboarding();
 *
 * mutate(undefined, {
 *   onSuccess: (data) => {
 *     // Redirect to Stripe onboarding
 *     window.location.href = data.url;
 *   },
 *   onError: (error) => {
 *     toast.error('Error al iniciar onboarding');
 *   }
 * });
 * ```
 */
export function useInitiateAffiliateOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => commissionsApi.initiateAffiliateOnboarding(),
    onSuccess: (data: OnboardingLinkDto) => {
      // Invalidate connect account status query
      queryClient.invalidateQueries({
        queryKey: ['affiliates', 'connect', 'status'],
      });
    },
  });
}
