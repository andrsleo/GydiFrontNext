/**
 * Mutation hook for creating a counter-offer on a pitch
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { collaborationsApi } from '../api/collaborations.api';
import type { CreateCounterOfferInput } from '../api/collaborations.api';
import { collaborationKeys } from './use-marketplace';

export function useCreateCounterOffer(pitchId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCounterOfferInput) =>
      collaborationsApi.createCounterOffer(pitchId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.pitchDetail(pitchId) });
      queryClient.invalidateQueries({ queryKey: collaborationKeys.inbox({}), exact: false });
      toast.success('Contraoferta enviada', {
        description: `Ronda ${data.roundNumber} de negociación en curso.`,
      });
    },
    onError: (error: Error) => {
      toast.error('Error al enviar contraoferta', {
        description: error.message || 'Intenta de nuevo más tarde.',
      });
    },
  });
}
