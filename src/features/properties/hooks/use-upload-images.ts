/**
 * useUploadImages Hook
 * React Query mutation for uploading property images
 */

'use client';

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { mediaApi } from '../api/media.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import { toast } from 'sonner';
import type { MediaUploadResponse } from '../types';

interface UploadImagesVariables {
  propertyId: string;
  files: File[];
}

type UseUploadImagesOptions = Omit<
  UseMutationOptions<MediaUploadResponse[], Error, UploadImagesVariables>,
  'mutationFn'
>;

/**
 * Hook to upload images to a property
 * Max 10 images, 10MB each, jpg/png/webp
 * Automatically invalidates property detail on success
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUploadImages({
 *   onSuccess: (data) => {
 *   }
 * });
 *
 * // Upload selected files
 * mutate({
 *   propertyId: 'property-123',
 *   files: selectedFiles
 * });
 * ```
 */
export function useUploadImages(options?: UseUploadImagesOptions) {
  const queryClient = useQueryClient();

  return useMutation<MediaUploadResponse[], Error, UploadImagesVariables>({
    mutationFn: ({ propertyId, files }) => mediaApi.uploadImages(propertyId, files),
    onSuccess: (data, variables, context) => {
      // Invalidate property detail to show new images
      queryClient.invalidateQueries({
        queryKey: propertyKeys.detail(variables.propertyId),
        refetchType: 'active',
      });

      // Invalidate ALL property lists (including filtered queries)
      queryClient.invalidateQueries({
        queryKey: propertyKeys.all,
        refetchType: 'active',
      });

      // Show success toast
      toast.success('Images uploaded successfully', {
        description: `${data.length} image(s) have been added`,
      });

      // Call custom onSuccess if provided
      // @ts-expect-error - TanStack Query signature mismatch
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Show error toast
      toast.error('Failed to upload images', {
        description: error.message || 'An unexpected error occurred',
      });

      // Call custom onError if provided
      // @ts-expect-error - TanStack Query signature mismatch
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}
