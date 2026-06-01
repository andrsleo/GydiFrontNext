/**
 * Mutation hook for declining a pitch (HOST action)
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { collaborationsApi } from '../api/collaborations.api';
import { collaborationKeys } from './use-marketplace';

export function useDeclinePitch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pitchId, reason }: { pitchId: number; reason: string }) =>
      collaborationsApi.declinePitch(pitchId, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.pitchDetail(data.pitchId) });
      queryClient.invalidateQueries({ queryKey: collaborationKeys.inbox({}), exact: false });
      toast.success('Pitch rechazado', {
        description: 'Se notificó al creador.',
      });
    },
    onError: (error: Error) => {
      toast.error('Error al rechazar pitch', {
        description: error.message || 'Intenta de nuevo más tarde.',
      });
    },
  });
}
