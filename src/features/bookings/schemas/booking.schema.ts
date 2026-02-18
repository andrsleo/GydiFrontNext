import { z } from 'zod';

/**
 * Zod schema for booking form validation
 *
 * ✅ UPDATED: Field names match backend CreateBookingRequest DTO
 */
export const createBookingSchema = z.object({
  referralLinkId: z.string().min(1, 'Referral link ID is required'),
  propertyId: z.string().min(1, 'Property ID is required'),
  checkInDate: z.string().min(1, 'Check-in date is required'),
  checkOutDate: z.string().min(1, 'Check-out date is required'),
  guestName: z.string().min(3, 'Full name must be at least 3 characters'),
  guestEmail: z.string().email('Invalid email address'),
  guestPhone: z.string().min(10, 'Phone must be at least 10 digits'),
  guestsCount: z.number().int().min(1, 'At least 1 guest is required').max(50, 'Maximum 50 guests allowed'),
}).refine((data) => {
  const start = new Date(data.checkInDate);
  const end = new Date(data.checkOutDate);
  return end > start;
}, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOutDate'],
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
