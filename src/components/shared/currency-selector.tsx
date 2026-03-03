'use client';

import { useCurrencyStore } from '@/store/currency-store';
import { Button } from '@/components/ui/button';
import { useHasHydrated } from '@/hooks/use-has-hydrated';
import { cn } from '@/lib/utils';

export function CurrencySelector({ className }: { className?: string }) {
  const currency = useCurrencyStore((state) => state.currency);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);
  const hasHydrated = useHasHydrated();

  if (!hasHydrated) {
    return (
      <div
        className={cn('h-8 w-[88px] animate-pulse rounded-md bg-muted', className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center rounded-md border border-border bg-muted/30 p-0.5',
        className
      )}
      role="group"
      aria-label="Seleccionar moneda"
    >
      <Button
        variant={currency === 'USD' ? 'default' : 'ghost'}
        size="sm"
        className="h-7 rounded-sm px-2.5 text-xs font-semibold transition-all duration-200"
        onClick={() => setCurrency('USD')}
        aria-pressed={currency === 'USD'}
      >
        $ USD
      </Button>
      <Button
        variant={currency === 'EUR' ? 'default' : 'ghost'}
        size="sm"
        className="h-7 rounded-sm px-2.5 text-xs font-semibold transition-all duration-200"
        onClick={() => setCurrency('EUR')}
        aria-pressed={currency === 'EUR'}
      >
        € EUR
      </Button>
    </div>
  );
}
