'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaApi } from '../api/media.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import { toast } from 'sonner';

interface DeleteImageParams {
  propertyId: string;
  imageId: string;
}

/**
 * Hook to delete a property image
 * Removes image from database and storage (S3/local)
 */
export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, imageId }: DeleteImageParams) => {
      return mediaApi.deleteImage(propertyId, imageId);
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch property detail
      queryClient.invalidateQueries({
        queryKey: propertyKeys.detail(variables.propertyId),
        refetchType: 'active',
      });

      // Invalidate ALL property lists (including filtered queries)
      queryClient.invalidateQueries({
        queryKey: propertyKeys.all,
        refetchType: 'active',
      });

      toast.success('Imagen eliminada correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al eliminar imagen', {
        description: error.message,
      });
    },
  });
}
