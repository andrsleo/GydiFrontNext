/**
 * React Query hooks for payment methods management
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { paymentMethodsApi } from '../api/subscriptions.api';
import type { PaymentMethodResponse, CreatePaymentMethodRequest } from '../types';

/**
 * Query key factory for payment methods
 */
export const paymentMethodKeys = {
  all: ['payment-methods'] as const,
};

/**
 * Hook to fetch all user's payment methods
 *
 * @returns React Query result with payment methods data
 *
 * @example
 * ```tsx
 * function PaymentMethodsList() {
 *   const { data: paymentMethods, isLoading } = usePaymentMethods();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!paymentMethods?.length) return <div>No payment methods</div>;
 *
 *   return (
 *     <div>
 *       {paymentMethods.map(method => (
 *         <PaymentMethodCard key={method.id} method={method} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePaymentMethods() {
  return useQuery({
    queryKey: paymentMethodKeys.all,
    queryFn: () => paymentMethodsApi.getAll(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to add a new payment method
 *
 * NOTE: This hook expects that you've already tokenized the payment method
 * using Stripe Elements on the frontend. The stripePaymentMethodId should
 * be obtained from Stripe.createPaymentMethod() BEFORE calling this mutation.
 *
 * @returns Mutation function and state
 *
 * @example
 * ```tsx
 * function AddPaymentMethodForm() {
 *   const { mutate: addPaymentMethod, isPending } = useCreatePaymentMethod();
 *   const [stripe, setStripe] = useState<Stripe | null>(null);
 *
 *   const handleSubmit = async (e: FormEvent) => {
 *     e.preventDefault();
 *
 *     // 1. Tokenize card with Stripe Elements
 *     const { paymentMethod } = await stripe!.createPaymentMethod({
 *       type: 'card',
 *       card: cardElement,
 *       billing_details: { email: 'user@example.com' },
 *     });
 *
 *     // 2. Send token to backend
 *     addPaymentMethod({
 *       stripePaymentMethodId: paymentMethod!.id,
 *       billingEmail: 'user@example.com',
 *       isDefault: true,
 *     });
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function useCreatePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreatePaymentMethodRequest) =>
      paymentMethodsApi.create(request),
    onSuccess: (data) => {
      // Invalidate payment methods query to refetch
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all });

      toast.success('Payment method added!', {
        description: `${data.cardBrand} ending in ${data.cardLastFour} has been added.`,
      });
    },
    onError: (error: any) => {
      toast.error('Failed to add payment method', {
        description: error?.response?.data?.message || 'Please try again later.',
      });
    },
  });
}

/**
 * Helper hook to get the default payment method
 *
 * @returns The default payment method or undefined
 *
 * @example
 * ```tsx
 * function DefaultPaymentMethod() {
 *   const defaultMethod = useDefaultPaymentMethod();
 *
 *   if (!defaultMethod) return <div>No default payment method</div>;
 *
 *   return (
 *     <div>
 *       Default: {defaultMethod.cardBrand} •••• {defaultMethod.cardLastFour}
 *     </div>
 *   );
 * }
 * ```
 */
export function useDefaultPaymentMethod() {
  const { data: paymentMethods } = usePaymentMethods();
  return paymentMethods?.find(method => method.isDefault);
}
