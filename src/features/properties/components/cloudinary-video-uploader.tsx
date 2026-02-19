/**
 * CloudinaryVideoUploader Component
 *
 * Video uploader with direct Cloudinary upload and per-file progress tracking.
 *
 * Features:
 * - Direct browser-to-Cloudinary upload (no backend proxy)
 * - Individual file progress bars
 * - Overall progress indicator
 * - File validation (type, size)
 * - Video preview thumbnails
 * - Parallel uploads (max 6 concurrent)
 * - Automatic retries on network errors
 * - Max 2 videos, 500MB each
 *
 * @example
 * ```tsx
 * <CloudinaryVideoUploader
 *   propertyId="prop-123"
 *   onUploadComplete={(videos) => console.log('Uploaded:', videos)}
 * />
 * ```
 */

'use client';

import { useState, useRef } from 'react';
import { useCloudinaryDirectUpload } from '../hooks/use-cloudinary-direct-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Video, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { VIDEO_ACCEPT, VIDEO_FORMATS_LABEL } from '@/lib/utils/media-types';
import type { MediaUploadResponse } from '../types';

interface CloudinaryVideoUploaderProps {
  propertyId: string;
  onUploadComplete?: (videos: MediaUploadResponse[]) => void;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
}

export function CloudinaryVideoUploader({
  propertyId,
  onUploadComplete,
  maxFiles = 2,
  disabled = false,
  className,
}: CloudinaryVideoUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImagesAsync, isUploading, progress, overallProgress, error } =
    useCloudinaryDirectUpload({ mediaType: 'VIDEO' });

  /**
   * Handle file selection
   */
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    if (fileArray.length + selectedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} videos allowed`);
      return;
    }

    // Validate file sizes (500MB)
    const invalidFiles = fileArray.filter((file) => file.size > 500 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      alert(`Some files exceed 500MB limit: ${invalidFiles.map((f) => f.name).join(', ')}`);
      return;
    }

    // Create preview URLs (object URLs for video)
    const newPreviews: Record<string, string> = {};
    fileArray.forEach((file) => {
      newPreviews[file.name] = URL.createObjectURL(file);
    });

    setSelectedFiles((prev) => [...prev, ...fileArray]);
    setPreviews((prev) => ({ ...prev, ...newPreviews }));
  };

  /**
   * Remove selected file
   */
  const handleRemoveFile = (fileName: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.name !== fileName));

    // Revoke preview URL to free memory
    if (previews[fileName]) {
      URL.revokeObjectURL(previews[fileName]);
    }
    setPreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[fileName];
      return newPreviews;
    });
  };

  /**
   * Clear all files
   */
  const handleClearAll = () => {
    // Revoke all preview URLs
    Object.values(previews).forEach((url) => URL.revokeObjectURL(url));

    setSelectedFiles([]);
    setPreviews({});
  };

  /**
   * Upload files
   */
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const uploadedVideos = await uploadImagesAsync({
        propertyId,
        files: selectedFiles,
      });

      // Cleanup previews
      Object.values(previews).forEach((url) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setPreviews({});

      // Notify parent
      onUploadComplete?.(uploadedVideos);
    } catch (uploadError) {
      console.error('Video upload error:', uploadError);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* File Input */}
      <Card>
        <CardContent className="pt-6">
          <input
            ref={fileInputRef}
            type="file"
            accept={VIDEO_ACCEPT}
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={disabled || isUploading}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              'border-muted-foreground/25 hover:border-primary/50',
              (disabled || isUploading) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <div className="text-sm font-medium">Click to select videos</div>
              <div className="text-xs text-muted-foreground">
                {VIDEO_FORMATS_LABEL} (max 500MB, up to {maxFiles} files)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">
                Selected Videos ({selectedFiles.length}/{maxFiles})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                disabled={isUploading}
              >
                Clear All
              </Button>
            </div>

            {/* File List */}
            <div className="space-y-3">
              {selectedFiles.map((file) => {
                const fileProgress = progress[file.name] || 0;
                const isComplete = fileProgress === 100;
                const hasError = error && fileProgress === 0;

                return (
                  <div
                    key={file.name}
                    className="flex items-center gap-3 p-2 border rounded-lg"
                  >
                    {/* Preview Thumbnail */}
                    <div className="relative w-16 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
                      {previews[file.name] ? (
                        <>
                          <video
                            src={previews[file.name]}
                            className="w-full h-full object-cover"
                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        </>
                      ) : (
                        <Video className="w-full h-full p-2 text-muted-foreground" />
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </div>

                      {/* Progress Bar */}
                      {isUploading && (
                        <div className="mt-2">
                          <Progress value={fileProgress} className="h-1" />
                          <div className="text-xs text-muted-foreground mt-1">
                            {fileProgress}%
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {isComplete && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {hasError && (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      )}
                      {!isUploading && !isComplete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFile(file.name)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall Progress */}
            {isUploading && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Overall Progress</span>
                  <span className="text-muted-foreground">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error.message}</span>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={isUploading || selectedFiles.length === 0}
                className="min-w-[120px]"
              >
                {isUploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-pulse" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload {selectedFiles.length} Video{selectedFiles.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
