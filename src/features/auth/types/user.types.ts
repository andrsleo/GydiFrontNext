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
  dateOfBirth: string | null; // ISO 8601 date string (YYYY-MM-DD)
  gender: Gender | null;
  bio: string | null;
  countryCode: string | null; // ISO 3166-1 alpha-3 (e.g., "USA", "CAN")
  timezone: string | null; // IANA timezone (e.g., "America/New_York")
  preferredLanguage: string | null; // ISO 639-1 (e.g., "en", "es")
  avatarUrl: string | null;
  coverImageUrl: string | null;
  socialLinks: Record<string, string> | null;
  preferences: Record<string, unknown> | null;
  profileVisibility: ProfileVisibility | null;
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

/**
 * Create user profile request (corresponds to CreateUserProfileRequest.java)
 */
export interface CreateUserProfileRequest {
  userId: number;
  dateOfBirth?: string; // ISO 8601 date string (YYYY-MM-DD)
  gender?: Gender;
  bio?: string; // max 1000 characters
  countryCode?: string; // 3 characters
  timezone?: string;
  preferredLanguage?: string; // max 5 characters
  avatarUrl?: string;
  coverImageUrl?: string;
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
  dateOfBirth?: string; // ISO 8601 date string (YYYY-MM-DD)
  gender?: Gender;
  bio?: string; // max 1000 characters
  countryCode?: string; // 3 characters
  timezone?: string;
  preferredLanguage?: string; // max 5 characters
  avatarUrl?: string;
  coverImageUrl?: string;
  socialLinks?: Record<string, string>;
  preferences?: Record<string, unknown>;
  profileVisibility?: ProfileVisibility;
  emailNotificationsEnabled?: boolean;
  smsNotificationsEnabled?: boolean;
}