/**
 * Unit tests for commission calculation functions
 *
 * Tests cover:
 * - Affiliate earnings calculations (platform PAYS to affiliate)
 * - Platform fee calculations (platform CHARGES to host)
 * - Host net income calculations
 * - Platform profit calculations
 */

import { describe, it, expect } from 'vitest';
import {
  calculateAffiliateEarnings,
  calculatePlatformFee,
  calculateHostNetIncome,
  calculatePlatformProfit,
  formatAffiliateRate,
  formatHostFeeRate,
  getBothCommissionRates,
  getAffiliateCommissionIncrease,
  getHostFeeDecrease,
} from './plans';

describe('Commission Calculations', () => {
  describe('calculateAffiliateEarnings', () => {
    it('should calculate affiliate earnings for FREE plan (2%)', () => {
      expect(calculateAffiliateEarnings('FREE', 100)).toBe(2);
    });

    it('should calculate affiliate earnings for PRO plan (5%)', () => {
      expect(calculateAffiliateEarnings('PRO', 100)).toBe(5);
    });

    it('should calculate affiliate earnings for ELITE plan (10%)', () => {
      expect(calculateAffiliateEarnings('ELITE', 100)).toBe(10);
    });

    it('should handle decimal amounts correctly', () => {
      expect(calculateAffiliateEarnings('PRO', 33.33)).toBeCloseTo(1.67, 2);
    });

    it('should return 0 for zero booking amount', () => {
      expect(calculateAffiliateEarnings('PRO', 0)).toBe(0);
    });

    it('should work with large amounts', () => {
      expect(calculateAffiliateEarnings('ELITE', 1000)).toBe(100);
    });
  });

  describe('calculatePlatformFee', () => {
    it('should calculate platform fee for FREE host (25%)', () => {
      expect(calculatePlatformFee('FREE', 100)).toBe(25);
    });

    it('should calculate platform fee for PRO host (20%)', () => {
      expect(calculatePlatformFee('PRO', 100)).toBe(20);
    });

    it('should calculate platform fee for ELITE host (15%)', () => {
      expect(calculatePlatformFee('ELITE', 100)).toBe(15);
    });

    it('should handle decimal amounts correctly', () => {
      expect(calculatePlatformFee('PRO', 250)).toBe(50);
    });

    it('should return 0 for zero booking amount', () => {
      expect(calculatePlatformFee('PRO', 0)).toBe(0);
    });
  });

  describe('calculateHostNetIncome', () => {
    it('should calculate host net income for FREE plan ($100 - $25 = $75)', () => {
      expect(calculateHostNetIncome('FREE', 100)).toBe(75);
    });

    it('should calculate host net income for PRO plan ($100 - $20 = $80)', () => {
      expect(calculateHostNetIncome('PRO', 100)).toBe(80);
    });

    it('should calculate host net income for ELITE plan ($100 - $15 = $85)', () => {
      expect(calculateHostNetIncome('ELITE', 100)).toBe(85);
    });

    it('should work with larger amounts', () => {
      expect(calculateHostNetIncome('PRO', 500)).toBe(400);
    });
  });

  describe('calculatePlatformProfit', () => {
    it('should calculate platform profit for FREE/FREE ($25 - $2 = $23)', () => {
      expect(calculatePlatformProfit('FREE', 'FREE', 100)).toBe(23);
    });

    it('should calculate platform profit for PRO/PRO ($20 - $5 = $15)', () => {
      expect(calculatePlatformProfit('PRO', 'PRO', 100)).toBe(15);
    });

    it('should calculate platform profit for ELITE/ELITE ($15 - $10 = $5)', () => {
      expect(calculatePlatformProfit('ELITE', 'ELITE', 100)).toBe(5);
    });

    it('should calculate platform profit for FREE/ELITE ($25 - $10 = $15)', () => {
      expect(calculatePlatformProfit('FREE', 'ELITE', 100)).toBe(15);
    });

    it('should calculate platform profit for mixed plans', () => {
      // Host PRO (charges 20%), Affiliate ELITE (pays 10%)
      expect(calculatePlatformProfit('PRO', 'ELITE', 500)).toBe(50);
    });

    it('should handle very small profits correctly', () => {
      // ELITE host (15%), ELITE affiliate (10%) = 5% profit
      expect(calculatePlatformProfit('ELITE', 'ELITE', 1000)).toBe(50);
    });
  });

  describe('Complete Booking Scenario', () => {
    it('should correctly distribute $100 booking with PRO plans', () => {
      const bookingAmount = 100;
      const hostPlan = 'PRO';
      const affiliatePlan = 'PRO';

      const platformFee = calculatePlatformFee(hostPlan, bookingAmount);
      const affiliateEarnings = calculateAffiliateEarnings(affiliatePlan, bookingAmount);
      const hostNetIncome = calculateHostNetIncome(hostPlan, bookingAmount);
      const platformProfit = calculatePlatformProfit(hostPlan, affiliatePlan, bookingAmount);

      expect(platformFee).toBe(20);           // Platform charges host 20%
      expect(affiliateEarnings).toBe(5);      // Platform pays affiliate 5%
      expect(hostNetIncome).toBe(80);         // Host receives 80%
      expect(platformProfit).toBe(15);        // Platform keeps 15%

      // Verify the math adds up
      expect(hostNetIncome + platformFee).toBe(bookingAmount);
      expect(platformFee).toBe(affiliateEarnings + platformProfit);
    });

    it('should correctly distribute $250 booking with ELITE plans', () => {
      const bookingAmount = 250;
      const hostPlan = 'ELITE';
      const affiliatePlan = 'ELITE';

      const platformFee = calculatePlatformFee(hostPlan, bookingAmount);
      const affiliateEarnings = calculateAffiliateEarnings(affiliatePlan, bookingAmount);
      const hostNetIncome = calculateHostNetIncome(hostPlan, bookingAmount);
      const platformProfit = calculatePlatformProfit(hostPlan, affiliatePlan, bookingAmount);

      expect(platformFee).toBe(37.5);          // 15% of 250
      expect(affiliateEarnings).toBe(25);      // 10% of 250
      expect(hostNetIncome).toBe(212.5);       // 250 - 37.5
      expect(platformProfit).toBe(12.5);       // 37.5 - 25

      // Verify the math adds up
      expect(hostNetIncome + platformFee).toBe(bookingAmount);
      expect(platformFee).toBe(affiliateEarnings + platformProfit);
    });
  });
});

describe('Formatting Functions', () => {
  describe('formatAffiliateRate', () => {
    it('should format FREE rate as "2%"', () => {
      expect(formatAffiliateRate('FREE')).toBe('2%');
    });

    it('should format PRO rate as "5%"', () => {
      expect(formatAffiliateRate('PRO')).toBe('5%');
    });

    it('should format ELITE rate as "10%"', () => {
      expect(formatAffiliateRate('ELITE')).toBe('10%');
    });
  });

  describe('formatHostFeeRate', () => {
    it('should format FREE rate as "25%"', () => {
      expect(formatHostFeeRate('FREE')).toBe('25%');
    });

    it('should format PRO rate as "20%"', () => {
      expect(formatHostFeeRate('PRO')).toBe('20%');
    });

    it('should format ELITE rate as "15%"', () => {
      expect(formatHostFeeRate('ELITE')).toBe('15%');
    });
  });

  describe('getBothCommissionRates', () => {
    it('should return both rates for PRO plan', () => {
      const rates = getBothCommissionRates('PRO');
      expect(rates.affiliateEarns).toBe('5%');
      expect(rates.platformCharges).toBe('20%');
    });
  });
});

describe('Upgrade Calculations', () => {
  describe('getAffiliateCommissionIncrease', () => {
    it('should calculate increase from FREE to PRO (2% → 5% = 3%)', () => {
      expect(getAffiliateCommissionIncrease('FREE', 'PRO')).toBeCloseTo(3, 10);
    });

    it('should calculate increase from PRO to ELITE (5% → 10% = 5%)', () => {
      expect(getAffiliateCommissionIncrease('PRO', 'ELITE')).toBeCloseTo(5, 10);
    });

    it('should calculate increase from FREE to ELITE (2% → 10% = 8%)', () => {
      expect(getAffiliateCommissionIncrease('FREE', 'ELITE')).toBeCloseTo(8, 10);
    });

    it('should return 0 for same plan', () => {
      expect(getAffiliateCommissionIncrease('PRO', 'PRO')).toBe(0);
    });
  });

  describe('getHostFeeDecrease', () => {
    it('should calculate decrease from FREE to PRO (25% → 20% = 5%)', () => {
      expect(getHostFeeDecrease('FREE', 'PRO')).toBeCloseTo(5, 10);
    });

    it('should calculate decrease from PRO to ELITE (20% → 15% = 5%)', () => {
      expect(getHostFeeDecrease('PRO', 'ELITE')).toBeCloseTo(5, 10);
    });

    it('should calculate decrease from FREE to ELITE (25% → 15% = 10%)', () => {
      expect(getHostFeeDecrease('FREE', 'ELITE')).toBe(10);
    });

    it('should return 0 for same plan', () => {
      expect(getHostFeeDecrease('PRO', 'PRO')).toBe(0);
    });
  });
});

describe('Edge Cases', () => {
  it('should handle very small amounts correctly', () => {
    expect(calculateAffiliateEarnings('PRO', 1)).toBeCloseTo(0.05, 2);
    expect(calculatePlatformFee('PRO', 1)).toBeCloseTo(0.20, 2);
  });

  it('should handle very large amounts correctly', () => {
    expect(calculateAffiliateEarnings('ELITE', 1000000)).toBe(100000);
    expect(calculatePlatformFee('FREE', 1000000)).toBe(250000);
  });

  it('should handle decimal booking amounts', () => {
    const booking = 99.99;
    const platformFee = calculatePlatformFee('PRO', booking);
    const affiliateEarnings = calculateAffiliateEarnings('PRO', booking);
    const hostNetIncome = calculateHostNetIncome('PRO', booking);

    // Verify precision
    expect(platformFee).toBeCloseTo(19.998, 2);
    expect(affiliateEarnings).toBeCloseTo(4.9995, 2);
    expect(hostNetIncome).toBeCloseTo(79.992, 2);
  });
});
