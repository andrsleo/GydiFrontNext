/**
 * Dispute Booking Dialog Component
 *
 * Client Component - Dialog to mark a finished booking as disputed.
 * Only available for FINISHED bookings when there is a complaint or issue.
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDisputeBooking } from '../../hooks';
import {
  disputeBookingSchema,
  type DisputeBookingFormData,
} from '../../schemas';
import { useAuthStore } from '@/store/auth-store';
import { Loader2, AlertTriangle } from 'lucide-react';

interface DisputeBookingDialogProps {
  bookingId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DisputeBookingDialog({
  bookingId,
  open,
  onOpenChange,
}: DisputeBookingDialogProps) {
  const { mutate: dispute, isPending } = useDisputeBooking();
  const user = useAuthStore((state) => state.user);

  const form = useForm<DisputeBookingFormData>({
    resolver: zodResolver(disputeBookingSchema),
    defaultValues: {
      reason: '',
    },
  });

  function onSubmit(data: DisputeBookingFormData) {
    if (!user?.id) {
      console.error('User ID not available');
      return;
    }

    dispute(
      {
        id: bookingId,
        data: {
          disputedBy: parseInt(user.id),
          reason: data.reason,
        },
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Marcar como Disputada
          </DialogTitle>
          <DialogDescription>
            Esta accion marcara la reserva como en disputa. Proporciona los detalles
            del problema o queja para poder gestionarla correctamente.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razon de la Disputa</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el problema o queja que motiva la disputa..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Minimo 10 caracteres, maximo 500
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="default"
                className="bg-amber-500 hover:bg-amber-600 text-white"
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Marcar en Disputa
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
