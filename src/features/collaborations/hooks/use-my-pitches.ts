/**
 * Hook for the creator's own pitch list
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { collaborationsApi } from '../api/collaborations.api';
import { collaborationKeys } from './use-marketplace';

export function useMyPitches(
  params: { status?: string; page?: number; size?: number } = {}
) {
  return useQuery({
    queryKey: collaborationKeys.myPitches(params),
    queryFn: () => collaborationsApi.getMyPitches(params),
    staleTime: 1 * 60 * 1000,
  });
}
