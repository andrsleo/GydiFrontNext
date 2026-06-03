'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaApi } from '../api/media.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';

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
  const { t } = useTranslation('properties');

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
      toast.success(t('toasts.videos.reordered'), {
        description: t('toasts.videos.reorderedDesc', { count: data.updatedCount }),
      });
    },
    onError: (error: Error) => {
      toast.error(t('toasts.videos.reorderError'), {
        description: error.message,
      });
    },
  });
}
