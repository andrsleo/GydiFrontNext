/**
 * Hook for uploading media to a content post
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contentApi } from '../api/content.api';
import { contentKeys } from './use-content-feed';

export function useUploadMedia(contentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => contentApi.uploadMedia(contentId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(contentId) });
      toast.success('Archivo subido exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al subir el archivo: ${error.message}`);
    },
  });
}
