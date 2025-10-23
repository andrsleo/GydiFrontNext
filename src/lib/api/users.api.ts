/**
 * Users API Client
 *
 * API calls for user authentication, user management, and user profiles.
 * All endpoints correspond to backend controllers:
 * - AuthController
 * - UserController
 * - UserProfileController
 */

import { get, post, put, patch, del } from './client';
import type {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  LogoutRequest,
} from '@/features/auth/types/auth.types';
import type {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserProfileResponse,
  CreateUserProfileRequest,
  UpdateUserProfileRequest,
} from '@/features/auth/types/user.types';

const AUTH_BASE_URL = '/api/v1/auth';
const USERS_BASE_URL = '/api/v1/users';
const PROFILES_BASE_URL = '/api/v1/users/profiles';

// ===========================
// AUTHENTICATION API
// ===========================

/**
 * Authentication API
 *
 * Methods for user login, logout, and token refresh.
 */
export const authApi = {
  /**
   * Login user with email and password
   *
   * @param request - Login credentials
   * @returns Authentication response with JWT tokens
   *
   * @example
   * const response = await authApi.login({
   *   email: 'user@example.com',
   *   password: 'password123'
   * });
   * console.log(response.token); // JWT access token
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    return post<AuthResponse>(`${AUTH_BASE_URL}/login`, request);
  },

  /**
   * Logout current user (blacklist token)
   *
   * @param request - Optional logout parameters
   * @returns void
   *
   * @example
   * await authApi.logout({ revokeAllDevices: true });
   */
  async logout(request?: LogoutRequest): Promise<void> {
    return post<void>(`${AUTH_BASE_URL}/logout`, request);
  },

  /**
   * Refresh access token using refresh token
   *
   * @param request - Refresh token request
   * @returns New authentication response with fresh access token
   *
   * @example
   * const response = await authApi.refresh({
   *   refreshToken: 'refresh_token_here'
   * });
   * console.log(response.token); // New access token
   */
  async refresh(request: RefreshTokenRequest): Promise<AuthResponse> {
    return post<AuthResponse>(`${AUTH_BASE_URL}/refresh`, request);
  },
};

// ===========================
// USER MANAGEMENT API
// ===========================

/**
 * User Management API
 *
 * Methods for CRUD operations on users.
 */
export const usersApi = {
  /**
   * Create a new user
   *
   * @param request - User creation data
   * @returns Created user data
   *
   * @example
   * const user = await usersApi.create({
   *   email: 'newuser@example.com',
   *   password: 'secure_password',
   *   name: 'John Doe',
   *   phoneNumber: '+1234567890',
   *   roleNames: ['USER']
   * });
   */
  async create(request: CreateUserRequest): Promise<UserResponse> {
    return post<UserResponse>(USERS_BASE_URL, request);
  },

  /**
   * Get user by ID
   *
   * @param id - User ID
   * @returns User data
   *
   * @example
   * const user = await usersApi.getById(123);
   * console.log(user.email);
   */
  async getById(id: number): Promise<UserResponse> {
    return get<UserResponse>(`${USERS_BASE_URL}/${id}`);
  },

  /**
   * Get all users (paginated)
   *
   * @param params - Query parameters for pagination and filtering
   * @returns Array of users
   *
   * @example
   * const users = await usersApi.getAll({ page: 0, size: 20 });
   */
  async getAll(params?: { page?: number; size?: number }): Promise<UserResponse[]> {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());

    const url = queryParams.toString()
      ? `${USERS_BASE_URL}?${queryParams.toString()}`
      : USERS_BASE_URL;

    return get<UserResponse[]>(url);
  },

  /**
   * Update user by ID
   *
   * @param id - User ID
   * @param request - User update data
   * @returns Updated user data
   *
   * @example
   * const updated = await usersApi.update(123, {
   *   name: 'Jane Doe',
   *   phoneNumber: '+0987654321'
   * });
   */
  async update(id: number, request: UpdateUserRequest): Promise<UserResponse> {
    return put<UserResponse>(`${USERS_BASE_URL}/${id}`, request);
  },

  /**
   * Delete user by ID
   *
   * @param id - User ID
   * @returns void
   *
   * @example
   * await usersApi.delete(123);
   */
  async delete(id: number): Promise<void> {
    return del<void>(`${USERS_BASE_URL}/${id}`);
  },
};

// ===========================
// USER PROFILES API
// ===========================

/**
 * User Profiles API
 *
 * Methods for managing user profiles (extended user information).
 */
export const profilesApi = {
  /**
   * Create a new user profile
   *
   * @param request - Profile creation data
   * @returns Created profile data
   *
   * @example
   * const profile = await profilesApi.create({
   *   userId: 123,
   *   bio: 'Software developer passionate about React',
   *   countryCode: 'USA',
   *   timezone: 'America/New_York',
   *   preferredLanguage: 'en',
   *   profileVisibility: 'public'
   * });
   */
  async create(request: CreateUserProfileRequest): Promise<UserProfileResponse> {
    return post<UserProfileResponse>(PROFILES_BASE_URL, request);
  },

  /**
   * Get profile by profile ID
   *
   * @param id - Profile ID (UUID)
   * @returns Profile data
   *
   * @example
   * const profile = await profilesApi.getById('550e8400-e29b-41d4-a716-446655440000');
   */
  async getById(id: string): Promise<UserProfileResponse> {
    return get<UserProfileResponse>(`${PROFILES_BASE_URL}/${id}`);
  },

  /**
   * Get profile by user ID
   *
   * @param userId - User ID
   * @returns Profile data
   *
   * @example
   * const profile = await profilesApi.getByUserId(123);
   * console.log(profile.bio);
   */
  async getByUserId(userId: number): Promise<UserProfileResponse> {
    return get<UserProfileResponse>(`${PROFILES_BASE_URL}/user/${userId}`);
  },

  /**
   * Update profile by user ID (PATCH - partial update)
   *
   * @param userId - User ID
   * @param request - Profile update data (all fields optional)
   * @returns Updated profile data
   *
   * @example
   * const updated = await profilesApi.updateByUserId(123, {
   *   bio: 'Updated bio',
   *   avatarUrl: 'https://example.com/avatar.jpg'
   * });
   */
  async updateByUserId(
    userId: number,
    request: UpdateUserProfileRequest
  ): Promise<UserProfileResponse> {
    return patch<UserProfileResponse>(`${PROFILES_BASE_URL}/user/${userId}`, request);
  },

  /**
   * Delete profile by user ID
   *
   * @param userId - User ID
   * @returns void
   *
   * @example
   * await profilesApi.deleteByUserId(123);
   */
  async deleteByUserId(userId: number): Promise<void> {
    return del<void>(`${PROFILES_BASE_URL}/user/${userId}`);
  },
};

// ===========================
// HELPER FUNCTIONS
// ===========================

/**
 * Get current user profile (convenience method)
 *
 * Requires authenticated session with user ID.
 *
 * @param userId - Current user's ID
 * @returns Profile data or null if not found
 *
 * @example
 * const profile = await getCurrentUserProfile(session.user.id);
 * if (profile) {
 *   console.log(profile.avatarUrl);
 * }
 */
export async function getCurrentUserProfile(
  userId: number
): Promise<UserProfileResponse | null> {
  try {
    return await profilesApi.getByUserId(userId);
  } catch (error) {
    // Profile might not exist yet
    console.error('Failed to fetch user profile:', error);
    return null;
  }
}

/**
 * Create or update user profile (upsert pattern)
 *
 * If profile exists, updates it. If not, creates a new one.
 *
 * @param userId - User ID
 * @param data - Profile data
 * @returns Profile data
 *
 * @example
 * const profile = await upsertUserProfile(123, {
 *   bio: 'My bio',
 *   timezone: 'America/New_York'
 * });
 */
export async function upsertUserProfile(
  userId: number,
  data: UpdateUserProfileRequest
): Promise<UserProfileResponse> {
  try {
    // Try to get existing profile
    await profilesApi.getByUserId(userId);
    // Profile exists, update it
    return await profilesApi.updateByUserId(userId, data);
  } catch (error) {
    // Profile doesn't exist, create it
    return await profilesApi.create({
      userId,
      ...data,
    });
  }
}

/**
 * Check if user has a profile
 *
 * @param userId - User ID
 * @returns True if profile exists
 *
 * @example
 * const hasProfile = await hasUserProfile(123);
 * if (!hasProfile) {
 *   // Redirect to profile creation
 * }
 */
export async function hasUserProfile(userId: number): Promise<boolean> {
  try {
    await profilesApi.getByUserId(userId);
    return true;
  } catch (error) {
    return false;
  }
}