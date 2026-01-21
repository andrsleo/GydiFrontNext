import { describe, it, expect } from 'vitest';
import { getCardBrandColor, CARD_BRAND_COLORS } from './card-brands';

describe('card-brands', () => {
  describe('CARD_BRAND_COLORS', () => {
    it('should have all required card brand colors defined', () => {
      expect(CARD_BRAND_COLORS).toHaveProperty('visa');
      expect(CARD_BRAND_COLORS).toHaveProperty('mastercard');
      expect(CARD_BRAND_COLORS).toHaveProperty('amex');
      expect(CARD_BRAND_COLORS).toHaveProperty('discover');
      expect(CARD_BRAND_COLORS).toHaveProperty('diners');
      expect(CARD_BRAND_COLORS).toHaveProperty('jcb');
      expect(CARD_BRAND_COLORS).toHaveProperty('unionpay');
      expect(CARD_BRAND_COLORS).toHaveProperty('default');
    });

    it('should have valid Tailwind CSS color classes', () => {
      Object.values(CARD_BRAND_COLORS).forEach((color) => {
        expect(color).toMatch(/^bg-\w+-\d{3}$/);
      });
    });
  });

  describe('getCardBrandColor', () => {
    describe('with valid card brands', () => {
      it('should return correct color for visa', () => {
        expect(getCardBrandColor('visa')).toBe('bg-blue-600');
      });

      it('should return correct color for mastercard', () => {
        expect(getCardBrandColor('mastercard')).toBe('bg-orange-600');
      });

      it('should return correct color for amex', () => {
        expect(getCardBrandColor('amex')).toBe('bg-teal-600');
      });

      it('should return correct color for discover', () => {
        expect(getCardBrandColor('discover')).toBe('bg-purple-600');
      });

      it('should return correct color for diners', () => {
        expect(getCardBrandColor('diners')).toBe('bg-indigo-600');
      });

      it('should return correct color for jcb', () => {
        expect(getCardBrandColor('jcb')).toBe('bg-pink-600');
      });

      it('should return correct color for unionpay', () => {
        expect(getCardBrandColor('unionpay')).toBe('bg-red-600');
      });
    });

    describe('with case insensitive input', () => {
      it('should handle uppercase card brands', () => {
        expect(getCardBrandColor('VISA')).toBe('bg-blue-600');
        expect(getCardBrandColor('MASTERCARD')).toBe('bg-orange-600');
      });

      it('should handle mixed case card brands', () => {
        expect(getCardBrandColor('Visa')).toBe('bg-blue-600');
        expect(getCardBrandColor('MasterCard')).toBe('bg-orange-600');
      });
    });

    describe('with invalid or missing input', () => {
      it('should return default color for unknown brand', () => {
        expect(getCardBrandColor('unknown')).toBe('bg-gray-600');
        expect(getCardBrandColor('fakebrand')).toBe('bg-gray-600');
      });

      it('should return default color for undefined', () => {
        expect(getCardBrandColor(undefined)).toBe('bg-gray-600');
      });

      it('should return default color for null', () => {
        expect(getCardBrandColor(null)).toBe('bg-gray-600');
      });

      it('should return default color for empty string', () => {
        expect(getCardBrandColor('')).toBe('bg-gray-600');
      });
    });

    describe('edge cases', () => {
      it('should handle whitespace', () => {
        expect(getCardBrandColor(' visa ')).toBe('bg-gray-600'); // Not trimmed by function
      });

      it('should return consistent results for same input', () => {
        const brand = 'visa';
        const result1 = getCardBrandColor(brand);
        const result2 = getCardBrandColor(brand);
        expect(result1).toBe(result2);
      });
    });
  });
});
