/**
 * Add Payment Method Dialog Component
 *
 * Dialog for adding a new payment method with Stripe integration.
 */

'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StripeProvider } from '@/lib/stripe/stripe-provider';
import { AddPaymentMethodForm } from './add-payment-method-form';

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPaymentMethodDialog({
  open,
  onOpenChange,
}: AddPaymentMethodDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
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
            Add a credit or debit card to use for subscription payments.
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
