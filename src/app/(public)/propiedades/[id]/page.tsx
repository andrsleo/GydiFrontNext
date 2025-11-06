'use client';

import { use } from 'react';
import { usePropertyDetail } from '@/features/properties';
import { PropertyGallery } from '@/features/properties/components';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Bed, Bath, Users, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/format';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: property, isLoading, error } = usePropertyDetail({ id });

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
              <Badge variant="outline">{property.propertyType}</Badge>
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

        {/* Sidebar - Booking Card */}
        <div className="md:col-span-2 lg:col-span-1">
          <div className="lg:sticky lg:top-4 border rounded-lg p-4 sm:p-6 space-y-4 bg-card shadow-lg">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold">
                  {formatCurrency(property.pricePerNight, property.currency)}
                </span>
                <span className="text-sm text-muted-foreground">/ noche</span>
              </div>
            </div>

            <Button className="w-full" size="lg">
              Reservar Ahora
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              No se realizará ningún cargo todavía
            </div>

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
    </div>
  );
}
