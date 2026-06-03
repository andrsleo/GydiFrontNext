'use client';
import { usePriceRange } from '../hooks/use-price-range';
import { useCurrencyFormat } from '@/hooks/use-currency-format';
import { cn } from '@/lib/utils';
import type { SupportedCurrency } from '@/lib/constants/currency-config';

interface PriceBreakdownCardProps {
  propertyId: number;
  checkIn: string;
  checkOut: string;
  /** Moneda original de la propiedad (fallback si el night.price.currency no viene del backend) */
  currency: SupportedCurrency;
}

const SOURCE_LABELS: Record<string, string> = {
  BASE: 'Precio base',
  SEASON_HIGH: 'Temporada alta',
  SEASON_MEDIUM: 'Temporada media',
  SEASON_LOW: 'Temporada baja',
  CUSTOM: 'Precio especial',
};

const SOURCE_BADGE_CLASSES: Record<string, string> = {
  BASE: 'bg-muted text-muted-foreground',
  SEASON_HIGH: 'bg-[hsl(var(--gydi-gold)/0.15)] text-[hsl(var(--gydi-gold))]',
  SEASON_MEDIUM: 'bg-[hsl(var(--gydi-primary)/0.10)] text-[hsl(var(--gydi-primary))]',
  SEASON_LOW: 'bg-[hsl(var(--gydi-teal)/0.12)] text-[hsl(var(--gydi-teal))]',
  CUSTOM: 'bg-[hsl(var(--gydi-teal)/0.15)] text-[hsl(var(--gydi-teal))]',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-419', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-5 bg-muted rounded w-1/2" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex justify-between gap-4">
          <div className="h-4 bg-muted rounded flex-1" />
          <div className="h-4 bg-muted rounded w-20" />
        </div>
      ))}
      <div className="h-px bg-muted" />
      <div className="flex justify-between gap-4">
        <div className="h-6 bg-muted rounded w-16" />
        <div className="h-6 bg-muted rounded w-24" />
      </div>
    </div>
  );
}

export function PriceBreakdownCard({
  propertyId,
  checkIn,
  checkOut,
  currency,
}: PriceBreakdownCardProps) {
  const { data, isLoading, isError } = usePriceRange(propertyId, checkIn, checkOut);

  // Conversión reactiva: cuando el usuario cambie moneda en el header,
  // formatAmount recomputa todos los precios automáticamente.
  const { formatAmount, displayCurrency } = useCurrencyFormat();

  if (isLoading) return <Skeleton />;

  if (isError || !data) {
    return (
      <div className="text-sm text-destructive text-center py-4">
        No se pudo calcular el precio para las fechas seleccionadas.
      </div>
    );
  }

  // La moneda de cada night viene del DTO del backend; si no viene, se usa la de la propiedad.
  const totalFromCurrency = (data.total.currency || currency) as SupportedCurrency;

  return (
    <div className="space-y-3">
      <h4 className="font-heading text-sm font-semibold text-[hsl(var(--gydi-ink))]">
        Desglose de precio
      </h4>

      {/* Nights table */}
      <div className="divide-y divide-border">
        {data.nights.map((night) => {
          const src = night.priceSource ?? 'BASE';
          const badgeClass = SOURCE_BADGE_CLASSES[src] ?? SOURCE_BADGE_CLASSES.BASE;
          const label = SOURCE_LABELS[src] ?? src;
          const nightFromCurrency = (night.price.currency || currency) as SupportedCurrency;
          const formattedNightPrice = `${formatAmount(night.price.amount, nightFromCurrency)} ${displayCurrency}`;

          return (
            <div
              key={night.date}
              className="flex items-center justify-between gap-2 py-2"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm text-foreground capitalize">{formatDate(night.date)}</span>
                <span
                  className={cn(
                    'text-[10px] font-medium px-1.5 py-0.5 rounded-full w-fit',
                    badgeClass,
                  )}
                >
                  {label}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {formattedNightPrice}
              </span>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-[hsl(var(--gydi-ink))]">
          Total ({data.nights.length} {data.nights.length === 1 ? 'noche' : 'noches'})
        </span>
        <span className="text-lg font-bold text-[hsl(var(--gydi-primary))]">
          {formatAmount(data.total.amount, totalFromCurrency)} {displayCurrency}
        </span>
      </div>
    </div>
  );
}
