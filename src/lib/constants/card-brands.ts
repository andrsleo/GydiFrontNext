/**
 * Card brand constants and utilities
 */

export const CARD_BRAND_COLORS = {
  visa: 'bg-blue-600',
  mastercard: 'bg-orange-600',
  amex: 'bg-teal-600',
  discover: 'bg-purple-600',
  diners: 'bg-indigo-600',
  jcb: 'bg-pink-600',
  unionpay: 'bg-red-600',
  default: 'bg-gray-600',
} as const;

export type CardBrand = keyof typeof CARD_BRAND_COLORS;

/**
 * Gets the appropriate color class for a card brand.
 *
 * @param brand - The card brand (e.g., 'visa', 'mastercard')
 * @returns The Tailwind CSS color class
 *
 * @example
 * ```ts
 * getCardBrandColor('visa') // Returns: 'bg-blue-600'
 * getCardBrandColor('unknown') // Returns: 'bg-gray-600'
 * ```
 */
export function getCardBrandColor(brand: string | undefined | null): string {
  if (!brand) {
    return CARD_BRAND_COLORS.default;
  }

  const normalizedBrand = brand.toLowerCase() as CardBrand;
  return CARD_BRAND_COLORS[normalizedBrand] ?? CARD_BRAND_COLORS.default;
}
