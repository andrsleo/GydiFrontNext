import { apiClient } from '@/lib/api/client';
import type {
  CommissionDto,
  CommissionFiltersInput,
  CommissionStats,
  PayoutStatusDto,
  SavePayPalEmailRequest,
  SavePayPalEmailResponse,
} from '../types';

/**
 * Commissions API client for USER
 *
 * SEMANTIC CLARITY:
 * - Affiliate endpoints: Commissions EARNED (platform PAYS affiliate)
 * - Host endpoints: Commissions PAID (platform CHARGES host)
 */
export const commissionsApi = {
  // ==========================================
  // AFFILIATE ENDPOINTS (commissions EARNED)
  // ==========================================

  /**
   * Get commissions earned by affiliate
   *
   * These are commissions the platform PAYS to the affiliate for successful referrals.
   */
  async getAffiliateCommissions(filters?: CommissionFiltersInput): Promise<CommissionDto[]> {
    const { data } = await apiClient.get<CommissionDto[]>(
      '/api/v1/commissions/affiliate/earned',
      {
        params: filters,
      }
    );
    return data;
  },

  /**
   * Get stats for affiliate commissions
   *
   * Returns totalEarned (how much platform owes affiliate).
   */
  async getAffiliateStats(): Promise<CommissionStats> {
    const { data } = await apiClient.get<CommissionStats>(
      '/api/v1/commissions/affiliate/stats'
    );
    return data;
  },

  // ==========================================
  // HOST ENDPOINTS (commissions PAID)
  // ==========================================

  /**
   * Get commissions paid by host
   *
   * These are commissions the platform CHARGES to the host for bookings via affiliates.
   */
  async getHostCommissions(filters?: CommissionFiltersInput): Promise<CommissionDto[]> {
    const { data } = await apiClient.get<CommissionDto[]>(
      '/api/v1/commissions/host/paid',
      {
        params: filters,
      }
    );
    return data;
  },

  /**
   * Get stats for host commissions
   *
   * Returns totalPaid (how much host has paid to platform).
   */
  async getHostStats(): Promise<CommissionStats> {
    const { data } = await apiClient.get<CommissionStats>(
      '/api/v1/commissions/host/stats'
    );
    return data;
  },

  // ==========================================
  // ADMIN ENDPOINTS (already implemented)
  // ==========================================
  // See: src/features/admin/commissions/api/admin-commissions.api.ts

  // ==========================================
  // AFFILIATE PAYOUT ENDPOINTS (PayPal)
  // ==========================================

  /**
   * Get affiliate payout status
   *
   * Returns PayPal email configuration status.
   */
  async getPayoutStatus(): Promise<PayoutStatusDto> {
    const { data } = await apiClient.get<PayoutStatusDto>(
      '/api/v1/affiliates/payout/status'
    );
    return data;
  },

  /**
   * Save affiliate PayPal email for payouts
   *
   * Stores the PayPal email address where affiliate commissions will be sent.
   */
  async savePayPalEmail(request: SavePayPalEmailRequest): Promise<SavePayPalEmailResponse> {
    const { data } = await apiClient.put<SavePayPalEmailResponse>(
      '/api/v1/affiliates/payout/paypal-email',
      request
    );
    return data;
  },
};
