/**
 * Mutation hook for requesting a revision on a deliverable (HOST action)
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { collaborationsApi } from '../api/collaborations.api';
import { collaborationKeys } from './use-marketplace';

export function useRequestRevision(agreementId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      deliverableId,
      feedback,
    }: {
      deliverableId: number;
      feedback: string;
    }) => collaborationsApi.requestRevision(agreementId, deliverableId, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: collaborationKeys.agreementDetail(agreementId),
      });
      toast.success('Revisión solicitada', {
        description: 'Se notificó al creador con el feedback.',
      });
    },
    onError: (error: Error) => {
      toast.error('Error al solicitar revisión', {
        description: error.message || 'Intenta de nuevo más tarde.',
      });
    },
  });
}
