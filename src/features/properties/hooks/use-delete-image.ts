'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaApi } from '../api/media.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';

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
  const { t } = useTranslation('properties');

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

      toast.success(t('toasts.images.deleted'));
    },
    onError: (error: Error) => {
      toast.error(t('toasts.images.deleteError'), {
        description: error.message,
      });
    },
  });
}
