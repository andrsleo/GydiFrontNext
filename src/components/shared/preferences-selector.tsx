'use client';

import { Globe, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrencyStore, selectCurrency, selectAvailableCurrencies } from '@/store/currency-store';
import { useLocaleStore } from '@/store/locale-store';
import { CURRENCY_META } from '@/lib/constants/currency-config';
import { useHasHydrated } from '@/hooks/use-has-hydrated';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import type { SupportedCurrency } from '@/lib/constants/currency-config';

/**
 * PreferencesSelector
 *
 * Single compact trigger (Globe + active currency + chevron) that opens
 * a dropdown panel combining currency and language selection.
 *
 * Replaces the separate CurrencySelector + LanguageSelector in all headers.
 * The panel stays open on selection so users can adjust both settings
 * before dismissing — better UX than closing on each tap.
 */
export function PreferencesSelector({ className, compact = false }: { className?: string; compact?: boolean }) {
  const currency = useCurrencyStore(selectCurrency);
  const availableCurrencies = useCurrencyStore(selectAvailableCurrencies);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);

  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);

  const hasHydrated = useHasHydrated();
  const { t } = useTranslation('common');

  if (!hasHydrated) {
    return (
      <div
        className={cn('h-9 w-[84px] animate-pulse rounded-md bg-muted', className)}
        aria-hidden="true"
      />
    );
  }

  const meta = CURRENCY_META[currency];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-9 gap-1.5 rounded-lg text-sm font-medium transition-all duration-200',
            'hover:bg-primary/8 focus-visible:ring-primary/30',
            compact ? 'px-2' : 'px-3',
            className
          )}
          aria-label={`Preferencias: ${currency}, ${locale.toUpperCase()}`}
        >
          <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
          {!compact && <span className="font-semibold">{meta.symbol} {currency}</span>}
          {!compact && <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-52 rounded-xl p-4 shadow-lg"
      >
        {/* ── Currency ─────────────────────────────────── */}
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {t('preferences.currency')}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {availableCurrencies.map((code: SupportedCurrency) => {
            const m = CURRENCY_META[code];
            const isActive = currency === code;
            return (
              <button
                key={code}
                onClick={() => setCurrency(code)}
                className={cn(
                  'flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-foreground hover:bg-muted/70'
                )}
                aria-pressed={isActive}
                title={m.name}
              >
                {isActive && <Check className="h-3 w-3" />}
                {m.symbol} {code}
              </button>
            );
          })}
        </div>

        <Separator className="my-3.5" />

        {/* ── Language ─────────────────────────────────── */}
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {t('preferences.language')}
        </p>
        <div className="flex gap-1.5">
          {(['es', 'en'] as const).map((lang) => {
            const isActive = locale === lang;
            return (
              <button
                key={lang}
                onClick={() => setLocale(lang)}
                className={cn(
                  'flex h-8 w-12 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-foreground hover:bg-muted/70'
                )}
                aria-pressed={isActive}
              >
                {lang.toUpperCase()}
              </button>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
