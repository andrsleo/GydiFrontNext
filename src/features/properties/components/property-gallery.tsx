/**
 * PropertyGallery Component
 * Image and video gallery with carousel and lightbox
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Download,
} from 'lucide-react';
import { getImagePath, getBlurDataURL } from '@/lib/utils/image';
import type { PropertyImage, PropertyVideo } from '../types';

interface PropertyGalleryProps {
  images: PropertyImage[];
  videos?: PropertyVideo[];
  title: string;
}

/**
 * Property Gallery Component
 * Displays property images and videos in a carousel with lightbox
 *
 * @example
 * ```tsx
 * <PropertyGallery
 *   images={property.images}
 *   videos={property.videos}
 *   title={property.title}
 * />
 * ```
 */
export function PropertyGallery({ images, videos = [], title }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const touchStartX = useRef<number | null>(null);

  const allMedia = [
    ...images.map((img) => ({ type: 'image' as const, ...img })),
    ...videos.map((vid) => ({ type: 'video' as const, ...vid })),
  ];

  const currentMedia = allMedia[currentIndex];

  const goToPrevious = () => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setZoomLevel(1);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setZoomLevel(1);
  };

  const cycleZoom = () => {
    setZoomLevel((prev) => {
      if (prev === 1) return 1.5;
      if (prev === 1.5) return 2;
      return 1;
    });
  };

  const handleFullscreen = () => {
    try {
      document.documentElement.requestFullscreen();
    } catch {
      // Some browsers don't support fullscreen
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  // Scroll lock when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
    touchStartX.current = null;
  };

  if (allMedia.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image/Video */}
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        {currentMedia.type === 'image' ? (
          <>
            {(() => {
              const blurUrl = getBlurDataURL(getImagePath(currentMedia.url));
              return (
                <Image
                  src={getImagePath(currentMedia.url)}
                  alt={`${title} - Image ${currentIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority={currentIndex === 0}
                  placeholder={blurUrl ? 'blur' : 'empty'}
                  blurDataURL={blurUrl || undefined}
                />
              );
            })()}
            <button
              onClick={() => openLightbox(currentIndex)}
              className="absolute inset-0 z-10 cursor-zoom-in"
              aria-label="Open lightbox"
            />
          </>
        ) : (
          <video
            src={currentMedia.url}
            controls
            className="h-full w-full object-cover"
            poster={currentMedia.thumbnailUrl ? getImagePath(currentMedia.thumbnailUrl) : undefined}
          />
        )}

        {/* Navigation Arrows */}
        {allMedia.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 rounded-md bg-black/60 px-2 sm:px-3 py-1 text-xs sm:text-sm text-white">
          {currentIndex + 1} / {allMedia.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3">
        {allMedia.map((media, index) => (
          <button
            key={`${media.type}-${media.id}`}
            onClick={() => setCurrentIndex(index)}
            className={`relative aspect-square overflow-hidden rounded-md transition-all min-h-[44px] min-w-[44px] ${
              index === currentIndex
                ? 'ring-2 ring-primary ring-offset-2'
                : 'opacity-70 hover:opacity-100'
            }`}
            aria-label={`View ${media.type} ${index + 1}`}
          >
            {media.type === 'image' ? (
              (() => {
                const blurUrl = getBlurDataURL(getImagePath(media.url));
                return (
                  <Image
                    src={getImagePath(media.url)}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12.5vw, 10vw"
                    loading={index < 10 ? 'eager' : 'lazy'}
                    placeholder={blurUrl ? 'blur' : 'empty'}
                    blurDataURL={blurUrl || undefined}
                  />
                );
              })()
            ) : (
              <>
                {media.thumbnailUrl ? (
                  (() => {
                    const blurUrl = getBlurDataURL(getImagePath(media.thumbnailUrl));
                    return (
                      <Image
                        src={getImagePath(media.thumbnailUrl)}
                        alt={`Video thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12.5vw, 10vw"
                        loading={index < 10 ? 'eager' : 'lazy'}
                        placeholder={blurUrl ? 'blur' : 'empty'}
                        blurDataURL={blurUrl || undefined}
                      />
                    );
                  })()
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-gray-700 to-gray-900" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Lightbox Header Controls */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-2 z-10">
            {/* Download button (images only) */}
            {currentMedia.type === 'image' && (
              <a
                href={getImagePath(currentMedia.url)}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  aria-label="Download image"
                >
                  <Download className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </a>
            )}

            {/* Zoom controls (images only) */}
            {currentMedia.type === 'image' && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomLevel((prev) => Math.min(prev + 0.5, 2));
                  }}
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
                  }}
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </>
            )}

            {/* Fullscreen button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                handleFullscreen();
              }}
              aria-label="Fullscreen"
            >
              <Maximize2 className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>

          <div
            className="relative h-[90vh] w-[90vw] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {currentMedia.type === 'image' ? (
              <div
                className="h-full w-full flex items-center justify-center cursor-zoom-in transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
                onClick={cycleZoom}
              >
                {(() => {
                  const blurUrl = getBlurDataURL(getImagePath(currentMedia.url));
                  return (
                    <Image
                      src={getImagePath(currentMedia.url)}
                      alt={`${title} - Image ${currentIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="90vw"
                      placeholder={blurUrl ? 'blur' : 'empty'}
                      blurDataURL={blurUrl || undefined}
                    />
                  );
                })()}
              </div>
            ) : (
              <video
                src={currentMedia.url}
                controls
                autoPlay
                className="h-full w-full object-contain"
                poster={
                  currentMedia.thumbnailUrl
                    ? getImagePath(currentMedia.thumbnailUrl)
                    : undefined
                }
                preload="metadata"
              />
            )}
          </div>

          {/* Lightbox Navigation */}
          {allMedia.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
              </Button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-black/60 px-3 py-1 text-sm text-white">
            {currentIndex + 1} / {allMedia.length}
          </div>
        </div>
      )}
    </div>
  );
}
