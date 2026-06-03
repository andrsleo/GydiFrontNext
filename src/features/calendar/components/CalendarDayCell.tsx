'use client';
import { cn } from '@/lib/utils';
import { useCurrencyFormat } from '@/hooks/use-currency-format';
import { CURRENCY_META } from '@/lib/constants/currency-config';
import type { SupportedCurrency } from '@/lib/constants/currency-config';
import type { CalendarDayDto } from '../types';

export interface CellLabels {
  blocked: string;
  reserved: string;
  maintenance: string;
  rangeStart: string;
}

const DEFAULT_LABELS: CellLabels = {
  blocked: 'Bloq.',
  reserved: 'Reserv.',
  maintenance: 'Mant.',
  rangeStart: 'Inicio',
};

interface CalendarDayCellProps {
  day: CalendarDayDto | null;
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isRangeStart?: boolean;
  isInRange?: boolean;
  isHost?: boolean;
  /**
   * Moneda origen del precio almacenado en la propiedad (viene del DTO backend).
   * La visualización siempre usa la moneda activa del usuario (useCurrencyStore),
   * convirtiendo desde `propertyCurrency` a la moneda del usuario.
   */
  propertyCurrency: SupportedCurrency;
  labels?: CellLabels;
  onClick?: (dateStr: string) => void;
  onMouseEnter?: (dateStr: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: 'bg-card hover:bg-muted/50',
  BLOCKED: 'bg-muted text-muted-foreground',
  RESERVED: 'bg-destructive/8 text-destructive',
  MAINTENANCE: 'bg-[hsl(var(--gydi-gold)/0.10)] text-[hsl(var(--gydi-gold))]',
};

type PriceSourceKey = 'SEASON_HIGH' | 'SEASON_MEDIUM' | 'SEASON_LOW' | 'CUSTOM' | 'BASE';

const PRICE_SOURCE_BADGES: Record<PriceSourceKey, { label: string; class: string } | null> = {
  SEASON_HIGH: {
    label: 'Alta',
    class: 'bg-[hsl(var(--gydi-gold)/0.15)] text-[hsl(var(--gydi-gold))]',
  },
  SEASON_MEDIUM: {
    label: 'Media',
    class: 'bg-[hsl(var(--gydi-primary)/0.10)] text-[hsl(var(--gydi-primary))]',
  },
  SEASON_LOW: {
    label: 'Baja',
    class: 'bg-[hsl(var(--gydi-teal)/0.12)] text-[hsl(var(--gydi-teal))]',
  },
  CUSTOM: {
    label: 'Custom',
    class: 'bg-[hsl(var(--gydi-teal)/0.15)] text-[hsl(var(--gydi-teal))]',
  },
  BASE: null,
};

export function CalendarDayCell({
  day,
  date,
  isCurrentMonth,
  isSelected,
  isRangeStart = false,
  isInRange = false,
  isHost,
  propertyCurrency,
  labels = DEFAULT_LABELS,
  onClick,
  onMouseEnter,
}: CalendarDayCellProps) {
  const dateStr = date.toISOString().split('T')[0];
  const status = day?.status ?? 'AVAILABLE';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPast = date < today;

  // Conversión reactiva: lee la moneda del store del usuario y las tasas de cambio.
  // Cuando el usuario cambia moneda en el header, displayCurrency cambia → re-render automático.
  const { formatAmount, displayCurrency } = useCurrencyFormat();

  // Use per-day currency from backend when available (e.g. custom prices stored in display currency).
  // Fall back to propertyCurrency for base/season prices which are always in property currency.
  const fromCurrency: SupportedCurrency =
    day?.effectivePriceCurrency && day.effectivePriceCurrency in CURRENCY_META
      ? (day.effectivePriceCurrency as SupportedCurrency)
      : propertyCurrency;

  const formattedPrice =
    day?.effectivePrice != null && status === 'AVAILABLE'
      ? `${formatAmount(day.effectivePrice, fromCurrency)} ${displayCurrency}`
      : null;

  const badge =
    day?.priceSource && day.priceSource !== 'BASE'
      ? PRICE_SOURCE_BADGES[day.priceSource as PriceSourceKey]
      : null;

  // Hosts can click available and blocked dates (to unblock them); not reserved
  const isInteractive = isHost && !isPast && status !== 'RESERVED';

  const isHighlighted = isSelected || isRangeStart || isInRange;

  return (
    <button
      onClick={() => isInteractive && onClick?.(dateStr)}
      onMouseEnter={() => isInteractive && onMouseEnter?.(dateStr)}
      disabled={!isInteractive}
      aria-label={`${dateStr} - ${status}`}
      aria-pressed={isSelected}
      className={cn(
        'relative flex flex-col items-start justify-start p-1 min-h-[44px] w-full border border-border rounded-lg text-left transition-colors',
        // Range highlight overrides status styles
        isHighlighted
          ? 'bg-[hsl(var(--gydi-primary)/0.12)] border-[hsl(var(--gydi-primary)/0.3)]'
          : (STATUS_STYLES[status] ?? STATUS_STYLES.AVAILABLE),
        // Range start gets stronger fill
        isRangeStart && 'bg-[hsl(var(--gydi-primary)/0.25)] border-[hsl(var(--gydi-primary))]',
        // Confirmed selection ring
        isSelected && !isRangeStart && 'ring-2 ring-[hsl(var(--gydi-primary))] ring-offset-1',
        !isCurrentMonth && 'opacity-30',
        isPast && 'opacity-40',
        isInteractive && 'cursor-pointer',
      )}
    >
      <span
        className={cn(
          'text-xs font-medium',
          isHighlighted && 'text-[hsl(var(--gydi-primary))] font-semibold',
        )}
      >
        {date.getDate()}
      </span>

      {formattedPrice && !isHighlighted && (
        <span className="text-[10px] text-muted-foreground leading-tight mt-auto">{formattedPrice}</span>
      )}

      {badge && !isHighlighted && (
        <span className={cn('text-[9px] px-1 rounded-full leading-tight mt-0.5', badge.class)}>
          {badge.label}
        </span>
      )}

      {status === 'BLOCKED' && !isHighlighted && (
        <span className="text-[10px] text-muted-foreground">{labels.blocked}</span>
      )}

      {status === 'RESERVED' && (
        <span className="text-[10px] text-destructive">{labels.reserved}</span>
      )}

      {status === 'MAINTENANCE' && !isHighlighted && (
        <span className="text-[10px] text-[hsl(var(--gydi-gold))]">{labels.maintenance}</span>
      )}

      {isRangeStart && (
        <span className="text-[9px] text-[hsl(var(--gydi-primary))] font-bold leading-tight">
          {labels.rangeStart}
        </span>
      )}
    </button>
  );
}
