import { NextResponse } from 'next/server';
import type { SupportedCurrency } from '@/lib/constants/currency-config';

const API_URL =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/** All rates expressed as: 1 USD = N units of currency */
export interface MultiCurrencyRates {
  base: 'USD';
  rates: Record<SupportedCurrency, number>;
  updatedAt: string;
  isFallback?: boolean;
}

const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
  'USD', 'EUR', 'MXN', 'COP', 'CLP', 'BRL', 'PEN', 'CAD', 'GBP',
];

/** Conservative fallback rates — updated periodically as a safety net */
const FALLBACK_RATES: Record<SupportedCurrency, number> = {
  USD: 1,
  EUR: 0.92,
  MXN: 17.1,
  COP: 4100,
  CLP: 930,
  BRL: 5.1,
  PEN: 3.75,
  CAD: 1.36,
  GBP: 0.79,
};

interface CacheEntry extends MultiCurrencyRates {
  expiresAt: number;
}

let cache: CacheEntry | null = null;

export async function GET() {
  if (cache && Date.now() < cache.expiresAt) {
    return NextResponse.json<MultiCurrencyRates>({
      base: cache.base,
      rates: cache.rates,
      updatedAt: cache.updatedAt,
    });
  }

  try {
    const res = await fetch(API_URL, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();

    const usdRates = data?.usd;
    if (!usdRates || typeof usdRates !== 'object') {
      throw new Error('Invalid response from exchange rate API');
    }

    const rates = {} as Record<SupportedCurrency, number>;
    for (const code of SUPPORTED_CURRENCIES) {
      if (code === 'USD') {
        rates[code] = 1;
        continue;
      }
      const apiRate: unknown = usdRates[code.toLowerCase()];
      rates[code] =
        typeof apiRate === 'number' && apiRate > 0 ? apiRate : FALLBACK_RATES[code];
    }

    cache = {
      base: 'USD',
      rates,
      updatedAt: data.date ?? new Date().toISOString().split('T')[0],
      expiresAt: Date.now() + CACHE_TTL_MS,
    };

    return NextResponse.json<MultiCurrencyRates>({
      base: 'USD',
      rates: cache.rates,
      updatedAt: cache.updatedAt,
    });
  } catch (error) {
    console.error('[exchange-rate]', error);
    return NextResponse.json<MultiCurrencyRates>({
      base: 'USD',
      rates: FALLBACK_RATES,
      updatedAt: new Date().toISOString().split('T')[0],
      isFallback: true,
    });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
