/**
 * Admin Commissions API Client
 *
 * API functions for admin commission management
 */

import { apiClient } from '@/lib/api/client';
import type {
  HostCommissionDto,
  AffiliateCommissionDto,
  CommissionFilters,
  CommissionStats,
} from '../types';

/**
 * Admin commissions API
 */
export const commissionsAdminApi = {
  /**
   * List host commissions (platform charges hosts)
   */
  async listHostCommissions(filters?: CommissionFilters): Promise<HostCommissionDto[]> {
    const { data } = await apiClient.get<HostCommissionDto[]>('/api/v1/commissions/host', {
      params: filters,
    });
    return data;
  },

  /**
   * Get single host commission
   */
  async getHostCommission(id: number): Promise<HostCommissionDto> {
    const { data } = await apiClient.get<HostCommissionDto>(
      `/api/v1/commissions/host/${id}`
    );
    return data;
  },

  /**
   * List affiliate commissions (platform pays affiliates)
   */
  async listAffiliateCommissions(
    filters?: CommissionFilters
  ): Promise<AffiliateCommissionDto[]> {
    const { data } = await apiClient.get<AffiliateCommissionDto[]>(
      '/api/v1/commissions/affiliate',
      {
        params: filters,
      }
    );
    return data;
  },

  /**
   * Get single affiliate commission
   */
  async getAffiliateCommission(id: number): Promise<AffiliateCommissionDto> {
    const { data } = await apiClient.get<AffiliateCommissionDto>(
      `/api/v1/commissions/affiliate/${id}`
    );
    return data;
  },

  /**
   * Get commission statistics
   */
  async getStats(): Promise<CommissionStats> {
    const { data } = await apiClient.get<CommissionStats>('/api/v1/commissions/stats');
    return data;
  },

  /**
   * Retry failed host commission charge
   */
  async retryHostCommission(id: number): Promise<HostCommissionDto> {
    const { data } = await apiClient.post<HostCommissionDto>(
      `/api/v1/commissions/host/${id}/retry`
    );
    return data;
  },

  /**
   * Retry failed affiliate commission payment
   */
  async retryAffiliateCommission(id: number): Promise<AffiliateCommissionDto> {
    const { data } = await apiClient.post<AffiliateCommissionDto>(
      `/api/v1/commissions/affiliate/${id}/retry`
    );
    return data;
  },

  /**
   * Approve affiliate commission for payment
   */
  async approveAffiliateCommission(id: number): Promise<AffiliateCommissionDto> {
    const { data } = await apiClient.post<AffiliateCommissionDto>(
      `/api/v1/commissions/affiliate/${id}/approve`
    );
    return data;
  },

  /**
   * Cancel affiliate commission
   */
  async cancelAffiliateCommission(id: number): Promise<AffiliateCommissionDto> {
    const { data } = await apiClient.post<AffiliateCommissionDto>(
      `/api/v1/commissions/affiliate/${id}/cancel`
    );
    return data;
  },
};
