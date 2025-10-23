import type { SubscriptionPlan } from '@/types/user';

/**
 * Subscription status
 */
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'TRIALING';

/**
 * User subscription
 *
 * Represents a user's current subscription with commission rates:
 * - FREE: 2% commission (0.02)
 * - PRO: 5% commission (0.05)
 * - ELITE: 10% commission (0.10)
 */
export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  commissionRate: number; // 0.02, 0.05, or 0.10 (updated from 0.15)
  currentPeriodStart: Date | string;
  currentPeriodEnd: Date | string;
  autoRenew: boolean;
  cancelAtPeriodEnd: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Earning status
 */
export type EarningStatus = 'PENDING' | 'PAID' | 'CANCELLED';

/**
 * Earning from a referral subscription
 */
export interface Earning {
  id: string;
  userId: string;
  referralId: string;
  referredUserId: string;
  subscriptionId: string;
  amount: number;
  commissionRate: number;
  status: EarningStatus;
  description: string;
  createdAt: Date | string;
  paidAt?: Date | string;
  cancelledAt?: Date | string;
}

/**
 * Earnings summary statistics
 */
export interface EarningsStats {
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  earningsGrowth: number; // Percentage growth vs last month
  totalReferralSubscriptions: number;
  activeReferralSubscriptions: number;
}

/**
 * Monthly earnings data point (for charts)
 */
export interface MonthlyEarning {
  month: string; // 'YYYY-MM'
  monthLabel: string; // 'Jan 2025'
  amount: number;
  count: number; // Number of earnings
}

/**
 * Upgrade plan request
 */
export interface UpgradePlanRequest {
  newPlan: SubscriptionPlan;
  paymentMethodId?: string; // Stripe payment method ID
}

/**
 * Upgrade plan response
 */
export interface UpgradePlanResponse {
  subscription: Subscription;
  requiresPayment: boolean;
  clientSecret?: string; // Stripe client secret for payment confirmation
}

/**
 * Cancel subscription request
 */
export interface CancelSubscriptionRequest {
  reason?: string;
  cancelImmediately?: boolean; // If false, cancel at period end
}