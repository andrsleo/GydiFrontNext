/**
 * Onboarding Layout
 *
 * Wraps onboarding pages with Stripe provider for payment processing.
 */

import { StripeProvider } from '@/lib/stripe/stripe-provider';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StripeProvider>{children}</StripeProvider>;
}
