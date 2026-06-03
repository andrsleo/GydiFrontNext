/**
 * Hook to fetch similar content for a given post
 * Uses the recommendation engine endpoint
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { contentApi } from '../api/content.api';
import { contentKeys } from './use-content-feed';

export function useSimilarContent(postId: number | undefined) {
  return useQuery({
    queryKey: contentKeys.similar(postId!),
    queryFn: () => contentApi.getSimilarContent(postId!),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000,
  });
}
