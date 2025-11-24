/**
 * Property Validation Schemas (Zod)
 * Client-side validation matching backend constraints
 */

import { z } from 'zod';
import { PropertyType, PropertyListingType, Currency } from '../types';

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
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must not exceed 2000 characters')
    .trim(),

  pricePerNight: z
    .number()
    .positive('Price must be positive')
    .min(1, 'Price must be at least 1')
    .max(999999999.99, 'Price is too high'),

  currency: z.nativeEnum(Currency, {
    errorMap: () => ({ message: 'Invalid currency' }),
  }),

  salePrice: z
    .number()
    .positive('Sale price must be positive')
    .min(1, 'Sale price must be at least 1')
    .max(999999999999.99, 'Sale price is too high')
    .optional(),

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
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address too long')
    .trim(),

  postalCode: z
    .string()
    .min(3, 'Postal code must be at least 3 characters')
    .max(20, 'Postal code too long')
    .trim(),

  amenities: z
    .array(z.string().trim())
    .min(3, 'Please select at least 3 amenities')
    .max(50, 'Maximum 50 amenities allowed'),

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

  listingType: z
    .nativeEnum(PropertyListingType, {
      errorMap: () => ({ message: 'Invalid listing type' }),
    })
    .optional()
    .default(PropertyListingType.SHORT_TERM_RENTAL),
}).refine(
  (data) => {
    // If listing type allows rental (SHORT_TERM_RENTAL or BOTH), pricePerNight is required
    if (
      data.listingType === PropertyListingType.SHORT_TERM_RENTAL ||
      data.listingType === PropertyListingType.BOTH
    ) {
      return data.pricePerNight > 0;
    }
    return true;
  },
  {
    message: 'Price per night is required for rental properties',
    path: ['pricePerNight'],
  }
).refine(
  (data) => {
    // If listing type allows sale (SALE or BOTH), salePrice is required
    if (
      data.listingType === PropertyListingType.SALE ||
      data.listingType === PropertyListingType.BOTH
    ) {
      return data.salePrice != null && data.salePrice > 0;
    }
    return true;
  },
  {
    message: 'Sale price is required when property is for sale',
    path: ['salePrice'],
  }
);

/**
 * Update Property Schema
 * Same validation as create schema - all fields required for data integrity
 */
export const updatePropertySchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),

  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must not exceed 2000 characters')
    .trim(),

  pricePerNight: z
    .number()
    .positive('Price must be positive')
    .min(1, 'Price must be at least 1')
    .max(999999999.99, 'Price is too high'),

  currency: z.nativeEnum(Currency, {
    errorMap: () => ({ message: 'Invalid currency' }),
  }),

  salePrice: z
    .number()
    .positive('Sale price must be positive')
    .min(1, 'Sale price must be at least 1')
    .max(999999999999.99, 'Sale price is too high')
    .optional(),

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
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address too long')
    .trim(),

  postalCode: z
    .string()
    .min(3, 'Postal code must be at least 3 characters')
    .max(20, 'Postal code too long')
    .trim(),

  amenities: z
    .array(z.string().trim())
    .min(3, 'Please select at least 3 amenities')
    .max(50, 'Maximum 50 amenities allowed'),

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

  listingType: z
    .nativeEnum(PropertyListingType, {
      errorMap: () => ({ message: 'Invalid listing type' }),
    })
    .optional()
    .default(PropertyListingType.SHORT_TERM_RENTAL),
}).refine(
  (data) => {
    // If listing type allows rental (SHORT_TERM_RENTAL or BOTH), pricePerNight is required
    if (
      data.listingType === PropertyListingType.SHORT_TERM_RENTAL ||
      data.listingType === PropertyListingType.BOTH
    ) {
      return data.pricePerNight > 0;
    }
    return true;
  },
  {
    message: 'Price per night is required for rental properties',
    path: ['pricePerNight'],
  }
).refine(
  (data) => {
    // If listing type allows sale (SALE or BOTH), salePrice is required
    if (
      data.listingType === PropertyListingType.SALE ||
      data.listingType === PropertyListingType.BOTH
    ) {
      return data.salePrice != null && data.salePrice > 0;
    }
    return true;
  },
  {
    message: 'Sale price is required when property is for sale',
    path: ['salePrice'],
  }
);

/**
 * Property Filters Schema
 * For search and filtering
 */
export const propertyFiltersSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED', 'INACTIVE', 'DELETED']).optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  listingType: z.nativeEnum(PropertyListingType).optional(),
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
