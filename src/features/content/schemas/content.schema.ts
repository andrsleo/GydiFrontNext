/**
 * Zod schemas for Content feature
 */

import { z } from 'zod';

export const createContentSchema = z.object({
  caption: z
    .string()
    .max(500, 'La descripción no puede superar los 500 caracteres')
    .optional(),
  type: z.enum(['VIDEO', 'PHOTO', 'CAROUSEL'], {
    required_error: 'Selecciona el tipo de contenido',
  }),
  propertyId: z
    .number({ required_error: 'Selecciona una propiedad' })
    .positive('Selecciona una propiedad válida'),
});

export type CreateContentFormData = z.infer<typeof createContentSchema>;
