/**
 * Host Commissions Hooks
 *
 * React Query hooks for fetching commissions PAID by host (platform CHARGES).
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { commissionsApi } from '../api/commissions.api';
import type { CommissionFiltersInput } from '../types';

/**
 * Hook to fetch host commissions (paid)
 *
 * Returns commissions the platform CHARGES to the host.
 * User must have canPublish capability.
 */
export function useHostCommissions(filters?: CommissionFiltersInput) {
  return useQuery({
    queryKey: ['commissions', 'host', 'paid', filters],
    queryFn: () => commissionsApi.getHostCommissions(filters),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch host commission stats
 *
 * Returns summary (totalPaid, pending).
 */
export function useHostCommissionStats() {
  return useQuery({
    queryKey: ['commissions', 'host', 'stats'],
    queryFn: () => commissionsApi.getHostStats(),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000,
  });
}
