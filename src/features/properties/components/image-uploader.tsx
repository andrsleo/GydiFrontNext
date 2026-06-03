/**
 * ImageUploader Component
 * Drag & drop image uploader with preview and validation.
 * Notifies parent immediately on every add/remove — no internal upload button.
 */

'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatFileSize } from '@/lib/utils/format';
import { isAllowedImageType, IMAGE_ACCEPT, IMAGE_FORMATS_LABEL } from '@/lib/utils/media-types';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  maxFiles?: number;
  /** Minimum count shown as a publish requirement indicator */
  minFiles?: number;
  maxSize?: number; // in bytes
  onFilesSelected?: (files: File[]) => void;
  disabled?: boolean;
}

export function ImageUploader({
  maxFiles = 20,
  minFiles = 0,
  maxSize = 10 * 1024 * 1024, // 10MB
  onFilesSelected,
  disabled = false,
}: ImageUploaderProps) {
  const { t } = useTranslation('properties');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = useCallback(
    (file: File): boolean => {
      if (!isAllowedImageType(file)) {
        toast.error(t('uploader.images.invalidType', { name: file.name }), {
          description: t('uploader.images.invalidTypeDesc', { formats: IMAGE_FORMATS_LABEL }),
        });
        return false;
      }
      if (file.size > maxSize) {
        toast.error(t('uploader.images.tooLarge', { name: file.name }), {
          description: t('uploader.images.tooLargeDesc', { size: formatFileSize(maxSize) }),
        });
        return false;
      }
      return true;
    },
    [maxSize, t]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);

      if (selectedFiles.length + fileArray.length > maxFiles) {
        toast.error(t('uploader.images.tooMany'), {
          description: t('uploader.images.tooManyDesc', { max: String(maxFiles) }),
        });
        return;
      }

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
        toast.error(t('uploader.images.noValidFiles'), {
          description: invalidFiles.length > 0
            ? t('uploader.images.rejected', { count: String(invalidFiles.length) })
            : t('uploader.images.selectValidFiles'),
        });
        return;
      }

      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      const newAll = [...selectedFiles, ...validFiles];

      setSelectedFiles(newAll);
      setPreviews((prev) => [...prev, ...newPreviews]);
      onFilesSelected?.(newAll);

      toast.success(t('uploader.images.added'), {
        description: t('uploader.images.addedDesc', { count: String(validFiles.length) }),
      });
    },
    [selectedFiles, maxFiles, validateFile, onFilesSelected, t]
  );

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

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      e.target.value = '';
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      URL.revokeObjectURL(previews[index]);
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      const newPreviews = previews.filter((_, i) => i !== index);
      setSelectedFiles(newFiles);
      setPreviews(newPreviews);
      onFilesSelected?.(newFiles);
    },
    [selectedFiles, previews, onFilesSelected]
  );

  const clearAll = useCallback(() => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviews([]);
    onFilesSelected?.([]);
  }, [previews, onFilesSelected]);

  const hasMin = minFiles > 0;
  const meetsMin = selectedFiles.length >= minFiles;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={t('uploader.images.ariaLabel')}
        className={cn(
          'relative rounded-xl border-2 border-dashed p-10 transition-all duration-200 text-center',
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/30',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={IMAGE_ACCEPT}
          multiple
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-hidden="true"
        />

        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-200',
            isDragging ? 'bg-primary/15' : 'bg-muted'
          )}>
            <Upload className={cn(
              'h-6 w-6 transition-colors duration-200',
              isDragging ? 'text-primary' : 'text-muted-foreground'
            )} />
          </div>
          <div>
            <p className="text-sm font-semibold">
              {isDragging ? t('uploader.images.dropHere') : t('uploader.images.dragOrClick')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('uploader.images.formatsHint', {
                formats: IMAGE_FORMATS_LABEL,
                max: String(maxFiles),
                size: formatFileSize(maxSize),
              })}
            </p>
          </div>
          {!isDragging && (
            <span className="text-xs text-primary font-medium border border-primary/30 rounded-full px-3 py-1">
              {t('uploader.images.selectFiles')}
            </span>
          )}
        </div>
      </div>

      {/* Min requirement indicator */}
      {hasMin && (
        <div className={cn(
          'flex items-center gap-1.5 text-xs font-medium',
          meetsMin ? 'text-green-600' : 'text-amber-600'
        )}>
          {meetsMin
            ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            : <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
          <span>
            {meetsMin
              ? `${selectedFiles.length}/${maxFiles} ${t('uploader.images.selectedLabel').toLowerCase()}`
              : t('uploader.images.minRequired', { min: String(minFiles) })}
          </span>
        </div>
      )}

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{t('uploader.images.selectedLabel')}</span>
              <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5 font-medium">
                {selectedFiles.length}/{maxFiles}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-muted-foreground hover:text-destructive"
            >
              {t('uploader.images.clearAll')}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
              >
                <Image
                  src={preview}
                  alt={`${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                  sizes="200px"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  aria-label={t('uploader.images.removeAria', { n: String(index + 1) })}
                  className="absolute right-1.5 top-1.5 rounded-full bg-background/90 p-1 shadow-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <div className="absolute bottom-1 left-1 bg-black/70 rounded-sm px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {formatFileSize(selectedFiles[index].size)}
                </div>

                <div className="absolute top-1.5 left-1.5 bg-black/60 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-white font-medium">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
