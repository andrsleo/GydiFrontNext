/**
 * useUploadVideos Hook
 * React Query mutation for uploading property videos
 */

'use client';

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { mediaApi } from '../api/media.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import { toast } from 'sonner';
import type { MediaUploadResponse } from '../types';

interface UploadVideosVariables {
  propertyId: string;
  files: File[];
}

type UseUploadVideosOptions = Omit<
  UseMutationOptions<MediaUploadResponse[], Error, UploadVideosVariables>,
  'mutationFn'
>;

/**
 * Hook to upload videos to a property
 * Max 5 videos, 500MB each, mp4/webm
 * Automatically invalidates property detail on success
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUploadVideos({
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
export function useUploadVideos(options?: UseUploadVideosOptions) {
  const queryClient = useQueryClient();

  return useMutation<MediaUploadResponse[], Error, UploadVideosVariables>({
    mutationFn: ({ propertyId, files }) => mediaApi.uploadVideos(propertyId, files),
    onSuccess: (data, variables, context) => {
      // Invalidate property detail to show new videos
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
      toast.success('Videos uploaded successfully', {
        description: `${data.length} video(s) have been added`,
      });

      // Call custom onSuccess if provided
      // @ts-expect-error - TanStack Query signature mismatch
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Show error toast
      toast.error('Failed to upload videos', {
        description: error.message || 'An unexpected error occurred',
      });

      // Call custom onError if provided
      // @ts-expect-error - TanStack Query signature mismatch
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}
