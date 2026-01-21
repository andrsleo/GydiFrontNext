/**
 * React Query hook for fetching subscription plans
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { plansApi } from '../api/subscriptions.api';
import type { PlanResponse } from '../types';

/**
 * Query key factory for plans
 */
export const plansKeys = {
  all: ['plans'] as const,
};

/**
 * Hook to fetch all active subscription plans
 *
 * @returns React Query result with plans data
 *
 * @example
 * ```tsx
 * function PlansPage() {
 *   const { data: plans, isLoading, error } = usePlans();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error loading plans</div>;
 *
 *   return (
 *     <div>
 *       {plans?.map(plan => (
 *         <PlanCard key={plan.id} plan={plan} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePlans() {
  return useQuery({
    queryKey: plansKeys.all,
    queryFn: () => plansApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes - plans don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Helper hook to get a specific plan by code
 *
 * @param planCode - The plan code (FREE, PRO, ELITE)
 * @returns The plan data or undefined
 *
 * @example
 * ```tsx
 * function PlanDetails({ code }: { code: string }) {
 *   const plan = usePlanByCode(code);
 *
 *   if (!plan) return <div>Plan not found</div>;
 *
 *   return <div>{plan.planName}: ${plan.monthlyPrice}</div>;
 * }
 * ```
 */
export function usePlanByCode(planCode: string) {
  const { data: plans } = usePlans();
  return plans?.find(plan => plan.planCode === planCode);
}
