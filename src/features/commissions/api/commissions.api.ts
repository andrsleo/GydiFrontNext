import { apiClient } from '@/lib/api/client';
import type {
  CommissionDto,
  CommissionFiltersInput,
  CommissionStats,
  OnboardingLinkDto,
  ConnectAccountStatusDto,
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
  // AFFILIATE CONNECT ENDPOINTS (Stripe Connect onboarding)
  // ==========================================

  /**
   * Initiate Stripe Connect onboarding for affiliate
   *
   * Returns URL to redirect user to Stripe onboarding form.
   */
  async initiateAffiliateOnboarding(): Promise<OnboardingLinkDto> {
    const { data } = await apiClient.post<OnboardingLinkDto>(
      '/api/v1/affiliates/connect/initiate'
    );
    return data;
  },

  /**
   * Get Stripe Connect account status
   *
   * Returns onboarding status and payout enablement.
   */
  async getConnectAccountStatus(): Promise<ConnectAccountStatusDto> {
    const { data } = await apiClient.get<ConnectAccountStatusDto>(
      '/api/v1/affiliates/connect/status'
    );
    return data;
  },

  /**
   * Generate a single-use Stripe Express Dashboard login link.
   *
   * The URL expires in ~5 minutes. Redirect the user immediately after receiving it.
   */
  async getDashboardLink(): Promise<{ url: string }> {
    const { data } = await apiClient.post<{ url: string }>(
      '/api/v1/affiliates/connect/dashboard-link'
    );
    return data;
  },
};
