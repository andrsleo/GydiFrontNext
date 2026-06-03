/**
 * Hook for infinite content feed
 */

'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { contentApi } from '../api/content.api';

export const contentKeys = {
  all: ['content'] as const,
  feed: () => [...contentKeys.all, 'feed'] as const,
  myContent: (page: number) => [...contentKeys.all, 'my-content', page] as const,
  propertyContent: (propertyId: number, page: number) =>
    [...contentKeys.all, 'property', propertyId, page] as const,
  detail: (id: number) => [...contentKeys.all, 'detail', id] as const,
  similar: (postId: number) => [...contentKeys.all, 'similar', postId] as const,
  recommended: () => [...contentKeys.all, 'recommended'] as const,
};

export function useContentFeed() {
  return useInfiniteQuery({
    queryKey: contentKeys.feed(),
    queryFn: ({ pageParam }) =>
      contentApi.getContentFeed(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime: 2 * 60 * 1000,
  });
}

export function useFollowingFeed() {
  return useInfiniteQuery({
    queryKey: [...contentKeys.all, 'feed', 'following'] as const,
    queryFn: ({ pageParam }) =>
      contentApi.getFollowingFeed(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime: 2 * 60 * 1000,
  });
}
