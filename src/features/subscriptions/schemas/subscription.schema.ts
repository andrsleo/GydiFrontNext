/**
 * Subscription Zod Schemas
 *
 * Validation schemas for subscription-related forms.
 */

import { z } from 'zod';

// ==================== Form Schemas ====================

/**
 * Subscribe to plan form schema
 */
export const subscribeToPlanSchema = z.object({
  planCode: z.enum(['FREE', 'PRO', 'ELITE'], {
    required_error: 'Please select a plan',
  }),
  paymentMethodId: z.number().nullable(),
  autoRenew: z.boolean(),
});

export type SubscribeToPlanFormData = z.infer<typeof subscribeToPlanSchema>;

/**
 * Change plan form schema
 */
export const changePlanSchema = z.object({
  newPlanCode: z.enum(['FREE', 'PRO', 'ELITE'], {
    required_error: 'Please select a new plan',
  }),
  paymentMethodId: z.number().nullable(),
});

export type ChangePlanFormData = z.infer<typeof changePlanSchema>;

/**
 * Cancel subscription form schema
 */
export const cancelSubscriptionSchema = z.object({
  reason: z
    .string()
    .min(10, 'Please provide a reason (minimum 10 characters)')
    .max(500, 'Reason is too long (maximum 500 characters)'),
  cancelImmediately: z.boolean(),
});

export type CancelSubscriptionFormData = z.infer<typeof cancelSubscriptionSchema>;

/**
 * Payment method form schema (for Stripe integration)
 */
export const paymentMethodSchema = z.object({
  billingEmail: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  saveAsDefault: z.boolean(),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

/**
 * Create payment method schema (internal - after Stripe tokenization)
 */
export const createPaymentMethodSchema = z.object({
  stripePaymentMethodId: z
    .string()
    .min(1, 'Stripe payment method ID is required')
    .startsWith('pm_', 'Invalid Stripe payment method ID'),
  billingEmail: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  isDefault: z.boolean(),
});

export type CreatePaymentMethodSchemaData = z.infer<typeof createPaymentMethodSchema>;

// ==================== Constants for Validation ====================

/**
 * Allowed plan codes
 */
export const PLAN_CODES = ['FREE', 'PRO', 'ELITE'] as const;
export type PlanCode = (typeof PLAN_CODES)[number];

/**
 * Cancellation reason templates (for UI)
 */
export const CANCELLATION_REASONS = [
  'Too expensive',
  'Not using the service enough',
  'Missing features I need',
  'Switching to a competitor',
  'Technical issues',
  'Other',
] as const;
