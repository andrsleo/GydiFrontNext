'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePropertyById, useUpdateProperty, useUploadVideos, useCloudinaryDirectUpload } from '@/features/properties';
import { PropertyForm, ImageUploader, VideoUploader, PropertyGallery, ImageOrganizer, VideoOrganizer, PropertyStatusBadge } from '@/features/properties/components';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import { UpdatePropertyFormData } from '@/features/properties/schemas';
import { PropertyStatus } from '@/features/properties/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSubmitForApproval } from '@/features/properties/hooks';
import { CohostInstructionsDialog } from '@/features/properties/components/cohost-instructions-dialog';

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: property, isLoading } = usePropertyById({ id });
  const updateProperty = useUpdateProperty({
    onCohostRequired: (propertyId) => {
      setPendingCohostPropertyId(propertyId);
      setShowCohostDialog(true);
    },
  });
  const { uploadImagesAsync, isUploading: isUploadingImages, progress: uploadProgress } = useCloudinaryDirectUpload();
  const uploadVideos = useUploadVideos();
  const submitForApproval = useSubmitForApproval();
  const [showCohostDialog, setShowCohostDialog] = useState(false);
  const [pendingCohostPropertyId, setPendingCohostPropertyId] = useState<string | null>(null);

  // Transform nested backend data to flat form data
  const formDefaultValues = property ? {
    title: property.title,
    description: property.description,
    pricePerNight: property.pricePerNight,
    currency: property.currency,
    salePrice: property.salePrice,
    propertyType: property.propertyType,
    listingType: property.listingType,
    airbnbUrl: property.airbnbUrl || '',
    icalUrlAirbnb: property.icalUrlAirbnb || '',
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
    // Sanitize data: convert nulls to undefined for optional fields
    const sanitizedData = {
      ...data,
      salePrice: data.salePrice ?? undefined,
    };
    return updateProperty.mutateAsync({ id, data: sanitizedData });
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
              <PropertyStatusBadge status={property.status as PropertyStatus} />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground truncate">{property.title}</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {property.slug ? (
            <Link href={`/propiedades/${property.slug}`} target="_blank" className="flex-1 sm:flex-initial">
              <Button variant="outline" className="w-full sm:w-auto">
                <Eye className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Vista Previa</span>
                <span className="sm:hidden">Preview</span>
              </Button>
            </Link>
          ) : (
            <Button variant="outline" className="w-full sm:w-auto" disabled title="El slug de la propiedad no está disponible">
              <Eye className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Vista Previa</span>
              <span className="sm:hidden">Preview</span>
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
                    // Use direct Cloudinary upload (bypasses Vercel size limits)
                    await uploadImagesAsync({ propertyId: id, files });
                  } catch (error) {
                    console.error('Error uploading images:', error);
                  }
                }}
                disabled={isUploadingImages}
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

      <CohostInstructionsDialog
        open={showCohostDialog}
        onClose={() => setShowCohostDialog(false)}
        onConfirm={() => {
          if (pendingCohostPropertyId) {
            submitForApproval.mutate(pendingCohostPropertyId, {
              onSuccess: () => setShowCohostDialog(false),
            });
          }
        }}
        isConfirming={submitForApproval.isPending}
      />
    </div>
  );
}
