/**
 * Stripe Card Element Component
 *
 * Wrapper around Stripe's CardElement with custom styling.
 */

'use client';

import { CardElement } from '@stripe/react-stripe-js';
import type { StripeCardElementOptions } from '@stripe/stripe-js';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface StripeCardElementWrapperProps {
  onReady?: () => void;
  onChange?: (event: any) => void;
  className?: string;
}

const CARD_ELEMENT_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: 'system-ui, sans-serif',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: false,
};

export function StripeCardElementWrapper({
  onReady,
  onChange,
  className,
}: StripeCardElementWrapperProps) {
  return (
    <div className={className}>
      <Label htmlFor="card-element" className="mb-2 block">
        Card Information
      </Label>
      <Card>
        <CardContent className="p-4">
          <CardElement
            id="card-element"
            options={CARD_ELEMENT_OPTIONS}
            onReady={onReady}
            onChange={onChange}
          />
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground mt-2">
        Your card information is encrypted and secure. We never store your full card number.
      </p>
    </div>
  );
}
