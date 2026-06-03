/**
 * ContentCard — grid card for content posts
 * Supports VIDEO (9:16) and PHOTO/CAROUSEL (1:1) aspect ratios
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Eye, Heart, MessageCircle, ImageIcon, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { resolveMediaUrl } from '@/lib/utils/image';
import { ContentStatusBadge } from './content-status-badge';
import type { ContentPost } from '../types';

interface ContentCardProps {
  post: ContentPost;
  showStatus?: boolean;
  className?: string;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

const TYPE_LABEL: Record<string, string> = {
  VIDEO: 'Video',
  PHOTO: 'Foto',
  CAROUSEL: 'Carrusel',
};

const TYPE_ICON: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  VIDEO: PlayCircle,
  PHOTO: ImageIcon,
  CAROUSEL: ImageIcon,
};

export function ContentCard({
  post,
  showStatus = false,
  className,
}: ContentCardProps) {
  const isVideo = post.type === 'VIDEO';
  const TypeIcon = TYPE_ICON[post.type] ?? ImageIcon;

  // Static thumbnail (image): post-level → first media thumbnail only (not video URL)
  const firstMedia = post.media?.[0];
  const rawThumb = post.thumbnailUrl ?? firstMedia?.thumbnailUrl;
  const thumbnailSrc = resolveMediaUrl(rawThumb);

  // For any post whose first media is a video without a static thumbnail,
  // use the video element itself to render the first frame (works for VIDEO and CAROUSEL)
  const firstMediaIsVideo = firstMedia?.mediaType === 'VIDEO';
  const videoSrc = firstMediaIsVideo && !thumbnailSrc
    ? resolveMediaUrl(firstMedia?.processedUrl ?? firstMedia?.originalUrl)
    : undefined;

  return (
    <Link
      href={`/feed/${String(post.id)}`}
      className={cn(
        'group relative block overflow-hidden rounded-2xl bg-muted aspect-square',
        className
      )}
    >
      {/* Thumbnail */}
      {thumbnailSrc ? (
        <Image
          src={thumbnailSrc}
          alt={post.caption ?? 'Contenido'}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : videoSrc ? (
        // Video without static thumbnail — browser renders first frame
        <video
          src={videoSrc}
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <TypeIcon className="h-10 w-10 text-muted-foreground/40" />
        </div>
      )}

      {/* Type badge — top left */}
      <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
        <TypeIcon className="h-3 w-3" />
        {TYPE_LABEL[post.type]}
      </div>

      {/* Status badge — top right (optional) */}
      {showStatus && (
        <div className="absolute right-2 top-2">
          <ContentStatusBadge status={post.status} />
        </div>
      )}

      {/* Hover overlay with stats */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="flex items-center gap-3 text-white">
          <span className="flex items-center gap-1 text-sm">
            <Eye className="h-4 w-4" />
            {formatCount(post.viewCount)}
          </span>
          <span className="flex items-center gap-1 text-sm">
            <Heart className="h-4 w-4" />
            {formatCount(post.likeCount)}
          </span>
          <span className="flex items-center gap-1 text-sm">
            <MessageCircle className="h-4 w-4" />
            {formatCount(post.commentCount)}
          </span>
        </div>
        {post.caption && (
          <p className="mt-1 line-clamp-2 text-xs text-white/80">
            {post.caption}
          </p>
        )}
      </div>
    </Link>
  );
}
