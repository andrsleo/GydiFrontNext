'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateProperty, useUploadImages, useUploadVideos, usePropertyById } from '@/features/properties';
import { PropertyForm, ImageUploader, VideoUploader, ImageOrganizer } from '@/features/properties/components';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Upload, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CreatePropertyFormData } from '@/features/properties/schemas';
import { toast } from 'sonner';

export default function NewPropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState<'details' | 'images' | 'organize' | 'videos'>('details');
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [imagesUploaded, setImagesUploaded] = useState(false);

  const createProperty = useCreateProperty();
  const uploadImages = useUploadImages();
  const uploadVideos = useUploadVideos();

  // Fetch property detail after images are uploaded to get image data
  const { data: property } = usePropertyById({
    id: propertyId || '',
    enabled: !!propertyId && imagesUploaded
  });

  const handleCreateProperty = async (data: CreatePropertyFormData) => {
    const property = await createProperty.mutateAsync(data);
    setPropertyId(property.id);
    setStep('images');
    return property;
  };

  const handleUploadImages = async () => {
    if (!propertyId || images.length === 0) return;

    try {
      await uploadImages.mutateAsync({ propertyId, files: images });
      setImagesUploaded(true);
      setStep('organize');
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleUploadVideos = async () => {
    if (!propertyId) return;

    try {
      if (videos.length > 0) {
        await uploadVideos.mutateAsync({ propertyId, files: videos });
      }
      router.push(`/dashboard/propiedades/${propertyId}/editar`);
    } catch (error) {
      console.error('Error uploading videos:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/propiedades">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Nueva Propiedad</h1>
          <p className="text-muted-foreground">
            Crea una nueva propiedad en 3 pasos
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-2 ${step === 'details' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'details' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            1
          </div>
          <span className="font-medium hidden sm:inline">Detalles</span>
        </div>
        <div className="flex-1 h-px bg-border" />
        <div className={`flex items-center gap-2 ${step === 'images' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'images' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            2
          </div>
          <span className="font-medium hidden sm:inline">Imágenes</span>
        </div>
        <div className="flex-1 h-px bg-border" />
        <div className={`flex items-center gap-2 ${step === 'organize' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'organize' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            3
          </div>
          <span className="font-medium hidden sm:inline">Organizar</span>
        </div>
        <div className="flex-1 h-px bg-border" />
        <div className={`flex items-center gap-2 ${step === 'videos' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'videos' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            4
          </div>
          <span className="font-medium hidden sm:inline">Videos</span>
        </div>
      </div>

      {/* Step 1: Property Details */}
      {step === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle>Información de la Propiedad</CardTitle>
            <CardDescription>
              Completa los detalles básicos de tu propiedad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PropertyForm
              mode="create"
              onSubmit={handleCreateProperty}
              isSubmitting={createProperty.isPending}
            />
          </CardContent>
        </Card>
      )}

      {/* Step 2: Upload Images */}
      {step === 'images' && (
        <Card>
          <CardHeader>
            <CardTitle>Imágenes de la Propiedad</CardTitle>
            <CardDescription>
              Sube hasta 20 imágenes (mínimo 4 para publicar)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUploader
              maxFiles={20}
              onFilesSelected={setImages}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('details')}
              >
                Atrás
              </Button>
              <Button
                onClick={handleUploadImages}
                disabled={images.length === 0 || uploadImages.isPending}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploadImages.isPending ? 'Subiendo...' : `Subir ${images.length} Imágenes`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Organize Images */}
      {step === 'organize' && property && (
        <Card>
          <CardHeader>
            <CardTitle>Organizar Fotos</CardTitle>
            <CardDescription>
              Reordena las imágenes y selecciona la foto de portada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageOrganizer
              propertyId={propertyId!}
              images={property.images}
              coverImageId={property.coverImageId}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('images')}
              >
                Atrás
              </Button>
              <Button
                onClick={() => setStep('videos')}
              >
                Continuar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Upload Videos */}
      {step === 'videos' && (
        <Card>
          <CardHeader>
            <CardTitle>Videos de la Propiedad</CardTitle>
            <CardDescription>
              Sube hasta 2 videos (opcional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <VideoUploader
              maxFiles={2}
              onFilesSelected={setVideos}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('organize')}
              >
                Atrás
              </Button>
              <Button
                onClick={handleUploadVideos}
                disabled={uploadVideos.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {uploadVideos.isPending ? 'Subiendo...' :
                  videos.length > 0 ? `Subir ${videos.length} Videos y Finalizar` : 'Omitir y Finalizar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
