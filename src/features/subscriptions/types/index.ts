/**
 * Subscription Types
 *
 * TypeScript types that match the backend DTOs exactly.
 * These types ensure type-safety between frontend and backend.
 */

// ==================== Enums ====================

/**
 * Subscription status (matches backend SubscriptionStatus enum)
 */
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELED' | 'SUSPENDED';

/**
 * Transaction type (matches backend TransactionType enum)
 */
export type TransactionType =
  | 'INITIAL_SUBSCRIPTION'
  | 'UPGRADE'
  | 'RENEWAL'
  | 'DOWNGRADE'
  | 'CANCELLATION'
  | 'REACTIVATION';

/**
 * Transaction status (matches backend TransactionStatus enum)
 */
export type TransactionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'
  | 'CANCELED';

/**
 * Payment method type (matches backend PaymentMethodType enum)
 */
export type PaymentMethodType =
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'PAYPAL'
  | 'STRIPE'
  | 'OTHER';

/**
 * Payment method status (matches backend PaymentMethodStatus enum)
 */
export type PaymentMethodStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'FAILED' | 'REPLACED';

/**
 * Payment method purpose (matches backend PaymentMethodPurpose enum)
 */
export type PaymentMethodPurpose = 'SUBSCRIPTION' | 'HOST_COMMISSION' | 'BOTH';

// ==================== Response DTOs ====================

/**
 * Plan response (matches PlanResponse DTO from backend)
 */
export interface PlanResponse {
  id: number;
  planCode: string;
  planName: string;
  description: string;
  monthlyPrice: number;
  currency: string;
  billingCycle: string;
  commissionRate: number;
  maxProperties: number;
  maxReferralsPerMonth: number;
  supportLevel: string;
  featuresJson: string;
  stripePriceId: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * User subscription response (matches UserSubscriptionResponse DTO from backend)
 */
export interface UserSubscriptionResponse {
  id: number;
  userId: number;
  planId: number;
  planCode: string;
  planName: string;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt: string | null;
  paymentMethodId: number | null;
  autoRenew: boolean;
  nextBillingDate: string | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  canceledAt: string | null;
  cancelationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payment method response (matches PaymentMethodResponse DTO from backend)
 */
export interface PaymentMethodResponse {
  id: number;
  userId: number;
  methodType: PaymentMethodType;
  cardBrand: string | null;
  cardLastFour: string | null;
  cardExpMonth: number | null;
  cardExpYear: number | null;
  billingEmail: string | null;
  isDefault: boolean;
  /** @deprecated Use status field instead. Kept for backward compatibility. */
  isActive: boolean;
  status: PaymentMethodStatus;
  purpose: PaymentMethodPurpose;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * Subscription transaction response (matches SubscriptionTransactionResponse DTO from backend)
 */
export interface SubscriptionTransactionResponse {
  id: number;
  userSubscriptionId: number;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  fromPlanId: number | null;
  fromPlanCode: string | null;
  fromPlanName: string | null;
  toPlanId: number | null;
  toPlanCode: string | null;
  toPlanName: string | null;
  amount: number;
  currency: string;
  stripePaymentIntentId: string | null;
  stripeChargeId: string | null;
  failureReason: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

// ==================== Request DTOs ====================

/**
 * Subscribe to plan request (matches SubscribeToPlanRequest DTO)
 */
export interface SubscribeToPlanRequest {
  planCode: string;
  paymentMethodId: number | null;
  autoRenew: boolean;
}

/**
 * Change plan request (matches ChangePlanRequest DTO)
 */
export interface ChangePlanRequest {
  newPlanCode: string;
  paymentMethodId: number | null;
}

/**
 * Cancel subscription request (matches CancelSubscriptionRequest DTO)
 */
export interface CancelSubscriptionRequest {
  reason: string;
  cancelImmediately: boolean;
}

/**
 * Create payment method request (matches CreatePaymentMethodRequest DTO)
 */
export interface CreatePaymentMethodRequest {
  stripePaymentMethodId: string;
  billingEmail: string;
  isDefault: boolean;
}

// ==================== Frontend-Only Types ====================

/**
 * Plan card info (for UI display)
 */
export interface PlanCardInfo {
  code: string;
  name: string;
  price: number;
  priceLabel: string;
  commission: number;
  commissionLabel: string;
  maxProperties: number;
  maxReferrals: number;
  features: string[];
  recommended?: boolean;
  popular?: boolean;
}

/**
 * Subscription stats (for dashboard)
 */
export interface SubscriptionStats {
  currentPlan: string;
  commissionRate: number;
  propertiesUsed: number;
  propertiesLimit: number;
  referralsThisMonth: number;
  referralsLimit: number;
  nextBillingDate: string | null;
  totalSpent: number;
}

/**
 * Payment form data (for Stripe integration)
 */
export interface PaymentFormData {
  billingEmail: string;
  saveAsDefault: boolean;
}

/**
 * Upgrade preview (calculation before upgrade)
 */
export interface UpgradePreview {
  fromPlan: string;
  toPlan: string;
  proratedAmount: number;
  nextBillingAmount: number;
  nextBillingDate: string;
  commissionIncrease: number;
}
