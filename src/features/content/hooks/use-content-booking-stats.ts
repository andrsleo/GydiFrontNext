'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { ContentBookingStats } from '@/features/properties/types';

async function fetchContentBookingStats(contentPostId: number): Promise<ContentBookingStats> {
  const { data } = await apiClient.get<ContentBookingStats>(
    `/api/v1/content/${contentPostId}/booking-stats`
  );
  return data;
}

export function useContentBookingStats(contentPostId: number | undefined) {
  return useQuery({
    queryKey: ['content', contentPostId, 'booking-stats'],
    queryFn: () => fetchContentBookingStats(contentPostId!),
    enabled: !!contentPostId,
    staleTime: 5 * 60 * 1000,
  });
}
