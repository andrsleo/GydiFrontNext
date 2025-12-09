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
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReorderImages } from '../hooks/use-reorder-images';
import { useDeleteImage } from '../hooks/use-delete-image';
import { toast } from 'sonner';

interface PropertyImage {
  id: string;
  url: string;
  displayOrder: number;
}

interface ImageOrganizerProps {
  propertyId: string;
  images: PropertyImage[];
  coverImageId?: string;
  onSuccess?: () => void;
}

/**
 * Sortable Image Item Component
 */
function SortableImageItem({
  image,
  isCover,
  onSetCover,
  onDelete,
  isPending,
}: {
  image: PropertyImage;
  isCover: boolean;
  onSetCover: () => void;
  onDelete: () => void;
  isPending: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
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
      className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
        isCover ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
      } ${isPending ? 'opacity-50' : ''}`}
    >
      <img src={image.url} alt="" className="w-full h-full object-cover" />

      {/* Overlay on hover - más oscuro para mejor contraste */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* Cover Badge - más grande y visible */}
      {isCover && (
        <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white shadow-lg" variant="default">
          <Star className="w-4 h-4 mr-1.5 fill-current" />
          <span className="font-semibold">Portada</span>
        </Badge>
      )}

      {/* Drag Handle - siempre visible, más contrastante */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg cursor-grab active:cursor-grabbing hover:bg-white hover:scale-110 transition-all shadow-lg z-10 border border-gray-200"
        disabled={isPending}
        title="Arrastrar para reordenar"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Delete Button - ROJO BRILLANTE, siempre visible en hover */}
      <Button
        size="sm"
        className="absolute top-3 left-3 z-10 bg-red-500 hover:bg-red-600 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 border-2 border-white/50"
        onClick={onDelete}
        disabled={isPending}
        title="Eliminar imagen"
      >
        <Trash2 className="w-4 h-4 mr-1.5" />
        <span className="font-semibold">Eliminar</span>
      </Button>

      {/* Set as Cover Button - AZUL BRILLANTE del branding GYDI */}
      {!isCover && (
        <Button
          size="sm"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 border-2 border-white/50"
          onClick={onSetCover}
          disabled={isPending}
        >
          <Star className="w-4 h-4 mr-1.5" />
          <span className="font-semibold">Marcar como Portada</span>
        </Button>
      )}
    </div>
  );
}

/**
 * Image Organizer Component
 * Drag & drop to reorder property images and set cover image
 */
export function ImageOrganizer({
  propertyId,
  images: initialImages,
  coverImageId: initialCoverId,
  onSuccess,
}: ImageOrganizerProps) {
  const [images, setImages] = useState(initialImages);
  const [coverImageId, setCoverImageId] = useState(initialCoverId);
  const [hasChanges, setHasChanges] = useState(false);

  const { mutate: reorderImages, isPending } = useReorderImages();
  const { mutate: deleteImage, isPending: isDeleting } = useDeleteImage();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        setHasChanges(true);
        return newItems;
      });
    }
  }

  function handleSetCover(imageId: string) {
    setCoverImageId(imageId);

    // Move the selected image to the first position
    setImages((currentImages) => {
      const imageIndex = currentImages.findIndex((img) => img.id === imageId);
      if (imageIndex === -1 || imageIndex === 0) {
        // Image not found or already first, no need to move
        return currentImages;
      }

      // Move image to first position
      const newImages = [...currentImages];
      const [movedImage] = newImages.splice(imageIndex, 1);
      newImages.unshift(movedImage);

      return newImages;
    });

    setHasChanges(true);
  }

  function handleDeleteImage(imageId: string) {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) {
      return;
    }

    deleteImage({ propertyId, imageId });
  }

  function handleSave() {
    if (!hasChanges) {
      toast.info('No changes to save');
      return;
    }

    const imageOrders = images.map((img, index) => ({
      imageId: img.id,
      displayOrder: index,
    }));

    reorderImages(
      {
        propertyId,
        imageOrders,
        coverImageId,
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
    setImages(initialImages);
    setCoverImageId(initialCoverId);
    setHasChanges(false);
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No images yet. Upload some images to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Organize Photos</h3>
          <p className="text-sm text-muted-foreground">
            Drag to reorder or mark a photo as cover. The cover photo will be displayed first.
          </p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset} disabled={isPending || isDeleting}>
              Reset
            </Button>
          )}
          <Button onClick={handleSave} disabled={!hasChanges || isPending || isDeleting}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Drag & Drop Grid */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <SortableImageItem
                key={image.id}
                image={image}
                isCover={image.id === coverImageId}
                onSetCover={() => handleSetCover(image.id)}
                onDelete={() => handleDeleteImage(image.id)}
                isPending={isPending || isDeleting}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Info */}
      {images.length < 20 && (
        <p className="text-sm text-muted-foreground">
          You can add up to {20 - images.length} more images.
        </p>
      )}
    </div>
  );
}