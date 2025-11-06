import { z } from 'zod';

/**
 * Profile Update Schema
 *
 * Validation for user profile update form.
 * Aligned with backend UpdateUserProfileRequest.java
 */
export const profileUpdateSchema = z.object({
  // Personal Information
  firstName: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder los 50 caracteres')
    .optional(),

  lastName: z
    .string()
    .min(1, 'El apellido es requerido')
    .max(50, 'El apellido no puede exceder los 50 caracteres')
    .optional(),

  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Número de teléfono inválido (formato E.164)')
    .optional()
    .or(z.literal('')),

  dateOfBirth: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const birthDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        return birthDate < today;
      },
      { message: 'La fecha de nacimiento debe ser en el pasado' }
    )
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const birthDate = new Date(val);
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 120); // 120 years ago
        return birthDate > minDate;
      },
      { message: 'La fecha de nacimiento no es válida' }
    ),

  gender: z
    .enum(['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'], {
      errorMap: () => ({ message: 'Género inválido' }),
    })
    .optional(),

  bio: z
    .string()
    .max(1000, 'La biografía no puede exceder los 1000 caracteres')
    .optional(),

  // Location
  country: z
    .string()
    .min(2, 'El país debe tener al menos 2 caracteres')
    .max(100, 'El país no puede exceder los 100 caracteres')
    .optional(),

  city: z
    .string()
    .max(100, 'La ciudad no puede exceder los 100 caracteres')
    .optional(),

  address: z
    .string()
    .max(255, 'La dirección no puede exceder los 255 caracteres')
    .optional(),

  postalCode: z
    .string()
    .max(20, 'El código postal no puede exceder los 20 caracteres')
    .optional(),

  // Professional
  websiteUrl: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || val === '' || z.string().url().safeParse(val).success,
      { message: 'La URL del sitio web debe ser válida' }
    ),

  // Preferences
  preferredLanguage: z
    .string()
    .max(5, 'El idioma debe tener máximo 5 caracteres')
    .optional(),

  // Images
  coverImageUrl: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || val === '' || z.string().url().safeParse(val).success,
      { message: 'La URL de la imagen debe ser válida' }
    ),

  // Visibility
  profileVisibility: z
    .enum(['public', 'private', 'connections'], {
      errorMap: () => ({ message: 'Visibilidad inválida' }),
    })
    .optional(),

  // Notifications
  emailNotificationsEnabled: z.boolean().optional(),
  smsNotificationsEnabled: z.boolean().optional(),

  // Social Links (JSONB)
  socialLinks: z.record(z.string(), z.string().url()).optional(),

  // Preferences (JSONB)
  preferences: z.record(z.string(), z.unknown()).optional(),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

/**
 * Comprehensive profile form for the configuracion page
 */
export const profileFormSchema = z.object({
  firstName: z.string().max(100).optional().or(z.literal('')),
  lastName: z.string().max(100).optional().or(z.literal('')),
  phoneNumber: z
    .string()
    .max(20)
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || val === '' || /^\+?[1-9]\d{1,14}$/.test(val),
      'Número de teléfono inválido'
    ),
  dateOfBirth: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || val === '' || new Date(val) < new Date(),
      'La fecha debe ser en el pasado'
    ),
  gender: z.enum(['male', 'female', 'non_binary', 'prefer_not_to_say', 'other']).optional(),
  bio: z.string().max(1000).optional().or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  postalCode: z.string().max(20).optional().or(z.literal('')),
  websiteUrl: z.string().max(500).optional().or(z.literal('')),
  preferredLanguage: z.string().max(5).optional().or(z.literal('')),
  coverImageUrl: z.string().max(500).optional().or(z.literal('')),
  profileVisibility: z.enum(['public', 'private', 'connections']).optional(),
  emailNotificationsEnabled: z.boolean().optional(),
  smsNotificationsEnabled: z.boolean().optional(),
  socialLinks: z.record(z.string(), z.string()).optional(),
  preferences: z.record(z.string(), z.unknown()).optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
