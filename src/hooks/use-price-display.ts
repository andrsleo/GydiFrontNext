'use client';

/**
 * usePriceDisplay — Hook estándar de visualización de precios en GYDI
 *
 * REGLAS GYDI (de IT/CLAUDE.md):
 *  1. Siempre leer moneda destino del `useCurrencyStore()`
 *  2. Siempre aplicar conversión usando las tasas de `/api/exchange-rate`
 *  3. Siempre mostrar el código ISO junto al precio (formatCurrencyWithCode)
 *  4. Nunca hardcodear moneda, símbolo ni locale
 *
 * Internamente delega a `useCurrencyFormat` (que ya maneja store + exchange rate).
 * Este hook añade:
 *  - `formatted`          → precio convertido + código ISO, listo para mostrar en UI
 *  - `formattedNoCode`    → precio convertido sin código (para inputs o tooltips)
 *  - `displayCurrency`    → moneda destino activa (SupportedCurrency)
 *  - `isLoading`          → true mientras carga tasas de cambio
 *  - `isFallback`         → true si se usaron FALLBACK_RATES en lugar de API real
 *
 * @param amount        Monto en la moneda original de la propiedad/entidad
 * @param fromCurrency  Moneda origen del monto (del DTO del backend, campo `currency`)
 *
 * @example
 * // Precio base de propiedad almacenado en COP, usuario tiene USD activo
 * const { formatted } = usePriceDisplay(500_000, 'COP');
 * // → "$121 USD"  (500000 COP ÷ 4100 COP/USD ≈ 121.9 USD)
 *
 * @example
 * // Misma moneda — sin conversión
 * const { formatted } = usePriceDisplay(1500, 'USD');
 * // → "$1,500 USD"
 */

import { useCurrencyFormat } from './use-currency-format';
import { formatCurrencyWithCode } from '@/lib/utils/format';
import type { SupportedCurrency } from '@/lib/constants/currency-config';

export interface UsePriceDisplayReturn {
  /** Precio convertido a la moneda del usuario + código ISO. Ej: "$1,500 USD" */
  formatted: string;
  /** Precio convertido sin código ISO. Ej: "$1,500". Útil para tooltips o inputs. */
  formattedNoCode: string;
  /** Moneda activa en el store del usuario */
  displayCurrency: SupportedCurrency;
  /** True mientras las tasas de cambio se están cargando */
  isLoading: boolean;
  /** True si las tasas vienen de FALLBACK_RATES y no de la API externa */
  isFallback: boolean;
}

export function usePriceDisplay(
  amount: number | null | undefined,
  fromCurrency: SupportedCurrency = 'USD'
): UsePriceDisplayReturn {
  const { formatAmount, displayCurrency, isLoading, isFallback } = useCurrencyFormat();

  if (amount == null) {
    return {
      formatted: '--',
      formattedNoCode: '--',
      displayCurrency,
      isLoading,
      isFallback,
    };
  }

  const formattedNoCode = formatAmount(amount, fromCurrency);
  const formatted = `${formattedNoCode} ${displayCurrency}`;

  return {
    formatted,
    formattedNoCode,
    displayCurrency,
    isLoading,
    isFallback,
  };
}

/**
 * Versión standalone (no-hook) para usar en contextos donde no se puede llamar un hook,
 * como dentro de funciones `.map()` después de ya haber obtenido las rates y la currency.
 *
 * @example
 * const { formatAmount, displayCurrency } = useCurrencyFormat();
 * const nights = data.nights.map(n => ({
 *   ...n,
 *   formatted: formatAmountWithCode(formatAmount(n.price.amount, n.price.currency as SupportedCurrency), displayCurrency),
 * }));
 */
export function formatAmountWithCode(formattedAmount: string, currency: SupportedCurrency): string {
  return `${formattedAmount} ${currency}`;
}
