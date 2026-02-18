/**
 * Commission types for USER (affiliate/host)
 *
 * SEMANTIC CLARITY:
 * - AFFILIATE: RECEIVES commission FROM platform (platform PAYS affiliate)
 * - HOST: PAYS commission TO platform (platform CHARGES host)
 */

/**
 * Commission DTO - Matches backend CommissionDto
 */
export interface CommissionDto {
  id: number;
  bookingId: number;
  plan: 'FREE' | 'PRO' | 'ELITE';
  commissionRate: number;
  bookingAmount: number;
  commissionAmount: number;
  currency: string;
  status: string; // PENDING, APPROVED, PAID, REJECTED
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
 * Status labels for display
 */
export const COMMISSION_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  PAID: 'Pagada',
  REJECTED: 'Rechazada',
};

/**
 * Status variant helper for Badge component
 */
export function getCommissionStatusVariant(
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    PENDING: 'secondary',
    APPROVED: 'default',
    PAID: 'default',
    REJECTED: 'destructive',
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
