/**
 * Hook for creating a new content post
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contentApi } from '../api/content.api';
import { contentKeys } from './use-content-feed';
import type { CreateContentPostRequest } from '../types';

export function useCreateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateContentPostRequest) =>
      contentApi.createContentPost(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.feed() });
      queryClient.invalidateQueries({ queryKey: contentKeys.myContent(0) });
      toast.success('Contenido creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al crear el contenido: ${error.message}`);
    },
  });
}
