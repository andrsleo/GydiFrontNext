/**
 * Zod schema for counter-offer form
 */

import { z } from 'zod';

const counterDeliverableSchema = z.object({
  type: z.string().min(1, 'Selecciona un tipo de entregable'),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
});

const counterCompensationSchema = z.object({
  type: z.string().min(1, 'Selecciona un tipo de compensación'),
  nights: z.number().int().positive().optional(),
  amount: z.number().positive().optional(),
  currency: z.string().optional(),
});

export const counterOfferSchema = z.object({
  message: z.string().max(500, 'El mensaje no puede superar 500 caracteres').optional(),
  deliverables: z
    .array(counterDeliverableSchema)
    .min(1, 'Agrega al menos un entregable'),
  compensation: counterCompensationSchema,
});

export type CounterOfferFormData = z.infer<typeof counterOfferSchema>;
