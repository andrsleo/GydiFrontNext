import { describe, it, expect } from 'vitest';
import { getRecommendedUpgradePlan } from './subscription';
import type { PlanResponse } from '@/features/subscriptions/types';

describe('subscription utils', () => {
  describe('getRecommendedUpgradePlan', () => {
    // Mock plan data
    const freePlan: PlanResponse = {
      id: 1,
      planCode: 'FREE',
      planName: 'Free Plan',
      description: 'Basic features',
      monthlyPrice: 0,
      currency: 'USD',
      commissionRate: 0.02,
      referralLimitPerMonth: 10,
      propertyPublishLimit: 5,
      isActive: true,
      isFeatured: false,
      displayOrder: 1,
      stripePriceId: null,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const proPlan: PlanResponse = {
      id: 2,
      planCode: 'PRO',
      planName: 'Pro Plan',
      description: 'Advanced features',
      monthlyPrice: 29,
      currency: 'USD',
      commissionRate: 0.05,
      referralLimitPerMonth: 50,
      propertyPublishLimit: 50,
      isActive: true,
      isFeatured: true,
      displayOrder: 2,
      stripePriceId: 'price_pro',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const plusPlan: PlanResponse = {
      id: 3,
      planCode: 'PLUS',
      planName: 'Plus Plan',
      description: 'Premium features',
      monthlyPrice: 99,
      currency: 'USD',
      commissionRate: 0.15,
      referralLimitPerMonth: -1,
      propertyPublishLimit: -1,
      isActive: true,
      isFeatured: false,
      displayOrder: 3,
      stripePriceId: 'price_plus',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    describe('with valid upgrade path', () => {
      it('should recommend PRO when user is on FREE', () => {
        const plans = [freePlan, proPlan, plusPlan];
        const result = getRecommendedUpgradePlan(plans, 'FREE');
        expect(result).toBe('PRO');
      });

      it('should recommend PLUS when user is on PRO', () => {
        const plans = [freePlan, proPlan, plusPlan];
        const result = getRecommendedUpgradePlan(plans, 'PRO');
        expect(result).toBe('PLUS');
      });

      it('should recommend PRO when explicitly on FREE plan', () => {
        const plans = [freePlan, proPlan, plusPlan];
        const result = getRecommendedUpgradePlan(plans, 'FREE');
        expect(result).toBe('PRO');
      });
    });

    describe('with no upgrade available', () => {
      it('should return undefined when user is on highest plan (PLUS)', () => {
        const plans = [freePlan, proPlan, plusPlan];
        const result = getRecommendedUpgradePlan(plans, 'PLUS');
        expect(result).toBeUndefined();
      });

      it('should return PRO as fallback when user is on FREE (only plan available)', () => {
        const plans = [freePlan];
        const result = getRecommendedUpgradePlan(plans, 'FREE');
        // Function has a fallback to recommend PRO for FREE users even if PRO doesn't exist in plans
        expect(result).toBe('PRO');
      });
    });

    describe('with unsorted plans', () => {
      it('should correctly sort plans by price and recommend next tier', () => {
        const unsortedPlans = [plusPlan, freePlan, proPlan]; // Random order
        const result = getRecommendedUpgradePlan(unsortedPlans, 'FREE');
        expect(result).toBe('PRO'); // Should still recommend PRO
      });

      it('should handle reverse-sorted plans', () => {
        const reversePlans = [plusPlan, proPlan, freePlan];
        const result = getRecommendedUpgradePlan(reversePlans, 'PRO');
        expect(result).toBe('PLUS');
      });
    });

    describe('with edge cases', () => {
      it('should return undefined when plans array is empty', () => {
        const result = getRecommendedUpgradePlan([], 'FREE');
        expect(result).toBeUndefined();
      });

      it('should return undefined when plans is null', () => {
        const result = getRecommendedUpgradePlan(null as unknown as PlanResponse[], 'FREE');
        expect(result).toBeUndefined();
      });

      it('should return undefined when plans is undefined', () => {
        const result = getRecommendedUpgradePlan(undefined as unknown as PlanResponse[], 'FREE');
        expect(result).toBeUndefined();
      });

      it('should return PRO when currentPlanCode is FREE (fallback)', () => {
        const plans = [freePlan, proPlan, plusPlan];
        const result = getRecommendedUpgradePlan(plans, 'FREE');
        expect(result).toBe('PRO');
      });

      it('should return undefined for unknown plan code (not FREE)', () => {
        const plans = [freePlan, proPlan, plusPlan];
        const result = getRecommendedUpgradePlan(plans, 'UNKNOWN' as string);
        // Unknown plan not found in list and not 'FREE', so no recommendation
        expect(result).toBeUndefined();
      });
    });

    describe('with two-tier system', () => {
      it('should recommend PRO when only FREE and PRO exist', () => {
        const plans = [freePlan, proPlan];
        const result = getRecommendedUpgradePlan(plans, 'FREE');
        expect(result).toBe('PRO');
      });

      it('should return undefined when user is on PRO and PLUS does not exist', () => {
        const plans = [freePlan, proPlan];
        const result = getRecommendedUpgradePlan(plans, 'PRO');
        expect(result).toBeUndefined();
      });
    });

    describe('with plans having same price', () => {
      it('should handle plans with identical prices', () => {
        const duplicatePricePlans: PlanResponse[] = [
          freePlan,
          { ...proPlan, monthlyPrice: 29 },
          { ...plusPlan, id: 4, planCode: 'PREMIUM', monthlyPrice: 29 },
        ];

        const result = getRecommendedUpgradePlan(duplicatePricePlans, 'FREE');
        // Should recommend the first plan in the sorted order after FREE
        expect(result).toBeDefined();
      });
    });

    describe('price sorting validation', () => {
      it('should respect price-based sorting', () => {
        const customPlans: PlanResponse[] = [
          { ...freePlan, monthlyPrice: 0 },
          { ...proPlan, monthlyPrice: 50 },
          { ...plusPlan, planCode: 'BASIC', monthlyPrice: 10 },
        ];

        // User on FREE (0) should be recommended BASIC (10), not PRO (50)
        const result = getRecommendedUpgradePlan(customPlans, 'FREE');
        expect(result).toBe('BASIC');
      });

      it('should handle large price differences', () => {
        const extremePlans: PlanResponse[] = [
          { ...freePlan, monthlyPrice: 0 },
          { ...plusPlan, monthlyPrice: 9999 },
        ];

        const result = getRecommendedUpgradePlan(extremePlans, 'FREE');
        expect(result).toBe('PLUS');
      });
    });

    describe('consistency and immutability', () => {
      it('should not mutate input plans array', () => {
        const originalPlans = [freePlan, proPlan, plusPlan];
        const plansCopy = [...originalPlans];

        getRecommendedUpgradePlan(originalPlans, 'FREE');

        expect(originalPlans).toEqual(plansCopy);
        expect(originalPlans[0]).toBe(freePlan); // References should be preserved
      });

      it('should return consistent results for same input', () => {
        const plans = [freePlan, proPlan, plusPlan];

        const result1 = getRecommendedUpgradePlan(plans, 'PRO');
        const result2 = getRecommendedUpgradePlan(plans, 'PRO');

        expect(result1).toBe(result2);
      });
    });

    describe('real-world scenarios', () => {
      it('should handle typical upgrade flow: FREE -> PRO -> PLUS', () => {
        const plans = [freePlan, proPlan, plusPlan];

        // User starts on FREE
        const step1 = getRecommendedUpgradePlan(plans, 'FREE');
        expect(step1).toBe('PRO');

        // User upgrades to PRO
        const step2 = getRecommendedUpgradePlan(plans, 'PRO');
        expect(step2).toBe('PLUS');

        // User upgrades to PLUS (highest tier)
        const step3 = getRecommendedUpgradePlan(plans, 'PLUS');
        expect(step3).toBeUndefined(); // No more upgrades
      });

      it('should handle user skipping a tier', () => {
        const plans = [freePlan, proPlan, plusPlan];

        // User goes directly from FREE to PLUS (skips PRO)
        const result = getRecommendedUpgradePlan(plans, 'FREE');
        expect(result).toBe('PRO'); // Still recommends next logical tier
      });
    });
  });
});
