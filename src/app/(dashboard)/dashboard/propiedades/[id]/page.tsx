'use client';

import { use } from 'react';
import Link from 'next/link';
import { usePropertyById } from '@/features/properties';
import { PropertyGallery } from '@/features/properties/components';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Edit, MapPin, Bed, Bath, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { PropertyListingType, LISTING_TYPE_LABELS } from '@/features/properties/types';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: property, isLoading } = usePropertyById({ id });

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
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">{property.title}</h1>
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
            <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{property.location?.city}, {property.location?.country}</span>
            </div>
          </div>
        </div>
        <Link href={`/dashboard/propiedades/${id}/editar`} className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Gallery */}
      {(property.images.length > 0 || property.videos.length > 0) && (
        <Card>
          <CardContent className="p-6">
            <PropertyGallery
              images={property.images}
              videos={property.videos}
              title={property.title}
            />
          </CardContent>
        </Card>
      )}

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm sm:text-base text-muted-foreground">{property.description}</p>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <Bed className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{property.specs?.bedrooms}</p>
                  <p className="text-xs text-muted-foreground">Habitaciones</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <Bath className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{property.specs?.bathrooms}</p>
                  <p className="text-xs text-muted-foreground">Baños</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{property.specs?.maxGuests}</p>
                  <p className="text-xs text-muted-foreground">Huéspedes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price & Amenities */}
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Precio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Precio por Noche - Si es RENTA o AMBAS */}
              {(property.listingType === PropertyListingType.SHORT_TERM_RENTAL ||
                property.listingType === PropertyListingType.BOTH) && (
                <div>
                  <div className="text-2xl sm:text-3xl font-bold">
                    {formatCurrency(property.pricePerNight, property.currency)}
                  </div>
                  <p className="text-sm text-muted-foreground">por noche</p>
                  {property.listingType === PropertyListingType.BOTH && (
                    <p className="text-xs text-muted-foreground mt-1">Para renta vacacional</p>
                  )}
                </div>
              )}

              {/* Precio de Venta - Si es VENTA o AMBAS */}
              {(property.listingType === PropertyListingType.SALE ||
                property.listingType === PropertyListingType.BOTH) && property.salePrice && (
                <div className={property.listingType === PropertyListingType.BOTH ? 'pt-3 border-t' : ''}>
                  <div className={property.listingType === PropertyListingType.BOTH ? 'text-xl sm:text-2xl font-bold' : 'text-2xl sm:text-3xl font-bold'}>
                    {formatCurrency(property.salePrice, property.currency)}
                  </div>
                  <p className="text-sm text-muted-foreground">precio de renta</p>
                </div>
              )}
            </CardContent>
          </Card>

          {property.amenities && property.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Amenidades</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {property.amenities.map((amenity, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>{amenity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}