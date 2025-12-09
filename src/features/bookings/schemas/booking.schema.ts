import { z } from 'zod';

/**
 * Zod schema for booking form validation
 */
export const createBookingSchema = z.object({
  referralLinkId: z.string().min(1, 'Referral link ID is required'),
  propertyId: z.string().min(1, 'Property ID is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  clientFirstName: z.string().min(2, 'First name must be at least 2 characters'),
  clientLastName: z.string().min(2, 'Last name must be at least 2 characters'),
  clientEmail: z.string().email('Invalid email address'),
  clientPhone: z.string().min(10, 'Phone must be at least 10 digits'),
  totalAmount: z.number().positive('Total amount must be positive'),
  currency: z.string().min(3, 'Currency code is required'),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type CreateBookingFormData = z.infer<typeof createBookingSchema>;

/**
 * Schema for date range selection
 */
export const dateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
}).refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type DateRangeData = z.infer<typeof dateRangeSchema>;
