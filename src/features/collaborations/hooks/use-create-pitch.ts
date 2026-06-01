/**
 * Mutation hook for creating a new pitch
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { collaborationsApi } from '../api/collaborations.api';
import type { CreatePitchInput } from '../api/collaborations.api';
import { collaborationKeys } from './use-marketplace';

export function useCreatePitch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePitchInput) => collaborationsApi.createPitch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.marketplace() });
      queryClient.invalidateQueries({
        queryKey: collaborationKeys.myPitches({}),
        exact: false,
      });
      toast.success('Pitch enviado', {
        description: 'Tu propuesta fue enviada al host. Recibirás una respuesta en 48h.',
      });
    },
    onError: (error: Error) => {
      toast.error('Error al enviar pitch', {
        description: error.message || 'Intenta de nuevo más tarde.',
      });
    },
  });
}
