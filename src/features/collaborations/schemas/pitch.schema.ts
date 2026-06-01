/**
 * Zod schema for pitch submission form
 */

import { z } from 'zod';

const deliverableSchema = z.object({
  type: z.string().min(1, 'Selecciona un tipo de entregable'),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
  notes: z.string().optional(),
});

const compensationSchema = z.object({
  type: z.string().min(1, 'Selecciona un tipo de compensación'),
  nights: z.number().int().positive().optional(),
  amount: z.number().positive().optional(),
  currency: z.string().optional(),
  bookingCommissionPct: z.number().min(0).max(100).optional(),
  experienceItems: z.array(z.string()).optional(),
});

export const pitchSchema = z.object({
  propertyId: z.number().int().positive('ID de propiedad inválido'),
  introduction: z
    .string()
    .min(50, 'La introducción debe tener al menos 50 caracteres')
    .max(1000, 'La introducción no puede superar 1000 caracteres'),
  portfolioUrl: z
    .string()
    .url('Ingresa una URL válida')
    .optional()
    .or(z.literal('')),
  preferredCheckIn: z.string().min(1, 'Selecciona una fecha de entrada'),
  preferredCheckOut: z.string().min(1, 'Selecciona una fecha de salida'),
  deliverables: z
    .array(deliverableSchema)
    .min(1, 'Agrega al menos un entregable'),
  compensation: compensationSchema,
});

export type PitchFormData = z.infer<typeof pitchSchema>;
