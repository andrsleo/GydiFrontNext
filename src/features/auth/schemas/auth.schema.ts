import { z } from 'zod';
import { PASSWORD_RULES, validatePasswordStrength } from '@/lib/password-validator';

/**
 * Login Schema
 *
 * Validation for user login form
 */
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

/**
 * Register Schema
 *
 * Validation for user registration form.
 * Note: Role is no longer required during registration.
 * All new users are created with USER role by default.
 * Names are saved in user_profile (source of truth) and users.name (deprecated, for backwards compatibility).
 *
 * Password requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (@$!%*?&)
 * - Not a common password (password123, qwerty, etc.)
 */
export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
    lastName: z.string().max(100).optional(),
    email: z.string().email('Email inválido'),
    phoneNumber: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
        'Número de teléfono inválido (formato E.164)'
      ),
    password: z
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
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Debes aceptar los términos y condiciones',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
