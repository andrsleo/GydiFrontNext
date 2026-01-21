/**
 * Subscription utility functions
 */

import type { PlanCode } from '@/features/subscriptions/schemas/subscription.schema';
import type { PlanResponse } from '@/features/subscriptions/types';

/**
 * Determines the recommended upgrade plan for a user based on their current plan.
 *
 * @param plans - All available plans sorted by price
 * @param currentPlanCode - The user's current plan code
 * @returns The recommended plan code to upgrade to, or undefined if no upgrade available
 *
 * @example
 * ```ts
 * const plans = [{ planCode: 'FREE', monthlyPrice: 0 }, { planCode: 'PRO', monthlyPrice: 29 }];
 * const recommendation = getRecommendedUpgradePlan(plans, 'FREE');
 * // Returns: 'PRO'
 * ```
 */
export function getRecommendedUpgradePlan(
  plans: PlanResponse[],
  currentPlanCode: string
): PlanCode | undefined {
  if (!plans || plans.length === 0) {
    return undefined;
  }

  const sortedPlans = [...plans].sort((a, b) => a.monthlyPrice - b.monthlyPrice);
  const currentIndex = sortedPlans.findIndex(plan => plan.planCode === currentPlanCode);

  // If current plan found and not the highest tier
  if (currentIndex !== -1 && currentIndex < sortedPlans.length - 1) {
    return sortedPlans[currentIndex + 1].planCode as PlanCode;
  }

  // Default recommendation for free users
  if (currentPlanCode === 'FREE') {
    return 'PRO';
  }

  return undefined;
}
