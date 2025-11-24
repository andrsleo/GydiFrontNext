/**
 * React Query Keys
 * Centralized query key management for TanStack Query
 */

import type { PropertyFilters } from '@/features/properties/types';

/**
 * Property Query Keys
 */
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters?: PropertyFilters) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (slug: string, ref?: string | null) =>
    ref ? [...propertyKeys.details(), slug, ref] as const : [...propertyKeys.details(), slug] as const,
  myProperties: (filters?: PropertyFilters) =>
    [...propertyKeys.all, 'my-properties', filters] as const,
};

/**
 * Auth Query Keys
 */
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

/**
 * Referral Query Keys
 */
export const referralKeys = {
  all: ['referrals'] as const,
  stats: () => [...referralKeys.all, 'stats'] as const,
  history: (filters?: any) => [...referralKeys.all, 'history', filters] as const,
  link: () => [...referralKeys.all, 'link'] as const,
};

/**
 * Subscription Query Keys
 */
export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  current: () => [...subscriptionKeys.all, 'current'] as const,
  plans: () => [...subscriptionKeys.all, 'plans'] as const,
};

/**
 * Earnings Query Keys
 */
export const earningsKeys = {
  all: ['earnings'] as const,
  stats: () => [...earningsKeys.all, 'stats'] as const,
  history: (filters?: any) => [...earningsKeys.all, 'history', filters] as const,
};
