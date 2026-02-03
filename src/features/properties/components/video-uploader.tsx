/**
 * VideoUploader Component
 * Drag & drop video uploader with preview and validation
 */

'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Video as VideoIcon, Play } from 'lucide-react';
import { toast } from 'sonner';
import { formatFileSize } from '@/lib/utils/format';
import { isAllowedVideoType, VIDEO_ACCEPT, VIDEO_FORMATS_LABEL } from '@/lib/utils/media-types';

interface VideoUploaderProps {
  maxFiles?: number;
  maxSize?: number; // in bytes
  onFilesSelected?: (files: File[]) => void;
  disabled?: boolean;
}

/**
 * Video Uploader Component
 * Drag & drop or click to upload videos
 * Max 2 videos, 500MB each, mp4/webm/mov supported
 *
 * @example
 * ```tsx
 * <VideoUploader
 *   maxFiles={2}
 *   maxSize={500 * 1024 * 1024}
 *   onFilesSelected={(files) => uploadMutation.mutate(files)}
 * />
 * ```
 */
export function VideoUploader({
  maxFiles = 2,
  maxSize = 500 * 1024 * 1024, // 500MB
  onFilesSelected,
  disabled = false,
}: VideoUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Validate file
  const validateFile = useCallback(
    (file: File): boolean => {
      // Check file type (with extension-based fallback)
      if (!isAllowedVideoType(file)) {
        toast.error(`Invalid file type: ${file.name}`, {
          description: `Only ${VIDEO_FORMATS_LABEL} formats are allowed`,
        });
        return false;
      }

      // Check file size
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}`, {
          description: `Maximum size is ${formatFileSize(maxSize)}`,
        });
        return false;
      }

      return true;
    },
    [maxSize]
  );

  // Handle file selection
  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);

      // Check max files
      if (selectedFiles.length + fileArray.length > maxFiles) {
        toast.error('Too many files', {
          description: `Maximum ${maxFiles} videos allowed`,
        });
        return;
      }

      // Validate and filter files
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      for (const file of fileArray) {
        if (validateFile(file)) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file.name);
        }
      }

      if (validFiles.length === 0) {
        toast.error('No valid files', {
          description: invalidFiles.length > 0
            ? `${invalidFiles.length} file(s) rejected`
            : 'Please select valid video files',
        });
        return;
      }

      // Create previews
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

      setSelectedFiles((prev) => [...prev, ...validFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);

      toast.success('Videos added', {
        description: `${validFiles.length} video(s) ready to upload`,
      });
    },
    [selectedFiles.length, maxFiles, validateFile]
  );

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  // Handle file input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      e.target.value = ''; // Reset input
    },
    [handleFiles]
  );

  // Remove file
  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]); // Clean up preview URL
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // Upload files
  const handleUpload = useCallback(() => {
    if (selectedFiles.length === 0) {
      toast.error('No videos selected');
      return;
    }

    if (onFilesSelected) {
      onFilesSelected(selectedFiles);
    } else {
      toast.error('No upload handler configured');
    }
  }, [selectedFiles, onFilesSelected]);

  // Clear all
  const clearAll = useCallback(() => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviews([]);
  }, [previews]);

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`relative rounded-lg border-2 border-dashed p-8 transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={VIDEO_ACCEPT}
          multiple
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium">
            {isDragging ? 'Drop videos here' : 'Drag & drop videos or click to browse'}
          </p>
          <p className="text-xs text-muted-foreground">
            {VIDEO_FORMATS_LABEL} • Max {maxFiles} videos • {formatFileSize(maxSize)} each
          </p>
        </div>
      </div>

      {/* Preview List */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Selected Videos ({selectedFiles.length}/{maxFiles})
            </p>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          </div>

          <div className="space-y-2">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                {/* Video Preview */}
                <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded bg-muted">
                  <video src={preview} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* File Info */}
                <div className="flex-1">
                  <p className="text-sm font-medium">{selectedFiles[index].name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFiles[index].size)}
                  </p>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <Button onClick={handleUpload} disabled={disabled} className="w-full">
            <VideoIcon className="mr-2 h-4 w-4" />
            Upload {selectedFiles.length} Video{selectedFiles.length !== 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  );
}
