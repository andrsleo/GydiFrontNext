/**
 * Resource Limits Types
 *
 * Types for managing resource usage and limits based on subscription plans.
 */

import type { SubscriptionPlan } from './navigation';

/**
 * Resource type that can have limits
 */
export type ResourceType = 'properties' | 'referrals';

/**
 * Resource limit configuration per plan
 */
export interface PlanLimits {
  properties: number;
  referrals: number;
}

/**
 * Current resource usage
 */
export interface ResourceUsage {
  properties: number;
  referrals: number;
}

/**
 * Complete resource limits info for a user
 */
export interface ResourceLimitsInfo {
  plan: SubscriptionPlan;
  limits: PlanLimits;
  usage: ResourceUsage;
  canCreate: {
    properties: boolean;
    referrals: boolean;
  };
  remaining: {
    properties: number | 'unlimited';
    referrals: number | 'unlimited';
  };
  percentage: {
    properties: number;
    referrals: number;
  };
}

/**
 * API response for resource limits check
 */
export interface ResourceLimitsResponse {
  userId: string;
  subscriptionPlan: SubscriptionPlan;
  limits: PlanLimits;
  usage: ResourceUsage;
}
