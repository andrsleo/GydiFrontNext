'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaApi } from '../api/media.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import { toast } from 'sonner';

interface DeleteVideoParams {
  propertyId: string;
  videoId: string;
}

/**
 * Hook to delete a property video
 * Removes video from database and storage (S3/local)
 */
export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, videoId }: DeleteVideoParams) => {
      return mediaApi.deleteVideo(propertyId, videoId);
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

      toast.success('Video eliminado correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al eliminar video', {
        description: error.message,
      });
    },
  });
}
