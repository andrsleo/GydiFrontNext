'use client';

import { useQuery } from '@tanstack/react-query';
import { exchangeRateKeys } from '@/lib/constants/query-keys';
import type { SupportedCurrency } from '@/lib/constants/currency-config';

/** All rates: 1 USD = N units of currency */
export interface ExchangeRates {
  base: 'USD';
  rates: Record<SupportedCurrency, number>;
  updatedAt: string;
  isFallback?: boolean;
}

async function fetchExchangeRates(): Promise<ExchangeRates> {
  const res = await fetch('/api/exchange-rate');
  if (!res.ok) throw new Error(`Failed to fetch exchange rates: ${res.status}`);
  return res.json();
}

export function useExchangeRate() {
  return useQuery<ExchangeRates>({
    queryKey: exchangeRateKeys.current(),
    queryFn: fetchExchangeRates,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 25 * 60 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
