/**
 * Add Payment Method Dialog Component
 *
 * Dialog for adding a new payment method with Stripe integration.
 */

'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StripeProvider } from '@/lib/stripe/stripe-provider';
import { AddPaymentMethodForm } from './add-payment-method-form';
import { getStripe } from '@/lib/stripe/config';

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  description?: string;
}

export function AddPaymentMethodDialog({
  open,
  onOpenChange,
  onSuccess,
  description,
}: AddPaymentMethodDialogProps) {
  // Pre-load Stripe.js as soon as this component mounts (before the user
  // opens the dialog) so the promise is already resolved when the dialog
  // opens and useStripe() returns the instance immediately — avoiding the
  // "disabled button" state that occurs when Stripe hasn't loaded yet.
  useEffect(() => {
    getStripe();
  }, []);

  const handleSuccess = () => {
    onOpenChange(false);
    onSuccess?.();
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            {description ?? 'Add a credit or debit card to use for subscription payments.'}
          </DialogDescription>
        </DialogHeader>

        <StripeProvider>
          <AddPaymentMethodForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </StripeProvider>
      </DialogContent>
    </Dialog>
  );
}
