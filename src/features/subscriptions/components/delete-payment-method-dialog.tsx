/**
 * Delete Payment Method Dialog
 *
 * Confirmation dialog before removing (soft deleting) a payment method.
 * Shows card details and warns about the action.
 *
 * NOTE: The backend performs soft delete - the card is marked as INACTIVE
 * but not physically removed from the database.
 */

'use client';

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
import type { PaymentMethodResponse } from '../types';

interface DeletePaymentMethodDialogProps {
  /** The payment method to delete */
  paymentMethod: PaymentMethodResponse | null;
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback when delete is confirmed */
  onConfirm: () => void;
  /** Whether the delete operation is in progress */
  isDeleting?: boolean;
}

/**
 * Dialog to confirm deletion of a payment method
 *
 * @example
 * ```tsx
 * function PaymentMethodsList() {
 *   const [methodToDelete, setMethodToDelete] = useState<PaymentMethodResponse | null>(null);
 *   const [dialogOpen, setDialogOpen] = useState(false);
 *   const { mutate: deleteMethod, isPending } = useDeletePaymentMethod();
 *
 *   const handleDelete = (method: PaymentMethodResponse) => {
 *     setMethodToDelete(method);
 *     setDialogOpen(true);
 *   };
 *
 *   const handleConfirm = () => {
 *     if (methodToDelete) {
 *       deleteMethod(methodToDelete.id, {
 *         onSuccess: () => setDialogOpen(false),
 *       });
 *     }
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={() => handleDelete(method)}>Delete</button>
 *       <DeletePaymentMethodDialog
 *         paymentMethod={methodToDelete}
 *         open={dialogOpen}
 *         onOpenChange={setDialogOpen}
 *         onConfirm={handleConfirm}
 *         isDeleting={isPending}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export function DeletePaymentMethodDialog({
  paymentMethod,
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: DeletePaymentMethodDialogProps) {
  if (!paymentMethod) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove payment method?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span>
              You are about to remove the payment method{' '}
              <span className="font-medium text-foreground">
                {paymentMethod.cardBrand?.toUpperCase()} •••• {paymentMethod.cardLastFour}
              </span>
              .
            </span>
            <br />
            <br />
            <span>
              This card will be deactivated and will no longer be available for transactions.
              You can add it again later if needed.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Removing...' : 'Remove'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
