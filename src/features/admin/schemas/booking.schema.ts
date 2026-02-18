/**
 * Booking Validation Schemas
 *
 * Zod schemas for booking form validation
 */

import { z } from 'zod';

/**
 * Reserve booking schema (confirm with Airbnb)
 */
export const reserveBookingSchema = z.object({
  airbnbConfirmationCode: z
    .string()
    .min(1, 'El código de confirmación es requerido')
    .regex(/^[A-Z0-9]+$/, 'Código inválido (solo letras mayúsculas y números)'),
  totalAmount: z
    .number({ required_error: 'El monto total es requerido' })
    .positive('El monto debe ser mayor a 0')
    .min(1, 'El monto mínimo es 1'),
  currency: z.enum(['USD', 'EUR', 'GBP', 'MXN'], {
    required_error: 'La moneda es requerida',
  }),
  checkInDate: z.string().optional(),
  checkOutDate: z.string().optional(),
}).refine(
  (data) => {
    // If both dates are provided, check-out must be after check-in
    if (data.checkInDate && data.checkOutDate) {
      const checkIn = new Date(data.checkInDate);
      const checkOut = new Date(data.checkOutDate);
      return checkOut > checkIn;
    }
    return true;
  },
  {
    message: 'La fecha de check-out debe ser posterior al check-in',
    path: ['checkOutDate'],
  }
);

export type ReserveBookingFormData = z.infer<typeof reserveBookingSchema>;

/**
 * Cancel booking schema
 */
export const cancelBookingSchema = z.object({
  reason: z
    .string()
    .min(10, 'La razón debe tener al menos 10 caracteres')
    .max(500, 'La razón no puede exceder 500 caracteres'),
});

export type CancelBookingFormData = z.infer<typeof cancelBookingSchema>;

/**
 * Dispute booking schema
 */
export const disputeBookingSchema = z.object({
  reason: z
    .string()
    .min(10, 'La razón de disputa debe tener al menos 10 caracteres')
    .max(500, 'La razón no puede exceder 500 caracteres'),
});

export type DisputeBookingFormData = z.infer<typeof disputeBookingSchema>;

/**
 * Create booking schema
 */
export const createBookingSchema = z.object({
  referralLinkId: z.number().int().positive(),
  propertyId: z.number().int().positive(),
  checkInDate: z.string().refine(
    (date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime()) && parsed >= new Date();
    },
    { message: 'La fecha de check-in debe ser futura' }
  ),
  checkOutDate: z.string(),
  guestEmail: z.string().email('Email inválido'),
  guestFirstName: z.string().min(2, 'Nombre muy corto').max(50),
  guestLastName: z.string().min(2, 'Apellido muy corto').max(50),
  guestPhone: z.string().optional(),
  guestsCount: z
    .number()
    .int()
    .min(1, 'Debe haber al menos 1 huésped')
    .max(20, 'Máximo 20 huéspedes'),
}).refine(
  (data) => {
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    return checkOut > checkIn;
  },
  {
    message: 'La fecha de check-out debe ser posterior al check-in',
    path: ['checkOutDate'],
  }
);

export type CreateBookingFormData = z.infer<typeof createBookingSchema>;
