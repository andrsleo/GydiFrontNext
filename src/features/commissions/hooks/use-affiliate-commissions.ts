/**
 * Affiliate Commissions Hooks
 *
 * React Query hooks for fetching commissions EARNED by affiliate (platform PAYS).
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { commissionsApi } from '../api/commissions.api';
import type { CommissionFiltersInput } from '../types';

/**
 * Hook to fetch affiliate commissions (earned)
 *
 * Returns commissions the platform PAYS to the affiliate.
 * User must have canRefer capability.
 */
export function useAffiliateCommissions(filters?: CommissionFiltersInput) {
  return useQuery({
    queryKey: ['commissions', 'affiliate', 'earned', filters],
    queryFn: () => commissionsApi.getAffiliateCommissions(filters),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch affiliate commission stats
 *
 * Returns summary (totalEarned, pending).
 */
export function useAffiliateCommissionStats() {
  return useQuery({
    queryKey: ['commissions', 'affiliate', 'stats'],
    queryFn: () => commissionsApi.getAffiliateStats(),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000,
  });
}
