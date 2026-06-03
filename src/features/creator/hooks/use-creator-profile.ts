'use client';

import { useQuery } from '@tanstack/react-query';
import { creatorApi } from '../api/creator.api';
import type { CreatorProfile } from '../types';

export function useCreatorProfile(userId: number) {
  return useQuery<CreatorProfile | null>({
    queryKey: ['creator-profile', userId],
    queryFn: async () => {
      try {
        return await creatorApi.getCreatorProfile(userId);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404 || status === 400) return null;
        throw err;
      }
    },
    staleTime: 5 * 60_000,
    enabled: !!userId,
  });
}
