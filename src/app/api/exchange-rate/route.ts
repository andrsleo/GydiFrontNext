import { NextResponse } from 'next/server';

const API_URL =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface CacheEntry {
  USD_to_EUR: number;
  EUR_to_USD: number;
  updatedAt: string;
  expiresAt: number;
}

let cache: CacheEntry | null = null;

export async function GET() {
  if (cache && Date.now() < cache.expiresAt) {
    return NextResponse.json({
      USD_to_EUR: cache.USD_to_EUR,
      EUR_to_USD: cache.EUR_to_USD,
      updatedAt: cache.updatedAt,
    });
  }

  try {
    const res = await fetch(API_URL, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();

    const usdToEur: number = data?.usd?.eur;
    if (typeof usdToEur !== 'number' || usdToEur <= 0) {
      throw new Error('Invalid data from exchange rate API');
    }

    cache = {
      USD_to_EUR: usdToEur,
      EUR_to_USD: parseFloat((1 / usdToEur).toFixed(6)),
      updatedAt: data.date ?? new Date().toISOString().split('T')[0],
      expiresAt: Date.now() + CACHE_TTL_MS,
    };

    return NextResponse.json({
      USD_to_EUR: cache.USD_to_EUR,
      EUR_to_USD: cache.EUR_to_USD,
      updatedAt: cache.updatedAt,
    });
  } catch (error) {
    console.error('[exchange-rate]', error);
    return NextResponse.json({
      USD_to_EUR: 0.92,
      EUR_to_USD: 1.087,
      updatedAt: new Date().toISOString().split('T')[0],
      isFallback: true,
    });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
