/**
 * Mutation hook for cancelling a pitch (CREATOR action)
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { collaborationsApi } from '../api/collaborations.api';
import { collaborationKeys } from './use-marketplace';

export function useCancelPitch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pitchId: number) => collaborationsApi.cancelPitch(pitchId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: collaborationKeys.myPitches({}),
        exact: false,
      });
      toast.success('Pitch cancelado');
    },
    onError: (error: Error) => {
      toast.error('Error al cancelar pitch', {
        description: error.message || 'Intenta de nuevo más tarde.',
      });
    },
  });
}
