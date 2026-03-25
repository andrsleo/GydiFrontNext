/**
 * Subscription Plans Constants
 *
 * Defines available subscription plans with ROLE-SPECIFIC commission rates.
 * Users can be AFFILIATE, HOST, or BOTH.
 *
 * ✅ **CORRECT Commission Structure:**
 * - **AFFILIATE**: RECEIVES commission FROM platform — rate is PROPERTY-BASED, not plan-based:
 *     - 4% base rate (default for all affiliates)
 *     - 6% boosted rate (affiliate has at least 1 PUBLISHED property)
 * - **HOST**: PAYS commission TO platform (15% — plan-based)
 * - **PLATFORM**: Earns profit = (host fee - affiliate commission)
 *
 * @example
 * // Affiliate WITHOUT published property, $100 booking:
 * // Platform PAYS $4 (4%) → Affiliate receives $4
 *
 * // Affiliate WITH published property, $100 booking:
 * // Platform PAYS $6 (6%) → Affiliate receives $6
 *
 * // Host (FREE plan), $100 booking:
 * // Platform CHARGES $15 (15%) → Host receives $85 ($100 - $15)
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
 * Affiliate commission rates — PROPERTY-BASED (not plan-based).
 *
 * The backend evaluates this at booking time (snapshot in ReserveBookingUseCase):
 * - 6% if the affiliate has at least one PUBLISHED property
 * - 4% otherwise (default)
 */
export const AFFILIATE_COMMISSION_RATE_BASE = 0.04;     // 4% — no published property
export const AFFILIATE_COMMISSION_RATE_BOOSTED = 0.06;  // 6% — has a published property

/**
 * Commission rates by plan and role
 *
 * **SEMANTICS:**
 * - `affiliateEarns`: base % that platform PAYS to affiliate (boosted to 6% with published property)
 * - `platformChargesHost`: % that platform CHARGES to host (plan-based)
 */
export const COMMISSION_RATES: Record<
  SubscriptionPlan,
  {
    affiliateEarns: number;     // Platform PAYS this to affiliate (base rate; 6% if has published property)
    platformChargesHost: number // Platform CHARGES this to host
  }
> = {
  FREE: {
    affiliateEarns: AFFILIATE_COMMISSION_RATE_BASE,  // 4% base (6% with published property)
    platformChargesHost: 0.15,                        // Platform CHARGES 15% to host
  },
  PRO: {
    affiliateEarns: AFFILIATE_COMMISSION_RATE_BASE,  // 4% base (6% with published property)
    platformChargesHost: 0.20,                        // Platform CHARGES 20% to host
  },
  ELITE: {
    affiliateEarns: AFFILIATE_COMMISSION_RATE_BASE,  // 4% base (6% with published property)
    platformChargesHost: 0.15,                        // Platform CHARGES 15% to host
  },
};

/**
 * @deprecated Use COMMISSION_RATES with new property names instead
 * Legacy keys for backward compatibility
 */
export const COMMISSION_RATES_LEGACY = {
  FREE: { affiliate: AFFILIATE_COMMISSION_RATE_BASE, host: 0.15 },
  PRO: { affiliate: AFFILIATE_COMMISSION_RATE_BASE, host: 0.20 },
  ELITE: { affiliate: AFFILIATE_COMMISSION_RATE_BASE, host: 0.15 },
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
      commission: AFFILIATE_COMMISSION_RATE_BASE,
      commissionDisplay: '4% — 6%',
      commissionBaseDisplay: '4%',
      commissionBoostedDisplay: '6%',
      benefits: [
        'Recibes 4% de comisión base por cada reserva generada con tu link',
        'Con al menos 1 propiedad publicada, tu tasa sube a 6% automáticamente',
      ],
    },

    // HOST benefits — lo que la plataforma te DESCUENTA por cada reserva vía referido
    host: {
      platformFee: COMMISSION_RATES.FREE.platformChargesHost,
      platformFeeDisplay: '15%',
      benefits: [
        'GYDI descuenta 15% de cada reserva generada por referidos',
        'Tú recibes el 85% restante — solo pagas si hay reserva confirmada',
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
      commission: AFFILIATE_COMMISSION_RATE_BASE,
      commissionDisplay: '4% — 6%',
      commissionBaseDisplay: '4%',
      commissionBoostedDisplay: '6%',
      benefits: [
        'Recibes 4% de comisión base por cada reserva generada con tu link',
        'Con al menos 1 propiedad publicada, tu tasa sube a 6% automáticamente',
      ],
    },

    // HOST benefits — lo que la plataforma te DESCUENTA por cada reserva vía referido
    host: {
      platformFee: COMMISSION_RATES.PRO.platformChargesHost,
      platformFeeDisplay: '20%',
      benefits: [
        'GYDI descuenta 20% de cada reserva generada por referidos',
        'Tú recibes el 80% restante — 5% más que en el plan FREE',
      ],
    },

    key: 'Sin contratos, cancela cuando quieras. Los beneficios aplican según el rol que uses: referido, anfitrión o ambos.',
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
      commission: AFFILIATE_COMMISSION_RATE_BASE,
      commissionDisplay: '4% — 6%',
      commissionBaseDisplay: '4%',
      commissionBoostedDisplay: '6%',
      benefits: [
        'Recibes 4% de comisión base por cada reserva generada con tu link',
        'Con al menos 1 propiedad publicada, tu tasa sube a 6% automáticamente',
      ],
    },

    // HOST benefits — lo que la plataforma te DESCUENTA por cada reserva vía referido
    host: {
      platformFee: COMMISSION_RATES.ELITE.platformChargesHost,
      platformFeeDisplay: '15%',
      benefits: [
        'GYDI descuenta solo 15% de cada reserva generada por referidos',
        'Tú recibes el 85% restante — la mejor tarifa de la plataforma',
      ],
    },

    key: 'Diseñado para anfitriones con múltiples propiedades y referidos de alto volumen que quieren maximizar cada reserva.',
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
 * Get the affiliate commission rate label based on actual rate received from backend.
 * Returns a human-readable badge label with the reason.
 *
 * @param currentCommissionRate - The actual rate (0.04 or 0.06) from the backend Earnings endpoint
 * @returns label and description for display
 *
 * @example
 * getAffiliateBadgeInfo(0.06) // { rate: "6%", label: "6% — Tienes propiedades publicadas", boosted: true }
 * getAffiliateBadgeInfo(0.04) // { rate: "4%", label: "4% — Publica una propiedad para ganar 6%", boosted: false }
 */
export function getAffiliateBadgeInfo(currentCommissionRate: number): {
  rate: string;
  label: string;
  tip: string;
  boosted: boolean;
} {
  const isBoosted = currentCommissionRate >= AFFILIATE_COMMISSION_RATE_BOOSTED;
  const rateDisplay = `${(currentCommissionRate * 100).toFixed(0)}%`;

  if (isBoosted) {
    return {
      rate: rateDisplay,
      label: `${rateDisplay} — Tienes propiedades publicadas`,
      tip: 'Estás ganando la tasa máxima de comisión gracias a tus propiedades publicadas.',
      boosted: true,
    };
  }

  return {
    rate: rateDisplay,
    label: `${rateDisplay} — Tasa base`,
    tip: 'Publica al menos una propiedad para subir tu tasa de comisión a 6%.',
    boosted: false,
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
