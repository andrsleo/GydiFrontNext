/**
 * React Query hook for payment method verification
 *
 * Verifies a payment method by performing a $0.01 charge and immediate refund.
 * This ensures the card is valid and can process charges before using it for
 * host commission payments.
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { paymentMethodsApi } from '../api/payment-methods.api';
import { paymentMethodKeys } from './use-payment-methods';
import type { PaymentMethodResponse } from '../types';

/**
 * Hook to verify a payment method
 *
 * Performs a micro-transaction ($0.01 charge + refund) to validate the card
 * is active and can process payments. This is required before using a card
 * for host commission charges.
 *
 * @returns Mutation function and state
 *
 * @example
 * ```tsx
 * function PaymentMethodCard({ method }) {
 *   const { mutate: verify, isPending } = useVerifyPaymentMethod();
 *
 *   const handleVerify = () => {
 *     verify(method.id);
 *   };
 *
 *   return (
 *     <button onClick={handleVerify} disabled={isPending}>
 *       Verify Card
 *     </button>
 *   );
 * }
 * ```
 */
export function useVerifyPaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentMethodId: number) => paymentMethodsApi.verify(paymentMethodId),
    onSuccess: (data) => {
      // Invalidate payment methods query to refetch updated data
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all });

      // Show success notification
      toast.success('Payment method verified!', {
        description: `${data.cardBrand} •••• ${data.cardLastFour} has been successfully verified.`,
        duration: 5000,
      });
    },
    onError: (error: any) => {
      // Extract error message from backend response
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to verify payment method. Please check your card and try again.';

      // Show error notification with details
      toast.error('Verification failed', {
        description: message,
        duration: 7000,
      });
    },
  });
}

/**
 * Hook to update payment method purpose
 *
 * Updates the purpose of a payment method (SUBSCRIPTION → BOTH)
 * to enable using a subscription card for host commission payments.
 *
 * @returns Mutation function and state
 *
 * @example
 * ```tsx
 * function ReuseSubscriptionCard({ subscriptionCardId }) {
 *   const { mutate: updatePurpose, isPending } = useUpdatePaymentMethodPurpose();
 *
 *   const handleReuseCard = () => {
 *     updatePurpose({ id: subscriptionCardId, purpose: 'BOTH' });
 *   };
 *
 *   return (
 *     <button onClick={handleReuseCard} disabled={isPending}>
 *       Use Subscription Card
 *     </button>
 *   );
 * }
 * ```
 */
export function useUpdatePaymentMethodPurpose() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, purpose }: { id: number; purpose: 'SUBSCRIPTION' | 'HOST_COMMISSION' | 'BOTH' }) =>
      paymentMethodsApi.updatePurpose(id, purpose),
    onSuccess: (data) => {
      // Invalidate payment methods query to refetch updated data
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all });
      queryClient.invalidateQueries({ queryKey: ['subscription'] });

      // Show success notification
      toast.success('Payment method updated!', {
        description: `${data.cardBrand} •••• ${data.cardLastFour} can now be used for host payments.`,
        duration: 5000,
      });
    },
    onError: (error: any) => {
      // Extract error message from backend response
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update payment method. Please try again.';

      // Show error notification
      toast.error('Update failed', {
        description: message,
        duration: 7000,
      });
    },
  });
}
