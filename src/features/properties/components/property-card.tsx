/**
 * PropertyCard Component
 * Displays property information in a card format for property lists
 */

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Users } from 'lucide-react';
import type { PropertyResponse } from '../types';
import { LISTING_TYPE_LABELS, PropertyListingType } from '../types';
import { formatCurrency } from '@/lib/utils/format';
import { getImagePath } from '@/lib/utils/image';
import { PropertyActionsMenu } from './property-actions-menu';

interface PropertyCardProps {
  property: PropertyResponse;
  href?: string;
  showActions?: boolean;
}

/**
 * Property Card Component
 * Shows property image, title, price, location, and basic specs
 *
 * @example
 * ```tsx
 * <PropertyCard
 *   property={propertyData}
 *   href={`/properties/${propertyData.id}`}
 * />
 * ```
 */
export function PropertyCard({ property, href, showActions = false }: PropertyCardProps) {
  const {
    id,
    slug,
    title,
    mainImageUrl,
    pricePerNight,
    salePrice,
    currency,
    city,
    country,
    bedrooms,
    bathrooms,
    maxGuests,
    status,
    propertyType,
    listingType,
  } = property;

  // Badge styling based on listing type
  const listingTypeBadgeConfig = {
    [PropertyListingType.SHORT_TERM_RENTAL]: {
      variant: 'secondary' as const,
      className: 'bg-blue-500/90 text-white hover:bg-blue-600',
    },
    [PropertyListingType.SALE]: {
      variant: 'destructive' as const,
      className: 'bg-green-500/90 text-white hover:bg-green-600',
    },
    [PropertyListingType.BOTH]: {
      variant: 'default' as const,
      className: 'bg-purple-500/90 text-white hover:bg-purple-600',
    },
  };

  const listingConfig = listingTypeBadgeConfig[listingType];

  // Use slug for public routes, fallback to ID for dashboard routes or if slug doesn't exist
  const linkHref = href || (showActions
    ? `/dashboard/propiedades/${id}`
    : `/propiedades/${slug || id}`);
  const imageUrl = getImagePath(mainImageUrl);

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={linkHref}>
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Status Badge (top right) */}
          {status !== 'PUBLISHED' && (
            <div className="absolute right-2 top-2">
              <Badge variant={status === 'DRAFT' ? 'warning' : 'secondary'}>{status}</Badge>
            </div>
          )}

          {/* Property Type & Listing Type Badges (top left) */}
          <div className="absolute left-2 top-2 flex flex-col gap-2">
            <Badge variant="secondary" className="bg-slate-800/90 text-white hover:bg-slate-900">
              {propertyType}
            </Badge>
            <Badge variant={listingConfig.variant} className={listingConfig.className}>
              {LISTING_TYPE_LABELS[listingType]}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardHeader className="pb-3">
          {/* Title Row with Actions Menu */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 flex-1 text-lg font-semibold leading-tight group-hover:text-primary">
              {title}
            </h3>

            {/* Actions Menu - Next to Title */}
            {showActions && (
              <div className="flex-shrink-0" onClick={(e) => e.preventDefault()}>
                <PropertyActionsMenu
                  propertyId={id}
                  status={status}
                />
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
            <MapPin className="h-4 w-4" />
            <span>
              {city}, {country}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          {/* Specs */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{maxGuests}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          {/* Price - Conditional based on listing type */}
          <div className="w-full space-y-2">
            {/* Precio por Noche - Si es RENTA o AMBAS */}
            {(listingType === PropertyListingType.SHORT_TERM_RENTAL ||
              listingType === PropertyListingType.BOTH) && (
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">
                  {formatCurrency(pricePerNight, currency)}
                </span>
                <span className="text-sm text-muted-foreground">/ noche</span>
              </div>
            )}

            {/* Precio de Venta - Si es VENTA o AMBAS */}
            {(listingType === PropertyListingType.SALE ||
              listingType === PropertyListingType.BOTH) && salePrice && (
              <div className="flex items-baseline gap-1">
                <span className={listingType === PropertyListingType.BOTH ? 'text-lg font-semibold' : 'text-2xl font-bold'}>
                  {formatCurrency(salePrice, currency)}
                </span>
                <span className="text-sm text-muted-foreground">precio de venta</span>
              </div>
            )}
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
