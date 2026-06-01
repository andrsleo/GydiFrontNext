import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PitchStatusBadge } from './pitch-status-badge';
import type { PitchSummary } from '../../types';

interface PitchCardProps {
  pitch: PitchSummary;
}

const COMPENSATION_LABELS: Record<string, string> = {
  free_stay: 'Estadía gratis',
  cash: 'Pago en efectivo',
  hybrid: 'Híbrido',
  affiliate: 'Comisión de afiliado',
  experience_exchange: 'Intercambio de experiencia',
};

export function PitchCard({ pitch }: PitchCardProps) {
  const compensationLabel =
    COMPENSATION_LABELS[pitch.compensation.type] ?? pitch.compensation.type;

  return (
    <Card className="flex flex-col rounded-2xl overflow-hidden micro-lift transition-shadow">
      {pitch.propertyThumbnail && (
        <div className="relative h-40 w-full">
          <Image
            src={pitch.propertyThumbnail}
            alt={pitch.propertyTitle}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-base font-semibold leading-tight line-clamp-2">
            {pitch.propertyTitle}
          </h3>
          <PitchStatusBadge status={pitch.status} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <p className="text-sm text-muted-foreground">{compensationLabel}</p>
        {pitch.counterOfferRounds > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {pitch.counterOfferRounds} ronda{pitch.counterOfferRounds !== 1 ? 's' : ''} de negociación
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Expira: {new Date(pitch.expiresAt).toLocaleDateString('es', { dateStyle: 'medium' })}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full min-h-11">
          <Link href={`/dashboard/colaboraciones/pitch/${pitch.pitchId}`}>
            Ver detalles
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
