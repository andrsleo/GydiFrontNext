/**
 * Cancel Booking Dialog Component
 *
 * Client Component - Dialog to cancel a booking
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
import { useCancelBooking } from '../../hooks';
import {
  cancelBookingSchema,
  type CancelBookingFormData,
} from '../../schemas';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface CancelBookingDialogProps {
  bookingId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelBookingDialog({
  bookingId,
  open,
  onOpenChange,
}: CancelBookingDialogProps) {
  const { mutate: cancel, isPending } = useCancelBooking();
  const user = useAuthStore((state) => state.user);

  const form = useForm<CancelBookingFormData>({
    resolver: zodResolver(cancelBookingSchema),
    defaultValues: {
      reason: '',
    },
  });

  function onSubmit(data: CancelBookingFormData) {
    if (!user?.id) {
      console.error('User ID not available');
      return;
    }

    cancel(
      {
        id: bookingId,
        data: {
          cancelledBy: parseInt(user.id),
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
          <DialogTitle>Cancelar Reserva</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Por favor proporciona una razón para la cancelación.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón de Cancelación</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe la razón de la cancelación..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Mínimo 10 caracteres, máximo 500
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
                Volver
              </Button>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cancelar Reserva
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
