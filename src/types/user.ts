/**
 * User Types - Aligned with Backend System
 *
 * This file contains user-related types that match the backend implementation:
 * - Roles: USER (unified) and ADMIN only
 * - Subscription Plans: FREE, PRO, ELITE
 * - User Capabilities: canPublish, canRefer, canRent
 * - Account Verification: accountVerified
 */

/**
 * User Role - Simplified to USER and ADMIN only
 *
 * - USER: Unified role for all authenticated users (owners, referrers, buyers)
 * - ADMIN: Full system access
 */
export type UserRole = 'USER' | 'ADMIN';

/**
 * Subscription Plan Types
 *
 * Maps to backend SubscriptionPlan enum:
 * - FREE: $0/month, 2% commission, 10 properties, 50 referrals
 * - PRO: $29.99/month, 5% commission, 50 properties, 200 referrals
 * - ELITE: $99.99/month, 10% commission, unlimited resources
 */
export type SubscriptionPlan = 'FREE' | 'PRO' | 'ELITE';

/**
 * User Capabilities - Feature toggles for moderation
 *
 * These flags can be disabled by administrators for moderation purposes:
 * - canPublish: Can publish new properties (requires verification)
 * - canRefer: Can generate referral links (requires verification)
 * - canRent: Can create bookings/reservations
 */
export interface UserCapabilities {
  canPublish: boolean;
  canRefer: boolean;
  canRent: boolean;
}

/**
 * User Permission - Granular permission enum
 *
 * Maps to backend Permission enum. 27 total permissions:
 * - Profile permissions (READ, UPDATE, DELETE)
 * - Property permissions (PUBLISH, UPDATE_OWN, DELETE_OWN, VIEW_ANY, etc.)
 * - Referral permissions (GENERATE, VIEW_OWN, VIEW_ANY)
 * - Booking permissions (CREATE, VIEW_OWN, VIEW_ANY)
 * - Analytics permissions (VIEW_OWN, VIEW_ADVANCED, EXPORT, VIEW_GLOBAL)
 * - Admin permissions (USER_MANAGE, SUBSCRIPTION_MANAGE, SYSTEM_CONFIGURE, etc.)
 */
export type Permission =
  // Profile
  | 'PROFILE_READ'
  | 'PROFILE_UPDATE'
  | 'PROFILE_DELETE'
  // Property - User
  | 'PROPERTY_PUBLISH'
  | 'PROPERTY_UPDATE_OWN'
  | 'PROPERTY_DELETE_OWN'
  | 'PROPERTY_RENT'
  // Property - Admin
  | 'PROPERTY_VIEW_ANY'
  | 'PROPERTY_UPDATE_ANY'
  | 'PROPERTY_DELETE_ANY'
  | 'PROPERTY_MODERATE'
  // Referral
  | 'REFERRAL_GENERATE'
  | 'REFERRAL_VIEW_OWN'
  | 'REFERRAL_VIEW_ANY'
  // Booking
  | 'BOOKING_CREATE'
  | 'BOOKING_VIEW_OWN'
  | 'BOOKING_VIEW_ANY'
  // Analytics
  | 'ANALYTICS_VIEW_OWN'
  | 'ANALYTICS_VIEW_ADVANCED'
  | 'ANALYTICS_EXPORT'
  | 'ANALYTICS_VIEW_GLOBAL'
  // Admin
  | 'USER_MANAGE'
  | 'SUBSCRIPTION_MANAGE'
  | 'SYSTEM_CONFIGURE'
  | 'MODERATION_MANAGE'
  | 'PAYMENT_VIEW'
  | 'REPORT_GENERATE';

/**
 * Complete User Type
 *
 * Represents a user in the system with all necessary fields.
 * This should match the backend User domain model structure.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;

  // Authentication & Authorization
  role: UserRole;
  accountVerified: boolean;

  // Subscription & Features
  activePlan: SubscriptionPlan;
  capabilities: UserCapabilities;

  // Timestamps
  createdAt: Date | string;
  updatedAt?: Date | string;
}

/**
 * Authenticated User Session
 *
 * Used by NextAuth to store session data.
 * Includes JWT access token and essential user info.
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  activePlan: SubscriptionPlan;
  capabilities: UserCapabilities;
  accountVerified: boolean;
  accessToken: string;
}

/**
 * User Profile (Extended)
 *
 * Additional user profile information stored separately.
 */
export interface UserProfile {
  userId: string;
  bio?: string;
  avatar?: string;
  location?: string;
  preferredLanguage?: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

/**
 * Permission Check Request
 *
 * Used to verify if a user has a specific permission.
 */
export interface PermissionCheckRequest {
  userId: string;
  permission: Permission;
}

/**
 * Permission Check Response
 *
 * Result of a permission check from the backend.
 */
export interface PermissionCheckResponse {
  userId: string;
  permission: string;
  granted: boolean;
  reason?: string;
}

/**
 * Resource Type for limits
 *
 * Types of resources that have limits based on subscription plan.
 */
export type ResourceType = 'PROPERTY' | 'REFERRAL';

/**
 * Resource Limit Check Request
 *
 * Used to verify if a user can create more resources.
 */
export interface ResourceLimitCheckRequest {
  userId: string;
  resourceType: ResourceType;
}

/**
 * Resource Limit Check Response
 *
 * Result of a resource limit check from the backend.
 */
export interface ResourceLimitCheckResponse {
  userId: string;
  resourceType: string;
  currentCount: number;
  limit: number;
  canExceedLimit: boolean;
  subscriptionPlan: string;
  remainingCapacity: number;
}

/**
 * Type guards for user roles
 */
export function isAdmin(user: User | AuthUser): boolean {
  return user.role === 'ADMIN';
}

export function isUser(user: User | AuthUser): boolean {
  return user.role === 'USER';
}

/**
 * Type guards for subscription plans
 */
export function hasFreePlan(user: User | AuthUser): boolean {
  return user.activePlan === 'FREE';
}

export function hasProPlan(user: User | AuthUser): boolean {
  return user.activePlan === 'PRO';
}

export function hasElitePlan(user: User | AuthUser): boolean {
  return user.activePlan === 'ELITE';
}

export function hasPaidPlan(user: User | AuthUser): boolean {
  return user.activePlan === 'PRO' || user.activePlan === 'ELITE';
}

/**
 * Type guards for capabilities
 */
export function canPublish(user: User | AuthUser): boolean {
  return user.capabilities.canPublish && user.accountVerified;
}

export function canRefer(user: User | AuthUser): boolean {
  return user.capabilities.canRefer && user.accountVerified;
}

export function canRent(user: User | AuthUser): boolean {
  return user.capabilities.canRent;
}