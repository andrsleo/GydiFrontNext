/**
 * Save PayPal Email Hook
 *
 * Mutation hook to save the affiliate's PayPal email address for payouts.
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commissionsApi } from '../api/commissions.api';
import type { SavePayPalEmailRequest } from '../types';

/**
 * Hook to save affiliate PayPal email
 *
 * Returns mutation to call backend endpoint that stores the PayPal email.
 * Automatically invalidates payout status query on success.
 *
 * @example
 * ```typescript
 * const { mutate, isPending } = useSavePayPalEmail();
 *
 * mutate({ paypalEmail: 'user@example.com' }, {
 *   onSuccess: () => {
 *     toast.success('Email de PayPal guardado');
 *   },
 *   onError: () => {
 *     toast.error('Error al guardar el email');
 *   }
 * });
 * ```
 */
export function useSavePayPalEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SavePayPalEmailRequest) =>
      commissionsApi.savePayPalEmail(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['affiliates', 'payout', 'status'],
      });
    },
  });
}
