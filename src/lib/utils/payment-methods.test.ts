import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isCardExpired,
  formatCardExpiry,
  isPaymentMethodUsable,
  getStatusLabel,
  getStatusBadgeVariant,
} from './payment-methods';
import type { PaymentMethodStatus } from '@/features/subscriptions/types';

describe('payment-methods utils', () => {
  // Mock current date for consistent testing
  const MOCK_DATE = new Date('2026-01-14T00:00:00.000Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_DATE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('isCardExpired', () => {
    describe('with valid expiration dates', () => {
      it('should return false for cards expiring in the future', () => {
        expect(isCardExpired(12, 2026)).toBe(false);
        expect(isCardExpired(6, 2027)).toBe(false);
        expect(isCardExpired(1, 2030)).toBe(false);
      });

      it('should return true for cards expiring in current month (already past first day)', () => {
        // Card expires on Jan 1, 2026 00:00 - we're on Jan 14, so it's expired
        expect(isCardExpired(1, 2026)).toBe(true);
      });

      it('should return true for cards expired in previous months of current year', () => {
        expect(isCardExpired(12, 2025)).toBe(true);
        expect(isCardExpired(11, 2025)).toBe(true);
      });

      it('should return true for cards expired in previous years', () => {
        expect(isCardExpired(12, 2024)).toBe(true);
        expect(isCardExpired(1, 2023)).toBe(true);
        expect(isCardExpired(6, 2020)).toBe(true);
      });
    });

    describe('with edge case months', () => {
      it('should handle January correctly', () => {
        expect(isCardExpired(1, 2025)).toBe(true); // Past year
        expect(isCardExpired(1, 2026)).toBe(true); // Current month (past first day)
        expect(isCardExpired(1, 2027)).toBe(false); // Future year
      });

      it('should handle December correctly', () => {
        expect(isCardExpired(12, 2025)).toBe(true); // Past year
        expect(isCardExpired(12, 2026)).toBe(false); // Future month this year
        expect(isCardExpired(12, 2027)).toBe(false); // Future year
      });
    });

    describe('with missing or invalid input', () => {
      it('should return false when expMonth is undefined', () => {
        expect(isCardExpired(undefined, 2026)).toBe(false);
      });

      it('should return false when expYear is undefined', () => {
        expect(isCardExpired(12, undefined)).toBe(false);
      });

      it('should return false when both are undefined', () => {
        expect(isCardExpired(undefined, undefined)).toBe(false);
      });

      it('should return false when expMonth is null', () => {
        expect(isCardExpired(null, 2026)).toBe(false);
      });

      it('should return false when expYear is null', () => {
        expect(isCardExpired(12, null)).toBe(false);
      });

      it('should return false when both are null', () => {
        expect(isCardExpired(null, null)).toBe(false);
      });
    });

    describe('with boundary values', () => {
      it('should handle minimum valid month (1)', () => {
        expect(isCardExpired(1, 2027)).toBe(false);
      });

      it('should handle maximum valid month (12)', () => {
        expect(isCardExpired(12, 2027)).toBe(false);
      });

      it('should handle far future dates', () => {
        expect(isCardExpired(12, 2099)).toBe(false);
      });

      it('should handle far past dates', () => {
        expect(isCardExpired(1, 2000)).toBe(true);
      });
    });
  });

  describe('formatCardExpiry', () => {
    describe('with valid input', () => {
      it('should format single digit months with leading zero', () => {
        expect(formatCardExpiry(1, 2026)).toBe('01/26');
        expect(formatCardExpiry(6, 2027)).toBe('06/27');
        expect(formatCardExpiry(9, 2028)).toBe('09/28');
      });

      it('should format double digit months without modification', () => {
        expect(formatCardExpiry(10, 2026)).toBe('10/26');
        expect(formatCardExpiry(11, 2027)).toBe('11/27');
        expect(formatCardExpiry(12, 2028)).toBe('12/28');
      });

      it('should format year to last two digits', () => {
        expect(formatCardExpiry(12, 2026)).toBe('12/26');
        expect(formatCardExpiry(1, 2030)).toBe('01/30');
        expect(formatCardExpiry(6, 2099)).toBe('06/99');
      });
    });

    describe('with edge case years', () => {
      it('should handle years with leading zeros in last two digits', () => {
        expect(formatCardExpiry(1, 2000)).toBe('01/00');
        expect(formatCardExpiry(6, 2001)).toBe('06/01');
        expect(formatCardExpiry(12, 2009)).toBe('12/09');
      });

      it('should handle 3-digit years (unlikely but possible)', () => {
        expect(formatCardExpiry(1, 999)).toBe('01/99');
      });

      it('should handle 2-digit years', () => {
        expect(formatCardExpiry(1, 26)).toBe('01/26');
      });
    });

    describe('with missing or invalid input', () => {
      it('should return empty string when expMonth is undefined', () => {
        expect(formatCardExpiry(undefined, 2026)).toBe('');
      });

      it('should return empty string when expYear is undefined', () => {
        expect(formatCardExpiry(12, undefined)).toBe('');
      });

      it('should return empty string when both are undefined', () => {
        expect(formatCardExpiry(undefined, undefined)).toBe('');
      });

      it('should return empty string when expMonth is null', () => {
        expect(formatCardExpiry(null, 2026)).toBe('');
      });

      it('should return empty string when expYear is null', () => {
        expect(formatCardExpiry(12, null)).toBe('');
      });

      it('should return empty string when both are null', () => {
        expect(formatCardExpiry(null, null)).toBe('');
      });

      it('should return empty string when expMonth is 0', () => {
        expect(formatCardExpiry(0, 2026)).toBe('');
      });
    });

    describe('format consistency', () => {
      it('should always return MM/YY format', () => {
        const results = [
          formatCardExpiry(1, 2026),
          formatCardExpiry(12, 2026),
          formatCardExpiry(6, 2030),
        ];

        results.forEach((result) => {
          expect(result).toMatch(/^\d{2}\/\d{2}$/);
        });
      });

      it('should return consistent results for same input', () => {
        const result1 = formatCardExpiry(6, 2027);
        const result2 = formatCardExpiry(6, 2027);
        expect(result1).toBe(result2);
      });
    });
  });

  describe('isPaymentMethodUsable', () => {
    it('should return true for ACTIVE status', () => {
      expect(isPaymentMethodUsable('ACTIVE')).toBe(true);
    });

    it('should return false for INACTIVE status', () => {
      expect(isPaymentMethodUsable('INACTIVE')).toBe(false);
    });

    it('should return false for EXPIRED status', () => {
      expect(isPaymentMethodUsable('EXPIRED')).toBe(false);
    });

    it('should return false for FAILED status', () => {
      expect(isPaymentMethodUsable('FAILED')).toBe(false);
    });

    it('should return false for REPLACED status', () => {
      expect(isPaymentMethodUsable('REPLACED')).toBe(false);
    });
  });

  describe('getStatusLabel', () => {
    it('should return correct label for ACTIVE', () => {
      expect(getStatusLabel('ACTIVE')).toBe('Active');
    });

    it('should return correct label for INACTIVE', () => {
      expect(getStatusLabel('INACTIVE')).toBe('Inactive');
    });

    it('should return correct label for EXPIRED', () => {
      expect(getStatusLabel('EXPIRED')).toBe('Expired');
    });

    it('should return correct label for FAILED', () => {
      expect(getStatusLabel('FAILED')).toBe('Failed');
    });

    it('should return correct label for REPLACED', () => {
      expect(getStatusLabel('REPLACED')).toBe('Replaced');
    });

    it('should return human-readable labels for all statuses', () => {
      const statuses: PaymentMethodStatus[] = ['ACTIVE', 'INACTIVE', 'EXPIRED', 'FAILED', 'REPLACED'];

      statuses.forEach((status) => {
        const label = getStatusLabel(status);
        expect(label).toBeTruthy();
        expect(label.length).toBeGreaterThan(0);
        // Should be capitalized
        expect(label[0]).toBe(label[0].toUpperCase());
      });
    });
  });

  describe('getStatusBadgeVariant', () => {
    it('should return "success" variant for ACTIVE', () => {
      expect(getStatusBadgeVariant('ACTIVE')).toBe('success');
    });

    it('should return "secondary" variant for INACTIVE', () => {
      expect(getStatusBadgeVariant('INACTIVE')).toBe('secondary');
    });

    it('should return "warning" variant for EXPIRED', () => {
      expect(getStatusBadgeVariant('EXPIRED')).toBe('warning');
    });

    it('should return "destructive" variant for FAILED', () => {
      expect(getStatusBadgeVariant('FAILED')).toBe('destructive');
    });

    it('should return "secondary" variant for REPLACED', () => {
      expect(getStatusBadgeVariant('REPLACED')).toBe('secondary');
    });

    it('should return valid badge variants for all statuses', () => {
      const statuses: PaymentMethodStatus[] = ['ACTIVE', 'INACTIVE', 'EXPIRED', 'FAILED', 'REPLACED'];
      const validVariants = ['default', 'success', 'warning', 'destructive', 'secondary'];

      statuses.forEach((status) => {
        const variant = getStatusBadgeVariant(status);
        expect(validVariants).toContain(variant);
      });
    });
  });

  describe('integration scenarios', () => {
    it('should correctly identify expired card and format its expiry', () => {
      const expMonth = 12;
      const expYear = 2025;

      expect(isCardExpired(expMonth, expYear)).toBe(true);
      expect(formatCardExpiry(expMonth, expYear)).toBe('12/25');
    });

    it('should correctly identify valid card and format its expiry', () => {
      const expMonth = 6;
      const expYear = 2027;

      expect(isCardExpired(expMonth, expYear)).toBe(false);
      expect(formatCardExpiry(expMonth, expYear)).toBe('06/27');
    });

    it('should handle missing data consistently across functions', () => {
      expect(isCardExpired(undefined, undefined)).toBe(false);
      expect(formatCardExpiry(undefined, undefined)).toBe('');
    });

    it('should provide consistent status information', () => {
      const status: PaymentMethodStatus = 'ACTIVE';

      expect(isPaymentMethodUsable(status)).toBe(true);
      expect(getStatusLabel(status)).toBe('Active');
      expect(getStatusBadgeVariant(status)).toBe('success');
    });

    it('should handle inactive payment method correctly', () => {
      const status: PaymentMethodStatus = 'INACTIVE';

      expect(isPaymentMethodUsable(status)).toBe(false);
      expect(getStatusLabel(status)).toBe('Inactive');
      expect(getStatusBadgeVariant(status)).toBe('secondary');
    });
  });
});
