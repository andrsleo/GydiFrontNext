/**
 * Subscription Plans Constants
 *
 * Defines the available subscription plans, commission rates, and resource limits.
 * This file is aligned with the backend SubscriptionPlan enum.
 *
 * Commission Structure:
 * - When a user refers someone who subscribes, they earn a commission
 * - Commission rate depends on the REFERRER's plan (not the referred user's plan)
 *
 * Example: User with PRO plan (5%) refers someone who subscribes to ELITE ($99.99)
 * → User earns: $99.99 × 5% = $4.99
 */

import type { SubscriptionPlan } from '@/types/user';

/**
 * Subscription Plan Names
 */
export const SUBSCRIPTION_PLANS = {
  FREE: 'FREE' as SubscriptionPlan,
  PRO: 'PRO' as SubscriptionPlan,
  ELITE: 'ELITE' as SubscriptionPlan,
} as const;

/**
 * Commission rates by plan
 *
 * - FREE: 2% per referral subscription
 * - PRO: 5% per referral subscription
 * - ELITE: 10% per referral subscription
 */
export const COMMISSION_RATES: Record<SubscriptionPlan, number> = {
  FREE: 0.02, // 2%
  PRO: 0.05, // 5%
  ELITE: 0.10, // 10%
};

/**
 * Plan pricing (USD per month)
 */
export const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  FREE: 0, // Free
  PRO: 29.99, // $29.99/month
  ELITE: 99.99, // $99.99/month
};

/**
 * Resource limits by plan
 *
 * Properties: Number of properties that can be published
 * Referrals: Number of referral links that can be generated
 */
export const PLAN_LIMITS = {
  FREE: {
    properties: 10,
    referrals: 50,
  },
  PRO: {
    properties: 50,
    referrals: 200,
  },
  ELITE: {
    properties: Infinity,
    referrals: Infinity,
  },
} as const;

/**
 * Plan features and details for UI display
 */
export const PLAN_FEATURES = {
  FREE: {
    name: 'Free',
    price: PLAN_PRICES.FREE,
    priceDisplay: 'Gratis',
    commission: COMMISSION_RATES.FREE,
    commissionDisplay: '2%',
    maxProperties: PLAN_LIMITS.FREE.properties,
    maxReferrals: PLAN_LIMITS.FREE.referrals,
    features: [
      'Hasta 10 propiedades',
      'Hasta 50 referidos',
      'Link de referido básico',
      'Comisión del 2%',
      'Dashboard básico',
    ],
    badge: null,
    color: 'gray',
  },
  PRO: {
    name: 'Pro',
    price: PLAN_PRICES.PRO,
    priceDisplay: '$29.99/mes',
    commission: COMMISSION_RATES.PRO,
    commissionDisplay: '5%',
    maxProperties: PLAN_LIMITS.PRO.properties,
    maxReferrals: PLAN_LIMITS.PRO.referrals,
    features: [
      'Hasta 50 propiedades',
      'Hasta 200 referidos',
      'Link de referido + QR Code',
      'Comisión del 5%',
      'Analytics avanzado',
      'Exportación de datos',
      'Soporte prioritario',
    ],
    badge: 'Más popular',
    color: 'blue',
  },
  ELITE: {
    name: 'Elite',
    price: PLAN_PRICES.ELITE,
    priceDisplay: '$99.99/mes',
    commission: COMMISSION_RATES.ELITE,
    commissionDisplay: '10%',
    maxProperties: PLAN_LIMITS.ELITE.properties,
    maxReferrals: PLAN_LIMITS.ELITE.referrals,
    features: [
      'Propiedades ilimitadas',
      'Referidos ilimitados',
      'Link + QR + Widget personalizado',
      'Comisión del 10%',
      'Analytics completo + API access',
      'Estadísticas globales',
      'White label disponible',
      'Gerente de cuenta dedicado',
    ],
    badge: 'Mejor valor',
    color: 'purple',
  },
} as const;

/**
 * Get commission amount for a subscription
 *
 * @param referrerPlan - Plan of the user who made the referral
 * @param subscriptionAmount - Amount of the referred user's subscription
 * @returns Commission amount in the same currency
 *
 * @example
 * // User with PRO plan refers someone who subscribes to ELITE
 * getCommissionAmount('PRO', 99.99) // Returns 4.9995 (~$5)
 */
export function getCommissionAmount(
  referrerPlan: SubscriptionPlan,
  subscriptionAmount: number
): number {
  const rate = COMMISSION_RATES[referrerPlan];
  return subscriptionAmount * rate;
}

/**
 * Format commission rate for display
 *
 * @example
 * formatCommissionRate('PRO') // Returns "5%"
 */
export function formatCommissionRate(plan: SubscriptionPlan): string {
  const rate = COMMISSION_RATES[plan];
  return `${(rate * 100).toFixed(0)}%`;
}

/**
 * Format price for display
 *
 * @example
 * formatPrice(0) // Returns "Gratis"
 * formatPrice(29.99) // Returns "$29.99/mes"
 */
export function formatPrice(price: number): string {
  if (price === 0) return 'Gratis';
  return `$${price.toFixed(2)}/mes`;
}

/**
 * Format resource limit for display
 *
 * @example
 * formatLimit(10) // Returns "10"
 * formatLimit(Infinity) // Returns "Ilimitado"
 */
export function formatLimit(limit: number): string {
  return limit === Infinity ? 'Ilimitado' : limit.toString();
}

/**
 * Check if user can add more properties based on plan
 *
 * @param plan - User's subscription plan
 * @param currentProperties - Number of properties currently published
 * @returns True if user can publish more properties
 */
export function canAddProperty(plan: SubscriptionPlan, currentProperties: number): boolean {
  const maxProperties = PLAN_LIMITS[plan].properties;
  return currentProperties < maxProperties;
}

/**
 * Check if user can add more referrals based on plan
 *
 * @param plan - User's subscription plan
 * @param currentReferrals - Number of referrals currently generated
 * @returns True if user can generate more referrals
 */
export function canAddReferral(plan: SubscriptionPlan, currentReferrals: number): boolean {
  const maxReferrals = PLAN_LIMITS[plan].referrals;
  return currentReferrals < maxReferrals;
}

/**
 * Get remaining capacity for a resource
 *
 * @param plan - User's subscription plan
 * @param resourceType - Type of resource ('properties' or 'referrals')
 * @param currentCount - Current number of resources
 * @returns Remaining capacity (number or Infinity)
 */
export function getRemainingCapacity(
  plan: SubscriptionPlan,
  resourceType: 'properties' | 'referrals',
  currentCount: number
): number {
  const limit = PLAN_LIMITS[plan][resourceType];
  if (limit === Infinity) return Infinity;
  return Math.max(0, limit - currentCount);
}

/**
 * Get upgrade suggestions based on current plan
 *
 * Returns an array of plans that are upgrades from the current plan.
 *
 * @example
 * getUpgradeSuggestions('FREE') // Returns ['PRO', 'ELITE']
 * getUpgradeSuggestions('PRO') // Returns ['ELITE']
 * getUpgradeSuggestions('ELITE') // Returns []
 */
export function getUpgradeSuggestions(currentPlan: SubscriptionPlan): SubscriptionPlan[] {
  switch (currentPlan) {
    case SUBSCRIPTION_PLANS.FREE:
      return [SUBSCRIPTION_PLANS.PRO, SUBSCRIPTION_PLANS.ELITE];
    case SUBSCRIPTION_PLANS.PRO:
      return [SUBSCRIPTION_PLANS.ELITE];
    case SUBSCRIPTION_PLANS.ELITE:
      return [];
    default:
      return [];
  }
}

/**
 * Check if a plan is an upgrade from another plan
 *
 * @example
 * isUpgrade('FREE', 'PRO') // Returns true
 * isUpgrade('PRO', 'FREE') // Returns false
 */
export function isUpgrade(fromPlan: SubscriptionPlan, toPlan: SubscriptionPlan): boolean {
  const planOrder = [SUBSCRIPTION_PLANS.FREE, SUBSCRIPTION_PLANS.PRO, SUBSCRIPTION_PLANS.ELITE];
  const fromIndex = planOrder.indexOf(fromPlan);
  const toIndex = planOrder.indexOf(toPlan);
  return toIndex > fromIndex;
}

/**
 * Calculate monthly savings between plans
 *
 * @example
 * // If upgrading from FREE to PRO
 * calculateMonthlySavings('FREE', 'PRO') // Returns 0 (no savings, PRO costs money)
 *
 * // For commission comparison:
 * // FREE: 2% of $100 = $2
 * // PRO: 5% of $100 = $5
 * // Extra commission per $100: $3
 */
export function getExtraCommissionPercentage(
  fromPlan: SubscriptionPlan,
  toPlan: SubscriptionPlan
): number {
  const fromRate = COMMISSION_RATES[fromPlan];
  const toRate = COMMISSION_RATES[toPlan];
  return (toRate - fromRate) * 100;
}

/**
 * Get plan color for UI theming
 *
 * @example
 * getPlanColor('PRO') // Returns 'blue'
 */
export function getPlanColor(plan: SubscriptionPlan): string {
  return PLAN_FEATURES[plan].color;
}

/**
 * Get plan badge text (if any)
 *
 * @example
 * getPlanBadge('PRO') // Returns 'Más popular'
 * getPlanBadge('FREE') // Returns null
 */
export function getPlanBadge(plan: SubscriptionPlan): string | null {
  return PLAN_FEATURES[plan].badge;
}

/**
 * Check if plan has unlimited resources
 *
 * @example
 * hasUnlimitedResources('ELITE') // Returns true
 * hasUnlimitedResources('PRO') // Returns false
 */
export function hasUnlimitedResources(plan: SubscriptionPlan): boolean {
  return plan === SUBSCRIPTION_PLANS.ELITE;
}