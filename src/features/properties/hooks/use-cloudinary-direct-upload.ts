/**
 * useCloudinaryDirectUpload Hook
 *
 * Direct browser-to-Cloudinary upload with parallel processing and progress tracking.
 *
 * Architecture:
 * 1. Request signed upload params from backend (includes signature, timestamp, folder)
 * 2. Upload files directly to Cloudinary API (max 6 concurrent uploads)
 * 3. Track individual file progress (0-100%)
 * 4. After all uploads complete, notify backend with URLs
 *
 * Benefits:
 * - Reduces backend load (no file proxy)
 * - Faster uploads (parallel, direct to CDN)
 * - Better UX with per-file progress
 * - Automatic retries on network errors
 *
 * @example
 * ```tsx
 * const { uploadImages, isUploading, progress } = useCloudinaryDirectUpload();
 *
 * await uploadImages({
 *   propertyId: 'prop-123',
 *   files: selectedFiles,
 * });
 *
 * // Progress: { 'file1.jpg': 45, 'file2.jpg': 78 }
 * ```
 */

'use client';

import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { propertyKeys } from '@/lib/constants/query-keys';
import { toast } from 'sonner';
import type { MediaUploadResponse } from '../types';

/**
 * Cloudinary Upload Signature Response (from backend)
 */
interface CloudinarySignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}

/**
 * Upload Progress by File Name
 */
type UploadProgress = Record<string, number>;

/**
 * Upload Result
 */
interface UploadResult {
  fileName: string;
  url: string;
  publicId: string;
  success: boolean;
  error?: string;
}

/**
 * Hook Options
 */
interface UseCloudinaryDirectUploadOptions {
  maxConcurrent?: number; // Max concurrent uploads (default: 6)
  timeout?: number;       // Upload timeout per file in ms (default: 300000 = 5 min)
  maxRetries?: number;    // Max retries on network error (default: 2)
}

/**
 * Upload Variables
 */
interface UploadImagesVariables {
  propertyId: string;
  files: File[];
}

/**
 * Hook to upload images directly to Cloudinary
 */
export function useCloudinaryDirectUpload(options?: UseCloudinaryDirectUploadOptions) {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);

  const maxConcurrent = options?.maxConcurrent ?? 6;
  const timeout = options?.timeout ?? 300000; // 5 minutes
  const maxRetries = options?.maxRetries ?? 2;

  /**
   * Step 1: Get signed upload parameters from backend
   */
  const getUploadSignature = async (propertyId: string): Promise<CloudinarySignature> => {
    const { data } = await apiClient.post<CloudinarySignature>(
      `/api/properties/${propertyId}/media/upload-signatures`
    );
    return data;
  };

  /**
   * Step 2: Upload single file directly to Cloudinary
   */
  const uploadFileToCloudinary = async (
    file: File,
    signature: CloudinarySignature,
    retries = 0
  ): Promise<UploadResult> => {
    const fileName = file.name;

    try {
      // Create FormData for Cloudinary API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature.signature);
      formData.append('timestamp', signature.timestamp.toString());
      formData.append('api_key', signature.apiKey);
      formData.append('folder', signature.folder);

      // Upload to Cloudinary with progress tracking
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`;

      const response = await new Promise<UploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            setProgress((prev) => ({ ...prev, [fileName]: percentComplete }));
          }
        });

        // Handle completion
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText);
              resolve({
                fileName,
                url: result.secure_url,
                publicId: result.public_id,
                success: true,
              });
            } catch (error) {
              reject(new Error(`Failed to parse Cloudinary response for ${fileName}`));
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status} for ${fileName}`));
          }
        });

        // Handle errors
        xhr.addEventListener('error', () => {
          reject(new Error(`Network error uploading ${fileName}`));
        });

        // Handle timeout
        xhr.addEventListener('timeout', () => {
          reject(new Error(`Upload timeout for ${fileName}`));
        });

        // Set timeout
        xhr.timeout = timeout;

        // Send request
        xhr.open('POST', cloudinaryUrl);
        xhr.send(formData);
      });

      return response;
    } catch (error) {
      // Retry on network errors
      if (retries < maxRetries && error instanceof Error && error.message.includes('Network')) {
        console.warn(`Retrying upload for ${fileName} (attempt ${retries + 1}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * (retries + 1))); // Exponential backoff
        return uploadFileToCloudinary(file, signature, retries + 1);
      }

      return {
        fileName,
        url: '',
        publicId: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  /**
   * Step 3: Upload multiple files in parallel (with concurrency limit)
   */
  const uploadFilesInParallel = async (
    files: File[],
    signature: CloudinarySignature
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    const queue = [...files];

    // Upload in batches
    while (queue.length > 0) {
      const batch = queue.splice(0, maxConcurrent);
      const batchResults = await Promise.all(
        batch.map((file) => uploadFileToCloudinary(file, signature))
      );
      results.push(...batchResults);
    }

    return results;
  };

  /**
   * Step 4: Notify backend with uploaded URLs
   */
  const saveUploadedUrls = async (
    propertyId: string,
    urls: string[]
  ): Promise<MediaUploadResponse[]> => {
    const { data } = await apiClient.post<MediaUploadResponse[]>(
      `/api/properties/${propertyId}/media/images/save-urls`,
      { urls }
    );
    return data;
  };

  /**
   * Main mutation: Upload images flow
   */
  const mutation = useMutation<MediaUploadResponse[], Error, UploadImagesVariables>({
    mutationFn: async ({ propertyId, files }) => {
      // Validate
      if (files.length === 0) {
        throw new Error('At least one image is required');
      }
      if (files.length > 20) {
        throw new Error('Maximum 20 images allowed');
      }

      // Validate each file
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`Image ${file.name} exceeds 10MB limit`);
        }
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(file.type)) {
          throw new Error(`Invalid file type for ${file.name}. Only JPG, PNG, WEBP, and HEIC allowed`);
        }
      }

      setIsUploading(true);

      // Initialize progress tracking
      const initialProgress: UploadProgress = {};
      files.forEach((file) => {
        initialProgress[file.name] = 0;
      });
      setProgress(initialProgress);

      try {
        // Step 1: Get signature from backend
        const signature = await getUploadSignature(propertyId);

        // Step 2: Upload files to Cloudinary in parallel
        const results = await uploadFilesInParallel(files, signature);

        // Check for failures
        const failures = results.filter((r) => !r.success);
        if (failures.length > 0) {
          const failedFiles = failures.map((f) => f.fileName).join(', ');
          throw new Error(`Failed to upload: ${failedFiles}`);
        }

        // Step 3: Notify backend with URLs
        const urls = results.map((r) => r.url);
        const savedMedia = await saveUploadedUrls(propertyId, urls);

        return savedMedia;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate property detail to show new images
      queryClient.invalidateQueries({
        queryKey: propertyKeys.detail(variables.propertyId),
        refetchType: 'active',
      });

      // Invalidate ALL property lists
      queryClient.invalidateQueries({
        queryKey: propertyKeys.all,
        refetchType: 'active',
      });

      // Clear progress
      setProgress({});

      // Show success toast
      toast.success('Images uploaded successfully', {
        description: `${data.length} image(s) have been uploaded directly to Cloudinary`,
      });
    },
    onError: (error) => {
      // Clear progress
      setProgress({});

      // Show error toast
      toast.error('Failed to upload images', {
        description: error.message || 'An unexpected error occurred',
      });
    },
  });

  /**
   * Helper: Calculate overall progress percentage
   */
  const getOverallProgress = useCallback((): number => {
    const progressValues = Object.values(progress);
    if (progressValues.length === 0) return 0;
    const sum = progressValues.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / progressValues.length);
  }, [progress]);

  return {
    uploadImages: mutation.mutate,
    uploadImagesAsync: mutation.mutateAsync,
    isUploading: isUploading || mutation.isPending,
    progress,
    overallProgress: getOverallProgress(),
    error: mutation.error,
    reset: mutation.reset,
  };
}
