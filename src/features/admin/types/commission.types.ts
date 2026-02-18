/**
 * Admin Commission Types
 *
 * Types for commission management matching backend DTOs
 */

import type { Currency } from './booking.types';

/**
 * Subscription plan enum
 */
export type SubscriptionPlan = 'FREE' | 'PRO' | 'ELITE';

/**
 * Host commission status
 */
export type HostCommissionStatus = 'PENDING' | 'PROCESSING' | 'CHARGED' | 'FAILED' | 'REFUNDED';

/**
 * Affiliate commission status
 */
export type AffiliateCommissionStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';

/**
 * Host Commission DTO (platform charges host)
 */
export interface HostCommissionDto {
  id: number;
  bookingId: number;
  hostId: number;
  hostPlan: SubscriptionPlan;

  // Commission calculation
  commissionRate: number; // 0.25, 0.20, 0.15
  bookingAmount: number;
  commissionAmount: number;
  currency: Currency;

  // Payment status
  status: HostCommissionStatus;
  stripePaymentIntentId?: string;
  chargedAt?: string;
  failureReason?: string;
  attemptCount: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Affiliate Commission DTO (platform pays affiliate)
 */
export interface AffiliateCommissionDto {
  id: number;
  bookingId: number;
  affiliateId: number;
  affiliatePlan: SubscriptionPlan;

  // Commission calculation
  commissionRate: number; // 0.02, 0.05, 0.10
  bookingAmount: number;
  commissionAmount: number;
  currency: Currency;

  // Payment schedule
  scheduledPaymentDate: string;
  disputePeriodEndsAt: string;

  // Payment status
  status: AffiliateCommissionStatus;
  stripeTransferId?: string;
  paidAt?: string;
  failureReason?: string;
  attemptCount: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Commission filters
 */
export interface CommissionFilters {
  status?: string;
  plan?: SubscriptionPlan;
  page?: number;
  size?: number;
}

/**
 * Commission statistics
 */
export interface CommissionStats {
  totalHostCommissions: number;
  totalAffiliateCommissions: number;
  platformProfit: number;
  pendingHostCharges: number;
  pendingAffiliatePayments: number;
  currency: Currency;
}

/**
 * Host Commission Status Configuration
 */
export const HOST_COMMISSION_STATUS_CONFIG: Record<HostCommissionStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'warning' | 'success';
}> = {
  PENDING: { label: 'Pendiente', variant: 'secondary' },
  PROCESSING: { label: 'Procesando', variant: 'default' },
  CHARGED: { label: 'Cobrado', variant: 'success' },
  FAILED: { label: 'Fallido', variant: 'destructive' },
  REFUNDED: { label: 'Reembolsado', variant: 'warning' },
};

/**
 * Affiliate Commission Status Configuration
 */
export const AFFILIATE_COMMISSION_STATUS_CONFIG: Record<AffiliateCommissionStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'success';
}> = {
  PENDING: { label: 'Pendiente', variant: 'secondary' },
  APPROVED: { label: 'Aprobado', variant: 'default' },
  PAID: { label: 'Pagado', variant: 'success' },
  CANCELLED: { label: 'Cancelado', variant: 'destructive' },
};
