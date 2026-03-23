/**
 * Payment Methods Section Component
 *
 * Displays active payment methods by default. Inactive cards are filtered out
 * to prevent confusion, as they cannot be used for transactions.
 */

'use client';

import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { PaymentMethodCard } from './payment-method-card';
import { isPaymentMethodUsable } from '@/lib/utils/payment-methods';
import type { PaymentMethodResponse } from '../types';

interface PaymentMethodsSectionProps {
  paymentMethods: PaymentMethodResponse[] | undefined;
  isLoading: boolean;
  onAdd: () => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
  deletingMethodId?: number;
  settingDefaultMethodId?: number;
  isDeleting: boolean;
  isSettingDefault: boolean;
}

export function PaymentMethodsSection({
  paymentMethods,
  isLoading,
  onAdd,
  onDelete,
  onSetDefault,
  deletingMethodId,
  settingDefaultMethodId,
  isDeleting,
  isSettingDefault,
}: PaymentMethodsSectionProps) {
  // Filter to show only active payment methods
  const activePaymentMethods = paymentMethods?.filter((method) =>
    isPaymentMethodUsable(method.status)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
          <Button size="sm" onClick={onAdd}>
            Add Card
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <LoadingSpinner size="md" variant="inline" />
        ) : activePaymentMethods && activePaymentMethods.length > 0 ? (
          activePaymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              paymentMethod={method}
              canDelete={activePaymentMethods.length > 1}
              onDelete={onDelete}
              onSetDefault={onSetDefault}
              isDeleting={isDeleting && deletingMethodId === method.id}
              isSettingDefault={isSettingDefault && settingDefaultMethodId === method.id}
            />
          ))
        ) : (
          <EmptyPaymentMethods onAdd={onAdd} />
        )}
      </CardContent>
    </Card>
  );
}

function EmptyPaymentMethods({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-8">
      <p className="text-sm text-muted-foreground mb-4">
        No payment methods added yet
      </p>
      <Button size="sm" onClick={onAdd}>
        Add Your First Card
      </Button>
    </div>
  );
}
