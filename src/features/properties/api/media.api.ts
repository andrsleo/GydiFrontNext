/**
 * Media API Client
 * Upload images and videos for properties
 */

import { apiClient } from '@/lib/api/client';
import {
  isAllowedImageType,
  isAllowedVideoType,
  IMAGE_FORMATS_LABEL,
  VIDEO_FORMATS_LABEL,
} from '@/lib/utils/media-types';
import type { MediaUploadResponse } from '../types';

/**
 * API Base Path
 */
const BASE_PATH = '/api/properties';

/**
 * Media API
 */
export const mediaApi = {
  /**
   * Upload images to property
   * Max 10 images, 10MB each, jpg/png/webp
   * Requires authentication + ownership
   */
  async uploadImages(propertyId: string, files: File[]): Promise<MediaUploadResponse[]> {
    // Validate file count
    if (files.length === 0) {
      throw new Error('At least one image is required');
    }
    if (files.length > 20) {
      throw new Error('Maximum 20 images allowed');
    }

    // Create FormData
    const formData = new FormData();
    files.forEach((file) => {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error(`Image ${file.name} exceeds 10MB limit`);
      }

      // Validate file type (with extension-based fallback for HEIC/HEIF)
      if (!isAllowedImageType(file)) {
        throw new Error(`Invalid file type for ${file.name}. Only ${IMAGE_FORMATS_LABEL} allowed`);
      }

      formData.append('files', file);
    });

    // Upload with multipart/form-data
    const { data } = await apiClient.post<MediaUploadResponse[]>(
      `${BASE_PATH}/${propertyId}/media/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return data;
  },

  /**
   * Upload videos to property
   * Max 5 videos, 500MB each, mp4/webm
   * Requires authentication + ownership
   */
  async uploadVideos(propertyId: string, files: File[]): Promise<MediaUploadResponse[]> {
    // Validate file count
    if (files.length === 0) {
      throw new Error('At least one video is required');
    }
    if (files.length > 5) {
      throw new Error('Maximum 5 videos allowed');
    }

    // Create FormData
    const formData = new FormData();
    files.forEach((file) => {
      // Validate file size (500MB)
      if (file.size > 500 * 1024 * 1024) {
        throw new Error(`Video ${file.name} exceeds 500MB limit`);
      }

      // Validate file type (with extension-based fallback)
      if (!isAllowedVideoType(file)) {
        throw new Error(`Invalid file type for ${file.name}. Only ${VIDEO_FORMATS_LABEL} allowed`);
      }

      formData.append('files', file);
    });

    // Upload with multipart/form-data
    const { data } = await apiClient.post<MediaUploadResponse[]>(
      `${BASE_PATH}/${propertyId}/media/videos`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return data;
  },

  /**
   * Delete image from property
   * Requires authentication + ownership
   */
  async deleteImage(propertyId: string, imageId: string): Promise<void> {
    await apiClient.delete(`${BASE_PATH}/${propertyId}/images/${imageId}`);
  },

  /**
   * Delete video from property
   * Requires authentication + ownership
   */
  async deleteVideo(propertyId: string, videoId: string): Promise<void> {
    await apiClient.delete(`${BASE_PATH}/${propertyId}/videos/${videoId}`);
  },

  /**
   * Reorder images and set cover image
   * Requires authentication + ownership
   */
  async reorderImages(
    propertyId: string,
    imageOrders: Array<{ imageId: string; displayOrder: number }>,
    coverImageId?: string
  ): Promise<{ success: boolean; updatedCount: number; coverImageId: string | null }> {
    const { data } = await apiClient.patch(
      `${BASE_PATH}/${propertyId}/images/reorder`,
      {
        imageOrders,
        coverImageId,
      }
    );
    return data;
  },

  /**
   * Reorder videos
   * Requires authentication + ownership
   */
  async reorderVideos(
    propertyId: string,
    videoOrders: Array<{ videoId: string; displayOrder: number }>
  ): Promise<{ success: boolean; updatedCount: number }> {
    const { data } = await apiClient.patch(
      `${BASE_PATH}/${propertyId}/videos/reorder`,
      { videoOrders }
    );
    return data;
  },
};
