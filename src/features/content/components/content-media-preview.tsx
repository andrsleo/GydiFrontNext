/**
 * ContentMediaPreview
 * - 1 item  → full-width viewer (image or video)
 * - N items → carousel slider with prev/next arrows + dot indicators
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImageIcon, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { resolveMediaUrl } from '@/lib/utils/image';
import { ContentVideoPlayer } from './content-video-player';
import type { ContentMedia } from '../types';

interface ContentMediaPreviewProps {
  media: ContentMedia[];
  className?: string;
}

// ── Single slide ─────────────────────────────────────────────────────────────

function MediaSlide({ item, priority = false }: { item: ContentMedia; priority?: boolean }) {
  const src = resolveMediaUrl(item.processedUrl ?? item.originalUrl);
  const poster = resolveMediaUrl(item.thumbnailUrl);

  if (item.mediaType === 'VIDEO') {
    return (
      <ContentVideoPlayer
        src={src ?? ''}
        poster={poster}
        className="aspect-square w-full rounded-none"
      />
    );
  }

  if (!src) {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-muted">
        <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-full">
      <Image
        src={src}
        alt="Media"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ContentMediaPreview({ media, className }: ContentMediaPreviewProps) {
  const [current, setCurrent] = useState(0);

  if (media.length === 0) {
    return (
      <div className={cn('flex aspect-square items-center justify-center rounded-2xl bg-muted', className)}>
        <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
      </div>
    );
  }

  // Single item — keep original aspect ratio behaviour
  if (media.length === 1) {
    const item = media[0];
    const src = resolveMediaUrl(item.processedUrl ?? item.originalUrl);
    const poster = resolveMediaUrl(item.thumbnailUrl);

    if (item.mediaType === 'VIDEO') {
      return (
        <ContentVideoPlayer
          src={src ?? ''}
          poster={poster}
          className={cn('aspect-[9/16] w-full', className)}
        />
      );
    }

    if (!src) {
      return (
        <div className={cn('flex aspect-square items-center justify-center rounded-2xl bg-muted', className)}>
          <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
        </div>
      );
    }

    return (
      <div className={cn('relative aspect-square w-full overflow-hidden rounded-2xl', className)}>
        <Image
          src={src}
          alt="Media"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
    );
  }

  // Multiple items — carousel slider
  const prev = () => setCurrent((c) => (c - 1 + media.length) % media.length);
  const next = () => setCurrent((c) => (c + 1) % media.length);

  const item = media[current];
  const isVideo = item.mediaType === 'VIDEO';

  return (
    <div className={cn('relative overflow-hidden rounded-2xl bg-black select-none', className)}>
      {/* Current slide */}
      <MediaSlide item={item} priority={current === 0} />

      {/* Type badge top-left */}
      <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
        {isVideo ? <Film className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
        {isVideo ? 'Video' : 'Foto'}
      </div>

      {/* Counter top-right */}
      <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
        {current + 1} / {media.length}
      </div>

      {/* Prev arrow */}
      {current > 0 && (
        <button
          type="button"
          onClick={prev}
          aria-label="Anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Next arrow */}
      {current < media.length - 1 && (
        <button
          type="button"
          onClick={next}
          aria-label="Siguiente"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {media.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrent(idx)}
            aria-label={`Ir a imagen ${idx + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all',
              idx === current
                ? 'w-4 bg-white'
                : 'w-1.5 bg-white/50 hover:bg-white/80'
            )}
          />
        ))}
      </div>
    </div>
  );
}
