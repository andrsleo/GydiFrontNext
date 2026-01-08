/**
 * Image Upload Hooks
 *
 * React Query hooks for uploading and deleting profile images.
 */

'use client';

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { uploadProfileImage, deleteProfileImage, type UploadImageResponse, type DeleteImageResponse } from '@/lib/api/storage.api';
import { profileKeys } from './use-profile';

/**
 * Hook to upload a profile image to S3
 *
 * @param options - React Query mutation options
 * @returns Mutation object with upload function
 *
 * @example
 * function ProfileImageUploader() {
 *   const { mutate: upload, isPending } = useUploadProfileImage({
 *     onSuccess: (data) => {
 *       toast.success('Image uploaded successfully');
 *       console.log('Uploaded to:', data.imageUrl);
 *     },
 *     onError: (error) => {
 *       toast.error(`Upload failed: ${error.message}`);
 *     },
 *   });
 *
 *   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
 *     const file = e.target.files?.[0];
 *     if (file) {
 *       upload(file);
 *     }
 *   };
 *
 *   return <input type="file" onChange={handleFileSelect} disabled={isPending} />;
 * }
 */
export function useUploadProfileImage(
  options?: Omit<UseMutationOptions<UploadImageResponse, Error, File>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation<UploadImageResponse, Error, File>({
    mutationFn: uploadProfileImage,
    onSuccess: (data, variables, context) => {
      // Invalidate profile queries to trigger a refresh
      queryClient.invalidateQueries({ queryKey: profileKeys.all });

      // Call user's onSuccess if provided
      // @ts-expect-error - TanStack Query signature mismatch
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Hook to delete a profile image from S3
 *
 * @param options - React Query mutation options
 * @returns Mutation object with delete function
 *
 * @example
 * function ProfileImageDeleter() {
 *   const { mutate: deleteImage, isPending } = useDeleteProfileImage({
 *     onSuccess: () => {
 *       toast.success('Image deleted successfully');
 *     },
 *   });
 *
 *   const handleDelete = () => {
 *     deleteImage('https://bucket.s3.amazonaws.com/profile-images/uuid.jpg');
 *   };
 *
 *   return <button onClick={handleDelete} disabled={isPending}>Delete Image</button>;
 * }
 */
export function useDeleteProfileImage(
  options?: Omit<UseMutationOptions<DeleteImageResponse, Error, string>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation<DeleteImageResponse, Error, string>({
    mutationFn: deleteProfileImage,
    onSuccess: (data, variables, context) => {
      // Invalidate profile queries to trigger a refresh
      queryClient.invalidateQueries({ queryKey: profileKeys.all });

      // Call user's onSuccess if provided
      // @ts-expect-error - TanStack Query signature mismatch
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}
