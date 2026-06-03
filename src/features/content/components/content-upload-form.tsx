/**
 * ContentUploadForm — create content post with media upload
 * - PHOTO / VIDEO: single file
 * - CAROUSEL: up to 10 images, drag-to-reorder list, sequential upload
 */

'use client';

import { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X, Film, GripVertical, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { createContentSchema, type CreateContentFormData } from '../schemas/content.schema';
import { useCreateContent } from '../hooks/use-create-content';
import { contentApi } from '../api/content.api';
import type { PropertyResponse } from '@/features/properties/types';
import { toast } from 'sonner';
import { PropertyPickerField } from './property-picker-field';
import { useTranslation } from '@/hooks/use-translation';

const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;  // 10 MB
const MAX_CAROUSEL_FILES = 10;

interface FileEntry {
  file: File;
  preview: string; // object URL
}

interface ContentUploadFormProps {
  onSuccess?: () => void;
}

export function ContentUploadForm({ onSuccess }: ContentUploadFormProps) {
  const { mutateAsync: createContent, isPending: isCreating } = useCreateContent();
  const { t } = useTranslation('content');

  const [files, setFiles] = useState<FileEntry[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0); // 0-100 overall
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateContentFormData>({
    resolver: zodResolver(createContentSchema),
    defaultValues: { caption: '', type: 'PHOTO', propertyId: undefined },
  });

  const contentType = form.watch('type');
  const isCarousel = contentType === 'CAROUSEL';
  const isVideo = contentType === 'VIDEO';
  const isSingle = !isCarousel; // PHOTO or VIDEO

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const validateFile = useCallback((f: File): boolean => {
    if (isVideo) {
      if (!f.type.startsWith('video/')) {
        toast.error(t('toast.selectVideo'));
        return false;
      }
      if (f.size > MAX_VIDEO_BYTES) {
        toast.error(t('toast.videoTooLarge'));
        return false;
      }
    } else if (isCarousel) {
      const isImg = f.type.startsWith('image/');
      const isVid = f.type.startsWith('video/');
      if (!isImg && !isVid) {
        toast.error(t('toast.carouselMediaOnly'));
        return false;
      }
      const maxBytes = isVid ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
      if (f.size > maxBytes) {
        toast.error(isVid ? t('toast.videoMaxCarousel') : t('toast.imageMaxCarousel'));
        return false;
      }
    } else {
      if (!f.type.startsWith('image/')) {
        toast.error(t('toast.selectImage'));
        return false;
      }
      if (f.size > MAX_IMAGE_BYTES) {
        toast.error(t('toast.imageTooLarge'));
        return false;
      }
    }
    return true;
  }, [isVideo, isCarousel, t]);

  const addFiles = useCallback((incoming: File[]) => {
    const valid = incoming.filter(validateFile);
    if (valid.length === 0) return;

    if (isSingle) {
      setFiles((prev) => {
        prev.forEach((e) => URL.revokeObjectURL(e.preview));
        return [{ file: valid[0], preview: URL.createObjectURL(valid[0]) }];
      });
    } else {
      setFiles((prev) => {
        const remaining = MAX_CAROUSEL_FILES - prev.length;
        if (remaining <= 0) {
          toast.error(t('toast.carouselMaxFiles', { max: MAX_CAROUSEL_FILES }));
          return prev;
        }
        const toAdd = valid.slice(0, remaining);
        if (valid.length > remaining) {
          toast.warning(t('toast.carouselLimitReached', { added: remaining, max: MAX_CAROUSEL_FILES }));
        }
        return [
          ...prev,
          ...toAdd.map((f) => ({ file: f, preview: URL.createObjectURL(f) })),
        ];
      });
    }
    setUploadState('idle');
    setUploadProgress(0);
  }, [isSingle, validateFile, t]);

  // ── Drop zone ────────────────────────────────────────────────────────────────

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length) addFiles(dropped);
  }, [addFiles]);

  const onFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length) addFiles(selected);
    e.target.value = '';
  }, [addFiles]);

  const removeFile = (index: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // ── Submit ───────────────────────────────────────────────────────────────────

  const onSubmit = async (data: CreateContentFormData) => {
    if (files.length === 0) {
      toast.error(t('toast.selectFile'));
      return;
    }
    if (isCarousel && files.length < 2) {
      toast.error(t('toast.carouselMinFiles'));
      return;
    }

    try {
      setUploadState('uploading');
      setUploadProgress(5);

      const post = await createContent({
        caption: data.caption,
        type: data.type,
        propertyId: data.propertyId,
      });

      for (let i = 0; i < files.length; i++) {
        await contentApi.uploadMedia(post.id, files[i].file, i);
        setUploadProgress(Math.round(((i + 1) / files.length) * 95) + 5);
      }

      setUploadProgress(100);
      setUploadState('success');
      toast.success(t('toast.published'));
      onSuccess?.();
    } catch {
      setUploadState('error');
      setUploadProgress(0);
      toast.error(t('toast.publishError'));
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const acceptAttr = isVideo ? 'video/*' : isCarousel ? 'image/*,video/*' : 'image/*';
  const dropHint = isVideo
    ? t('form.file.hintVideo')
    : isCarousel
    ? t('form.file.hintCarousel', { max: MAX_CAROUSEL_FILES })
    : t('form.file.hintPhoto');

  const showDropZone = files.length === 0 || isCarousel;

  const submitLabel = (() => {
    if (isCreating || uploadState === 'uploading') return t('form.submit.publishing');
    if (isCarousel) {
      const unit = files.length === 1 ? t('form.submit.imageOne') : t('form.submit.imageMany');
      return t('form.submit.publishCarousel', { count: files.length, unit });
    }
    return t('form.submit.publish');
  })();

  const progressLabel = isCarousel && files.length > 1
    ? t('form.progress.uploadingCarousel', {
        percent: uploadProgress,
        current: Math.ceil((uploadProgress / 100) * files.length),
        total: files.length,
      })
    : t('form.progress.uploading', { percent: uploadProgress });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Content Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.type.label')}</FormLabel>
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  setFiles((prev) => {
                    prev.forEach((e) => URL.revokeObjectURL(e.preview));
                    return [];
                  });
                  setUploadState('idle');
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('form.type.placeholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PHOTO">{t('form.type.photo')}</SelectItem>
                  <SelectItem value="VIDEO">{t('form.type.video')}</SelectItem>
                  <SelectItem value="CAROUSEL">{t('form.type.carousel')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Caption */}
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.caption.label')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('form.caption.placeholder')}
                  className="w-full resize-none"
                  rows={3}
                  maxLength={500}
                  {...field}
                />
              </FormControl>
              <div className="flex justify-end">
                <span className="text-xs text-muted-foreground">
                  {field.value?.length ?? 0}/500
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Property selector */}
        <FormField
          control={form.control}
          name="propertyId"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                {t('form.property.label')}{' '}
                <span className="text-destructive">*</span>
              </FormLabel>
              <PropertyPickerField
                value={field.value}
                onChange={(id: number, _prop: PropertyResponse) => field.onChange(id)}
                error={fieldState.error?.message}
              />
            </FormItem>
          )}
        />

        {/* File Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>
              {isCarousel
                ? t('form.file.labelCarousel', { count: files.length, max: MAX_CAROUSEL_FILES })
                : t('form.file.label')}
            </Label>
            {isCarousel && files.length > 0 && files.length < MAX_CAROUSEL_FILES && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-7 gap-1 text-xs"
              >
                <Plus className="h-3 w-3" />
                {t('form.file.addMore')}
              </Button>
            )}
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((entry, idx) => (
                <div
                  key={entry.preview}
                  className="flex items-center gap-3 rounded-xl border bg-muted/40 p-2"
                >
                  {isCarousel && (
                    <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                  )}

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                    {entry.file.type.startsWith('video/') ? (
                      <Film className="h-6 w-6 text-muted-foreground" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={entry.preview}
                        alt={t('form.file.fileAlt', { number: idx + 1 })}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{entry.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(entry.file.size / (1024 * 1024)).toFixed(1)} MB
                      {isCarousel && (
                        <span className="ml-2 text-muted-foreground/60">#{idx + 1}</span>
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    disabled={uploadState === 'uploading'}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
                    aria-label={t('picker.clearAriaLabel')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Drop zone */}
          {showDropZone && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors',
                isDragging
                  ? 'border-[hsl(var(--gydi-primary))] bg-[hsl(var(--gydi-primary))]/5'
                  : 'border-muted-foreground/30 hover:border-[hsl(var(--gydi-primary))]/50 hover:bg-muted/50'
              )}
            >
              <Upload className="h-10 w-10 text-muted-foreground/60" />
              <div>
                <p className="font-medium text-foreground">
                  {isCarousel && files.length > 0
                    ? t('form.file.dragHereCarousel')
                    : t('form.file.dragHere')}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{dropHint}</p>
              </div>
              <Button type="button" variant="outline" size="sm">
                {isCarousel ? t('form.file.selectImages') : t('form.file.selectFile')}
              </Button>
            </div>
          )}

          {/* Progress */}
          {uploadState === 'uploading' && (
            <div className="space-y-1">
              <Progress value={uploadProgress} className="h-1.5" />
              <p className="text-xs text-muted-foreground">{progressLabel}</p>
            </div>
          )}
          {uploadState === 'error' && (
            <p className="text-xs font-medium text-destructive">{t('form.progress.error')}</p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={acceptAttr}
            multiple={isCarousel}
            className="sr-only"
            onChange={onFileInputChange}
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={
            isCreating ||
            uploadState === 'uploading' ||
            files.length === 0 ||
            (isCarousel && files.length < 2) ||
            !form.watch('propertyId')
          }
          className="w-full bg-[hsl(var(--gydi-primary))] text-white hover:bg-[hsl(var(--gydi-primary))]/90"
        >
          {submitLabel}
        </Button>

        {isCarousel && files.length === 1 && (
          <p className="text-center text-xs text-muted-foreground">
            {t('form.submit.carouselMinHint')}
          </p>
        )}
      </form>
    </Form>
  );
}
