/**
 * Payment Methods API Client
 *
 * Handles communication with backend payment methods endpoints.
 */

import { apiClient } from '@/lib/api/client';

/**
 * Create Payment Method Request DTO
 */
export interface CreatePaymentMethodRequest {
  stripePaymentMethodId: string;
  billingEmail: string;
  isDefault: boolean;
}

/**
 * Payment Method Response DTO (matches backend)
 */
export interface PaymentMethodResponse {
  id: number;
  userId: number;
  methodType: 'STRIPE' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'OTHER';
  cardBrand: string | null;
  cardLastFour: string | null;
  cardExpMonth: number | null;
  cardExpYear: number | null;
  billingEmail: string | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * Payment Methods API
 */
export const paymentMethodsApi = {
  /**
   * Create a new payment method
   * POST /api/payment-methods
   */
  async create(request: CreatePaymentMethodRequest): Promise<PaymentMethodResponse> {
    const { data } = await apiClient.post<PaymentMethodResponse>(
      '/api/payment-methods',
      request
    );
    return data;
  },

  /**
   * Get all payment methods for current user
   * GET /api/payment-methods
   */
  async getAll(): Promise<PaymentMethodResponse[]> {
    const { data } = await apiClient.get<PaymentMethodResponse[]>('/api/payment-methods');
    return data;
  },

  /**
   * Get a specific payment method
   * GET /api/payment-methods/:id
   */
  async getById(id: number): Promise<PaymentMethodResponse> {
    const { data } = await apiClient.get<PaymentMethodResponse>(
      `/api/payment-methods/${id}`
    );
    return data;
  },

  /**
   * Delete a payment method
   * DELETE /api/payment-methods/:id
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/payment-methods/${id}`);
  },

  /**
   * Set a payment method as default
   * PUT /api/payment-methods/:id/default
   */
  async setAsDefault(id: number): Promise<PaymentMethodResponse> {
    const { data } = await apiClient.put<PaymentMethodResponse>(
      `/api/payment-methods/${id}/default`
    );
    return data;
  },
};
