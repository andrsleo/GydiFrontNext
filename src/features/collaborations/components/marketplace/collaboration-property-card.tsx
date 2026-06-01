import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { MarketplacePropertySummary } from '../../types';

interface CollaborationPropertyCardProps {
  property: MarketplacePropertySummary;
}

const COMPENSATION_LABELS: Record<string, string> = {
  free_stay: 'Estadía gratis',
  cash: 'Efectivo',
  hybrid: 'Híbrido',
  affiliate: 'Afiliado',
  experience_exchange: 'Experiencia',
};

export function CollaborationPropertyCard({ property }: CollaborationPropertyCardProps) {
  return (
    <Card className="flex flex-col rounded-2xl overflow-hidden micro-lift transition-shadow h-full">
      <div className="relative h-48 w-full bg-muted">
        {property.thumbnailUrl ? (
          <Image
            src={property.thumbnailUrl}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            Sin imagen
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <h3 className="font-heading text-base font-semibold leading-tight line-clamp-2">
          {property.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {property.location.city}, {property.location.country}
        </p>
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <div className="flex flex-wrap gap-1.5">
          {property.acceptedCompensations.map((comp) => (
            <Badge key={comp} variant="secondary" className="text-xs">
              {COMPENSATION_LABELS[comp] ?? comp}
            </Badge>
          ))}
        </div>
        {property.activePitchCount > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {property.activePitchCount} pitch{property.activePitchCount !== 1 ? 's' : ''} activo{property.activePitchCount !== 1 ? 's' : ''}
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full min-h-11" variant="outline">
          <Link href={`/colaboraciones/${property.propertyId}`}>
            Ver propiedad
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
