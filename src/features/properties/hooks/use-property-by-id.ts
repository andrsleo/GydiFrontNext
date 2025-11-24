/**
 * usePropertyById Hook
 * React Query hook for fetching property details by ID
 * Used for admin/owner views where ID is known (e.g., after creation, in edit mode)
 */

'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { propertiesApi } from '../api/properties.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import type { PropertyDetailResponse } from '../types';

interface UsePropertyByIdOptions
    extends Omit<UseQueryOptions<PropertyDetailResponse, Error>, 'queryKey' | 'queryFn'> {
    id: string;
}

/**
 * Hook to fetch property details by ID
 * Includes all property info, images, videos, amenities
 * Typically used for property management/editing views
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = usePropertyById({ 
 *   id: '123',
 *   enabled: !!id 
 * });
 * ```
 */
export function usePropertyById(options: UsePropertyByIdOptions) {
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
