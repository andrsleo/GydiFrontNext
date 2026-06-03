/**
 * Hook for authenticated user's own content
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { useIsAuthenticated } from '@/features/auth/hooks/use-auth';
import { contentApi } from '../api/content.api';
import { contentKeys } from './use-content-feed';

export function useMyContent(page = 0, size = 12) {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: contentKeys.myContent(page),
    queryFn: () => contentApi.getMyContent(page, size),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}
