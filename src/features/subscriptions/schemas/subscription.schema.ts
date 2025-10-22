import { z } from 'zod';
import { SUBSCRIPTION_PLANS } from '@/lib/constants/plans';

/**
 * Validation schema for upgrading subscription plan
 */
export const upgradePlanSchema = z.object({
  newPlan: z.enum([
    SUBSCRIPTION_PLANS.BASIC,
    SUBSCRIPTION_PLANS.PRO,
    SUBSCRIPTION_PLANS.PLUS,
  ]),
  paymentMethodId: z.string().optional(),
});

export type UpgradePlanFormData = z.infer<typeof upgradePlanSchema>;

/**
 * Validation schema for cancelling subscription
 */
export const cancelSubscriptionSchema = z.object({
  reason: z.string().max(500, 'La razón no puede exceder 500 caracteres').optional(),
  cancelImmediately: z.boolean().default(false),
});

export type CancelSubscriptionFormData = z.infer<typeof cancelSubscriptionSchema>;

/**
 * Validation schema for earnings filters
 */
export const earningsFiltersSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'CANCELLED', 'ALL']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().positive().optional(),
});

export type EarningsFiltersFormData = z.infer<typeof earningsFiltersSchema>;