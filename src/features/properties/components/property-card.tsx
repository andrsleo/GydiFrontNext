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
import { formatCurrency } from '@/lib/utils/format';
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
    title,
    mainImageUrl,
    pricePerNight,
    currency,
    city,
    country,
    bedrooms,
    bathrooms,
    maxGuests,
    status,
    propertyType,
  } = property;

  const linkHref = href || `/dashboard/propiedades/${id}`;
  const imageUrl = mainImageUrl || '/images/property-placeholder.jpg';

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

          {/* Status Badge */}
          {status !== 'PUBLISHED' && (
            <div className="absolute right-2 top-2">
              <Badge variant={status === 'DRAFT' ? 'warning' : 'secondary'}>{status}</Badge>
            </div>
          )}

          {/* Property Type Badge */}
          <div className="absolute left-2 top-2">
            <Badge variant="secondary">{propertyType}</Badge>
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
          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">
              {formatCurrency(pricePerNight, currency)}
            </span>
            <span className="text-sm text-muted-foreground">/ night</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
