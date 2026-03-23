/**
 * Commission types for USER (affiliate/host)
 *
 * SEMANTIC CLARITY:
 * - AFFILIATE: RECEIVES commission FROM platform (platform PAYS affiliate)
 * - HOST: PAYS commission TO platform (platform CHARGES host)
 */

/**
 * Affiliate commission status — matches backend ReferralCommissionStatus enum
 */
export type AffiliateCommissionStatus =
  | 'WAITING_HOST_CHARGE' // Created, waiting for host charge to succeed before advancing
  | 'PENDING'             // Host charged, but affiliate has no Stripe Connect yet
  | 'APPROVED'            // Ready for payout on next scheduled date (1st or 15th)
  | 'PAID'                // Successfully transferred to affiliate's Stripe account
  | 'CANCELLED'           // Booking cancelled or disputed before payment
  | 'WITHHELD'            // Payment withheld (investigation or policy violation)
  | 'DISPUTED';           // Booking under dispute, commission frozen

/**
 * Commission DTO - Matches backend ReferralCommissionDto
 */
export interface CommissionDto {
  id: number;
  bookingId: number;
  plan: 'FREE' | 'PRO' | 'ELITE';
  commissionRate: number;
  bookingAmount: number;
  commissionAmount: number;
  currency: string;
  status: AffiliateCommissionStatus;
  createdAt: string;
  paidAt?: string;

  // Relations (populated from backend)
  propertyTitle?: string;
  guestName?: string;
  affiliateName?: string;
  hostName?: string;
}

/**
 * Commission Filters Input
 */
export interface CommissionFiltersInput {
  status?: string;
  startDate?: string; // ISO date
  endDate?: string; // ISO date
  page?: number;
  size?: number;
}

/**
 * Commission Stats
 */
export interface CommissionStats {
  totalEarned: number; // For affiliates (platform PAYS)
  totalPaid: number; // For hosts (platform CHARGES)
  pending: number;
  currency: string;
}

/**
 * Status labels for display — maps all backend ReferralCommissionStatus values to Spanish
 */
export const COMMISSION_STATUS_LABELS: Record<string, string> = {
  WAITING_HOST_CHARGE: 'Esperando cobro al host',
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  PAID: 'Pagada',
  CANCELLED: 'Cancelada',
  WITHHELD: 'Retenida',
  DISPUTED: 'En disputa',
};

/**
 * Status variant helper for Badge component
 */
export function getCommissionStatusVariant(
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    WAITING_HOST_CHARGE: 'outline',
    PENDING: 'secondary',
    APPROVED: 'default',
    PAID: 'default',
    CANCELLED: 'destructive',
    WITHHELD: 'destructive',
    DISPUTED: 'outline',
  };
  return variants[status] || 'outline';
}

/**
 * Status label helper
 */
export function getCommissionStatusLabel(status: string): string {
  return COMMISSION_STATUS_LABELS[status] || status;
}

/**
 * Onboarding Link DTO - Stripe Connect onboarding URL
 */
export interface OnboardingLinkDto {
  url: string;
  stripeAccountId: string;
  expiresAt: string;
}

/**
 * Connect Account Status DTO - Stripe Connect account status
 */
export interface ConnectAccountStatusDto {
  hasAccount: boolean;
  onboardingCompleted: boolean;
  payoutsEnabled: boolean;
  verificationStatus: string;
  stripeAccountId: string | null;
}
