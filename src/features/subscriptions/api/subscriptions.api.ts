import { apiClient } from '@/lib/api/client';
import type {
  Subscription,
  Earning,
  EarningsStats,
  MonthlyEarning,
  UpgradePlanRequest,
  UpgradePlanResponse,
  CancelSubscriptionRequest,
} from '../types';

/**
 * Subscriptions API client
 */
export const subscriptionsApi = {
  /**
   * Get current user subscription
   */
  async getCurrent(): Promise<Subscription> {
    const { data } = await apiClient.get<Subscription>('/api/subscriptions/current');
    return data;
  },

  /**
   * Upgrade to a new plan
   */
  async upgradePlan(request: UpgradePlanRequest): Promise<UpgradePlanResponse> {
    const { data } = await apiClient.post<UpgradePlanResponse>(
      '/api/subscriptions/upgrade',
      request
    );
    return data;
  },

  /**
   * Cancel subscription
   */
  async cancel(request: CancelSubscriptionRequest): Promise<Subscription> {
    const { data } = await apiClient.post<Subscription>(
      '/api/subscriptions/cancel',
      request
    );
    return data;
  },

  /**
   * Reactivate cancelled subscription
   */
  async reactivate(): Promise<Subscription> {
    const { data} = await apiClient.post<Subscription>('/api/subscriptions/reactivate');
    return data;
  },

  /**
   * Get earnings history
   */
  async getEarnings(params?: {
    status?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<{ data: Earning[]; total: number; page: number; limit: number }> {
    const { data } = await apiClient.get('/api/earnings', { params });
    return data;
  },

  /**
   * Get earnings statistics
   */
  async getEarningsStats(): Promise<EarningsStats> {
    const { data } = await apiClient.get<EarningsStats>('/api/earnings/stats');
    return data;
  },

  /**
   * Get monthly earnings for charts
   */
  async getMonthlyEarnings(months: number = 6): Promise<MonthlyEarning[]> {
    const { data } = await apiClient.get<MonthlyEarning[]>('/api/earnings/monthly', {
      params: { months },
    });
    return data;
  },

  /**
   * Get earning by ID
   */
  async getEarningById(id: string): Promise<Earning> {
    const { data } = await apiClient.get<Earning>(`/api/earnings/${id}`);
    return data;
  },
};