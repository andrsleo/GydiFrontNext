/**
 * Property Validation Schemas (Zod)
 * Client-side validation matching backend constraints
 */

import { z } from 'zod';
import { PropertyType, Currency } from '../types';

/**
 * Create Property Schema
 * Validates all required fields for property creation
 */
export const createPropertySchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),

  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional(),

  pricePerNight: z
    .number()
    .positive('Price must be positive')
    .min(1, 'Price must be at least 1')
    .max(999999.99, 'Price is too high'),

  currency: z.nativeEnum(Currency, {
    errorMap: () => ({ message: 'Invalid currency' }),
  }),

  country: z
    .string()
    .min(2, 'Country is required')
    .max(100, 'Country name too long')
    .trim(),

  city: z
    .string()
    .min(2, 'City is required')
    .max(100, 'City name too long')
    .trim(),

  address: z
    .string()
    .max(200, 'Address too long')
    .trim()
    .optional(),

  postalCode: z
    .string()
    .max(20, 'Postal code too long')
    .trim()
    .optional(),

  amenities: z
    .array(z.string().trim())
    .max(50, 'Maximum 50 amenities allowed')
    .optional()
    .default([]),

  bedrooms: z
    .number()
    .int('Bedrooms must be a whole number')
    .min(0, 'Bedrooms cannot be negative')
    .max(50, 'Maximum 50 bedrooms'),

  bathrooms: z
    .number()
    .int('Bathrooms must be a whole number')
    .min(0, 'Bathrooms cannot be negative')
    .max(50, 'Maximum 50 bathrooms'),

  maxGuests: z
    .number()
    .int('Max guests must be a whole number')
    .min(1, 'At least 1 guest required')
    .max(100, 'Maximum 100 guests'),

  propertyType: z.nativeEnum(PropertyType, {
    errorMap: () => ({ message: 'Invalid property type' }),
  }),
});

/**
 * Update Property Schema
 * All fields optional for partial updates
 */
export const updatePropertySchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim()
    .optional(),

  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional(),

  pricePerNight: z
    .number()
    .positive('Price must be positive')
    .min(1, 'Price must be at least 1')
    .max(999999.99, 'Price is too high')
    .optional(),

  currency: z
    .nativeEnum(Currency, {
      errorMap: () => ({ message: 'Invalid currency' }),
    })
    .optional(),

  country: z
    .string()
    .min(2, 'Country is required')
    .max(100, 'Country name too long')
    .trim()
    .optional(),

  city: z
    .string()
    .min(2, 'City is required')
    .max(100, 'City name too long')
    .trim()
    .optional(),

  address: z
    .string()
    .max(200, 'Address too long')
    .trim()
    .optional(),

  postalCode: z
    .string()
    .max(20, 'Postal code too long')
    .trim()
    .optional(),

  amenities: z
    .array(z.string().trim())
    .max(50, 'Maximum 50 amenities allowed')
    .optional(),

  bedrooms: z
    .number()
    .int('Bedrooms must be a whole number')
    .min(0, 'Bedrooms cannot be negative')
    .max(50, 'Maximum 50 bedrooms')
    .optional(),

  bathrooms: z
    .number()
    .int('Bathrooms must be a whole number')
    .min(0, 'Bathrooms cannot be negative')
    .max(50, 'Maximum 50 bathrooms')
    .optional(),

  maxGuests: z
    .number()
    .int('Max guests must be a whole number')
    .min(1, 'At least 1 guest required')
    .max(100, 'Maximum 100 guests')
    .optional(),

  propertyType: z
    .nativeEnum(PropertyType, {
      errorMap: () => ({ message: 'Invalid property type' }),
    })
    .optional(),
});

/**
 * Property Filters Schema
 * For search and filtering
 */
export const propertyFiltersSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED', 'INACTIVE', 'DELETED']).optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  minBedrooms: z.number().int().min(0).optional(),
  maxBedrooms: z.number().int().min(0).optional(),
  minBathrooms: z.number().int().min(0).optional(),
  maxBathrooms: z.number().int().min(0).optional(),
  minGuests: z.number().int().min(1).optional(),
  maxGuests: z.number().int().min(1).optional(),
  page: z.number().int().min(0).optional().default(0),
  size: z.number().int().min(1).max(100).optional().default(20),
  sortBy: z.enum(['price', 'createdAt', 'publishedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Image Upload Validation
 * Max 10 images, 10MB each, jpg/png/webp only
 */
export const imageUploadSchema = z.object({
  files: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= 10 * 1024 * 1024, {
          message: 'Image must be less than 10MB',
        })
        .refine(
          (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
          {
            message: 'Only JPG, PNG, and WEBP formats are allowed',
          }
        )
    )
    .min(1, 'At least one image is required')
    .max(20, 'Maximum 20 images allowed'),
});

/**
 * Video Upload Validation
 * Max 2 videos, 500MB each, mp4/webm only
 */
export const videoUploadSchema = z.object({
  files: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= 500 * 1024 * 1024, {
          message: 'Video must be less than 500MB',
        })
        .refine((file) => ['video/mp4', 'video/webm'].includes(file.type), {
          message: 'Only MP4 and WEBM formats are allowed',
        })
    )
    .min(1, 'At least one video is required')
    .max(2, 'Maximum 2 videos allowed'),
});

/**
 * Export inferred types for use with React Hook Form
 */
export type CreatePropertyFormData = z.infer<typeof createPropertySchema>;
export type UpdatePropertyFormData = z.infer<typeof updatePropertySchema>;
export type PropertyFiltersFormData = z.infer<typeof propertyFiltersSchema>;
export type ImageUploadFormData = z.infer<typeof imageUploadSchema>;
export type VideoUploadFormData = z.infer<typeof videoUploadSchema>;
