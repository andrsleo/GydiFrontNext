/**
 * Storage API Client
 *
 * Handles file uploads to AWS S3 via backend proxy endpoints.
 */

import { apiClient } from './client';

export interface UploadImageResponse {
  imageUrl: string;
  message: string;
}

export interface DeleteImageResponse {
  message: string;
}

/**
 * Upload a profile image to S3
 *
 * @param file - The image file to upload (max 5MB, JPG/PNG/GIF/WebP)
 * @returns Promise with the public S3 URL of the uploaded image
 *
 * @example
 * const file = event.target.files[0];
 * const { imageUrl } = await uploadProfileImage(file);
 */
export async function uploadProfileImage(file: File): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post<UploadImageResponse>(
    '/api/v1/users/profiles/images/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return data;
}

/**
 * Delete a profile image from S3
 *
 * @param imageUrl - The S3 URL of the image to delete
 * @returns Promise with success message
 *
 * @example
 * await deleteProfileImage('https://bucket.s3.amazonaws.com/profile-images/uuid.jpg');
 */
export async function deleteProfileImage(imageUrl: string): Promise<DeleteImageResponse> {
  const { data } = await apiClient.delete<DeleteImageResponse>(
    '/api/v1/users/profiles/images',
    {
      params: { imageUrl },
    }
  );

  return data;
}
