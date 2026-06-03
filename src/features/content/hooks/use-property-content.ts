/**
 * Hook for content tagged to a specific property
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { contentApi } from '../api/content.api';
import { contentKeys } from './use-content-feed';

export function usePropertyContent(propertyId: number, page = 0) {
  return useQuery({
    queryKey: contentKeys.propertyContent(propertyId, page),
    queryFn: () => contentApi.getPropertyContent(propertyId, page),
    enabled: propertyId > 0,
    staleTime: 5 * 60 * 1000,
  });
}
