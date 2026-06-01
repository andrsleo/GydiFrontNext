/**
 * Hook for fetching a single pitch with full detail and counter-offer history
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { collaborationsApi } from '../api/collaborations.api';
import { collaborationKeys } from './use-marketplace';

export function usePitchDetail(pitchId: number) {
  return useQuery({
    queryKey: collaborationKeys.pitchDetail(pitchId),
    queryFn: () => collaborationsApi.getPitchDetail(pitchId),
    staleTime: 2 * 60 * 1000,
    enabled: pitchId > 0,
  });
}
