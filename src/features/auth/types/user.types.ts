/**
 * User API Types
 *
 * TypeScript types aligned with backend DTOs for user management.
 */

/**
 * User response (corresponds to UserResponse.java)
 */
export interface UserResponse {
  id: number;
  email: string;
  name: string;
  phoneNumber: string | null;
  roleNames: string[];
  createdAt: string; // ISO 8601 date string
}

/**
 * Create user request (corresponds to CreateUserRequest.java)
 */
export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  roleNames?: string[];
}

/**
 * Update user request (corresponds to UpdateUserRequest.java)
 *
 * Note: Email cannot be changed after account creation for security reasons.
 */
export interface UpdateUserRequest {
  name: string;
  phoneNumber?: string;
  roleNames?: string[];
}

/**
 * User profile gender options
 */
export type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say' | 'other';

/**
 * Profile visibility options
 */
export type ProfileVisibility = 'public' | 'private' | 'connections';

/**
 * User profile response (corresponds to UserProfileResponse.java)
 */
export interface UserProfileResponse {
  id: string; // UUID
  userId: number;
  // Personal Information
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null; // ISO 8601 date string (YYYY-MM-DD)
  gender: Gender | null;
  bio: string | null;
  // Location
  country: string | null; // Full country name (not code)
  city: string | null;
  address: string | null;
  postalCode: string | null;
  // Professional
  websiteUrl: string | null;
  // Preferences
  preferredLanguage: string | null; // ISO 639-1 (e.g., "en", "es")
  // Images
  coverImageUrl: string | null; // Profile image
  // Social & Metadata
  socialLinks: Record<string, string>;
  preferences: Record<string, unknown>;
  profileVisibility: ProfileVisibility;
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  metadata: Record<string, unknown>;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

/**
 * Create user profile request (corresponds to CreateUserProfileRequest.java)
 */
export interface CreateUserProfileRequest {
  userId: number;
  // Personal Information
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string; // ISO 8601 date string (YYYY-MM-DD)
  gender?: Gender;
  bio?: string; // max 1000 characters
  // Location
  country?: string; // Full country name
  city?: string;
  address?: string;
  postalCode?: string;
  // Professional
  websiteUrl?: string;
  // Preferences
  preferredLanguage?: string; // max 5 characters
  // Images
  coverImageUrl?: string;
  // Social & Metadata
  socialLinks?: Record<string, string>;
  preferences?: Record<string, unknown>;
  profileVisibility?: ProfileVisibility;
  emailNotificationsEnabled?: boolean;
  smsNotificationsEnabled?: boolean;
}

/**
 * Update user profile request (corresponds to UpdateUserProfileRequest.java)
 *
 * All fields are optional to support PATCH-style updates.
 */
export interface UpdateUserProfileRequest {
  // Personal Information
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string; // ISO 8601 date string (YYYY-MM-DD)
  gender?: Gender;
  bio?: string; // max 1000 characters
  // Location
  country?: string; // Full country name
  city?: string;
  address?: string;
  postalCode?: string;
  // Professional
  websiteUrl?: string;
  // Preferences
  preferredLanguage?: string; // max 5 characters
  // Images
  coverImageUrl?: string;
  // Social & Metadata
  socialLinks?: Record<string, string>;
  preferences?: Record<string, unknown>;
  profileVisibility?: ProfileVisibility;
  emailNotificationsEnabled?: boolean;
  smsNotificationsEnabled?: boolean;
}