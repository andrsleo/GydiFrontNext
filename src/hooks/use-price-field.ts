'use client';

import { useCurrencyStore } from '@/store/currency-store';
import { CURRENCY_META } from '@/lib/constants/currency-config';
import type { SupportedCurrency } from '@/lib/constants/currency-config';

export type PriceFieldType = 'per-night' | 'sale' | 'per-month' | 'total';

export interface PriceFieldMeta {
  currency: SupportedCurrency;
  symbol: string;
  code: string;
  label: string;
  helperText: string;
  placeholder: string;
}

const LABEL_BY_TYPE: Record<PriceFieldType, (code: string) => string> = {
  'per-night': (code) => `Precio por Noche (${code})`,
  'sale':      (code) => `Precio de Venta (${code})`,
  'per-month': (code) => `Precio por Mes (${code})`,
  'total':     (code) => `Precio Total (${code})`,
};

const HELPER_BY_TYPE: Record<PriceFieldType, (name: string, code: string) => string> = {
  'per-night': (name, code) => `Ingresa el valor por noche en ${name} (${code})`,
  'sale':      (name, code) => `Ingresa el valor total de venta en ${name} (${code})`,
  'per-month': (name, code) => `Ingresa el valor mensual en ${name} (${code})`,
  'total':     (name, code) => `Ingresa el valor total en ${name} (${code})`,
};

const PLACEHOLDER_BY_TYPE: Record<PriceFieldType, string> = {
  'per-night': '350.000',
  'sale':      '850.000.000',
  'per-month': '2.000.000',
  'total':     '1.500.000',
};

export function usePriceField(fieldType: PriceFieldType): PriceFieldMeta {
  const { currency } = useCurrencyStore();
  const meta = CURRENCY_META[currency] ?? CURRENCY_META['USD'];

  return {
    currency,
    symbol: meta.symbol,
    code: meta.code,
    label: LABEL_BY_TYPE[fieldType](meta.code),
    helperText: HELPER_BY_TYPE[fieldType](meta.name, meta.code),
    placeholder: PLACEHOLDER_BY_TYPE[fieldType],
  };
}
