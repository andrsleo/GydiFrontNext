/**
 * Hook for single marketplace property detail
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { collaborationsApi } from '../api/collaborations.api';
import { collaborationKeys } from './use-marketplace';

export function useMarketplaceProperty(propertyId: number) {
  return useQuery({
    queryKey: collaborationKeys.marketplaceProperty(propertyId),
    queryFn: () => collaborationsApi.getMarketplaceProperty(propertyId),
    staleTime: 5 * 60 * 1000,
    enabled: propertyId > 0,
  });
}
