/**
 * Property Types
 * TypeScript interfaces matching backend DTOs
 */

/**
 * Property Status Enum
 */
export enum PropertyStatus {
  DRAFT = 'DRAFT',
  SEND_GYDI_COHOST = 'SEND_GYDI_COHOST',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  PUBLISHED = 'PUBLISHED',
  INACTIVE = 'INACTIVE',
  DENY = 'DENY',
  DELETED = 'DELETED',
}

/**
 * Status labels in Spanish for display in UI
 */
export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  [PropertyStatus.DRAFT]: 'Borrador',
  [PropertyStatus.SEND_GYDI_COHOST]: 'Agregar Co-host',
  [PropertyStatus.PENDING_APPROVAL]: 'En Revisión',
  [PropertyStatus.PUBLISHED]: 'Publicada',
  [PropertyStatus.INACTIVE]: 'Inactiva',
  [PropertyStatus.DENY]: 'Rechazada',
  [PropertyStatus.DELETED]: 'Eliminada',
};

/**
 * Import Mode Enum
 */
export enum ImportMode {
  MANUAL = 'MANUAL',
  SEMI_IMPORT = 'SEMI_IMPORT',
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
 * Etiquetas en español para cada tipo de propiedad.
 * Úsalas en la UI para mostrar texto legible al usuario.
 * Los valores del enum (APARTMENT, HOUSE, etc.) se usan para la API y BD.
 */
export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  [PropertyType.APARTMENT]: 'Apartamento',
  [PropertyType.HOUSE]: 'Casa',
  [PropertyType.VILLA]: 'Villa',
  [PropertyType.CABIN]: 'Cabaña',
  [PropertyType.STUDIO]: 'Estudio',
  [PropertyType.CONDO]: 'Condominio',
  [PropertyType.BUNGALOW]: 'Bungalow',
  [PropertyType.OTHER]: 'Otro',
};

/**
 * Property Listing Type Enum
 */
export enum PropertyListingType {
  SHORT_TERM_RENTAL = 'SHORT_TERM_RENTAL',
  SALE = 'SALE',
  BOTH = 'BOTH',
}

/**
 * Listing Type Labels (Spanish)
 */
export const LISTING_TYPE_LABELS: Record<PropertyListingType, string> = {
  [PropertyListingType.SHORT_TERM_RENTAL]: 'Renta Corta',
  [PropertyListingType.SALE]: 'Venta',
  [PropertyListingType.BOTH]: 'Renta/Venta',
};

/**
 * Listing Type Descriptions
 */
export const LISTING_TYPE_DESCRIPTIONS: Record<PropertyListingType, string> = {
  [PropertyListingType.SHORT_TERM_RENTAL]: 'Propiedad disponible para renta vacacional',
  [PropertyListingType.SALE]: 'Propiedad en venta',
  [PropertyListingType.BOTH]: 'Disponible para renta o venta',
};

/**
 * Currency Enum
 */
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  // MXN = 'MXN',
  // COP = 'COP',
  // CAD = 'CAD',
  // GBP = 'GBP',
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
  slug?: string;
  description: string;
  pricePerNight: number;
  currency: Currency;
  salePrice?: number;
  country: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  propertyType: PropertyType;
  listingType: PropertyListingType;
  status: PropertyStatus;
  imageCount: number;
  videoCount: number;
  mainImageUrl?: string;
  importMode?: ImportMode;
  airbnbUrl?: string;
  createdAt: string;
  publishedAt?: string;
  submittedAt?: string;
  approvedAt?: string;
  denialReason?: string;
  icalUrlAirbnb?: string;
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
  // Airbnb import fields
  airbnbUrl?: string;
  importMode?: ImportMode;
  importedAt?: string;
  airbnbListingId?: string;
  icalUrlAirbnb?: string;
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
  salePrice?: number;
  country: string;
  city: string;
  address?: string;
  postalCode?: string;
  amenities?: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  propertyType: PropertyType;
  listingType?: PropertyListingType;
  airbnbUrl?: string;
  icalUrlAirbnb?: string;
}

/**
 * Update Property Request
 */
export interface UpdatePropertyRequest {
  title?: string;
  description?: string;
  pricePerNight?: number;
  currency?: Currency;
  salePrice?: number;
  country?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  amenities?: string[];
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  propertyType?: PropertyType;
  listingType?: PropertyListingType;
  airbnbUrl?: string;
  icalUrlAirbnb?: string;
}

/**
 * Property Filters (for search/list)
 */
export interface PropertyFilters {
  status?: PropertyStatus;
  propertyType?: PropertyType;
  listingType?: PropertyListingType;
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

/**
 * Validate Airbnb URL Request
 */
export interface ValidateAirbnbUrlRequest {
  airbnbUrl: string;
}

/**
 * Validate Airbnb URL Response
 */
export interface ValidateAirbnbUrlResponse {
  valid: boolean;
  listingId?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  amenities?: string[];
  city?: string;
  country?: string;
  address?: string;
  errorMessage?: string;
}

/**
 * Import Property from Airbnb Request
 */
export interface ImportPropertyFromAirbnbRequest {
  airbnbUrl: string;
  priceAmount: number;
  priceCurrency: Currency;
  country: string;
  city: string;
  address: string;
  postalCode?: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  propertyType: PropertyType;
  listingType: PropertyListingType;
  titleOverride?: string;
  descriptionOverride?: string;
  additionalAmenities?: string[];
}
