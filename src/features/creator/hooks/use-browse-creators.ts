'use client';

import { useQuery } from '@tanstack/react-query';
import { creatorApi } from '../api/creator.api';

export function useBrowseCreators(page = 0, size = 12) {
  return useQuery({
    queryKey: ['creators', page, size],
    queryFn: () => creatorApi.browseCreators(page, size),
    staleTime: 2 * 60_000,
  });
}
