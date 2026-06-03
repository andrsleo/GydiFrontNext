/**
 * VideoUploader Component
 * Drag & drop video uploader with preview and validation.
 * Notifies parent immediately on every add/remove — no internal upload button.
 */

'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Play } from 'lucide-react';
import { toast } from 'sonner';
import { formatFileSize } from '@/lib/utils/format';
import { isAllowedVideoType, VIDEO_ACCEPT, VIDEO_FORMATS_LABEL } from '@/lib/utils/media-types';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

interface VideoUploaderProps {
  maxFiles?: number;
  maxSize?: number; // in bytes
  onFilesSelected?: (files: File[]) => void;
  disabled?: boolean;
}

export function VideoUploader({
  maxFiles = 2,
  maxSize = 500 * 1024 * 1024, // 500MB
  onFilesSelected,
  disabled = false,
}: VideoUploaderProps) {
  const { t } = useTranslation('properties');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = useCallback(
    (file: File): boolean => {
      if (!isAllowedVideoType(file)) {
        toast.error(t('uploader.videos.invalidType', { name: file.name }), {
          description: t('uploader.videos.invalidTypeDesc', { formats: VIDEO_FORMATS_LABEL }),
        });
        return false;
      }
      if (file.size > maxSize) {
        toast.error(t('uploader.videos.tooLarge', { name: file.name }), {
          description: t('uploader.videos.tooLargeDesc', { size: formatFileSize(maxSize) }),
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
        toast.error(t('uploader.videos.tooMany'), {
          description: t('uploader.videos.tooManyDesc', { max: String(maxFiles) }),
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
        toast.error(t('uploader.videos.noValidFiles'), {
          description: invalidFiles.length > 0
            ? t('uploader.videos.rejected', { count: String(invalidFiles.length) })
            : t('uploader.videos.selectValidFiles'),
        });
        return;
      }

      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      const newAll = [...selectedFiles, ...validFiles];

      setSelectedFiles(newAll);
      setPreviews((prev) => [...prev, ...newPreviews]);
      onFilesSelected?.(newAll);

      toast.success(t('uploader.videos.added'), {
        description: t('uploader.videos.addedDesc', { count: String(validFiles.length) }),
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

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={t('uploader.videos.ariaLabel')}
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
          accept={VIDEO_ACCEPT}
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
              {isDragging ? t('uploader.videos.dropHere') : t('uploader.videos.dragOrClick')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('uploader.videos.formatsHint', {
                formats: VIDEO_FORMATS_LABEL,
                max: String(maxFiles),
                size: formatFileSize(maxSize),
              })}
            </p>
          </div>
          {!isDragging && (
            <span className="text-xs text-primary font-medium border border-primary/30 rounded-full px-3 py-1">
              {t('uploader.videos.selectFiles')}
            </span>
          )}
        </div>
      </div>

      {/* Preview List */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{t('uploader.videos.selectedLabel')}</span>
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
              {t('uploader.videos.clearAll')}
            </Button>
          </div>

          <div className="space-y-2">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/40"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                  <video src={preview} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Play className="h-5 w-5 text-white drop-shadow" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{selectedFiles[index].name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatFileSize(selectedFiles[index].size)}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  aria-label={t('uploader.videos.removeAria', { n: String(index + 1) })}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
