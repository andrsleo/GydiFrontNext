/**
 * ImageUploader Component
 * Drag & drop image uploader with preview and validation
 */

'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { formatFileSize } from '@/lib/utils/format';

interface ImageUploaderProps {
  maxFiles?: number;
  maxSize?: number; // in bytes
  onFilesSelected?: (files: File[]) => void;
  disabled?: boolean;
}

/**
 * Image Uploader Component
 * Drag & drop or click to upload images
 * Max 20 images, 10MB each, jpg/png/webp only
 *
 * @example
 * ```tsx
 * <ImageUploader
 *   maxFiles={20}
 *   maxSize={10 * 1024 * 1024}
 *   onFilesSelected={(files) => uploadMutation.mutate(files)}
 * />
 * ```
 */
export function ImageUploader({
  maxFiles = 20,
  maxSize = 10 * 1024 * 1024, // 10MB
  onFilesSelected,
  disabled = false,
}: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Validate file
  const validateFile = useCallback(
    (file: File): boolean => {
      // Check file type
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}`, {
          description: 'Only JPG, PNG, WEBP, and HEIC formats are allowed',
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
          description: `Maximum ${maxFiles} images allowed`,
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
            : 'Please select valid image files',
        });
        return;
      }

      // Create previews
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

      setSelectedFiles((prev) => [...prev, ...validFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);

      toast.success('Images added', {
        description: `${validFiles.length} image(s) ready to upload`,
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
      toast.error('No images selected');
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
        className={`relative rounded-lg border-2 border-dashed p-8 transition-colors ${isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium">
            {isDragging ? 'Drop images here' : 'Drag & drop images or click to browse'}
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, WEBP, or HEIC • Max {maxFiles} images • {formatFileSize(maxSize)} each
          </p>
        </div>
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Selected Images ({selectedFiles.length}/{maxFiles})
            </p>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {previews.map((preview, index) => (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="200px"
                />

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute right-1 top-1 rounded-full bg-destructive p-1 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-4 w-4 text-white" />
                </button>

                {/* File Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {formatFileSize(selectedFiles[index].size)}
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <Button onClick={handleUpload} disabled={disabled} className="w-full">
            <ImageIcon className="mr-2 h-4 w-4" />
            Upload {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  );
}
