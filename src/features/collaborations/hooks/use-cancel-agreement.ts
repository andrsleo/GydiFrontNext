/**
 * Mutation hook for cancelling an agreement
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { collaborationsApi } from '../api/collaborations.api';
import { collaborationKeys } from './use-marketplace';

export function useCancelAgreement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agreementId: number) => collaborationsApi.cancelAgreement(agreementId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: collaborationKeys.agreements(),
        exact: false,
      });
      toast.success('Acuerdo cancelado');
    },
    onError: (error: Error) => {
      toast.error('Error al cancelar acuerdo', {
        description: error.message || 'Intenta de nuevo más tarde.',
      });
    },
  });
}
