/**
 * Payment Method Card Component
 *
 * Displays a saved payment method (credit/debit card).
 */

'use client';

import { CreditCard, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PaymentMethodResponse } from '../types';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethodResponse;
  className?: string;
}

const CARD_BRAND_COLORS = {
  visa: 'bg-blue-600',
  mastercard: 'bg-orange-600',
  amex: 'bg-teal-600',
  discover: 'bg-purple-600',
  default: 'bg-gray-600',
};

export function PaymentMethodCard({
  paymentMethod,
  className,
}: PaymentMethodCardProps) {
  const brandLower = paymentMethod.cardBrand?.toLowerCase() || 'default';
  const brandColor =
    CARD_BRAND_COLORS[brandLower as keyof typeof CARD_BRAND_COLORS] ||
    CARD_BRAND_COLORS.default;

  const isExpired = () => {
    if (!paymentMethod.cardExpMonth || !paymentMethod.cardExpYear) {
      return false;
    }

    const now = new Date();
    const expDate = new Date(
      paymentMethod.cardExpYear,
      paymentMethod.cardExpMonth - 1
    );

    return expDate < now;
  };

  return (
    <Card className={cn('relative', className)}>
      {/* Default Badge */}
      {paymentMethod.isDefault && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-green-500 text-white">
            <Check className="mr-1 h-3 w-3" />
            Default
          </Badge>
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {/* Card Icon */}
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg',
              brandColor
            )}
          >
            <CreditCard className="h-6 w-6 text-white" />
          </div>

          {/* Card Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold capitalize">
                {paymentMethod.cardBrand || 'Card'}
              </p>
              {isExpired() && (
                <Badge variant="destructive" className="text-xs">
                  Expired
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground mt-1">
              •••• •••• •••• {paymentMethod.cardLastFour}
            </p>

            {paymentMethod.cardExpMonth && paymentMethod.cardExpYear && (
              <p className="text-xs text-muted-foreground mt-1">
                Expires {paymentMethod.cardExpMonth.toString().padStart(2, '0')}
                /{paymentMethod.cardExpYear.toString().slice(-2)}
              </p>
            )}
          </div>
        </div>

        {/* Billing Email */}
        {paymentMethod.billingEmail && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">Billing Email</p>
            <p className="text-sm font-medium mt-1">
              {paymentMethod.billingEmail}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
