/**
 * Commissions Query Hooks
 *
 * TanStack Query hooks for fetching commissions data
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { commissionsAdminApi } from '../api';
import type {
  HostCommissionDto,
  AffiliateCommissionDto,
  CommissionFilters,
  CommissionStats,
} from '../types';

/**
 * Query keys for commissions
 */
export const commissionKeys = {
  all: ['commissions'] as const,
  host: () => [...commissionKeys.all, 'host'] as const,
  hostList: (filters?: CommissionFilters) => [...commissionKeys.host(), 'list', filters] as const,
  hostDetail: (id: number) => [...commissionKeys.host(), 'detail', id] as const,
  affiliate: () => [...commissionKeys.all, 'affiliate'] as const,
  affiliateList: (filters?: CommissionFilters) =>
    [...commissionKeys.affiliate(), 'list', filters] as const,
  affiliateDetail: (id: number) => [...commissionKeys.affiliate(), 'detail', id] as const,
  stats: () => [...commissionKeys.all, 'stats'] as const,
};

/**
 * Hook to fetch host commissions (platform charges hosts)
 */
export function useHostCommissions(filters?: CommissionFilters) {
  return useQuery<HostCommissionDto[]>({
    queryKey: commissionKeys.hostList(filters),
    queryFn: () => commissionsAdminApi.listHostCommissions(filters),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single host commission
 */
export function useHostCommission(id: number, options?: { enabled?: boolean }) {
  return useQuery<HostCommissionDto>({
    queryKey: commissionKeys.hostDetail(id),
    queryFn: () => commissionsAdminApi.getHostCommission(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch affiliate commissions (platform pays affiliates)
 */
export function useAffiliateCommissions(filters?: CommissionFilters) {
  return useQuery<AffiliateCommissionDto[]>({
    queryKey: commissionKeys.affiliateList(filters),
    queryFn: () => commissionsAdminApi.listAffiliateCommissions(filters),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single affiliate commission
 */
export function useAffiliateCommission(id: number, options?: { enabled?: boolean }) {
  return useQuery<AffiliateCommissionDto>({
    queryKey: commissionKeys.affiliateDetail(id),
    queryFn: () => commissionsAdminApi.getAffiliateCommission(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch commission statistics
 */
export function useCommissionStats() {
  return useQuery<CommissionStats>({
    queryKey: commissionKeys.stats(),
    queryFn: () => commissionsAdminApi.getStats(),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
  });
}
