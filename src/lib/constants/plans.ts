/**
 * Subscription Plans Constants
 *
 * Defines the available subscription plans and their commission rates.
 * Commission is earned when a referred user subscribes to a plan.
 */

export const SUBSCRIPTION_PLANS = {
  BASIC: 'BASIC',
  PRO: 'PRO',
  PLUS: 'PLUS',
} as const;

export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS];

/**
 * Commission rates by plan
 * - BASIC: 2% per referral subscription
 * - PRO: 5% per referral subscription
 * - PLUS: 15% per referral subscription
 */
export const COMMISSION_RATES: Record<SubscriptionPlan, number> = {
  [SUBSCRIPTION_PLANS.BASIC]: 0.02,  // 2%
  [SUBSCRIPTION_PLANS.PRO]: 0.05,    // 5%
  [SUBSCRIPTION_PLANS.PLUS]: 0.15,   // 15%
};

/**
 * Plan pricing (USD per month)
 */
export const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  [SUBSCRIPTION_PLANS.BASIC]: 0,     // Free
  [SUBSCRIPTION_PLANS.PRO]: 29,      // $29/month
  [SUBSCRIPTION_PLANS.PLUS]: 99,     // $99/month
};

/**
 * Plan features and limits
 */
export const PLAN_FEATURES = {
  [SUBSCRIPTION_PLANS.BASIC]: {
    name: 'Basic',
    price: PLAN_PRICES.BASIC,
    commission: COMMISSION_RATES.BASIC,
    commissionDisplay: '2%',
    maxReferrals: 10,
    features: [
      'Hasta 10 referidos por mes',
      'Link de referido básico',
      'Comisión del 2%',
      'Dashboard básico',
    ],
    badge: null,
  },
  [SUBSCRIPTION_PLANS.PRO]: {
    name: 'Pro',
    price: PLAN_PRICES.PRO,
    commission: COMMISSION_RATES.PRO,
    commissionDisplay: '5%',
    maxReferrals: 50,
    features: [
      'Hasta 50 referidos por mes',
      'Link de referido + QR Code',
      'Comisión del 5%',
      'Analytics avanzado',
      'Soporte prioritario',
    ],
    badge: 'Más popular',
  },
  [SUBSCRIPTION_PLANS.PLUS]: {
    name: 'Plus',
    price: PLAN_PRICES.PLUS,
    commission: COMMISSION_RATES.PLUS,
    commissionDisplay: '15%',
    maxReferrals: Infinity,
    features: [
      'Referidos ilimitados',
      'Link + QR + Widget personalizado',
      'Comisión del 15%',
      'Analytics completo + API access',
      'White label disponible',
      'Gerente de cuenta dedicado',
    ],
    badge: 'Mejor valor',
  },
} as const;

/**
 * Get commission amount for a subscription
 */
export function getCommissionAmount(plan: SubscriptionPlan, subscriptionAmount: number): number {
  const rate = COMMISSION_RATES[plan];
  return subscriptionAmount * rate;
}

/**
 * Format commission rate for display
 */
export function formatCommissionRate(plan: SubscriptionPlan): string {
  const rate = COMMISSION_RATES[plan];
  return `${(rate * 100).toFixed(0)}%`;
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  if (price === 0) return 'Gratis';
  return `$${price}/mes`;
}

/**
 * Check if user can add more referrals based on plan
 */
export function canAddReferral(plan: SubscriptionPlan, currentReferrals: number): boolean {
  const maxReferrals = PLAN_FEATURES[plan].maxReferrals;
  return currentReferrals < maxReferrals;
}

/**
 * Get upgrade suggestions
 */
export function getUpgradeSuggestions(currentPlan: SubscriptionPlan): SubscriptionPlan[] {
  switch (currentPlan) {
    case SUBSCRIPTION_PLANS.BASIC:
      return [SUBSCRIPTION_PLANS.PRO, SUBSCRIPTION_PLANS.PLUS];
    case SUBSCRIPTION_PLANS.PRO:
      return [SUBSCRIPTION_PLANS.PLUS];
    case SUBSCRIPTION_PLANS.PLUS:
      return [];
    default:
      return [];
  }
}
