'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaApi } from '../api/media.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import { toast } from 'sonner';

interface ReorderVideosParams {
  propertyId: string;
  videoOrders: Array<{ videoId: string; displayOrder: number }>;
}

/**
 * Hook to reorder property videos
 * Uses TanStack Query mutation with cache invalidation
 */
export function useReorderVideos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, videoOrders }: ReorderVideosParams) => {
      return mediaApi.reorderVideos(propertyId, videoOrders);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: propertyKeys.detail(variables.propertyId),
        refetchType: 'active',
      });
      queryClient.invalidateQueries({
        queryKey: propertyKeys.all,
        refetchType: 'active',
      });
      toast.success('Videos reorganizados', {
        description: `${data.updatedCount} videos actualizados`,
      });
    },
    onError: (error: Error) => {
      toast.error('Error al reorganizar videos', {
        description: error.message,
      });
    },
  });
}
