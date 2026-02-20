/**
 * Subscription Plans Constants
 *
 * Defines available subscription plans with ROLE-SPECIFIC commission rates.
 * Users can be AFFILIATE, HOST, or BOTH.
 *
 * ✅ **CORRECT Commission Structure:**
 * - **AFFILIATE**: RECEIVES commission FROM platform (2%, 5%, 10%)
 * - **HOST**: PAYS commission TO platform (25%, 20%, 15%)
 * - **PLATFORM**: Earns profit = (host fee - affiliate commission)
 *
 * @example
 * // User with PRO plan, $100 booking:
 * // As AFFILIATE: Platform PAYS $5 (5%) → Affiliate receives $5
 * // As HOST: Platform CHARGES $20 (20%) → Host receives $80 ($100 - $20)
 * // Platform profit: $20 - $5 = $15
 */

import type { SubscriptionPlan } from '@/types/user';

// Re-export SubscriptionPlan type for convenience
export type { SubscriptionPlan } from '@/types/user';

/**
 * User Roles
 */
export type UserRole = 'AFFILIATE' | 'HOST' | 'BOTH';

/**
 * Subscription Plan Names
 */
export const SUBSCRIPTION_PLANS = {
  FREE: 'FREE' as SubscriptionPlan,
  PRO: 'PRO' as SubscriptionPlan,
  ELITE: 'ELITE' as SubscriptionPlan,
} as const;

/**
 * Commission rates by plan and role
 *
 * **SEMANTICS:**
 * - `affiliateEarns`: % that platform PAYS to affiliate
 * - `platformCharges`: % that platform CHARGES to host (platform fee)
 */
export const COMMISSION_RATES: Record<
  SubscriptionPlan,
  {
    affiliateEarns: number;     // Platform PAYS this to affiliate
    platformChargesHost: number // Platform CHARGES this to host
  }
> = {
  FREE: {
    affiliateEarns: 0.02,         // Platform PAYS 2% to affiliate
    platformChargesHost: 0.25,    // Platform CHARGES 25% to host
  },
  PRO: {
    affiliateEarns: 0.05,         // Platform PAYS 5% to affiliate
    platformChargesHost: 0.20,    // Platform CHARGES 20% to host
  },
  ELITE: {
    affiliateEarns: 0.10,         // Platform PAYS 10% to affiliate
    platformChargesHost: 0.15,    // Platform CHARGES 15% to host
  },
};

/**
 * @deprecated Use COMMISSION_RATES with new property names instead
 * Legacy keys for backward compatibility
 */
export const COMMISSION_RATES_LEGACY = {
  FREE: { affiliate: 0.02, host: 0.25 },
  PRO: { affiliate: 0.05, host: 0.20 },
  ELITE: { affiliate: 0.10, host: 0.15 },
} as const;

/**
 * Plan pricing (USD per month)
 */
export const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  FREE: 0,      // Free
  PRO: 19.00,   // $19.00/month
  ELITE: 39.00, // $39.00/month
};

/**
 * Resource limits by plan
 *
 * ⚠️ **NOTA: LÍMITES DESACTIVADOS TEMPORALMENTE**
 * Los planes actualmente solo se diferencian por porcentaje de comisiones.
 * Los límites de recursos (propiedades, referidos) NO se aplican por el momento.
 *
 * Esta constante se mantiene para posible uso futuro, pero actualmente
 * no hay validaciones activas que bloqueen operaciones por límites.
 *
 * @deprecated Temporalmente no se usa. Los planes solo se diferencian por comisiones.
 */
export const PLAN_LIMITS = {
  FREE: {
    properties: Infinity,  // Sin límite (desactivado)
    referrals: Infinity,   // Sin límite (desactivado)
  },
  PRO: {
    properties: Infinity,  // Sin límite (desactivado)
    referrals: Infinity,   // Sin límite (desactivado)
  },
  ELITE: {
    properties: Infinity,  // Sin límite (desactivado)
    referrals: Infinity,   // Sin límite (desactivado)
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
    tagline: 'Empieza sin riesgo y descubre cómo funciona',

    // AFFILIATE benefits — lo que RECIBES de la plataforma por referir
    affiliate: {
      commission: COMMISSION_RATES.FREE.affiliateEarns,
      commissionDisplay: '2%',
      benefits: [
        'Recibes 2% de comisión por cada reserva generada con tu link',
        'La plataforma te paga directo en cada reserva confirmada',
      ],
    },

    // HOST benefits — lo que la plataforma te DESCUENTA por cada reserva vía referido
    host: {
      platformFee: COMMISSION_RATES.FREE.platformChargesHost,
      platformFeeDisplay: '25%',
      benefits: [
        'GYDI descuenta 25% de cada reserva generada por afiliados',
        'Tú recibes el 75% restante — solo pagas si hay reserva confirmada',
      ],
    },

    key: 'Ideal para probar la plataforma sin compromiso. Funciona tanto si quieres referir propiedades como si tienes propiedades en renta.',
    cta: 'Empezar gratis',
    badge: null,
    color: 'gray',
    popular: false,
  },

  PRO: {
    name: 'Pro',
    price: PLAN_PRICES.PRO,
    priceDisplay: '$19/mes',
    tagline: 'Más comisión, más herramientas, más resultados',

    // AFFILIATE benefits — lo que RECIBES de la plataforma por referir
    affiliate: {
      commission: COMMISSION_RATES.PRO.affiliateEarns,
      commissionDisplay: '5%',
      previousRate: '2%',
      benefits: [
        'Recibes 5% de comisión por cada reserva generada con tu link',
        'Ganas 2.5x más que en el plan FREE por la misma reserva',
      ],
    },

    // HOST benefits — lo que la plataforma te DESCUENTA por cada reserva vía referido
    host: {
      platformFee: COMMISSION_RATES.PRO.platformChargesHost,
      platformFeeDisplay: '20%',
      benefits: [
        'GYDI descuenta 20% de cada reserva generada por afiliados',
        'Tú recibes el 80% restante — 5% más que en el plan FREE',
      ],
    },

    key: 'Sin contratos, cancela cuando quieras. Los beneficios aplican según el rol que uses: afiliado, anfitrión o ambos.',
    cta: 'Pasar a PRO',
    badge: 'Más popular',
    color: 'blue',
    popular: true,
  },

  ELITE: {
    name: 'Elite',
    price: PLAN_PRICES.ELITE,
    priceDisplay: '$39/mes',
    tagline: 'El máximo retorno para quienes van en serio',

    // AFFILIATE benefits — lo que RECIBES de la plataforma por referir
    affiliate: {
      commission: COMMISSION_RATES.ELITE.affiliateEarns,
      commissionDisplay: '10%',
      previousRates: ['2%', '5%'],
      benefits: [
        'Recibes 10% de comisión — la tasa más alta de la plataforma',
        'Duplicas las ganancias del plan PRO en cada referido exitoso',
      ],
    },

    // HOST benefits — lo que la plataforma te DESCUENTA por cada reserva vía referido
    host: {
      platformFee: COMMISSION_RATES.ELITE.platformChargesHost,
      platformFeeDisplay: '15%',
      benefits: [
        'GYDI descuenta solo 15% de cada reserva generada por afiliados',
        'Tú recibes el 85% restante — la mejor tarifa de la plataforma',
      ],
    },

    key: 'Diseñado para anfitriones con múltiples propiedades y afiliados de alto volumen que quieren maximizar cada reserva.',
    cta: 'Unirme a ELITE',
    badge: 'Mejor valor',
    color: 'purple',
    popular: false,
  },
} as const;

/**
 * Calculate affiliate earnings (what platform PAYS to affiliate)
 *
 * @param plan - Affiliate's subscription plan
 * @param bookingAmount - Total booking amount
 * @returns Amount affiliate receives from platform
 *
 * @example
 * // Affiliate with PRO plan, $100 booking
 * calculateAffiliateEarnings('PRO', 100) // Returns 5.00 (platform pays 5%)
 */
export function calculateAffiliateEarnings(
  plan: SubscriptionPlan,
  bookingAmount: number
): number {
  return bookingAmount * COMMISSION_RATES[plan].affiliateEarns;
}

/**
 * Calculate platform fee (what platform CHARGES to host)
 *
 * @param plan - Host's subscription plan
 * @param bookingAmount - Total booking amount
 * @returns Amount platform charges to host
 *
 * @example
 * // Host with PRO plan, $100 booking
 * calculatePlatformFee('PRO', 100) // Returns 20.00 (platform charges 20%)
 */
export function calculatePlatformFee(
  plan: SubscriptionPlan,
  bookingAmount: number
): number {
  return bookingAmount * COMMISSION_RATES[plan].platformChargesHost;
}

/**
 * Calculate host net income (what host receives after platform fee)
 *
 * @param plan - Host's subscription plan
 * @param bookingAmount - Total booking amount
 * @returns Amount host receives (booking - platform fee)
 *
 * @example
 * // Host with PRO plan, $100 booking
 * calculateHostNetIncome('PRO', 100) // Returns 80.00 ($100 - $20 fee)
 */
export function calculateHostNetIncome(
  plan: SubscriptionPlan,
  bookingAmount: number
): number {
  const platformFee = calculatePlatformFee(plan, bookingAmount);
  return bookingAmount - platformFee;
}

/**
 * Calculate platform profit (platform fee - affiliate commission)
 *
 * @param hostPlan - Host's subscription plan
 * @param affiliatePlan - Affiliate's subscription plan
 * @param bookingAmount - Total booking amount
 * @returns Platform's net profit
 *
 * @example
 * // Host PRO, Affiliate PRO, $100 booking
 * calculatePlatformProfit('PRO', 'PRO', 100) // Returns 15.00 ($20 - $5)
 */
export function calculatePlatformProfit(
  hostPlan: SubscriptionPlan,
  affiliatePlan: SubscriptionPlan,
  bookingAmount: number
): number {
  const platformFee = calculatePlatformFee(hostPlan, bookingAmount);
  const affiliateEarnings = calculateAffiliateEarnings(affiliatePlan, bookingAmount);
  return platformFee - affiliateEarnings;
}

/**
 * @deprecated Use calculateAffiliateEarnings or calculatePlatformFee instead
 * Legacy function for backward compatibility
 */
export function getCommissionAmount(
  plan: SubscriptionPlan,
  role: 'AFFILIATE' | 'HOST',
  bookingAmount: number
): number {
  if (role === 'AFFILIATE') {
    return calculateAffiliateEarnings(plan, bookingAmount);
  } else {
    return calculatePlatformFee(plan, bookingAmount);
  }
}

/**
 * Format affiliate commission rate for display
 *
 * @example
 * formatAffiliateRate('PRO') // Returns "5%"
 */
export function formatAffiliateRate(plan: SubscriptionPlan): string {
  const rate = COMMISSION_RATES[plan].affiliateEarns;
  return `${(rate * 100).toFixed(0)}%`;
}

/**
 * Format host platform fee rate for display
 *
 * @example
 * formatHostFeeRate('PRO') // Returns "20%"
 */
export function formatHostFeeRate(plan: SubscriptionPlan): string {
  const rate = COMMISSION_RATES[plan].platformChargesHost;
  return `${(rate * 100).toFixed(0)}%`;
}

/**
 * @deprecated Use formatAffiliateRate or formatHostFeeRate instead
 */
export function formatCommissionRate(
  plan: SubscriptionPlan,
  role: 'AFFILIATE' | 'HOST'
): string {
  if (role === 'AFFILIATE') {
    return formatAffiliateRate(plan);
  } else {
    return formatHostFeeRate(plan);
  }
}

/**
 * Get commission rates for both roles with correct semantics
 *
 * @example
 * getBothCommissionRates('PRO')
 * // Returns { affiliateEarns: "5%", platformCharges: "20%" }
 */
export function getBothCommissionRates(plan: SubscriptionPlan): {
  affiliateEarns: string;
  platformCharges: string;
} {
  return {
    affiliateEarns: formatAffiliateRate(plan),
    platformCharges: formatHostFeeRate(plan),
  };
}

/**
 * Format price for display
 *
 * @example
 * formatPrice(0) // Returns "Gratis"
 * formatPrice(19) // Returns "$19/mes"
 */
export function formatPrice(price: number): string {
  if (price === 0) return 'Gratis';
  return `$${price.toFixed(0)}/mes`;
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
 * Note: All plans have unlimited referrals now
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
 * Calculate affiliate commission increase when upgrading
 *
 * @example
 * getAffiliateCommissionIncrease('FREE', 'PRO')
 * // Returns 3 (from 2% to 5%, increase of 3 percentage points)
 */
export function getAffiliateCommissionIncrease(
  fromPlan: SubscriptionPlan,
  toPlan: SubscriptionPlan
): number {
  const fromRate = COMMISSION_RATES[fromPlan].affiliateEarns;
  const toRate = COMMISSION_RATES[toPlan].affiliateEarns;
  return (toRate - fromRate) * 100;
}

/**
 * Calculate platform fee decrease when host upgrades (lower % charged)
 *
 * @example
 * getHostFeeDecrease('FREE', 'PRO')
 * // Returns 5 (from 25% to 20%, decrease of 5 percentage points)
 */
export function getHostFeeDecrease(
  fromPlan: SubscriptionPlan,
  toPlan: SubscriptionPlan
): number {
  const fromRate = COMMISSION_RATES[fromPlan].platformChargesHost;
  const toRate = COMMISSION_RATES[toPlan].platformChargesHost;
  return (fromRate - toRate) * 100; // Positive number means saving
}

/**
 * @deprecated Use getAffiliateCommissionIncrease or getHostFeeDecrease instead
 */
export function getCommissionIncrease(
  fromPlan: SubscriptionPlan,
  toPlan: SubscriptionPlan,
  role: 'AFFILIATE' | 'HOST'
): number {
  if (role === 'AFFILIATE') {
    return getAffiliateCommissionIncrease(fromPlan, toPlan);
  } else {
    return -getHostFeeDecrease(fromPlan, toPlan); // Negative because it's actually a decrease
  }
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

/**
 * Check if plan has unlimited referrals
 * Note: All plans now have unlimited referrals
 *
 * @example
 * hasUnlimitedReferrals('FREE') // Returns true
 * hasUnlimitedReferrals('PRO') // Returns true
 */
export function hasUnlimitedReferrals(plan: SubscriptionPlan): boolean {
  return PLAN_LIMITS[plan].referrals === Infinity;
}
