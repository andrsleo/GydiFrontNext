/**
 * Mutation hook for accepting a pitch (HOST action)
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { collaborationsApi } from '../api/collaborations.api';
import { collaborationKeys } from './use-marketplace';

export function useAcceptPitch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pitchId: number) => collaborationsApi.acceptPitch(pitchId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.pitchDetail(data.pitchId) });
      queryClient.invalidateQueries({ queryKey: collaborationKeys.inbox({}), exact: false });
      toast.success('Pitch aceptado', {
        description: 'Se ha creado el acuerdo de colaboración.',
      });
    },
    onError: (error: Error) => {
      toast.error('Error al aceptar pitch', {
        description: error.message || 'Intenta de nuevo más tarde.',
      });
    },
  });
}
