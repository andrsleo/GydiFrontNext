/**
 * Example Usage: HostPaymentOnboardingModal
 *
 * This file demonstrates how to integrate the Host Payment Onboarding Modal
 * into your application. This is NOT production code - just an example.
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HostPaymentOnboardingModal } from './host-payment-onboarding-modal';
import { StripeProvider } from '@/lib/stripe/stripe-provider';
import { usePaymentMethods } from '../hooks/use-payment-methods';
import { useSubscription } from '../hooks/use-subscription';
import type { SubscriptionPlan } from '@/types/user';

/**
 * Example 1: Trigger modal when HOST tries to publish a property
 */
export function PropertyPublishButton() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { data: subscription } = useSubscription();
  const { data: paymentMethods } = usePaymentMethods();

  // Check if user has a verified HOST payment method
  const hasHostPaymentMethod = paymentMethods?.some(
    (pm) => pm.purpose === 'HOST_COMMISSION' || pm.purpose === 'BOTH'
  );

  const handlePublish = () => {
    if (!hasHostPaymentMethod) {
      // Show onboarding modal if no host payment method
      setShowOnboarding(true);
    } else {
      // Proceed with publishing
      console.log('Publishing property...');
    }
  };

  return (
    <>
      <Button onClick={handlePublish}>Publish Property</Button>

      <StripeProvider>
        <HostPaymentOnboardingModal
          open={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onSuccess={() => {
            console.log('Payment method verified! Can now publish property.');
            // Proceed with publishing after modal closes
          }}
          userPlan={(subscription?.planCode || 'FREE') as SubscriptionPlan}
          hasSubscriptionPaymentMethod={paymentMethods?.some(
            (pm) => pm.purpose === 'SUBSCRIPTION' || pm.purpose === 'BOTH'
          )}
          subscriptionCardLast4={
            paymentMethods?.find((pm) => pm.isDefault && pm.cardLastFour)?.cardLastFour ?? undefined
          }
          subscriptionCardBrand={
            paymentMethods?.find((pm) => pm.isDefault && pm.cardBrand)?.cardBrand ?? undefined
          }
          subscriptionPaymentMethodId={
            paymentMethods?.find((pm) => pm.isDefault)?.id
          }
        />
      </StripeProvider>
    </>
  );
}

/**
 * Example 2: Show modal in settings page to add host payment method
 */
export function AddHostPaymentMethodSettings() {
  const [showModal, setShowModal] = useState(false);
  const { data: subscription } = useSubscription();
  const { data: paymentMethods } = usePaymentMethods();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Host Payment Settings</h2>
      <p className="text-sm text-muted-foreground">
        Add a payment method to receive host payments after platform commission charges.
      </p>

      <Button onClick={() => setShowModal(true)}>Add Host Payment Method</Button>

      <StripeProvider>
        <HostPaymentOnboardingModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            console.log('Host payment method added successfully!');
          }}
          userPlan={(subscription?.planCode || 'FREE') as SubscriptionPlan}
          hasSubscriptionPaymentMethod={paymentMethods?.some(
            (pm) => pm.purpose === 'SUBSCRIPTION' || pm.purpose === 'BOTH'
          )}
          subscriptionCardLast4={
            paymentMethods?.find((pm) => pm.isDefault && pm.cardLastFour)?.cardLastFour ?? undefined
          }
          subscriptionCardBrand={
            paymentMethods?.find((pm) => pm.isDefault && pm.cardBrand)?.cardBrand ?? undefined
          }
          subscriptionPaymentMethodId={
            paymentMethods?.find((pm) => pm.isDefault)?.id
          }
        />
      </StripeProvider>
    </div>
  );
}

/**
 * Example 3: Show warning banner if HOST has no payment method
 */
export function HostPaymentWarningBanner() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { data: subscription } = useSubscription();
  const { data: paymentMethods } = usePaymentMethods();

  const hasHostPaymentMethod = paymentMethods?.some(
    (pm) => pm.purpose === 'HOST_COMMISSION' || pm.purpose === 'BOTH'
  );

  // Don't show banner if not a HOST or if already has payment method
  if (!subscription || hasHostPaymentMethod) {
    return null;
  }

  return (
    <>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900">
              Add Payment Method to Publish Properties
            </h3>
            <p className="text-sm text-yellow-800 mt-1">
              You need to add a verified payment method before you can publish properties
              and receive bookings as a host.
            </p>
          </div>
          <Button onClick={() => setShowOnboarding(true)} size="sm">
            Add Now
          </Button>
        </div>
      </div>

      <StripeProvider>
        <HostPaymentOnboardingModal
          open={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onSuccess={() => {
            console.log('Payment method added! Banner will disappear.');
          }}
          userPlan={subscription.planCode as SubscriptionPlan}
          hasSubscriptionPaymentMethod={paymentMethods?.some(
            (pm) => pm.purpose === 'SUBSCRIPTION' || pm.purpose === 'BOTH'
          )}
          subscriptionCardLast4={
            paymentMethods?.find((pm) => pm.isDefault && pm.cardLastFour)?.cardLastFour ?? undefined
          }
          subscriptionCardBrand={
            paymentMethods?.find((pm) => pm.isDefault && pm.cardBrand)?.cardBrand ?? undefined
          }
          subscriptionPaymentMethodId={
            paymentMethods?.find((pm) => pm.isDefault)?.id
          }
        />
      </StripeProvider>
    </>
  );
}

/**
 * Example 4: Use verification hook directly
 */
export function DirectVerificationExample() {
  const { mutate: verify, isPending } = useVerifyPaymentMethod();

  const handleVerify = (paymentMethodId: number) => {
    verify(paymentMethodId, {
      onSuccess: () => {
        console.log('Verification successful!');
      },
      onError: (error) => {
        console.error('Verification failed:', error);
      },
    });
  };

  return (
    <Button onClick={() => handleVerify(123)} disabled={isPending}>
      {isPending ? 'Verifying...' : 'Verify Card'}
    </Button>
  );
}

// Import the hook for direct use
import { useVerifyPaymentMethod } from '../hooks/use-verify-payment-method';
