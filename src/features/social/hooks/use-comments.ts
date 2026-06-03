'use client';

import { useQuery } from '@tanstack/react-query';
import { socialApi } from '../api/social.api';

export function useComments(contentPostId: number, page = 0) {
  return useQuery({
    queryKey: ['comments', contentPostId, page],
    queryFn: () => socialApi.getComments(contentPostId, page),
    staleTime: 30_000,
  });
}
