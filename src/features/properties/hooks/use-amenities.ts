/**
 * useAmenities Hook
 * React Query hook for fetching amenities
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { amenitiesApi } from '../api/amenities.api';

/**
 * Hook to fetch all available amenities
 */
export function useAmenities() {
  return useQuery({
    queryKey: ['amenities'],
    queryFn: () => amenitiesApi.getAll(),
    staleTime: 60 * 60 * 1000, // 1 hour - amenities don't change often
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

/**
 * Hook to fetch amenities by category
 */
export function useAmenitiesByCategory(category: string) {
  return useQuery({
    queryKey: ['amenities', 'category', category],
    queryFn: () => amenitiesApi.getByCategory(category),
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    enabled: !!category,
  });
}