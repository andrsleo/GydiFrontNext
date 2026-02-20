'use client';

import { usePaymentMethods } from './use-payment-methods';
import { useAuthStore } from '@/store/auth-store';

/**
 * Hook to check if the current user has at least one active payment method.
 * Matches the backend's hasActivePaymentMethod check (status === 'ACTIVE').
 *
 * @returns { hasHostPaymentMethod, isLoading }
 */
export function useHostHasPaymentMethod() {
  const { isAuthenticated } = useAuthStore();
  const { data: paymentMethods, isLoading } = usePaymentMethods();

  const hasHostPaymentMethod =
    isAuthenticated &&
    (paymentMethods ?? []).some((pm) => pm.status === 'ACTIVE');

  return { hasHostPaymentMethod, isLoading };
}
