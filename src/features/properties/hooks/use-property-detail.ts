/**
 * usePropertyDetail Hook
 * React Query hook for fetching single property details
 */

'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { propertiesApi } from '../api/properties.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import type { PropertyDetailResponse } from '../types';

interface UsePropertyDetailOptions
  extends Omit<UseQueryOptions<PropertyDetailResponse, Error>, 'queryKey' | 'queryFn'> {
  id: string;
}

/**
 * Hook to fetch property details by ID
 * Includes all property info, images, videos, amenities
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = usePropertyDetail({ id: 'property-123' });
 * ```
 */
export function usePropertyDetail(options: UsePropertyDetailOptions) {
  const { id, ...queryOptions } = options;

  return useQuery<PropertyDetailResponse, Error>({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertiesApi.getById(id),
    staleTime: 2 * 60 * 1000, // 2 minutes - details can change
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    enabled: !!id, // Only fetch if ID is provided
    ...queryOptions,
  });
}
