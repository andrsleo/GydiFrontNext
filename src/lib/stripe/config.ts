/**
 * Stripe Configuration
 *
 * Configuration for Stripe integration in the frontend.
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

/**
 * Stripe publishable key
 * This is safe to expose in the frontend
 */
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable'
  );
}

/**
 * Stripe promise - singleton instance
 * loadStripe is called only once and cached
 */
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};
