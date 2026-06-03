/**
 * Hook for a single content post
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { contentApi } from '../api/content.api';
import { contentKeys } from './use-content-feed';

export function useContentById(id: number) {
  return useQuery({
    queryKey: contentKeys.detail(id),
    queryFn: () => contentApi.getContentById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
  });
}
