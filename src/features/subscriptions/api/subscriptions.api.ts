/**
 * Subscriptions API Client
 *
 * API client for all subscription-related endpoints.
 * Connects to Spring Boot backend REST controllers.
 */

import { apiClient } from '@/lib/api/client';
import type {
  PlanResponse,
  UserSubscriptionResponse,
  PaymentMethodResponse,
  SubscriptionTransactionResponse,
  SubscribeToPlanRequest,
  ChangePlanRequest,
  CancelSubscriptionRequest,
  CreatePaymentMethodRequest,
} from '../types';

/**
 * Plans API
 * Endpoint: /api/plans
 */
export const plansApi = {
  /**
   * Get all active subscription plans
   * GET /api/plans
   */
  async getAll(): Promise<PlanResponse[]> {
    const { data } = await apiClient.get<PlanResponse[]>('/api/plans');
    return data;
  },
};

/**
 * Subscriptions API
 * Endpoint: /api/subscriptions
 */
export const subscriptionsApi = {
  /**
   * Get current user's subscription
   * GET /api/subscriptions/current
   */
  async getCurrent(): Promise<UserSubscriptionResponse> {
    const { data } = await apiClient.get<UserSubscriptionResponse>(
      '/api/subscriptions/current'
    );
    return data;
  },

  /**
   * Subscribe to a plan
   * POST /api/subscriptions
   */
  async subscribe(request: SubscribeToPlanRequest): Promise<UserSubscriptionResponse> {
    const { data } = await apiClient.post<UserSubscriptionResponse>(
      '/api/subscriptions',
      request
    );
    return data;
  },

  /**
   * Change subscription plan (upgrade or downgrade)
   * PUT /api/subscriptions/change-plan
   */
  async changePlan(request: ChangePlanRequest): Promise<UserSubscriptionResponse> {
    const { data } = await apiClient.put<UserSubscriptionResponse>(
      '/api/subscriptions/change-plan',
      request
    );
    return data;
  },

  /**
   * Cancel subscription
   * POST /api/subscriptions/cancel
   */
  async cancel(request: CancelSubscriptionRequest): Promise<UserSubscriptionResponse> {
    const { data } = await apiClient.post<UserSubscriptionResponse>(
      '/api/subscriptions/cancel',
      request
    );
    return data;
  },
};

/**
 * Payment Methods API
 * Endpoint: /api/payment-methods
 */
export const paymentMethodsApi = {
  /**
   * Get all user's payment methods
   * GET /api/payment-methods
   */
  async getAll(): Promise<PaymentMethodResponse[]> {
    const { data } = await apiClient.get<PaymentMethodResponse[]>('/api/payment-methods');
    return data;
  },

  /**
   * Add a new payment method
   * POST /api/payment-methods
   *
   * NOTE: The stripePaymentMethodId must be obtained from Stripe Elements
   * tokenization on the frontend BEFORE calling this endpoint.
   */
  async create(request: CreatePaymentMethodRequest): Promise<PaymentMethodResponse> {
    const { data } = await apiClient.post<PaymentMethodResponse>(
      '/api/payment-methods',
      request
    );
    return data;
  },

  /**
   * Delete a payment method
   * DELETE /api/payment-methods/:id
   *
   * NOTE: Cannot delete the only payment method if user has a paid subscription.
   * Cannot delete the default payment method without setting another as default first.
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

/**
 * Combined API object for convenience
 */
const subscriptionApi = {
  plans: plansApi,
  subscriptions: subscriptionsApi,
  paymentMethods: paymentMethodsApi,
};

// Default export
export default subscriptionApi;
