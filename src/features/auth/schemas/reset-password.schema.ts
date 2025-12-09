/**
 * Reset Password Schema
 *
 * Zod validation schema for reset password form with strong password requirements.
 *
 * Password requirements (matches backend @StrongPassword):
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (@$!%*?&)
 * - Not a common password (password123, qwerty, etc.)
 */

import { z } from 'zod';
import { PASSWORD_RULES, validatePasswordStrength } from '@/lib/password-validator';

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(PASSWORD_RULES.minLength, `La contraseña debe tener al menos ${PASSWORD_RULES.minLength} caracteres`)
      .max(PASSWORD_RULES.maxLength, `La contraseña no debe exceder ${PASSWORD_RULES.maxLength} caracteres`)
      .regex(PASSWORD_RULES.patterns.uppercase, 'Debe contener al menos una letra mayúscula (A-Z)')
      .regex(PASSWORD_RULES.patterns.lowercase, 'Debe contener al menos una letra minúscula (a-z)')
      .regex(PASSWORD_RULES.patterns.digit, 'Debe contener al menos un número (0-9)')
      .regex(PASSWORD_RULES.patterns.specialChar, 'Debe contener al menos un carácter especial (@$!%*?&)')
      .refine(
        (password) => {
          const result = validatePasswordStrength(password);
          return !result.errors.some((error) => error.includes('too common'));
        },
        {
          message: 'Esta contraseña es muy común y fácil de adivinar. Por favor elige una contraseña más segura',
        }
      ),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;