/**
 * Hooks for host collaboration settings
 * GET + PUT /api/v1/collaborations/settings/properties/{propertyId}
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { collaborationsApi } from '../api/collaborations.api';
import { collaborationKeys } from './use-marketplace';
import type { CollaborationSettings } from '../types';

// ── GET ───────────────────────────────────────────────────────────────────────

export function useGetCollaborationSettings(propertyId: number) {
  return useQuery({
    queryKey: collaborationKeys.settings(propertyId),
    queryFn: () => collaborationsApi.getCollaborationSettings(propertyId),
    staleTime: 5 * 60 * 1000,
    enabled: propertyId > 0,
  });
}

// ── PUT ───────────────────────────────────────────────────────────────────────

export interface UpdateCollaborationSettingsInput {
  propertyId: number;
  acceptCollaborations: boolean;
  acceptedCompensations: string[];
}

export function useUpdateCollaborationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, acceptCollaborations, acceptedCompensations }: UpdateCollaborationSettingsInput) =>
      collaborationsApi.updateCollaborationSettings(propertyId, {
        acceptCollaborations,
        acceptedCompensations,
      }),
    onSuccess: (data: CollaborationSettings) => {
      queryClient.setQueryData(collaborationKeys.settings(data.propertyId), data);
      queryClient.invalidateQueries({
        queryKey: collaborationKeys.settings(data.propertyId),
      });
    },
  });
}
