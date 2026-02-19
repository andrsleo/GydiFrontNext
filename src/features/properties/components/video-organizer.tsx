'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Play, Trash2 } from 'lucide-react';
import { getImagePath } from '@/lib/utils/image';
import { Button } from '@/components/ui/button';
import { useReorderVideos } from '../hooks/use-reorder-videos';
import { useDeleteVideo } from '../hooks/use-delete-video';
import { formatFileSize } from '@/lib/utils/format';

interface PropertyVideo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  size?: number;
  displayOrder: number;
}

interface VideoOrganizerProps {
  propertyId: string;
  videos: PropertyVideo[];
  onSuccess?: () => void;
}

/**
 * Sortable Video Item Component
 */
function SortableVideoItem({
  video,
  index,
  onDelete,
  isPending,
}: {
  video: PropertyVideo;
  index: number;
  onDelete: () => void;
  isPending: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: video.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
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
            <p className="text-sm font-medium truncate">Video {index + 1}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {video.duration && (
                <span>
                  {Math.floor(video.duration / 60)}:
                  {String(Math.floor(video.duration % 60)).padStart(2, '0')}
                </span>
              )}
              {video.size && (
                <>
                  {video.duration && <span>•</span>}
                  <span>{formatFileSize(video.size)}</span>
                </>
              )}
            </div>
          </div>

          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="p-2 text-muted-foreground cursor-grab active:cursor-grabbing hover:text-foreground transition-colors rounded"
            disabled={isPending}
            title="Arrastrar para reordenar"
          >
            <GripVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Delete Button */}
      <Button
        size="sm"
        className="absolute top-3 right-3 z-10 bg-red-500 hover:bg-red-600 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 border-2 border-white/50"
        onClick={onDelete}
        disabled={isPending}
        title="Eliminar video"
      >
        <Trash2 className="w-4 h-4 mr-1.5" />
        <span className="font-semibold">Eliminar</span>
      </Button>
    </div>
  );
}

/**
 * Video Organizer Component
 * Drag & drop to reorder property videos (max 2 videos, vertical list)
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
  videos: initialVideos,
  onSuccess,
}: VideoOrganizerProps) {
  const [videos, setVideos] = useState(initialVideos);
  const [hasChanges, setHasChanges] = useState(false);

  const { mutate: reorderVideos, isPending } = useReorderVideos();
  const { mutate: deleteVideo, isPending: isDeleting } = useDeleteVideo();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setVideos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        setHasChanges(true);
        return newItems;
      });
    }
  }

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

  function handleSave() {
    const videoOrders = videos.map((vid, index) => ({
      videoId: vid.id,
      displayOrder: index,
    }));

    reorderVideos(
      {
        propertyId,
        videoOrders,
      },
      {
        onSuccess: () => {
          setHasChanges(false);
          onSuccess?.();
        },
      }
    );
  }

  function handleReset() {
    setVideos(initialVideos);
    setHasChanges(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Administrar Videos</h3>
          <p className="text-sm text-muted-foreground">
            Arrastra para reordenar. Máximo 2 videos permitidos.
          </p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset} disabled={isPending || isDeleting}>
              Restablecer
            </Button>
          )}
          {hasChanges && (
            <Button onClick={handleSave} disabled={isPending || isDeleting}>
              {isPending ? 'Guardando...' : 'Guardar orden'}
            </Button>
          )}
        </div>
      </div>

      {/* Drag & Drop List */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={videos.map((vid) => vid.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 gap-4">
            {videos.map((video, index) => (
              <SortableVideoItem
                key={video.id}
                video={video}
                index={index}
                onDelete={() => handleDeleteVideo(video.id)}
                isPending={isPending || isDeleting}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Info */}
      {videos.length < 2 && (
        <p className="text-sm text-muted-foreground">
          Puedes agregar {2 - videos.length} video{2 - videos.length !== 1 ? 's' : ''} más.
        </p>
      )}
    </div>
  );
}
