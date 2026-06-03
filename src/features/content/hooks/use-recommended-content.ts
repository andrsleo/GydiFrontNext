/**
 * Hook for infinite recommended content feed
 * Anonymous users receive the trending feed from the server
 */

'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { contentApi } from '../api/content.api';
import { contentKeys } from './use-content-feed';

export function useRecommendedContent() {
  return useInfiniteQuery({
    queryKey: contentKeys.recommended(),
    queryFn: ({ pageParam }) =>
      contentApi.getRecommendedContent(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime: 5 * 60 * 1000,
  });
}
