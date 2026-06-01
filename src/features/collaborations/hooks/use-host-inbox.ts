/**
 * Hook for the host's pitch inbox
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { collaborationsApi } from '../api/collaborations.api';
import { collaborationKeys } from './use-marketplace';

export function useHostInbox(
  params: {
    status?: string;
    propertyId?: number;
    page?: number;
    size?: number;
  } = {}
) {
  return useQuery({
    queryKey: collaborationKeys.inbox(params),
    queryFn: () => collaborationsApi.getHostInbox(params),
    staleTime: 1 * 60 * 1000,
  });
}
