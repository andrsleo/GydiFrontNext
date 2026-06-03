'use client';

import { use, useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePropertyDetail } from '@/features/properties';
import { PropertyGallery } from '@/features/properties/components';
import { BookingModal } from '@/features/bookings';
import { PropertyCalendar } from '@/features/calendar';
import { StripeProvider } from '@/lib/stripe/stripe-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MapPin, Bed, Bath, Users, Calendar, DollarSign, Film } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { PropertyListingType, LISTING_TYPE_LABELS } from '@/features/properties/types';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/store/auth-store';
import { useHostHasPaymentMethod } from '@/features/subscriptions/hooks/use-host-payment-method';
import { usePropertyContent } from '@/features/content/hooks/use-property-content';
import { ContentCard } from '@/features/content/components/content-card';
import { usePropertySocialProof } from '@/features/properties/hooks/use-property-social-proof';

function PropertyDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const refParam = searchParams.get('ref');
  // Phase 4 — Social Commerce: content post that originated this visit
  const contentIdParam = searchParams.get('contentId');
  const contentPostId = contentIdParam ? Number(contentIdParam) : undefined;

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { user } = useAuthStore();
  const { hasHostPaymentMethod, isLoading: isLoadingPayment } = useHostHasPaymentMethod();

  // Determine if ref is a valid numeric ID or a legacy JWE token
  const isNumericRef = refParam != null && /^\d+$/.test(refParam);
  const [referralLinkId, setReferralLinkId] = useState<string>(isNumericRef ? refParam : '');

  const { data: property, isLoading, error } = usePropertyDetail({ slug });
  const propertyId = property?.id ? Number(property.id) : 0;
  const { data: contentPage, isLoading: isLoadingContent } = usePropertyContent(propertyId);
  const { data: socialProof } = usePropertySocialProof(propertyId || undefined);

  // Resolve referralLinkId based on the ref parameter type
  useEffect(() => {
    // MOCK DATA - Las propiedades mock no tienen referral links reales en el backend
    if (String(property?.id ?? '').startsWith('mock-airbnb-')) {
      setReferralLinkId('0');
      return;
    }

    if (isNumericRef) {
      // New flow: ref is already a numeric referralLinkId
      setReferralLinkId(refParam);
    } else if (refParam && !isNumericRef && property?.id) {
      // Legacy flow: ref is a JWE token from old cached URLs
      // Resolve it to get the numeric referralLinkId
      apiClient
        .post('/api/v1/referrals/resolve', { token: refParam })
        .then((response) => {
          setReferralLinkId(response.data.referralLinkId.toString());
        })
        .catch((err) => {
          console.error('Error resolving referral token, falling back to system link:', err);
          // Fallback to system link if token resolution fails
          return apiClient
            .get(`/api/v1/referrals/public/system-link/${property.id}`)
            .then((response) => {
              setReferralLinkId(response.data.referralLinkId.toString());
            });
        })
        .catch((error) => {
          console.error('Error fetching system referral link:', error);
          setReferralLinkId('0');
        });
    } else if (!refParam && property?.id) {
      // User arrived organically (no referral link)
      // Fetch or create system referral link
      apiClient
        .get(`/api/v1/referrals/public/system-link/${property.id}`)
        .then((response) => {
          setReferralLinkId(response.data.referralLinkId.toString());
        })
        .catch((error) => {
          console.error('Error fetching system referral link:', error);
          setReferralLinkId('0');
        });
    }
  }, [refParam, isNumericRef, property?.id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Skeleton className="h-[500px] mb-6 sm:mb-8" />
        <Skeleton className="h-[200px]" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Propiedad no encontrada</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            La propiedad que buscas no existe o no está disponible.
          </p>
        </div>
      </div>
    );
  }

  // MOCK DATA - Las propiedades mock no permiten reservas reales
  const isMockProperty = slug.startsWith('mock-airbnb-');

  // Determine if the current user is the property owner and lacks a payment method
  const isOwner =
    user?.id != null &&
    property?.hostId != null &&
    String(user.id) === String(property.hostId);
  const ownerMissingPaymentMethod = isOwner && !hasHostPaymentMethod && !isLoadingPayment;
  const isBookingDisabled = property.status !== 'PUBLISHED' || ownerMissingPaymentMethod;

  const handleBookingClick = () => {
    if (!user) {
      router.push(`/login?callbackUrl=/propiedades/${slug}`);
      return;
    }
    if (!isBookingDisabled) {
      setIsBookingModalOpen(true);
    }
  };

  // Badge configuration for listing type
  const listingTypeBadgeConfig = {
    [PropertyListingType.SHORT_TERM_RENTAL]: {
      className: 'bg-blue-500 text-white hover:bg-blue-600',
    },
    [PropertyListingType.SALE]: {
      className: 'bg-green-500 text-white hover:bg-green-600',
    },
    [PropertyListingType.BOTH]: {
      className: 'bg-purple-500 text-white hover:bg-purple-600',
    },
  };

  const listingConfig = listingTypeBadgeConfig[property.listingType];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Gallery */}
      <div className="mb-6 sm:mb-8">
        <PropertyGallery images={property.images} videos={property.videos} title={property.title} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-4 sm:space-y-6">
          {/* Title and Status */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant={property.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                {property.status}
              </Badge>
              <Badge className="bg-slate-800 text-white hover:bg-slate-900">
                {property.propertyType}
              </Badge>
              <Badge className={listingConfig.className}>
                {LISTING_TYPE_LABELS[property.listingType]}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-sm sm:text-base text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{property.location.city}, {property.location.country}</span>
            </div>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <span className="text-sm sm:text-base">{property.specs.bedrooms} habitaciones</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <span className="text-sm sm:text-base">{property.specs.bathrooms} baños</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <span className="text-sm sm:text-base">{property.specs.maxGuests} huéspedes</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">Descripción</h2>
            <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap">
              {property.description || 'Sin descripción'}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3">Amenidades</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-xs sm:text-sm">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Calendar — availability + pricing */}
          {property.listingType !== 'SALE' && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3">Disponibilidad</h2>
              <PropertyCalendar
                propertyId={Number(property.id)}
                currency={property.currency ?? 'USD'}
                isHost={false}
              />
            </div>
          )}

          {/* Location Details */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">Ubicación</h2>
            <div className="space-y-2 text-sm sm:text-base text-muted-foreground">
              <p>País: {property.location.country}</p>
              <p>Ciudad: {property.location.city}</p>
              {property.location.address && <p>Dirección: {property.location.address}</p>}
              {property.location.postalCode && <p>Código Postal: {property.location.postalCode}</p>}
            </div>
          </div>
        </div>

        {/* Sidebar - Property Info */}
        <div className="md:col-span-2 lg:col-span-1">
          <div className="lg:sticky lg:top-4 border rounded-lg p-4 sm:p-6 space-y-4 bg-card shadow-lg">
            {/* Banner de método de pago requerido (solo visible para el dueño sin método) */}
            {ownerMissingPaymentMethod && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                <p className="font-medium">Método de pago requerido</p>
                <p className="mt-1 text-xs">
                  Para que los huéspedes puedan reservar esta propiedad, debes agregar un método de pago.
                  La plataforma cobra comisiones cuando se realizan reservas efectivas.
                </p>
                <Link
                  href="/dashboard/subscription"
                  className="mt-2 inline-block text-xs font-medium underline"
                >
                  Agregar método de pago →
                </Link>
              </div>
            )}

            {/* Botón de reserva */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="w-full">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleBookingClick}
                      disabled={isMockProperty || (!!user && isBookingDisabled)}
                    >
                      Verificar Disponibilidad
                    </Button>
                  </span>
                </TooltipTrigger>
                {isMockProperty && (
                  <TooltipContent>
                    <p>Disponibilidad sujeta a Airbnb</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex items-start gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Publicado: {formatDate(property.publishedAt || property.createdAt)}</span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Comisión por referido disponible</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 4: Social Proof banner — only shown when there's social data */}
      {socialProof && (socialProof.contentCount > 0 || socialProof.totalBookings > 0) && (
        <div className="mt-6 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {socialProof.contentCount > 0 && (
              <span>
                <span className="font-semibold text-foreground">{socialProof.contentCount}</span>{' '}
                {socialProof.contentCount === 1 ? 'reel de creador' : 'reels de creadores'}
              </span>
            )}
            {socialProof.totalViews > 0 && (
              <span>
                <span className="font-semibold text-foreground">
                  {socialProof.totalViews >= 1000
                    ? `${(socialProof.totalViews / 1000).toFixed(1)}K`
                    : socialProof.totalViews}
                </span>{' '}
                vistas totales
              </span>
            )}
            {socialProof.totalBookings > 0 && (
              <span>
                <span className="font-semibold text-foreground">{socialProof.totalBookings}</span>{' '}
                {socialProof.totalBookings === 1 ? 'reserva via contenido' : 'reservas via contenido'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* UGC Content Section — content tagged to this property */}
      {(isLoadingContent || (contentPage?.content && contentPage.content.length > 0)) && (
        <div className="mt-8 sm:mt-12">
          <div className="mb-4 flex items-center gap-2">
            <Film className="h-5 w-5 text-[hsl(var(--gydi-primary))]" />
            <h2 className="text-lg font-semibold sm:text-xl">Contenido de esta propiedad</h2>
          </div>
          {isLoadingContent ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {contentPage!.content.map((post) => (
                <ContentCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Modal — wrapped in StripeProvider for Fase 2 payment */}
      <StripeProvider>
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          property={{
            id: property.id,
            title: property.title,
            pricePerNight: property.pricePerNight,
            currency: property.currency,
            airbnbUrl: property.airbnbUrl,
          }}
          referralLinkId={referralLinkId}
          contentPostId={contentPostId}
        />
      </StripeProvider>
    </div>
  );
}

export default function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Skeleton className="h-[500px] mb-6 sm:mb-8" />
        <Skeleton className="h-[200px]" />
      </div>
    }>
      <PropertyDetailContent params={params} />
    </Suspense>
  );
}
