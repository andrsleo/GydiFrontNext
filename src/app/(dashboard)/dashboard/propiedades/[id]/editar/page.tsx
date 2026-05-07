'use client';

import { use, useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useRouter } from 'next/navigation';
import { usePropertyById, useUpdateProperty, useUploadVideos, useCloudinaryDirectUpload } from '@/features/properties';
import { PropertyForm, ImageUploader, VideoUploader, PropertyGallery, ImageOrganizer, VideoOrganizer, PropertyStatusBadge } from '@/features/properties/components';
import type { PropertyFormHandle } from '@/features/properties/components/property-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Eye, Save, Pencil } from 'lucide-react';
import Link from 'next/link';
import { UpdatePropertyFormData } from '@/features/properties/schemas';
import { PropertyStatus } from '@/features/properties/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSubmitForApproval } from '@/features/properties/hooks';
import { CohostInstructionsDialog } from '@/features/properties/components/cohost-instructions-dialog';
import { AddPaymentMethodDialog } from '@/features/subscriptions/components/add-payment-method-dialog';
import { useHostHasPaymentMethod } from '@/features/subscriptions/hooks/use-host-payment-method';

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: property, isLoading } = usePropertyById({ id });
  const { hasHostPaymentMethod } = useHostHasPaymentMethod();
  const updateProperty = useUpdateProperty({
    onCohostRequired: (propertyId) => {
      setPendingCohostPropertyId(propertyId);
      if (hasHostPaymentMethod) {
        setShowCohostDialog(true);
      } else {
        setShowAddCardDialog(true);
      }
    },
  });
  const { uploadImagesAsync, isUploading: isUploadingImages, progress: uploadProgress } = useCloudinaryDirectUpload();
  const uploadVideos = useUploadVideos();
  const submitForApproval = useSubmitForApproval();
  const [showCohostDialog, setShowCohostDialog] = useState(false);
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const [pendingCohostPropertyId, setPendingCohostPropertyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const formRef = useRef<PropertyFormHandle>(null);

  const handleSave = () => {
    if (activeTab !== 'details') {
      // flushSync forces React to synchronously commit the tab switch,
      // so PropertyForm is mounted and formRef.current is set before submit() runs.
      flushSync(() => setActiveTab('details'));
    }
    formRef.current?.submit();
  };

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
      pricePerNight: data.pricePerNight ?? undefined,
      salePrice: data.salePrice ?? undefined,
    };
    return updateProperty.mutateAsync({ id, data: sanitizedData });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <Pencil className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-base font-medium">Propiedad no encontrada</p>
        <p className="text-sm text-muted-foreground">Verifica que la URL sea correcta o vuelve al listado.</p>
        <Link href="/dashboard/propiedades">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a propiedades
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-3 sm:space-y-0 sm:flex sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
          <Link href="/dashboard/propiedades" className="mt-0.5 shrink-0">
            <Button variant="ghost" size="icon" aria-label="Volver a propiedades">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <div className="flex items-center gap-1.5">
                <Pencil className="h-4 w-4 text-muted-foreground shrink-0" />
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Editar Propiedad</h1>
              </div>
              <PropertyStatusBadge status={property.status as PropertyStatus} />
            </div>
            <p className="text-sm text-muted-foreground truncate max-w-md">{property.title}</p>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto sm:shrink-0 ml-10 sm:ml-0">
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
          <Button
            onClick={handleSave}
            disabled={updateProperty.isPending}
            className="flex-1 sm:flex-initial"
          >
            <Save className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">
              {updateProperty.isPending ? 'Guardando...' : 'Guardar cambios'}
            </span>
            <span className="sm:hidden">{updateProperty.isPending ? '...' : 'Guardar'}</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="details" className="gap-1.5">
            <span className="hidden sm:inline">Detalles de la propiedad</span>
            <span className="sm:hidden">Detalles</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="gap-1.5">
            <span className="hidden sm:inline">
              Fotos y videos
              {(property.imageCount > 0 || property.videoCount > 0) && (
                <span className="ml-1.5 text-xs bg-muted-foreground/20 rounded-full px-1.5 py-0.5">
                  {property.imageCount + property.videoCount}
                </span>
              )}
            </span>
            <span className="sm:hidden">Media ({property.imageCount + property.videoCount})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Información de la Propiedad</CardTitle>
              <CardDescription>Actualiza los detalles de tu propiedad. Los cambios se guardan con el botón de arriba.</CardDescription>
            </CardHeader>
            <CardContent>
              <PropertyForm
                ref={formRef}
                mode="edit"
                defaultValues={formDefaultValues}
                onSubmit={handleUpdateProperty}
                isSubmitting={updateProperty.isPending}
                hideSubmitButton
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-6 space-y-5">
          {/* Organize Images */}
          {property.images.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Organizar Fotos</CardTitle>
                <CardDescription>Arrastra para reordenar. Haz clic en una imagen para marcarla como portada.</CardDescription>
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
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Administrar Videos</CardTitle>
                <CardDescription>Elimina los videos que ya no desees mostrar en tu propiedad.</CardDescription>
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

          {/* Current Media Gallery */}
          {(property.images.length > 0 || property.videos.length > 0) && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Vista Previa</CardTitle>
                <CardDescription>Así se verán las fotos y videos en tu listado.</CardDescription>
              </CardHeader>
              <CardContent>
                <PropertyGallery images={property.images} videos={property.videos} title={property.title} />
              </CardContent>
            </Card>
          )}

          {/* Upload New Images */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Agregar Imágenes</CardTitle>
              <CardDescription>
                {property.imageCount < 20
                  ? `Puedes subir hasta ${20 - property.imageCount} imágenes más. Actualmente tienes ${property.imageCount} de 20.`
                  : 'Has alcanzado el límite de 20 imágenes. Elimina alguna para agregar nuevas.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                maxFiles={20 - property.imageCount}
                onFilesSelected={async (files) => {
                  try {
                    await uploadImagesAsync({ propertyId: id, files });
                  } catch (error) {
                    console.error('Error uploading images:', error);
                  }
                }}
                disabled={isUploadingImages || property.imageCount >= 20}
              />
            </CardContent>
          </Card>

          {/* Upload New Videos */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Agregar Videos</CardTitle>
              <CardDescription>
                {property.videoCount < 2
                  ? `Puedes subir hasta ${2 - property.videoCount} video${2 - property.videoCount !== 1 ? 's' : ''} más. Actualmente tienes ${property.videoCount} de 2.`
                  : 'Has alcanzado el límite de 2 videos. Elimina alguno para agregar nuevos.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoUploader
                maxFiles={2 - property.videoCount}
                onFilesSelected={async (files) => {
                  try {
                    await uploadVideos.mutateAsync({ propertyId: id, files });
                  } catch (error) {
                    console.error('Error uploading videos:', error);
                  }
                }}
                disabled={uploadVideos.isPending || property.videoCount >= 2}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddPaymentMethodDialog
        open={showAddCardDialog}
        onOpenChange={setShowAddCardDialog}
        onSuccess={() => setShowCohostDialog(true)}
        description="Para enviar tu propiedad a revisión necesitas agregar una tarjeta. La plataforma cobra comisiones cuando se realizan reservas en tu propiedad."
      />

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
