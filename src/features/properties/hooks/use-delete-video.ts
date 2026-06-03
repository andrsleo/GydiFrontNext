'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaApi } from '../api/media.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';

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
  const { t } = useTranslation('properties');

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

      toast.success(t('toasts.videos.deleted'));
    },
    onError: (error: Error) => {
      toast.error(t('toasts.videos.deleteError'), {
        description: error.message,
      });
    },
  });
}
