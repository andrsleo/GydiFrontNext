'use client';

import { Play, Trash2 } from 'lucide-react';
import { getImagePath } from '@/lib/utils/image';
import { Button } from '@/components/ui/button';
import { useDeleteVideo } from '../hooks/use-delete-video';
import { formatFileSize } from '@/lib/utils/format';

interface PropertyVideo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  size?: number;
}

interface VideoOrganizerProps {
  propertyId: string;
  videos: PropertyVideo[];
  onSuccess?: () => void;
}

/**
 * Video Organizer Component
 * Manage property videos with delete functionality
 *
 * @example
 * ```tsx
 * <VideoOrganizer
 *   propertyId="123"
 *   videos={property.videos}
 * />
 * ```
 */
export function VideoOrganizer({
  propertyId,
  videos,
  onSuccess,
}: VideoOrganizerProps) {
  const { mutate: deleteVideo, isPending } = useDeleteVideo();

  function handleDeleteVideo(videoId: string) {
    if (!confirm('¿Estás seguro de eliminar este video? Esta acción no se puede deshacer.')) {
      return;
    }

    deleteVideo(
      { propertyId, videoId },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay videos aún. Sube algunos videos para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Administrar Videos</h3>
        <p className="text-sm text-muted-foreground">
          Administra los videos de tu propiedad. Máximo 2 videos permitidos.
        </p>
      </div>

      {/* Video List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className={`group relative rounded-lg overflow-hidden border-2 border-border hover:border-primary/50 transition-all ${
              isPending ? 'opacity-50' : ''
            }`}
          >
            {/* Video Preview */}
            <div className="relative aspect-video bg-muted">
              <video
                src={video.url}
                poster={getImagePath(video.thumbnailUrl)}
                className="w-full h-full object-cover"
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity">
                <Play className="w-12 h-12 text-white" />
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>

            {/* Video Info */}
            <div className="p-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    Video {videos.indexOf(video) + 1}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {video.duration && (
                      <span>{Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}</span>
                    )}
                    {video.size && (
                      <>
                        {video.duration && <span>•</span>}
                        <span>{formatFileSize(video.size)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Delete Button - ROJO BRILLANTE, visible en hover */}
            <Button
              size="sm"
              className="absolute top-3 right-3 z-10 bg-red-500 hover:bg-red-600 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 border-2 border-white/50"
              onClick={() => handleDeleteVideo(video.id)}
              disabled={isPending}
              title="Eliminar video"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              <span className="font-semibold">Eliminar</span>
            </Button>
          </div>
        ))}
      </div>

      {/* Info */}
      {videos.length < 2 && (
        <p className="text-sm text-muted-foreground">
          Puedes agregar {2 - videos.length} video{2 - videos.length !== 1 ? 's' : ''} más.
        </p>
      )}
    </div>
  );
}