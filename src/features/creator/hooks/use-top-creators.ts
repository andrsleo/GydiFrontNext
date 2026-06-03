'use client';

import { useQuery } from '@tanstack/react-query';
import { creatorApi } from '../api/creator.api';

export function useTopCreators(limit = 6) {
  return useQuery({
    queryKey: ['creators', 'top', limit],
    queryFn: () => creatorApi.getTopCreators(limit),
    staleTime: 5 * 60_000,
  });
}
