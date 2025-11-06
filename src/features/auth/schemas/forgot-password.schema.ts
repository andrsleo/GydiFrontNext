/**
 * Forgot Password Schema
 *
 * Zod validation schema for forgot password form.
 */

import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;