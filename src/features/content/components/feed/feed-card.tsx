'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX } from 'lucide-react';
import type { ContentPost } from '../../types';
import { resolveMediaUrl } from '@/lib/utils/image';
import { FeedOverlay } from './feed-overlay';
import { FeedActions } from './feed-actions';
import { useRegisterView } from '../../hooks/use-register-view';

interface FeedCardProps {
  post: ContentPost;
}

export function FeedCard({ post }: FeedCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { registerView } = useRegisterView();
  const hasRegisteredView = useRef(false);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  }, []);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/feed/${post.id}`
      : `/feed/${post.id}`;

  // IntersectionObserver: autoplay/pause + register view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let viewTimer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.7) {
          videoRef.current?.play().catch(() => {});
          // Register view once per card visibility (debounced by 3s)
          if (!hasRegisteredView.current) {
            viewTimer = setTimeout(() => {
              hasRegisteredView.current = true;
              registerView(post.id);
            }, 3000);
          }
        } else {
          videoRef.current?.pause();
          if (viewTimer) {
            clearTimeout(viewTimer);
            viewTimer = undefined;
          }
        }
      },
      { threshold: 0.7 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (viewTimer) clearTimeout(viewTimer);
    };
  }, [post.id, registerView]);

  const firstMedia = post.media?.[0];
  const isVideo = firstMedia?.mediaType === 'VIDEO';
  const mediaSrc = resolveMediaUrl(firstMedia?.processedUrl ?? firstMedia?.originalUrl);
  const thumbnail = resolveMediaUrl(firstMedia?.thumbnailUrl ?? post.thumbnailUrl);

  return (
    <div
      ref={containerRef}
      className="relative h-[100dvh] w-full snap-start overflow-hidden bg-black"
    >
      {/* Media */}
      {isVideo && mediaSrc ? (
        <video
          ref={videoRef}
          src={mediaSrc}
          poster={thumbnail ?? undefined}
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
        />
      ) : thumbnail ? (
        <Image
          src={thumbnail}
          alt={post.caption ?? 'Contenido'}
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(252,100%,64%)] to-[hsl(177,100%,42%)]" />
      )}

      {/* Mute toggle — only for videos */}
      {isVideo && mediaSrc && (
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      )}

      {/* Overlay */}
      <FeedOverlay post={post} />

      {/* Actions */}
      <FeedActions post={post} shareUrl={shareUrl} />
    </div>
  );
}
