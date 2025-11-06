/**
 * Property Types
 * TypeScript interfaces matching backend DTOs
 */

/**
 * Property Status Enum
 */
export enum PropertyStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

/**
 * Property Type Enum
 */
export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  VILLA = 'VILLA',
  CABIN = 'CABIN',
  STUDIO = 'STUDIO',
  CONDO = 'CONDO',
  BUNGALOW = 'BUNGALOW',
  OTHER = 'OTHER',
}

/**
 * Currency Enum
 */
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  MXN = 'MXN',
  CAD = 'CAD',
  GBP = 'GBP',
}

/**
 * Location Information
 */
export interface PropertyLocation {
  country: string;
  city: string;
  address?: string;
  postalCode?: string;
}

/**
 * Property Specifications
 */
export interface PropertySpecs {
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
}

/**
 * Media Image
 */
export interface PropertyImage {
  id: string;
  url: string;
  displayOrder: number;
  uploadedAt: string;
}

/**
 * Media Video
 */
export interface PropertyVideo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  displayOrder: number;
  durationSeconds?: number;
  uploadedAt: string;
}

/**
 * Property Response (for list)
 */
export interface PropertyResponse {
  id: string;
  hostId: string;
  title: string;
  description: string;
  pricePerNight: number;
  currency: Currency;
  country: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  propertyType: PropertyType;
  status: PropertyStatus;
  imageCount: number;
  videoCount: number;
  mainImageUrl?: string;
  createdAt: string;
  publishedAt?: string;
}

/**
 * Property Detail Response (includes all info)
 */
export interface PropertyDetailResponse extends PropertyResponse {
  location: PropertyLocation;
  amenities: string[];
  specs: PropertySpecs;
  images: PropertyImage[];
  videos: PropertyVideo[];
  coverImageId?: string;
  updatedAt: string;
}

/**
 * Create Property Request
 */
export interface CreatePropertyRequest {
  title: string;
  description?: string;
  pricePerNight: number;
  currency: Currency;
  country: string;
  city: string;
  address?: string;
  postalCode?: string;
  amenities?: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  propertyType: PropertyType;
}

/**
 * Update Property Request
 */
export interface UpdatePropertyRequest {
  title?: string;
  description?: string;
  pricePerNight?: number;
  currency?: Currency;
  country?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  amenities?: string[];
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  propertyType?: PropertyType;
}

/**
 * Property Filters (for search/list)
 */
export interface PropertyFilters {
  status?: PropertyStatus;
  propertyType?: PropertyType;
  country?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  minGuests?: number;
  amenities?: string[];  // Agregado - búsqueda por amenidades
  searchText?: string;   // Agregado - búsqueda por texto (título o descripción)
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

/**
 * Paginated Response
 */
export interface PaginatedPropertyResponse {
  content: PropertyResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first?: boolean;
  last?: boolean;
}

/**
 * Media Upload Response
 */
export interface MediaUploadResponse {
  id: string;
  url: string;
  displayOrder: number;
  uploadedAt: string;
}
