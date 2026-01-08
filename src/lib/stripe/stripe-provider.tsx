/**
 * Stripe Provider Component
 *
 * Wraps children with Stripe Elements provider.
 * Use this in layouts where you need Stripe functionality.
 */

'use client';

import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from './config';

interface StripeProviderProps {
  children: React.ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
  return (
    <Elements
      stripe={getStripe()}
      options={{
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#0070f3',
            colorBackground: '#ffffff',
            colorText: '#000000',
            colorDanger: '#df1b41',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}
