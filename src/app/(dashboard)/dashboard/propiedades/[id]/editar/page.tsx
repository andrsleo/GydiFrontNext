'use client';

import { use, useState, useRef } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { flushSync } from 'react-dom';
import {
  usePropertyById,
  useUpdateProperty,
  useUploadVideos,
  useCloudinaryDirectUpload,
} from '@/features/properties';
import {
  PropertyForm,
  ImageUploader,
  VideoUploader,
  PropertyGallery,
  ImageOrganizer,
  PropertyStatusBadge,
} from '@/features/properties/components';
import type { PropertyFormHandle } from '@/features/properties/components/property-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Eye,
  Save,
  Pencil,
  ClipboardList,
  ImageIcon,
  SlidersHorizontal,
  Video,
  Upload,
  CheckCircle2,
  AlertCircle,
  Play,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { UpdatePropertyFormData } from '@/features/properties/schemas';
import { PropertyStatus } from '@/features/properties/types';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AddPaymentMethodDialog } from '@/features/subscriptions/components/add-payment-method-dialog';
import { CollaborationSettingsPanel } from '@/features/collaborations/components';
import { cn } from '@/lib/utils';

const MIN_IMAGES = 4;
const MAX_IMAGES = 20;
const MAX_VIDEOS = 2;

export default function EditPropertyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = use(params);
  const { tab: initialTab } = use(searchParams);
  const { t } = useTranslation('properties');
  const { data: property, isLoading } = usePropertyById({ id });

  const updateProperty = useUpdateProperty();
  const { uploadImagesAsync, isUploading: isUploadingImages } = useCloudinaryDirectUpload();
  const uploadVideos = useUploadVideos();

  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab ?? 'details');

  // Staged files — selected in the uploader but not yet pushed to the server
  const [stagedImages, setStagedImages] = useState<File[]>([]);
  const [stagedVideos, setStagedVideos] = useState<File[]>([]);

  // Bump these keys to unmount/remount the uploaders (clears their internal state)
  const [imageUploaderKey, setImageUploaderKey] = useState(0);
  const [videoUploaderKey, setVideoUploaderKey] = useState(0);

  const formRef = useRef<PropertyFormHandle>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSave = () => {
    // The collaborations tab manages its own save flow
    if (activeTab === 'collaborations') return;
    if (activeTab !== 'details') {
      // flushSync: ensure PropertyForm is mounted before submit() runs
      flushSync(() => setActiveTab('details'));
    }
    formRef.current?.submit();
  };

  const handleUploadImages = async () => {
    if (!stagedImages.length) return;
    try {
      await uploadImagesAsync({ propertyId: id, files: stagedImages });
      setStagedImages([]);
      setImageUploaderKey((k) => k + 1);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleUploadVideos = async () => {
    if (!stagedVideos.length) return;
    try {
      await uploadVideos.mutateAsync({ propertyId: id, files: stagedVideos });
      setStagedVideos([]);
      setVideoUploaderKey((k) => k + 1);
    } catch (error) {
      console.error('Error uploading videos:', error);
    }
  };

  const handleUpdateProperty = async (data: UpdatePropertyFormData) => {
    const sanitizedData = {
      ...data,
      pricePerNight: data.pricePerNight ?? undefined,
      salePrice: data.salePrice ?? undefined,
    };
    return updateProperty.mutateAsync({ id, data: sanitizedData });
  };

  // ── Form default values ────────────────────────────────────────────────────

  const formDefaultValues = property
    ? {
        title: property.title,
        description: property.description,
        pricePerNight: property.pricePerNight,
        currency: property.currency,
        salePrice: property.salePrice,
        propertyType: property.propertyType,
        listingType: property.listingType,
        country: property.location?.country || '',
        city: property.location?.city || '',
        address: property.location?.address || '',
        postalCode: property.location?.postalCode || '',
        bedrooms: property.specs?.bedrooms || 1,
        bathrooms: property.specs?.bathrooms || 1,
        maxGuests: property.specs?.maxGuests || 2,
        amenities: property.amenities || [],
      }
    : undefined;

  // ── Loading skeleton ───────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
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

  // ── Not found ──────────────────────────────────────────────────────────────

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <Pencil className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-base font-medium">{t('editPage.notFound.title')}</p>
        <p className="text-sm text-muted-foreground">
          {t('editPage.notFound.desc')}
        </p>
        <Link href="/dashboard/propiedades">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('editPage.notFound.back')}
          </Button>
        </Link>
      </div>
    );
  }

  // ── Derived values ─────────────────────────────────────────────────────────

  const imageSlotsLeft = MAX_IMAGES - property.imageCount;
  const videoSlotsLeft = MAX_VIDEOS - property.videoCount;
  const meetsMinImages = property.imageCount >= MIN_IMAGES;

  // ── Page ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
      {/* ── Header ── */}
      <div className="space-y-3 sm:space-y-0 sm:flex sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
          <Link href="/dashboard/propiedades" className="mt-0.5 shrink-0">
            <Button variant="ghost" size="icon" aria-label={t('editPage.ariaBack')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <div className="flex items-center gap-1.5">
                <Pencil className="h-4 w-4 text-muted-foreground shrink-0" />
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                  {t('editPage.title')}
                </h1>
              </div>
              <PropertyStatusBadge status={property.status as PropertyStatus} />
            </div>
            <p className="text-sm text-muted-foreground truncate max-w-md">{property.title}</p>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto sm:shrink-0">
          {property.slug ? (
            <Link
              href={`/propiedades/${property.slug}`}
              target="_blank"
              className="flex-1 sm:flex-initial"
            >
              <Button variant="outline" className="w-full sm:w-auto">
                <Eye className="h-4 w-4 mr-2" />
                {t('editPage.header.preview')}
              </Button>
            </Link>
          ) : (
            <Button variant="outline" className="w-full sm:w-auto" disabled>
              <Eye className="h-4 w-4 mr-2" />
              {t('editPage.header.preview')}
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={updateProperty.isPending}
            className="flex-1 sm:flex-initial"
          >
            <Save className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">
              {updateProperty.isPending ? t('editPage.header.saving') : t('editPage.header.save')}
            </span>
            <span className="sm:hidden">{updateProperty.isPending ? '...' : t('editPage.header.saveShort')}</span>
          </Button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>

        {/* Custom card-style tab navigation */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {/* Details tab */}
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={cn(
              'group relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden',
              'sm:flex-row sm:items-center sm:text-left sm:gap-3 sm:p-4',
              activeTab === 'details'
                ? 'border-primary/40 bg-primary/5 shadow-sm'
                : 'border-border bg-card hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm'
            )}
          >
            <div
              className={cn(
                'shrink-0 rounded-lg p-1.5 transition-colors duration-200 sm:p-2',
                activeTab === 'details'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
              )}
            >
              <ClipboardList className="h-4 w-4" />
            </div>
            <div className="min-w-0 sm:flex-1">
              <p
                className={cn(
                  'text-xs font-semibold leading-tight sm:text-sm',
                  activeTab === 'details' ? 'text-primary' : 'text-foreground'
                )}
              >
                <span className="hidden sm:inline">{t('editPage.tabs.details')}</span>
                <span className="sm:hidden">{t('editPage.tabs.detailsShort')}</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 sm:text-xs sm:block hidden">
                {t('editPage.tabs.detailsDesc')}
              </p>
            </div>
            {activeTab === 'details' && (
              <>
                <div className="absolute bottom-0 inset-x-4 h-0.5 rounded-full bg-primary sm:hidden" />
                <div className="hidden sm:block w-1 h-6 shrink-0 rounded-full bg-primary" />
              </>
            )}
          </button>

          {/* Media tab */}
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={cn(
              'group relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden',
              'sm:flex-row sm:items-center sm:text-left sm:gap-3 sm:p-4',
              activeTab === 'media'
                ? 'border-primary/40 bg-primary/5 shadow-sm'
                : 'border-border bg-card hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm'
            )}
          >
            <div
              className={cn(
                'relative shrink-0 rounded-lg p-1.5 transition-colors duration-200 sm:p-2',
                activeTab === 'media'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
              )}
            >
              <ImageIcon className="h-4 w-4" />
              {(property.imageCount > 0 || property.videoCount > 0) && (
                <span
                  className={cn(
                    'absolute -top-1.5 -right-1.5 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none sm:hidden',
                    activeTab === 'media'
                      ? 'bg-primary-foreground text-primary'
                      : 'bg-foreground text-background'
                  )}
                >
                  {property.imageCount + property.videoCount}
                </span>
              )}
            </div>
            <div className="min-w-0 sm:flex-1">
              <div className="flex items-center justify-center gap-1.5 sm:justify-start sm:gap-2">
                <p
                  className={cn(
                    'text-xs font-semibold leading-tight sm:text-sm',
                    activeTab === 'media' ? 'text-primary' : 'text-foreground'
                  )}
                >
                  <span className="hidden sm:inline">{t('editPage.tabs.media')}</span>
                  <span className="sm:hidden">{t('editPage.tabs.mediaShort')}</span>
                </p>
                {(property.imageCount > 0 || property.videoCount > 0) && (
                  <span
                    className={cn(
                      'hidden sm:inline text-xs rounded-full px-1.5 py-0.5 font-medium',
                      activeTab === 'media'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted-foreground/15 text-muted-foreground'
                    )}
                  >
                    {property.imageCount + property.videoCount}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5 sm:text-xs sm:block hidden">
                {t('editPage.tabs.mediaDesc', { images: property.imageCount, videos: property.videoCount })}
              </p>
            </div>
            {activeTab === 'media' && (
              <>
                <div className="absolute bottom-0 inset-x-4 h-0.5 rounded-full bg-primary sm:hidden" />
                <div className="hidden sm:block w-1 h-6 shrink-0 rounded-full bg-primary" />
              </>
            )}
          </button>

          {/* Collaborations tab */}
          <button
            type="button"
            onClick={() => setActiveTab('collaborations')}
            className={cn(
              'group relative col-span-2 flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden',
              'sm:col-span-1 sm:flex-row sm:items-center sm:text-left sm:gap-3 sm:p-4',
              activeTab === 'collaborations'
                ? 'border-primary/40 bg-primary/5 shadow-sm'
                : 'border-border bg-card hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm'
            )}
          >
            <div
              className={cn(
                'shrink-0 rounded-lg p-1.5 transition-colors duration-200 sm:p-2',
                activeTab === 'collaborations'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
              )}
            >
              <Users className="h-4 w-4" />
            </div>
            <div className="min-w-0 sm:flex-1">
              <p
                className={cn(
                  'text-xs font-semibold leading-tight sm:text-sm',
                  activeTab === 'collaborations' ? 'text-primary' : 'text-foreground'
                )}
              >
                <span className="hidden sm:inline">Colaboraciones</span>
                <span className="sm:hidden">Colabs</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 sm:text-xs sm:block hidden">
                Creadores de contenido
              </p>
            </div>
            {activeTab === 'collaborations' && (
              <>
                <div className="absolute bottom-0 inset-x-4 h-0.5 rounded-full bg-primary sm:hidden" />
                <div className="hidden sm:block w-1 h-6 shrink-0 rounded-full bg-primary" />
              </>
            )}
          </button>
        </div>

        {/* ── Tab: Details ── */}
        <TabsContent value="details" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <ClipboardList className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{t('editPage.details.cardTitle')}</CardTitle>
                  <CardDescription className="mt-0.5">
                    {t('editPage.details.cardDesc')}
                  </CardDescription>
                </div>
              </div>
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

        {/* ── Tab: Media ── */}
        <TabsContent value="media" className="mt-6 space-y-5">

          {/* Image count status banner */}
          <div
            className={cn(
              'flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium',
              meetsMinImages
                ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400'
                : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
            )}
          >
            {meetsMinImages ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>
              {meetsMinImages
                ? t('editPage.media.bannerOk', { count: property.imageCount, min: MIN_IMAGES })
                : t('editPage.media.bannerWarn', { count: property.imageCount, min: MIN_IMAGES, remaining: MIN_IMAGES - property.imageCount })}
            </span>
          </div>

          {/* Organize Images */}
          {property.images.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{t('editPage.media.organizeTitle')}</CardTitle>
                    <CardDescription className="mt-0.5">
                      {t('editPage.media.organizeDesc')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ImageOrganizer
                  key={`${id}-${property.images.map((img) => img.displayOrder).join('-')}-${property.coverImageId}`}
                  propertyId={id}
                  images={property.images}
                  coverImageId={property.coverImageId}
                />
              </CardContent>
            </Card>
          )}

          {/* Current Media Gallery */}
          {(property.images.length > 0 || property.videos.length > 0) && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <Play className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{t('editPage.media.previewTitle')}</CardTitle>
                    <CardDescription className="mt-0.5">
                      {t('editPage.media.previewDesc')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <PropertyGallery
                  images={property.images}
                  videos={property.videos}
                  title={property.title}
                />
              </CardContent>
            </Card>
          )}

          {/* Upload New Images */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <ImageIcon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{t('editPage.media.addImagesTitle')}</CardTitle>
                  <CardDescription className="mt-0.5">
                    {imageSlotsLeft > 0
                      ? t('editPage.media.addImagesSlotsAvail', { count: imageSlotsLeft, current: property.imageCount, max: MAX_IMAGES })
                      : t('editPage.media.addImagesLimit', { max: MAX_IMAGES })}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUploader
                key={imageUploaderKey}
                maxFiles={imageSlotsLeft}
                onFilesSelected={setStagedImages}
                disabled={isUploadingImages || imageSlotsLeft <= 0}
              />
              {stagedImages.length > 0 && (
                <Button
                  onClick={handleUploadImages}
                  disabled={isUploadingImages}
                  className="w-full sm:w-auto"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploadingImages
                    ? t('editPage.media.uploading')
                    : t('editPage.media.uploadImages', { count: stagedImages.length })}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Upload New Videos */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Video className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{t('editPage.media.addVideosTitle')}</CardTitle>
                  <CardDescription className="mt-0.5">
                    {videoSlotsLeft > 0
                      ? t('editPage.media.addVideosSlotsAvail', { count: videoSlotsLeft, current: property.videoCount, max: MAX_VIDEOS })
                      : t('editPage.media.addVideosLimit', { max: MAX_VIDEOS })}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <VideoUploader
                key={videoUploaderKey}
                maxFiles={videoSlotsLeft}
                onFilesSelected={setStagedVideos}
                disabled={uploadVideos.isPending || videoSlotsLeft <= 0}
              />
              {stagedVideos.length > 0 && (
                <Button
                  onClick={handleUploadVideos}
                  disabled={uploadVideos.isPending}
                  className="w-full sm:w-auto"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadVideos.isPending
                    ? t('editPage.media.uploading')
                    : t('editPage.media.uploadVideos', { count: stagedVideos.length })}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab: Collaborations ── */}
        <TabsContent value="collaborations" className="mt-6">
          <CollaborationSettingsPanel
            propertyId={Number(id)}
            isPublished={property.status === 'PUBLISHED'}
          />
        </TabsContent>
      </Tabs>

      <AddPaymentMethodDialog
        open={showAddCardDialog}
        onOpenChange={setShowAddCardDialog}
        description={t('editPage.addCardDesc')}
      />
    </div>
  );
}
