/**
 * Host Payment Onboarding Modal
 *
 * Modal that guides HOSTs through adding/verifying a payment method
 * before they can publish properties. HOSTs must have a verified
 * payment method to receive payouts after platform charges commissions.
 *
 * Two options available:
 * 1. Reuse existing subscription card (update purpose to BOTH)
 * 2. Add a new payment method specifically for host payments
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { StripeCardElementWrapper } from './stripe-card-element';
import { useCreatePaymentMethod } from '../hooks/use-payment-methods';
import {
  useVerifyPaymentMethod,
  useUpdatePaymentMethodPurpose,
} from '../hooks/use-verify-payment-method';
import { formatHostFeeRate } from '@/lib/constants/plans';
import type { SubscriptionPlan } from '@/types/user';
import { CreditCard, AlertCircle, CheckCircle2, Info } from 'lucide-react';

// ==================== Zod Schema ====================

const addPaymentMethodSchema = z.object({
  billingEmail: z.string().email('Invalid email address'),
  saveAsDefault: z.boolean(),
});

type AddPaymentMethodFormData = z.infer<typeof addPaymentMethodSchema>;

// ==================== Component Props ====================

export interface HostPaymentOnboardingModalProps {
  /** Whether modal is open */
  open: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when onboarding is successfully completed */
  onSuccess?: () => void;
  /** User's current subscription plan */
  userPlan: SubscriptionPlan;
  /** Whether user has an existing subscription payment method */
  hasSubscriptionPaymentMethod?: boolean;
  /** Last 4 digits of subscription card (if exists) */
  subscriptionCardLast4?: string;
  /** Brand of subscription card (if exists) */
  subscriptionCardBrand?: string;
  /** ID of subscription payment method (if exists) */
  subscriptionPaymentMethodId?: number;
}

// ==================== Component ====================

export function HostPaymentOnboardingModal({
  open,
  onClose,
  onSuccess,
  userPlan,
  hasSubscriptionPaymentMethod = false,
  subscriptionCardLast4,
  subscriptionCardBrand,
  subscriptionPaymentMethodId,
}: HostPaymentOnboardingModalProps) {
  const [mode, setMode] = useState<'select' | 'reuse' | 'add-new'>('select');
  const [cardReady, setCardReady] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const stripe = useStripe();
  const elements = useElements();
  const createPaymentMethod = useCreatePaymentMethod();
  const verifyPaymentMethod = useVerifyPaymentMethod();
  const updatePurpose = useUpdatePaymentMethodPurpose();

  const form = useForm<AddPaymentMethodFormData>({
    resolver: zodResolver(addPaymentMethodSchema),
    defaultValues: {
      billingEmail: '',
      saveAsDefault: false,
    },
  });

  // Calculate commission rate for user's plan
  const commissionRate = formatHostFeeRate(userPlan);

  // ==================== Handlers ====================

  /**
   * Handle reusing existing subscription card
   */
  const handleReuseCard = async () => {
    if (!subscriptionPaymentMethodId) return;

    try {
      // Update purpose from SUBSCRIPTION to BOTH
      await updatePurpose.mutateAsync({
        id: subscriptionPaymentMethodId,
        purpose: 'BOTH',
      });

      // Verify the payment method
      await verifyPaymentMethod.mutateAsync(subscriptionPaymentMethodId);

      // Success - close modal and trigger callback
      onSuccess?.();
      onClose();
    } catch (_error) {
      // Errors are handled by mutation hooks (toast notifications)
      console.error('Error reusing subscription card');
    }
  };

  /**
   * Handle adding new payment method
   */
  const handleAddNewCard = async (data: AddPaymentMethodFormData) => {
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    try {
      // 1. Tokenize card with Stripe Elements
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email: data.billingEmail,
        },
      });

      if (stripeError) {
        setCardError(stripeError.message || 'Failed to tokenize card');
        return;
      }

      if (!paymentMethod) {
        setCardError('Failed to create payment method');
        return;
      }

      // 2. Send tokenized payment method to backend
      const createdPaymentMethod = await createPaymentMethod.mutateAsync({
        stripePaymentMethodId: paymentMethod.id,
        billingEmail: data.billingEmail,
        isDefault: data.saveAsDefault,
      });

      // 3. Verify the newly added payment method
      await verifyPaymentMethod.mutateAsync(createdPaymentMethod.id);

      // Success - close modal and trigger callback
      onSuccess?.();
      onClose();
    } catch (_error: any) {
      // Errors are handled by mutation hooks (toast notifications)
      console.error('Error adding new payment method');
      setCardError(
        _error?.response?.data?.message || 'Failed to add payment method. Please try again.'
      );
    }
  };

  /**
   * Reset modal state when closing
   */
  const handleClose = () => {
    setMode('select');
    setCardError(null);
    form.reset();
    onClose();
  };

  // ==================== Loading State ====================

  const isLoading =
    createPaymentMethod.isPending ||
    verifyPaymentMethod.isPending ||
    updatePurpose.isPending;

  // ==================== Render ====================

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Add Payment Method for Host Payments
          </DialogTitle>
          <DialogDescription>
            To publish properties and receive bookings, you need to add a verified payment
            method. The platform will charge a {commissionRate} commission on bookings generated
            through affiliate referrals.
          </DialogDescription>
        </DialogHeader>

        {/* Commission Rate Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Your Commission Rate: {commissionRate}</AlertTitle>
          <AlertDescription>
            As a <strong>{userPlan}</strong> plan member, the platform charges {commissionRate}{' '}
            on each booking made through an affiliate referral. You keep the remaining{' '}
            {100 - parseFloat(commissionRate)}% of the booking amount.
          </AlertDescription>
        </Alert>

        {/* MODE: Select Option */}
        {mode === 'select' && (
          <div className="space-y-4">
            {/* Option 1: Reuse Subscription Card */}
            {hasSubscriptionPaymentMethod && subscriptionCardLast4 && (
              <>
                <div className="rounded-lg border p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold">
                        Option 1: Use Your Subscription Card
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Reuse your existing subscription payment method for host payments.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">
                          {subscriptionCardBrand} •••• {subscriptionCardLast4}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => setMode('reuse')}
                    className="w-full"
                    variant="default"
                  >
                    Use Subscription Card
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
              </>
            )}

            {/* Option 2: Add New Card */}
            <div className="rounded-lg border p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">
                    {hasSubscriptionPaymentMethod ? 'Option 2:' : ''} Add a New Payment
                    Method
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Add a different card specifically for host commission payments.
                  </p>
                </div>
              </div>
              <Button onClick={() => setMode('add-new')} className="w-full" variant="outline">
                Add New Card
              </Button>
            </div>
          </div>
        )}

        {/* MODE: Reuse Subscription Card */}
        {mode === 'reuse' && (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Confirming Card</AlertTitle>
              <AlertDescription>
                We'll verify your subscription card ({subscriptionCardBrand} ••••{' '}
                {subscriptionCardLast4}) with a $0.01 charge that will be immediately refunded.
                This card will then be available for both subscription and host payments.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={() => setMode('select')} variant="outline" disabled={isLoading}>
                Back
              </Button>
              <Button onClick={handleReuseCard} className="flex-1" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify & Use Card'}
              </Button>
            </div>
          </div>
        )}

        {/* MODE: Add New Card */}
        {mode === 'add-new' && (
          <div className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddNewCard)} className="space-y-4">
                {/* Billing Email */}
                <FormField
                  control={form.control}
                  name="billingEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your-email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        We'll send payment receipts to this email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Stripe Card Element */}
                <div className="space-y-2">
                  <StripeCardElementWrapper
                    onReady={() => setCardReady(true)}
                    onChange={(event) => {
                      if (event.error) {
                        setCardError(event.error.message);
                      } else {
                        setCardError(null);
                      }
                    }}
                  />
                  {cardError && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {cardError}
                    </p>
                  )}
                </div>

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
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Set as default payment method</FormLabel>
                        <FormDescription>
                          This card will be used for future subscription renewals and host
                          payments.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Verification Notice */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Card Verification</AlertTitle>
                  <AlertDescription>
                    We'll verify your card with a $0.01 charge that will be immediately
                    refunded. This ensures the card can process payments.
                  </AlertDescription>
                </Alert>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setMode('select')}
                    variant="outline"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={!stripe || !cardReady || isLoading || !!cardError}
                  >
                    {isLoading ? 'Processing...' : 'Add & Verify Card'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
