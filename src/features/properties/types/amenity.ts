/**
 * Amenity Types
 * Types for property amenities
 */

/**
 * Amenity Response from API
 */
export interface Amenity {
  id: number;
  name: string;
  description: string | null;
  category: string;
}

/**
 * Amenity Category
 */
export type AmenityCategory =
  | 'Essential'
  | 'Entertainment'
  | 'Kitchen'
  | 'Outdoor'
  | 'Bathroom'
  | 'Bedroom'
  | 'Family'
  | 'Work'
  | 'Climate'
  | 'Wellness'
  | 'Safety'
  | 'Building'
  | 'Accessibility'
  | 'Policy'
  | 'Service';