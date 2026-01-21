/**
 * Add Payment Method Form Component
 *
 * Form to add a new payment method using Stripe Elements.
 */

'use client';

import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { StripeCardElementWrapper } from './stripe-card-element';
import { useCreatePaymentMethod } from '../hooks/use-payment-methods';
import { paymentMethodSchema, type PaymentMethodFormData } from '../schemas/subscription.schema';

interface AddPaymentMethodFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AddPaymentMethodForm({
  onSuccess,
  onCancel,
}: AddPaymentMethodFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { mutate: createPaymentMethod } = useCreatePaymentMethod();
  const [stripeError, setStripeError] = useState<string | null>(null);

  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      billingEmail: '',
      saveAsDefault: true,
    },
  });

  const onSubmit = async (data: PaymentMethodFormData) => {
    if (!stripe || !elements) {
      toast.error('Stripe not loaded', {
        description: 'Please refresh the page and try again.',
      });
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      toast.error('Card element not found');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create payment method with Stripe
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email: data.billingEmail,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      // 2. Send tokenized payment method to backend
      createPaymentMethod(
        {
          stripePaymentMethodId: paymentMethod.id,
          billingEmail: data.billingEmail || '',
          isDefault: data.saveAsDefault,
        },
        {
          onSuccess: () => {
            form.reset();
            cardElement.clear();
            onSuccess?.();
          },
        }
      );
    } catch (error: any) {
      toast.error('Payment method creation failed', {
        description: error.message || 'Please check your card details and try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


        {/* Stripe Card Element */}
        <StripeCardElementWrapper onChange={(e) => {
          if (e.error) {
            setStripeError(e.error.message);
          } else {
            setStripeError(null);
          }
        }} />
        {stripeError && (
          <p className="text-sm font-medium text-destructive">{stripeError}</p>
        )}

        {/* Save as Default */}
        <FormField
          control={form.control}
          name="saveAsDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isProcessing}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Set as default payment method</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Use this card for future payments
                </p>
              </div>
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={!stripe || isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Payment Method
          </Button>
        </div>
      </form>
    </Form>
  );
}
