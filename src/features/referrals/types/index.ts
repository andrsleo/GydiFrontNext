/**
 * TypeScript types for Referrals feature
 * Matches backend DTOs from Spring Boot
 */

export type ReferralLinkStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'DELETED';
export type CommissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
export type DeviceType = 'DESKTOP' | 'MOBILE' | 'TABLET' | 'UNKNOWN';

export interface ReferralLink {
  id: string;
  affiliateId: number;
  propertyId: string;
  encryptedToken: string;
  shortCode: string;
  fullUrl: string;
  qrCodeUrl: string;
  clicksCount: number;
  conversionsCount: number;
  totalCommission: number;
  conversionRate: number;
  status: ReferralLinkStatus;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * SECURITY: affiliateId removed from request
 * Server extracts it from JWT token to prevent IDOR attacks
 *
 * NOTE: expirationDays is NO LONGER accepted
 * The backend automatically calculates expiration based on user's plan:
 * - FREE: 30 days
 * - PRO: 90 days
 * - ELITE: 365 days
 */
export interface GenerateReferralLinkRequest {
  propertyId: string;
}

export interface GenerateReferralLinkResponse {
  id: string;
  encryptedToken: string;
  shortCode: string;
  fullUrl: string;
  qrCodeUrl: string;
  expiresAt: string;
  createdAt: string;
}

export interface TrackClickRequest {
  referralLinkId: string;
  ipAddress: string;
  userAgent: string;
  fingerprint?: string;
  countryCode?: string;
  referer?: string;
}

export interface Commission {
  id: string;
  referralLinkId: string;
  affiliateId: number;
  propertyId: string;
  commissionRate: number;
  commissionAmount: number;
  affiliatePlan: string;
  status: CommissionStatus;
  remainingHoldDays: number;
  isReadyForApproval: boolean;
  isPayable: boolean;
  createdAt: string;
}

export interface ReferralStats {
  affiliateId: number;

  // Link stats
  totalLinks: number;
  activeLinks: number;
  expiredLinks: number;

  // Click stats
  totalClicks: number;
  uniqueClicks: number;
  clicksLast30Days: number;
  clicksByCountry: Record<string, number>;
  clicksByDevice: Record<string, number>;

  // Conversion stats
  totalConversions: number;
  conversionsLast30Days: number;
  overallConversionRate: number;

  // Financial stats
  totalEarnings: number;
  pendingCommissions: number;
  approvedCommissions: number;
  paidCommissions: number;
  earningsByMonth: Record<string, number>;
}

export interface Earnings {
  affiliateId: number;
  currentPlan: string;
  currentCommissionRate: number;

  // Totals
  totalEarnings: number;
  pendingAmount: number;
  approvedAmount: number;
  paidAmount: number;

  // Counts
  pendingCount: number;
  approvedCount: number;
  paidCount: number;

  // Next payout
  nextPayoutAmount: number;
  nextPayoutDate: string | null;

  // Recent history
  recentCommissions: Commission[];
}

// UI Helper Types
export interface ReferralLinkWithQR extends ReferralLink {
  qrCodeDataUrl?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}