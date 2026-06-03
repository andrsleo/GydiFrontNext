'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaApi } from '../api/media.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';

interface ReorderImagesParams {
  propertyId: string;
  imageOrders: Array<{ imageId: string; displayOrder: number }>;
  coverImageId?: string;
}

/**
 * Hook to reorder property images and set cover image
 * Uses TanStack Query mutation with cache invalidation
 */
export function useReorderImages() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('properties');

  return useMutation({
    mutationFn: async ({ propertyId, imageOrders, coverImageId }: ReorderImagesParams) => {
      return mediaApi.reorderImages(propertyId, imageOrders, coverImageId);
    },
    onSuccess: (data, variables) => {
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

      toast.success(t('toasts.images.reordered'), {
        description: t('toasts.images.reorderedDesc', { count: data.updatedCount }),
      });
    },
    onError: (error: Error) => {
      toast.error(t('toasts.images.reorderError'), {
        description: error.message,
      });
    },
  });
}