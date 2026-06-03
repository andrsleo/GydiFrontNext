'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateProperty, useCloudinaryDirectUpload, useUploadVideos, usePropertyById } from '@/features/properties';
import { PropertyForm, ImageUploader, VideoUploader, ImageOrganizer } from '@/features/properties/components';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Upload, ArrowRight, ClipboardList, ImageIcon, SlidersHorizontal, Video, Check } from 'lucide-react';
import Link from 'next/link';
import { CreatePropertyFormData } from '@/features/properties/schemas';
import { useTranslation } from '@/hooks/use-translation';

type WizardStep = 'details' | 'images' | 'organize' | 'videos';

const STEPS: { key: WizardStep; icon: React.ElementType; labelKey: string; descKey: string }[] = [
  { key: 'details',  icon: ClipboardList,     labelKey: 'page.steps.details',  descKey: 'page.cards.detailsDesc'  },
  { key: 'images',   icon: ImageIcon,          labelKey: 'page.steps.images',   descKey: 'page.cards.imagesDesc'   },
  { key: 'organize', icon: SlidersHorizontal,  labelKey: 'page.steps.organize', descKey: 'page.cards.organizeDesc' },
  { key: 'videos',   icon: Video,              labelKey: 'page.steps.videos',   descKey: 'page.cards.videosDesc'   },
];

function getStepIndex(step: WizardStep): number {
  return STEPS.findIndex((s) => s.key === step);
}

export default function NewPropertyPage() {
  const router = useRouter();
  const { t } = useTranslation('properties');
  const [step, setStep] = useState<WizardStep>('details');
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [imagesUploaded, setImagesUploaded] = useState(false);

  const createProperty = useCreateProperty();
  const { uploadImagesAsync, isUploading: isUploadingImages } = useCloudinaryDirectUpload();
  const uploadVideos = useUploadVideos();

  const { data: property } = usePropertyById({
    id: propertyId || '',
    enabled: !!propertyId && imagesUploaded,
  });

  const currentStepIndex = getStepIndex(step);

  const handleCreateProperty = async (data: CreatePropertyFormData) => {
    const sanitizedData = { ...data, pricePerNight: data.pricePerNight ?? undefined, salePrice: data.salePrice ?? undefined };
    const property = await createProperty.mutateAsync(sanitizedData);
    setPropertyId(property.id);
    setStep('images');
    return property;
  };

  const handleUploadImages = async () => {
    if (!propertyId || images.length === 0) return;
    try {
      await uploadImagesAsync({ propertyId, files: images });
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
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/propiedades">
          <Button variant="ghost" size="icon" aria-label="Volver">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('page.title')}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t('page.subtitle')}</p>
        </div>
      </div>

      {/* Progress Stepper */}
      <nav aria-label="Pasos del formulario">
        <ol className="flex items-start gap-0">
          {STEPS.map((s, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent  = index === currentStepIndex;
            const isUpcoming  = index > currentStepIndex;
            const Icon = s.icon;

            return (
              <li key={s.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  {/* Circle */}
                  <div
                    className={[
                      'w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                      isCompleted ? 'bg-primary border-primary text-primary-foreground'       : '',
                      isCurrent   ? 'bg-primary border-primary text-primary-foreground shadow-md scale-110' : '',
                      isUpcoming  ? 'bg-background border-muted-foreground/30 text-muted-foreground/50'   : '',
                    ].join(' ')}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    {isCompleted
                      ? <Check className="h-4 w-4" />
                      : <Icon className="h-4 w-4" />}
                  </div>
                  {/* Label */}
                  <span
                    className={[
                      'text-xs font-medium hidden sm:block transition-colors duration-300',
                      isCurrent   ? 'text-primary'              : '',
                      isCompleted ? 'text-primary/70'           : '',
                      isUpcoming  ? 'text-muted-foreground/50'  : '',
                    ].join(' ')}
                  >
                    {t(s.labelKey)}
                  </span>
                </div>

                {/* Connector line — skip after last item */}
                {index < STEPS.length - 1 && (
                  <div className="flex-1 mx-2 mt-[-18px]">
                    <div
                      className={[
                        'h-0.5 w-full rounded transition-colors duration-500',
                        isCompleted ? 'bg-primary' : 'bg-muted-foreground/20',
                      ].join(' ')}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Step content */}

      {/* Step 1: Property Details */}
      {step === 'details' && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <ClipboardList className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{t('page.cards.detailsTitle')}</CardTitle>
                <CardDescription className="mt-0.5">{t('page.cards.detailsDesc')}</CardDescription>
              </div>
            </div>
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
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <ImageIcon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{t('page.cards.imagesTitle')}</CardTitle>
                <CardDescription className="mt-0.5">{t('page.cards.imagesDesc')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUploader maxFiles={20} minFiles={4} onFilesSelected={setImages} />
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep('details')}>
                {t('page.buttons.back')}
              </Button>
              <Button
                onClick={handleUploadImages}
                disabled={images.length === 0 || isUploadingImages}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploadingImages
                  ? t('page.buttons.uploading')
                  : t('page.buttons.uploadImages', { count: String(images.length) })}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Organize Images */}
      {step === 'organize' && property && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{t('page.cards.organizeTitle')}</CardTitle>
                <CardDescription className="mt-0.5">{t('page.cards.organizeDesc')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageOrganizer
              propertyId={propertyId!}
              images={property.images}
              coverImageId={property.coverImageId}
            />
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep('images')}>
                {t('page.buttons.back')}
              </Button>
              <Button onClick={() => setStep('videos')}>
                {t('page.buttons.continue')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Upload Videos */}
      {step === 'videos' && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Video className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{t('page.cards.videosTitle')}</CardTitle>
                <CardDescription className="mt-0.5">{t('page.cards.videosDesc')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <VideoUploader maxFiles={2} onFilesSelected={setVideos} />
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep('organize')}>
                {t('page.buttons.back')}
              </Button>
              <Button onClick={handleUploadVideos} disabled={uploadVideos.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {uploadVideos.isPending
                  ? t('page.buttons.uploading')
                  : videos.length > 0
                    ? t('page.buttons.uploadVideos', { count: String(videos.length) })
                    : t('page.buttons.skipAndFinish')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
