/**
 * Hook for marketplace property listing
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { collaborationsApi } from '../api/collaborations.api';
import type { MarketplaceFilters } from '../types';

export const collaborationKeys = {
  all: ['collaborations'] as const,
  marketplace: () => [...collaborationKeys.all, 'marketplace'] as const,
  marketplaceList: (filters: MarketplaceFilters) =>
    [...collaborationKeys.marketplace(), filters] as const,
  marketplaceProperty: (propertyId: number) =>
    [...collaborationKeys.marketplace(), propertyId] as const,
  pitches: () => [...collaborationKeys.all, 'pitches'] as const,
  myPitches: (params: { status?: string; page?: number; size?: number }) =>
    [...collaborationKeys.pitches(), 'mine', params] as const,
  pitchDetail: (pitchId: number) =>
    [...collaborationKeys.pitches(), pitchId] as const,
  inbox: (params: {
    status?: string;
    propertyId?: number;
    page?: number;
    size?: number;
  }) => [...collaborationKeys.all, 'inbox', params] as const,
  agreements: () => [...collaborationKeys.all, 'agreements'] as const,
  agreementDetail: (agreementId: number) =>
    [...collaborationKeys.agreements(), agreementId] as const,
  settings: (propertyId: number) =>
    [...collaborationKeys.all, 'settings', propertyId] as const,
};

export function useMarketplace(filters: MarketplaceFilters = {}) {
  return useQuery({
    queryKey: collaborationKeys.marketplaceList(filters),
    queryFn: () => collaborationsApi.getMarketplace(filters),
    staleTime: 60 * 60 * 1000, // 1 hour — aligns with ISR revalidation
  });
}
