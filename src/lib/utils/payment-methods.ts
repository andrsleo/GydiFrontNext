/**
 * Payment method utility functions
 */

import type { PaymentMethodStatus } from '@/features/subscriptions/types';

/**
 * Checks if a credit card is expired based on expiration date.
 *
 * @param expMonth - The expiration month (1-12)
 * @param expYear - The expiration year (full year, e.g., 2025)
 * @returns True if the card is expired, false otherwise
 *
 * @example
 * ```ts
 * isCardExpired(12, 2023) // Returns: true (if current date is after Dec 2023)
 * isCardExpired(6, 2025) // Returns: false (if current date is before Jun 2025)
 * isCardExpired(undefined, 2025) // Returns: false (missing data)
 * ```
 */
export function isCardExpired(
  expMonth: number | undefined | null,
  expYear: number | undefined | null
): boolean {
  if (!expMonth || !expYear) {
    return false;
  }

  const now = new Date();
  const expDate = new Date(expYear, expMonth - 1);

  return expDate < now;
}

/**
 * Checks if a payment method is active and can be used.
 *
 * A payment method is considered usable if its status is ACTIVE.
 * INACTIVE, EXPIRED, FAILED, and REPLACED cards cannot be used.
 *
 * @param status - The payment method status
 * @returns True if the payment method can be used, false otherwise
 *
 * @example
 * ```ts
 * isPaymentMethodUsable('ACTIVE') // Returns: true
 * isPaymentMethodUsable('INACTIVE') // Returns: false
 * isPaymentMethodUsable('EXPIRED') // Returns: false
 * ```
 */
export function isPaymentMethodUsable(status: PaymentMethodStatus): boolean {
  return status === 'ACTIVE';
}

/**
 * Gets the display label for a payment method status.
 *
 * @param status - The payment method status
 * @returns Human-readable status label
 *
 * @example
 * ```ts
 * getStatusLabel('ACTIVE') // Returns: 'Active'
 * getStatusLabel('INACTIVE') // Returns: 'Inactive'
 * getStatusLabel('EXPIRED') // Returns: 'Expired'
 * ```
 */
export function getStatusLabel(status: PaymentMethodStatus): string {
  const labels: Record<PaymentMethodStatus, string> = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    EXPIRED: 'Expired',
    FAILED: 'Failed',
    REPLACED: 'Replaced',
  };
  return labels[status];
}

/**
 * Gets the appropriate badge variant for a payment method status.
 *
 * @param status - The payment method status
 * @returns Badge variant string for UI components
 *
 * @example
 * ```ts
 * getStatusBadgeVariant('ACTIVE') // Returns: 'success'
 * getStatusBadgeVariant('EXPIRED') // Returns: 'warning'
 * getStatusBadgeVariant('FAILED') // Returns: 'destructive'
 * ```
 */
export function getStatusBadgeVariant(status: PaymentMethodStatus):
  'default' | 'success' | 'warning' | 'destructive' | 'secondary' {
  const variants: Record<PaymentMethodStatus, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
    ACTIVE: 'success',
    INACTIVE: 'secondary',
    EXPIRED: 'warning',
    FAILED: 'destructive',
    REPLACED: 'secondary',
  };
  return variants[status];
}

/**
 * Formats card expiration date for display.
 *
 * @param expMonth - The expiration month (1-12)
 * @param expYear - The expiration year (full year, e.g., 2025)
 * @returns Formatted string like "06/25" or empty string if data missing
 *
 * @example
 * ```ts
 * formatCardExpiry(6, 2025) // Returns: "06/25"
 * formatCardExpiry(12, 2024) // Returns: "12/24"
 * formatCardExpiry(undefined, 2025) // Returns: ""
 * ```
 */
export function formatCardExpiry(
  expMonth: number | undefined | null,
  expYear: number | undefined | null
): string {
  if (!expMonth || !expYear) {
    return '';
  }

  const monthStr = expMonth.toString().padStart(2, '0');
  const yearStr = expYear.toString().slice(-2);

  return `${monthStr}/${yearStr}`;
}
