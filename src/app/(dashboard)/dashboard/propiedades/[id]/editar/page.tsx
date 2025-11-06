'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePropertyDetail, useUpdateProperty, useUploadImages, useUploadVideos, usePublishProperty } from '@/features/properties';
import { PropertyForm, ImageUploader, VideoUploader, PropertyGallery, ImageOrganizer, VideoOrganizer } from '@/features/properties/components';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, Upload, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { UpdatePropertyFormData } from '@/features/properties/schemas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: property, isLoading } = usePropertyDetail({ id });
  const updateProperty = useUpdateProperty();
  const uploadImages = useUploadImages();
  const uploadVideos = useUploadVideos();
  const publishProperty = usePublishProperty();

  // Transform nested backend data to flat form data
  const formDefaultValues = property ? {
    title: property.title,
    description: property.description,
    pricePerNight: property.pricePerNight,
    currency: property.currency,
    propertyType: property.propertyType,
    // Flatten location object
    country: property.location?.country || '',
    city: property.location?.city || '',
    address: property.location?.address || '',
    postalCode: property.location?.postalCode || '',
    // Flatten specs object
    bedrooms: property.specs?.bedrooms || 1,
    bathrooms: property.specs?.bathrooms || 1,
    maxGuests: property.specs?.maxGuests || 2,
    amenities: property.amenities || [],
  } : undefined;

  const handleUpdateProperty = async (data: UpdatePropertyFormData) => {
    try {
      await updateProperty.mutateAsync({ id, data });
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const handlePublishProperty = async () => {
    try {
      await publishProperty.mutateAsync(id);
      // Optionally navigate to property detail or list after publish
      // router.push('/dashboard/propiedades');
    } catch (error) {
      // Error is handled by the hook's onError callback with toast
      console.error('Error publishing property:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Propiedad no encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <Link href="/dashboard/propiedades">
            <Button variant="ghost" size="icon" aria-label="Volver">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Editar Propiedad</h1>
              <Badge variant={property.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                {property.status}
              </Badge>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground truncate">{property.title}</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link href={`/propiedades/${id}`} target="_blank" className="flex-1 sm:flex-initial">
            <Button variant="outline" className="w-full sm:w-auto">
              <Eye className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Vista Previa</span>
              <span className="sm:hidden">Preview</span>
            </Button>
          </Link>
          {property.status === 'DRAFT' && (
            <Button
              className="flex-1 sm:flex-initial"
              onClick={handlePublishProperty}
              disabled={publishProperty.isPending}
            >
              {publishProperty.isPending ? 'Publicando...' : 'Publicar'}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="media" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">
              Media ({property.imageCount} imgs, {property.videoCount} videos)
            </span>
            <span className="sm:hidden">
              Media ({property.imageCount + property.videoCount})
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Propiedad</CardTitle>
              <CardDescription>
                Actualiza los detalles de tu propiedad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PropertyForm
                mode="edit"
                defaultValues={formDefaultValues}
                onSubmit={handleUpdateProperty}
                isSubmitting={updateProperty.isPending}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-6 space-y-6">
          {/* Organize Images */}
          {property.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Organizar Fotos</CardTitle>
                <CardDescription>
                  Reordena las imágenes y selecciona la foto de portada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageOrganizer
                  key={`${id}-${property.images.map(img => img.displayOrder).join('-')}-${property.coverImageId}`}
                  propertyId={id}
                  images={property.images}
                  coverImageId={property.coverImageId}
                />
              </CardContent>
            </Card>
          )}

          {/* Organize Videos */}
          {property.videos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Administrar Videos</CardTitle>
                <CardDescription>
                  Elimina videos que ya no desees mostrar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VideoOrganizer
                  key={`${id}-${property.videos.map(v => v.id).join('-')}`}
                  propertyId={id}
                  videos={property.videos}
                />
              </CardContent>
            </Card>
          )}

          {/* Current Media */}
          {(property.images.length > 0 || property.videos.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Vista Previa de Media</CardTitle>
                <CardDescription>
                  Imágenes y videos de tu propiedad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PropertyGallery images={property.images} videos={property.videos} title={property.title} />
              </CardContent>
            </Card>
          )}

          {/* Upload New Images */}
          <Card>
            <CardHeader>
              <CardTitle>Agregar Imágenes</CardTitle>
              <CardDescription>
                Sube hasta {20 - property.imageCount} imágenes más (tienes {property.imageCount}/20)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUploader
                maxFiles={20 - property.imageCount}
                onFilesSelected={async (files) => {
                  try {
                    await uploadImages.mutateAsync({ propertyId: id, files });
                  } catch (error) {
                    console.error('Error uploading images:', error);
                  }
                }}
                disabled={uploadImages.isPending}
              />
            </CardContent>
          </Card>

          {/* Upload New Videos */}
          <Card>
            <CardHeader>
              <CardTitle>Agregar Videos</CardTitle>
              <CardDescription>
                Sube hasta {2 - property.videoCount} videos más (tienes {property.videoCount}/2)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <VideoUploader
                maxFiles={2 - property.videoCount}
                onFilesSelected={async (files) => {
                  try {
                    await uploadVideos.mutateAsync({ propertyId: id, files });
                  } catch (error) {
                    console.error('Error uploading videos:', error);
                  }
                }}
                disabled={uploadVideos.isPending}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
