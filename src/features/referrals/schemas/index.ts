/**
 * Zod schemas for validation
 */
import { z } from 'zod';

export const generateReferralLinkSchema = z.object({
  affiliateId: z.number().positive('Affiliate ID must be positive'),
  propertyId: z.string().uuid('Invalid property ID'),
  expirationDays: z.number().min(1).max(365).optional().default(90),
});

export const trackClickSchema = z.object({
  referralLinkId: z.string().uuid('Invalid referral link ID'),
  ipAddress: z.string().ip('Invalid IP address'),
  userAgent: z.string().min(1, 'User agent is required'),
  fingerprint: z.string().optional(),
  countryCode: z.string().length(2).optional(),
  referer: z.string().url().optional(),
});

// Form schemas
export const createReferralLinkFormSchema = z.object({
  propertyId: z.string().uuid('Please select a valid property'),
  expirationDays: z.coerce
    .number()
    .min(1, 'Minimum 1 day')
    .max(365, 'Maximum 365 days'),
});

export type GenerateReferralLinkFormData = z.infer<typeof createReferralLinkFormSchema>;