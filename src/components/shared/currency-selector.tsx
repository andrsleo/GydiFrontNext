'use client';

import { useCurrencyStore, selectCurrency, selectAvailableCurrencies } from '@/store/currency-store';
import { CURRENCY_META } from '@/lib/constants/currency-config';
import { Button } from '@/components/ui/button';
import { useHasHydrated } from '@/hooks/use-has-hydrated';
import { cn } from '@/lib/utils';

/**
 * CurrencySelector
 *
 * Always-visible pill button group. Options are driven by the geo-detected
 * country (via CurrencyInitializer + currency store). Possible configurations:
 *   - 2 options: [USD, EUR] or [EUR, USD]       → dollarized / eurozone countries
 *   - 3 options: [local, USD, EUR]               → LATAM countries with own currency
 *
 * The selector skeletons during Zustand hydration to prevent CLS.
 */
export function CurrencySelector({ className }: { className?: string }) {
  const currency = useCurrencyStore(selectCurrency);
  const availableCurrencies = useCurrencyStore(selectAvailableCurrencies);
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
      {availableCurrencies.map((code) => {
        const meta = CURRENCY_META[code];
        const isActive = currency === code;

        return (
          <Button
            key={code}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            className="h-7 rounded-sm px-2.5 text-xs font-semibold transition-all duration-200"
            onClick={() => setCurrency(code)}
            aria-pressed={isActive}
            title={meta.name}
          >
            {meta.symbol} {code}
          </Button>
        );
      })}
    </div>
  );
}
