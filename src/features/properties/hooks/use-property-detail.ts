/**
 * usePropertyDetail Hook
 * React Query hook for fetching single property details
 */

'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { propertiesApi } from '../api/properties.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import type { PropertyDetailResponse } from '../types';
// MOCK DATA - Remover cuando haya suficientes propiedades reales en DB
import { MOCK_PROPERTY_DETAILS } from '../data/mock-properties';

interface UsePropertyDetailOptions
  extends Omit<UseQueryOptions<PropertyDetailResponse, Error>, 'queryKey' | 'queryFn'> {
  slug: string;
}

/**
 * Hook to fetch property details by SEO-friendly slug
 * Includes all property info, images, videos, amenities
 * Automatically extracts and includes referral token from URL if present
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = usePropertyDetail({ slug: 'beach-house-malibu-x7k2m' });
 * ```
 */
export function usePropertyDetail(options: UsePropertyDetailOptions) {
  const { slug, ...queryOptions } = options;
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  return useQuery<PropertyDetailResponse, Error>({
    queryKey: propertyKeys.detail(slug, ref),
    // MOCK DATA - Si es una propiedad mock, retornar datos locales sin llamar al backend
    queryFn: () => {
      if (slug.startsWith('mock-airbnb-') && MOCK_PROPERTY_DETAILS[slug]) {
        return Promise.resolve(MOCK_PROPERTY_DETAILS[slug]);
      }
      return propertiesApi.getBySlug(slug, ref || undefined);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - details can change
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    enabled: !!slug, // Only fetch if slug is provided
    ...queryOptions,
  });
}
