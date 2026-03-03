'use client';

import { useCallback } from 'react';
import { useCurrencyStore, selectCurrency } from '@/store/currency-store';
import { useExchangeRate } from './use-exchange-rate';
import { formatCurrency } from '@/lib/utils/format';
import type { DisplayCurrency } from '@/store/currency-store';
import type { Currency } from '@/features/properties/types';

interface UseCurrencyFormatReturn {
  formatAmount: (amount: number | null | undefined, originalCurrency?: DisplayCurrency) => string;
  displayCurrency: DisplayCurrency;
  isLoading: boolean;
  isFallback: boolean;
}

export function useCurrencyFormat(): UseCurrencyFormatReturn {
  const displayCurrency = useCurrencyStore(selectCurrency);
  const { data: rates, isLoading } = useExchangeRate();

  const formatAmount = useCallback(
    (amount: number | null | undefined, originalCurrency: DisplayCurrency = 'USD'): string => {
      if (amount == null) return '--';
      let converted = amount;
      if (rates && originalCurrency !== displayCurrency) {
        converted =
          originalCurrency === 'USD'
            ? amount * rates.USD_to_EUR
            : amount * rates.EUR_to_USD;
      }
      return formatCurrency(converted, displayCurrency as unknown as Currency);
    },
    [displayCurrency, rates]
  );

  return {
    formatAmount,
    displayCurrency,
    isLoading,
    isFallback: rates?.isFallback ?? false,
  };
}
