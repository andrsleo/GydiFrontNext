/**
 * Payment Method Card Component
 *
 * Displays a saved payment method (credit/debit card) with actions.
 */

'use client';

import { useState } from 'react';
import { CreditCard, Check, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { getCardBrandColor } from '@/lib/constants/card-brands';
import {
  isCardExpired,
  formatCardExpiry,
  getStatusLabel,
  getStatusBadgeVariant,
  isPaymentMethodUsable,
} from '@/lib/utils/payment-methods';
import type { PaymentMethodResponse } from '../types';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethodResponse;
  className?: string;
  /** Whether this card can be deleted (false when it's the only active method) */
  canDelete?: boolean;
  /** Callback when delete is confirmed */
  onDelete?: (id: number) => void;
  /** Callback when set default button is clicked */
  onSetDefault?: (id: number) => void;
  /** Whether a delete operation is in progress for this card */
  isDeleting?: boolean;
  /** Whether a set default operation is in progress for this card */
  isSettingDefault?: boolean;
}

export function PaymentMethodCard({
  paymentMethod,
  className,
  canDelete = true,
  onDelete,
  onSetDefault,
  isDeleting = false,
  isSettingDefault = false,
}: PaymentMethodCardProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const brandColor = getCardBrandColor(paymentMethod.cardBrand);
  const cardIsExpired = isCardExpired(
    paymentMethod.cardExpMonth,
    paymentMethod.cardExpYear
  );
  const expiryDisplay = formatCardExpiry(
    paymentMethod.cardExpMonth,
    paymentMethod.cardExpYear
  );
  const isUsable = isPaymentMethodUsable(paymentMethod.status);
  const statusLabel = getStatusLabel(paymentMethod.status);
  const statusVariant = getStatusBadgeVariant(paymentMethod.status);

  return (
    <>
    <Card className={cn('relative', !isUsable && 'opacity-60', className)}>
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
              {/* Status Badge - Primary indicator */}
              <Badge variant={statusVariant} className="text-xs">
                {statusLabel}
              </Badge>
              {/* Expiration warning - Only show if card is active but expired */}
              {cardIsExpired && paymentMethod.status === 'ACTIVE' && (
                <Badge variant="warning" className="text-xs">
                  Card Expired
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground mt-1">
              •••• •••• •••• {paymentMethod.cardLastFour}
            </p>

            {expiryDisplay && (
              <p className="text-xs text-muted-foreground mt-1">
                Expires {expiryDisplay}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!paymentMethod.isDefault && onSetDefault && isUsable && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSetDefault(paymentMethod.id)}
                disabled={isSettingDefault || isDeleting}
                title="Set as default"
              >
                <Star className="h-4 w-4" />
              </Button>
            )}
            {onDelete && isUsable && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (!canDelete) {
                    toast.warning('No puedes eliminar tu único método de pago', {
                      description: 'Agrega otra tarjeta antes de eliminar esta.',
                    });
                    return;
                  }
                  setIsConfirmOpen(true);
                }}
                disabled={isDeleting || isSettingDefault}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                title="Eliminar método de pago"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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

    <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar tarjeta?</AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de eliminar la tarjeta{' '}
            <span className="font-medium capitalize">{paymentMethod.cardBrand}</span> terminada en{' '}
            <span className="font-medium">{paymentMethod.cardLastFour}</span>. Esta acción no se puede
            deshacer y la tarjeta también será eliminada de Stripe.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              onDelete?.(paymentMethod.id);
              setIsConfirmOpen(false);
            }}
          >
            Sí, eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
