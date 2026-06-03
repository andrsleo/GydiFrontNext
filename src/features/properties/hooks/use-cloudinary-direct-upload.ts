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
import { isAllowedImageType, IMAGE_FORMATS_LABEL } from '@/lib/utils/media-types';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';
import type { MediaUploadResponse } from '../types';

/**
 * Single upload signature from backend
 */
interface UploadSignature {
  signature: string;
  timestamp: number;
  folder: string;
  publicId: string;
}

/**
 * Cloudinary Upload Signature Response (from backend)
 * Backend returns multiple signatures (one per file) plus shared config
 */
interface CloudinarySignatureResponse {
  signatures: UploadSignature[];
  cloudName: string;
  apiKey: string;
  uploadUrl: string;
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
  durationSeconds?: number;
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
  mediaType?: 'IMAGE' | 'VIDEO'; // Media type for upload (default: 'IMAGE')
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
  const { t } = useTranslation('properties');
  const [progress, setProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);

  const maxConcurrent = options?.maxConcurrent ?? 6;
  const timeout = options?.timeout ?? 300000; // 5 minutes
  const maxRetries = options?.maxRetries ?? 2;
  const mediaType = options?.mediaType ?? 'IMAGE';

  /**
   * Step 1: Get signed upload parameters from backend
   *
   * @param propertyId - The property ID
   * @param fileCount - Number of files to upload
   * @param mediaType - Type of media ('IMAGE' or 'VIDEO')
   */
  const getUploadSignatures = async (
    propertyId: string,
    fileCount: number,
    mediaType: 'IMAGE' | 'VIDEO' = 'IMAGE'
  ): Promise<CloudinarySignatureResponse> => {
    const { data } = await apiClient.post<CloudinarySignatureResponse>(
      `/api/properties/${propertyId}/media/upload-signatures`,
      {
        fileCount,
        mediaType,
      }
    );
    return data;
  };

  /**
   * Step 2: Upload single file directly to Cloudinary
   *
   * @param file - The file to upload
   * @param signature - Individual signature for this file
   * @param config - Shared Cloudinary config (cloudName, apiKey, uploadUrl)
   * @param retries - Current retry count
   */
  const uploadFileToCloudinary = async (
    file: File,
    signature: UploadSignature,
    config: { cloudName: string; apiKey: string; uploadUrl: string },
    retries = 0
  ): Promise<UploadResult> => {
    const fileName = file.name;

    try {
      // Create FormData for Cloudinary API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature.signature);
      formData.append('timestamp', signature.timestamp.toString());
      formData.append('api_key', config.apiKey);
      formData.append('folder', signature.folder);
      formData.append('public_id', signature.publicId);

      // Upload to Cloudinary with progress tracking (use the uploadUrl from backend)
      const cloudinaryUrl = config.uploadUrl;

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
                durationSeconds: result.duration ? Math.round(result.duration) : undefined,
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
        return uploadFileToCloudinary(file, signature, config, retries + 1);
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
   *
   * Each file gets its own signature from the backend response.
   */
  const uploadFilesInParallel = async (
    files: File[],
    signatureResponse: CloudinarySignatureResponse
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    const { signatures, cloudName, apiKey, uploadUrl } = signatureResponse;
    const config = { cloudName, apiKey, uploadUrl };

    // Pair files with their signatures
    const fileSignaturePairs = files.map((file, index) => ({
      file,
      signature: signatures[index],
    }));

    // Upload in batches
    const queue = [...fileSignaturePairs];
    while (queue.length > 0) {
      const batch = queue.splice(0, maxConcurrent);
      const batchResults = await Promise.all(
        batch.map(({ file, signature }) => uploadFileToCloudinary(file, signature, config))
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
    results: UploadResult[],
    mediaType: 'IMAGE' | 'VIDEO'
  ): Promise<MediaUploadResponse[]> => {
    const endpoint = mediaType === 'VIDEO'
      ? `/api/properties/${propertyId}/media/videos/save-urls`
      : `/api/properties/${propertyId}/media/images/save-urls`;

    const { data } = await apiClient.post<MediaUploadResponse[]>(
      endpoint,
      {
        mediaUrls: results.map((r, index) => ({
          url: r.url,
          displayOrder: index,
          ...(mediaType === 'VIDEO' && r.durationSeconds !== undefined ? { durationSeconds: r.durationSeconds } : {}),
        })),
      }
    );
    return data;
  };

  /**
   * Fallback: Upload directly to backend (for local dev without Cloudinary)
   *
   * Used when NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured.
   * Backend stores files in ./uploads/ directory (LocalFileSystemStorageAdapter).
   */
  const uploadToBackendDirect = async (propertyId: string, files: File[]): Promise<void> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    await apiClient.post(`/api/properties/${propertyId}/media/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          // Update all files to the same overall progress (simulated per-file)
          const simulatedProgress: UploadProgress = {};
          files.forEach((file) => {
            simulatedProgress[file.name] = percent;
          });
          setProgress(simulatedProgress);
        }
      },
    });
  };

  /**
   * Main mutation: Upload images flow
   *
   * Automatically selects upload strategy:
   * - Cloudinary (production): signatures → direct-to-CDN → save URLs
   * - Local backend (dev): multipart upload → LocalFileSystemStorageAdapter
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
        if (!isAllowedImageType(file)) {
          throw new Error(`Invalid file type for ${file.name}. Only ${IMAGE_FORMATS_LABEL} allowed`);
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
        // Detect storage strategy based on environment
        const isCloudinaryConfigured = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

        if (!isCloudinaryConfigured) {
          // LOCAL DEV: Upload directly to backend (no Cloudinary needed)
          await uploadToBackendDirect(propertyId, files);
          return [];
        }

        // PRODUCTION: Cloudinary direct upload flow
        // Step 1: Get signatures from backend (one per file)
        const signatureResponse = await getUploadSignatures(propertyId, files.length, mediaType);

        // Step 2: Upload files to Cloudinary in parallel (each file uses its own signature)
        const results = await uploadFilesInParallel(files, signatureResponse);

        // Check for failures
        const failures = results.filter((r) => !r.success);
        if (failures.length > 0) {
          const failedFiles = failures.map((f) => f.fileName).join(', ');
          throw new Error(`Failed to upload: ${failedFiles}`);
        }

        // Step 3: Notify backend with results (includes durationSeconds for videos)
        const savedMedia = await saveUploadedUrls(propertyId, results, mediaType);

        return savedMedia;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: (data, variables) => {
      // Optimistic update: show new media immediately
      if (data.length > 0) {
        queryClient.setQueryData(
          propertyKeys.detail(variables.propertyId),
          (old: Record<string, unknown> | undefined) => {
            if (!old) return old;
            if (mediaType === 'VIDEO') {
              return {
                ...old,
                videos: [...((old.videos as unknown[]) || []), ...data],
              };
            }
            return {
              ...old,
              images: [...((old.images as unknown[]) || []), ...data],
            };
          }
        );
      }

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
      const isCloudinaryConfigured = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadedCount = data.length > 0 ? data.length : variables.files.length;
      const isVideo = mediaType === 'VIDEO';
      toast.success(isVideo ? t('toasts.videos.uploaded') : t('toasts.images.uploaded'), {
        description: isCloudinaryConfigured
          ? t(isVideo ? 'toasts.videos.uploadedCloudinaryDesc' : 'toasts.images.uploadedCloudinaryDesc', { count: uploadedCount })
          : t(isVideo ? 'toasts.videos.uploadedDesc' : 'toasts.images.uploadedDesc', { count: uploadedCount }),
      });
    },
    onError: (error) => {
      // Clear progress
      setProgress({});

      // Show error toast
      toast.error(t('toasts.images.uploadError'), {
        description: error.message || t('toasts.property.createError'),
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
