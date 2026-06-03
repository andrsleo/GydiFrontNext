'use client';

import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '../api/properties.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import type { PropertyFilters, PaginatedPropertyResponse } from '../types';

/**
 * Hook to fetch the current user's own properties (all statuses, not just PUBLISHED).
 * Uses the authenticated /my-properties endpoint.
 */
export function useMyProperties(filters?: PropertyFilters) {
  return useQuery<PaginatedPropertyResponse, Error>({
    queryKey: propertyKeys.myProperties(filters),
    queryFn: () => propertiesApi.getMyProperties(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
