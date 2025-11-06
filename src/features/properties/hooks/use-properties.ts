/**
 * useProperties Hook
 * React Query hook for fetching paginated property list with filters
 */

'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { propertiesApi } from '../api/properties.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import type { PropertyFilters, PaginatedPropertyResponse } from '../types';

interface UsePropertiesOptions
  extends Omit<
    UseQueryOptions<PaginatedPropertyResponse, Error>,
    'queryKey' | 'queryFn'
  > {
  filters?: PropertyFilters;
}

/**
 * Hook to fetch properties with filters
 * Includes pagination, search, and filter support
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useProperties({
 *   filters: { status: 'PUBLISHED', country: 'USA', page: 0, size: 20 }
 * });
 * ```
 */
export function useProperties(options?: UsePropertiesOptions) {
  const { filters, ...queryOptions } = options || {};

  return useQuery<PaginatedPropertyResponse, Error>({
    queryKey: propertyKeys.list(filters),
    queryFn: () => propertiesApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes - properties don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache
    ...queryOptions,
  });
}
