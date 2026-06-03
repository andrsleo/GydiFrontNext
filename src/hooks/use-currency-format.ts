'use client';

import { useCallback } from 'react';
import { useCurrencyStore, selectCurrency } from '@/store/currency-store';
import { useExchangeRate } from './use-exchange-rate';
import { formatCurrency } from '@/lib/utils/format';
import type { SupportedCurrency } from '@/lib/constants/currency-config';

interface UseCurrencyFormatReturn {
  formatAmount: (amount: number | null | undefined, originalCurrency?: SupportedCurrency) => string;
  displayCurrency: SupportedCurrency;
  isLoading: boolean;
  isFallback: boolean;
}

/**
 * Convert an amount from one currency to another using USD as the intermediary.
 *
 * All rates in the API are expressed as: 1 USD = N units of currency.
 * Conversion formula: result = amount * rates[to] / rates[from]
 * Special case: USD rate is always 1, so the formula handles USD↔X correctly.
 */
function convertAmount(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: Record<SupportedCurrency, number>
): number {
  if (from === to) return amount;
  const fromRate = rates[from]; // 1 USD = fromRate units of `from`
  const toRate = rates[to];    // 1 USD = toRate units of `to`
  return (amount / fromRate) * toRate;
}

export function useCurrencyFormat(): UseCurrencyFormatReturn {
  const displayCurrency = useCurrencyStore(selectCurrency);
  const { data: ratesData, isLoading } = useExchangeRate();

  const formatAmount = useCallback(
    (amount: number | null | undefined, originalCurrency: SupportedCurrency = 'USD'): string => {
      if (amount == null) return '--';

      let converted = amount;
      if (ratesData && originalCurrency !== displayCurrency) {
        converted = convertAmount(amount, originalCurrency, displayCurrency, ratesData.rates);
      }

      return formatCurrency(converted, displayCurrency);
    },
    [displayCurrency, ratesData]
  );

  return {
    formatAmount,
    displayCurrency,
    isLoading,
    isFallback: ratesData?.isFallback ?? false,
  };
}
