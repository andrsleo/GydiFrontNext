/**
 * Mutation hook for approving a deliverable (HOST action)
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { collaborationsApi } from '../api/collaborations.api';
import { collaborationKeys } from './use-marketplace';

export function useApproveDeliverable(agreementId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deliverableId: number) =>
      collaborationsApi.approveDeliverable(agreementId, deliverableId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: collaborationKeys.agreementDetail(agreementId),
      });
      toast.success('Entregable aprobado');
    },
    onError: (error: Error) => {
      toast.error('Error al aprobar entregable', {
        description: error.message || 'Intenta de nuevo más tarde.',
      });
    },
  });
}
