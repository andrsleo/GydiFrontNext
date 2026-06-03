'use client';

import { useEffect } from 'react';
import { useCurrencyStore } from '@/store/currency-store';
import { useLocaleStore } from '@/store/locale-store';
import { getLocaleForCountry } from '@/lib/constants/currency-config';

/**
 * CurrencyInitializer
 *
 * Invisible component — renders nothing. Runs once on mount after both
 * Zustand stores have rehydrated from localStorage.
 *
 * What it does:
 * 1. Reads `gydi-country` cookie written by middleware (from x-vercel-ip-country)
 * 2. Calls initFromCountry(country) → sets currency + availableCurrencies
 * 3. Calls initLocaleFromCountry(locale) → sets UI language (es/en)
 *
 * Respects manual user choice:
 * - If user already clicked the currency selector → isManuallySet = true → no override
 * - If user already clicked the language selector → isManuallySet = true → no override
 *
 * Detection priority:
 *   gydi-country cookie (set by Vercel geo header in middleware)
 *   → NEXT_PUBLIC_DEFAULT_COUNTRY env var (local dev override)
 *   → 'US' hardcoded fallback
 */
export function CurrencyInitializer() {
  const currencyHydrated = useCurrencyStore((state) => state._hasHydrated);
  const localeHydrated = useLocaleStore((state) => state._hasHydrated);
  const initFromCountry = useCurrencyStore((state) => state.initFromCountry);
  const initLocaleFromCountry = useLocaleStore((state) => state.initLocaleFromCountry);

  useEffect(() => {
    // Wait for both stores to rehydrate — ensures isManuallySet is read from localStorage
    if (!currencyHydrated || !localeHydrated) return;

    const countryFromCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('gydi-country='))
      ?.split('=')[1];

    const country =
      countryFromCookie ||
      process.env.NEXT_PUBLIC_DEFAULT_COUNTRY ||
      'US';

    initFromCountry(country);
    initLocaleFromCountry(getLocaleForCountry(country));
  }, [currencyHydrated, localeHydrated, initFromCountry, initLocaleFromCountry]);

  return null;
}
