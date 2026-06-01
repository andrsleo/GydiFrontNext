/**
 * Mutation hook for uploading a delivery asset (CREATOR action)
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { collaborationsApi } from '../api/collaborations.api';
import { collaborationKeys } from './use-marketplace';

export function useUploadDeliveryAsset(agreementId: number, deliverableId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      collaborationsApi.uploadDeliveryAsset(agreementId, deliverableId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: collaborationKeys.agreementDetail(agreementId),
      });
      toast.success('Archivo subido', {
        description: 'El host revisará tu entregable.',
      });
    },
    onError: (error: Error) => {
      toast.error('Error al subir archivo', {
        description: error.message || 'Intenta de nuevo más tarde.',
      });
    },
  });
}
