/**
 * React Query hooks for subscription management
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { subscriptionsApi } from '../api/subscriptions.api';
import type {
  UserSubscriptionResponse,
  SubscribeToPlanRequest,
  ChangePlanRequest,
  CancelSubscriptionRequest,
} from '../types';

/**
 * Query key factory for subscriptions
 */
export const subscriptionKeys = {
  all: ['subscription'] as const,
  current: () => [...subscriptionKeys.all, 'current'] as const,
};

/**
 * Hook to fetch current user's subscription
 *
 * @returns React Query result with subscription data
 *
 * @example
 * ```tsx
 * function SubscriptionStatus() {
 *   const { data: subscription, isLoading } = useSubscription();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!subscription) return <div>No active subscription</div>;
 *
 *   return (
 *     <div>
 *       <p>Plan: {subscription.planName}</p>
 *       <p>Status: {subscription.status}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSubscription() {
  return useQuery({
    queryKey: subscriptionKeys.current(),
    queryFn: () => subscriptionsApi.getCurrent(),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once - user might not have a subscription yet
  });
}

/**
 * Hook to subscribe to a plan
 *
 * @returns Mutation function and state
 *
 * @example
 * ```tsx
 * function SubscribeButton({ planCode }: { planCode: string }) {
 *   const { mutate: subscribe, isPending } = useSubscribeToPlan();
 *
 *   const handleSubscribe = () => {
 *     subscribe({
 *       planCode,
 *       paymentMethodId: null, // For FREE plan
 *       autoRenew: true,
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleSubscribe} disabled={isPending}>
 *       Subscribe to {planCode}
 *     </button>
 *   );
 * }
 * ```
 */
export function useSubscribeToPlan() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (request: SubscribeToPlanRequest) =>
      subscriptionsApi.subscribe(request),
    onSuccess: (data) => {
      // Invalidate subscription query to refetch
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });

      toast.success('Successfully subscribed!', {
        description: `You are now on the ${data.planName} plan.`,
      });

      // Redirect to dashboard
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error('Subscription failed', {
        description: error?.response?.data?.message || 'Please try again later.',
      });
    },
  });
}

/**
 * Hook to change subscription plan (upgrade/downgrade)
 *
 * @returns Mutation function and state
 *
 * @example
 * ```tsx
 * function UpgradeButton() {
 *   const { mutate: changePlan, isPending } = useChangePlan();
 *
 *   const handleUpgrade = () => {
 *     changePlan({
 *       newPlanCode: 'PRO',
 *       paymentMethodId: 123,
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleUpgrade} disabled={isPending}>
 *       Upgrade to Pro
 *     </button>
 *   );
 * }
 * ```
 */
export function useChangePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ChangePlanRequest) =>
      subscriptionsApi.changePlan(request),
    onSuccess: (data) => {
      // Invalidate subscription query
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });

      toast.success('Plan changed successfully!', {
        description: `You are now on the ${data.planName} plan.`,
      });
    },
    onError: (error: any) => {
      toast.error('Plan change failed', {
        description: error?.response?.data?.message || 'Please try again later.',
      });
    },
  });
}

/**
 * Hook to cancel subscription
 *
 * @returns Mutation function and state
 *
 * @example
 * ```tsx
 * function CancelButton() {
 *   const { mutate: cancelSubscription, isPending } = useCancelSubscription();
 *
 *   const handleCancel = () => {
 *     cancelSubscription({
 *       reason: 'Too expensive',
 *       cancelImmediately: false,
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleCancel} disabled={isPending}>
 *       Cancel Subscription
 *     </button>
 *   );
 * }
 * ```
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CancelSubscriptionRequest) =>
      subscriptionsApi.cancel(request),
    onSuccess: (data) => {
      // Invalidate subscription query
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });

      if (data.status === 'CANCELED') {
        toast.success('Subscription canceled', {
          description: 'Your subscription has been canceled.',
        });
      } else {
        toast.success('Subscription will cancel at period end', {
          description: `Your subscription will remain active until ${
            data.expiresAt ? new Date(data.expiresAt).toLocaleDateString() : 'the end of the period'
          }.`,
        });
      }
    },
    onError: (error: any) => {
      toast.error('Cancellation failed', {
        description: error?.response?.data?.message || 'Please try again later.',
      });
    },
  });
}
