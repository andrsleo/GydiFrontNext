'use client';

/**
 * Resource Limits Hook
 *
 * Manages resource usage limits based on subscription plan.
 * Provides information about current usage, limits, and availability.
 */

import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/features/auth/hooks/use-auth';
import { PLAN_LIMITS } from '@/lib/constants/menu-items';
import type {
  ResourceLimitsInfo,
  ResourceLimitsResponse,
  ResourceType,
} from '@/types/resource-limits';
import type { SubscriptionPlan } from '@/types/navigation';
import { apiClient } from '@/lib/api/client';

/**
 * Fetch resource limits from backend
 */
async function fetchResourceLimits(): Promise<ResourceLimitsResponse> {
  const { data } = await apiClient.get<ResourceLimitsResponse>(
    '/api/v1/users/resource-limits'
  );
  return data;
}

/**
 * Calculate resource limits info from API response
 */
function calculateLimitsInfo(
  response: ResourceLimitsResponse | undefined,
  fallbackPlan: SubscriptionPlan = 'FREE'
): ResourceLimitsInfo {
  const plan = response?.subscriptionPlan || fallbackPlan;
  const limits = response?.limits || PLAN_LIMITS[plan];
  const usage = response?.usage || { properties: 0, referrals: 0 };

  // Check if user can create more resources
  const canCreateProperties =
    limits.properties === Infinity || usage.properties < limits.properties;
  const canCreateReferrals =
    limits.referrals === Infinity || usage.referrals < limits.referrals;

  // Calculate remaining resources
  const remainingProperties =
    limits.properties === Infinity
      ? 'unlimited'
      : Math.max(0, limits.properties - usage.properties);

  const remainingReferrals =
    limits.referrals === Infinity
      ? 'unlimited'
      : Math.max(0, limits.referrals - usage.referrals);

  // Calculate usage percentage (0-100)
  const propertiesPercentage =
    limits.properties === Infinity
      ? 0
      : Math.min(100, (usage.properties / limits.properties) * 100);

  const referralsPercentage =
    limits.referrals === Infinity
      ? 0
      : Math.min(100, (usage.referrals / limits.referrals) * 100);

  return {
    plan,
    limits,
    usage,
    canCreate: {
      properties: canCreateProperties,
      referrals: canCreateReferrals,
    },
    remaining: {
      properties: remainingProperties,
      referrals: remainingReferrals,
    },
    percentage: {
      properties: Math.round(propertiesPercentage),
      referrals: Math.round(referralsPercentage),
    },
  };
}

/**
 * Hook to get resource limits and usage
 *
 * @example
 * function CreatePropertyButton() {
 *   const { canCreate, remaining, percentage } = useResourceLimits();
 *
 *   return (
 *     <div>
 *       <button disabled={!canCreate.properties}>
 *         Create Property
 *       </button>
 *       <p>{remaining.properties} / {limits.properties} properties</p>
 *       <ProgressBar value={percentage.properties} />
 *     </div>
 *   );
 * }
 */
export function useResourceLimits() {
  const user = useUser();

  const { data, isLoading, error, refetch } = useQuery<
    ResourceLimitsResponse,
    Error
  >({
    queryKey: ['resource-limits', user?.id],
    queryFn: fetchResourceLimits,
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const limitsInfo = calculateLimitsInfo(data, user?.activePlan as SubscriptionPlan);

  return {
    ...limitsInfo,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to check if a specific resource can be created
 *
 * @example
 * function CreatePropertyButton() {
 *   const canCreate = useCanCreateResource('properties');
 *
 *   return (
 *     <button disabled={!canCreate}>
 *       Create Property
 *     </button>
 *   );
 * }
 */
export function useCanCreateResource(resourceType: ResourceType): boolean {
  const { canCreate, isLoading } = useResourceLimits();

  if (isLoading) return false;

  return canCreate[resourceType];
}

/**
 * Hook to get formatted limit display string
 *
 * @example
 * const propertiesDisplay = useResourceLimitDisplay('properties');
 * // Returns: "3 / 10" or "5 / unlimited"
 */
export function useResourceLimitDisplay(
  resourceType: ResourceType
): string {
  const { usage, limits, isLoading } = useResourceLimits();

  if (isLoading) return '...';

  const current = usage[resourceType];
  const limit = limits[resourceType];

  if (limit === Infinity) {
    return `${current} / ilimitado`;
  }

  return `${current} / ${limit}`;
}

/**
 * Hook to check if user is near the limit (>80%)
 *
 * @example
 * const isNearLimit = useIsNearLimit('properties');
 * if (isNearLimit) {
 *   // Show upgrade prompt
 * }
 */
export function useIsNearLimit(
  resourceType: ResourceType,
  threshold: number = 80
): boolean {
  const { percentage, limits } = useResourceLimits();

  // If unlimited, never near limit
  if (limits[resourceType] === Infinity) return false;

  return percentage[resourceType] >= threshold;
}
