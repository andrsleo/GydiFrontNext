/**
 * Unit tests for useVerifyPaymentMethod hook
 *
 * Tests the payment method verification functionality using
 * React Testing Library and Vitest.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useVerifyPaymentMethod,
  useUpdatePaymentMethodPurpose,
} from './use-verify-payment-method';
import { paymentMethodsApi } from '../api/payment-methods.api';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../api/payment-methods.api', () => ({
  paymentMethodsApi: {
    verify: vi.fn(),
    updatePurpose: vi.fn(),
  },
}));

// Helper to create a wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useVerifyPaymentMethod', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('successful verification', () => {
    it('should verify payment method and show success toast', async () => {
      // Mock API response
      const mockResponse = {
        id: 1,
        userId: 123,
        methodType: 'CREDIT_CARD' as const,
        cardBrand: 'Visa',
        cardLastFour: '4242',
        cardExpMonth: 12,
        cardExpYear: 2025,
        billingEmail: 'test@example.com',
        isDefault: true,
        isActive: true,
        status: 'ACTIVE' as const,
        purpose: 'HOST_COMMISSION' as const,
        deletedAt: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: null,
      };

      vi.mocked(paymentMethodsApi.verify).mockResolvedValue(mockResponse);

      // Render hook
      const { result } = renderHook(() => useVerifyPaymentMethod(), {
        wrapper: createWrapper(),
      });

      // Trigger mutation
      result.current.mutate(1);

      // Wait for mutation to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verify API was called with correct params
      expect(paymentMethodsApi.verify).toHaveBeenCalledWith(1);
      expect(paymentMethodsApi.verify).toHaveBeenCalledTimes(1);

      // Verify success toast was shown
      expect(toast.success).toHaveBeenCalledWith('Payment method verified!', {
        description: 'Visa •••• 4242 has been successfully verified.',
        duration: 5000,
      });
    });

    it('should invalidate payment methods query after success', async () => {
      const mockResponse = {
        id: 1,
        userId: 123,
        methodType: 'CREDIT_CARD' as const,
        cardBrand: 'Mastercard',
        cardLastFour: '5555',
        cardExpMonth: 6,
        cardExpYear: 2026,
        billingEmail: 'user@example.com',
        isDefault: false,
        isActive: true,
        status: 'ACTIVE' as const,
        purpose: 'BOTH' as const,
        deletedAt: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: null,
      };

      vi.mocked(paymentMethodsApi.verify).mockResolvedValue(mockResponse);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useVerifyPaymentMethod(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        ),
      });

      result.current.mutate(1);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verify invalidateQueries was called
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['payment-methods'] });
    });
  });

  describe('failed verification', () => {
    it('should show error toast when verification fails', async () => {
      const errorMessage = 'Card declined';
      const error = {
        response: {
          data: {
            message: errorMessage,
          },
        },
      };

      vi.mocked(paymentMethodsApi.verify).mockRejectedValue(error);

      const { result } = renderHook(() => useVerifyPaymentMethod(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(1);

      await waitFor(() => expect(result.current.isError).toBe(true));

      // Verify error toast was shown
      expect(toast.error).toHaveBeenCalledWith('Verification failed', {
        description: errorMessage,
        duration: 7000,
      });
    });

    it('should show generic error message when no specific message', async () => {
      vi.mocked(paymentMethodsApi.verify).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useVerifyPaymentMethod(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(1);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(toast.error).toHaveBeenCalledWith('Verification failed', {
        description: 'Network error',
        duration: 7000,
      });
    });
  });

  describe('loading states', () => {
    it('should set isPending to true while verifying', async () => {
      vi.mocked(paymentMethodsApi.verify).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  id: 1,
                  userId: 123,
                  methodType: 'CREDIT_CARD',
                  cardBrand: 'Visa',
                  cardLastFour: '4242',
                  cardExpMonth: 12,
                  cardExpYear: 2025,
                  billingEmail: 'test@example.com',
                  isDefault: true,
                  isActive: true,
                  status: 'ACTIVE',
                  purpose: 'HOST_COMMISSION',
                  deletedAt: null,
                  createdAt: '2024-01-01T00:00:00Z',
                  updatedAt: null,
                } as any),
              100
            );
          })
      );

      const { result } = renderHook(() => useVerifyPaymentMethod(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(1);

      // Wait for mutation to enter pending state
      await waitFor(() => expect(result.current.isPending).toBe(true));

      // Wait for mutation to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should not be pending after success
      expect(result.current.isPending).toBe(false);
    });
  });
});

describe('useUpdatePaymentMethodPurpose', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('successful update', () => {
    it('should update purpose and show success toast', async () => {
      const mockResponse = {
        id: 1,
        userId: 123,
        methodType: 'CREDIT_CARD' as const,
        cardBrand: 'Visa',
        cardLastFour: '4242',
        cardExpMonth: 12,
        cardExpYear: 2025,
        billingEmail: 'test@example.com',
        isDefault: true,
        isActive: true,
        status: 'ACTIVE' as const,
        purpose: 'BOTH' as const,
        deletedAt: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: null,
      };

      vi.mocked(paymentMethodsApi.updatePurpose).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdatePaymentMethodPurpose(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: 1, purpose: 'BOTH' });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verify API was called
      expect(paymentMethodsApi.updatePurpose).toHaveBeenCalledWith(1, 'BOTH');

      // Verify success toast
      expect(toast.success).toHaveBeenCalledWith('Payment method updated!', {
        description: 'Visa •••• 4242 can now be used for host payments.',
        duration: 5000,
      });
    });

    it('should invalidate both payment methods and subscription queries', async () => {
      const mockResponse = {
        id: 1,
        userId: 123,
        methodType: 'CREDIT_CARD' as const,
        cardBrand: 'Mastercard',
        cardLastFour: '5555',
        cardExpMonth: 6,
        cardExpYear: 2026,
        billingEmail: 'user@example.com',
        isDefault: false,
        isActive: true,
        status: 'ACTIVE' as const,
        purpose: 'BOTH' as const,
        deletedAt: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: null,
      };

      vi.mocked(paymentMethodsApi.updatePurpose).mockResolvedValue(mockResponse);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useUpdatePaymentMethodPurpose(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        ),
      });

      result.current.mutate({ id: 1, purpose: 'BOTH' });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verify both queries were invalidated
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['payment-methods'] });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['subscription'] });
    });
  });

  describe('failed update', () => {
    it('should show error toast when update fails', async () => {
      const errorMessage = 'Cannot update payment method purpose';
      const error = {
        response: {
          data: {
            message: errorMessage,
          },
        },
      };

      vi.mocked(paymentMethodsApi.updatePurpose).mockRejectedValue(error);

      const { result } = renderHook(() => useUpdatePaymentMethodPurpose(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: 1, purpose: 'BOTH' });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(toast.error).toHaveBeenCalledWith('Update failed', {
        description: errorMessage,
        duration: 7000,
      });
    });
  });
});
