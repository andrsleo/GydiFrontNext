/**
 * ContentVideoPlayer — native video player with custom controls
 * Uses <video> element: no external dependencies
 * Supports iOS Safari (playsInline, muted)
 */

'use client';

import { useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentVideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export function ContentVideoPlayer({
  src,
  poster,
  className,
}: ContentVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // don't trigger play/pause
    const video = videoRef.current;
    if (!video) return;
    const next = !isMuted;
    video.muted = next;
    setIsMuted(next);
  }, [isMuted]);

  return (
    <div className={cn('relative overflow-hidden rounded-2xl bg-black', className)}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        muted={isMuted}
        loop
        className="h-full w-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Play/Pause overlay */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        className="absolute inset-0 flex items-center justify-center"
      >
        {!isPlaying && (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-opacity hover:bg-black/70 min-h-11 min-w-11">
            <Play className="h-7 w-7 translate-x-0.5" />
          </div>
        )}
        {isPlaying && (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/0 text-white opacity-0 transition-all hover:bg-black/30 hover:opacity-100 min-h-11 min-w-11">
            <Pause className="h-7 w-7" />
          </div>
        )}
      </button>

      {/* Mute toggle — bottom right */}
      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 min-h-11 min-w-11"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
