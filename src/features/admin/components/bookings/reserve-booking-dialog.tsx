/**
 * Reserve Booking Dialog Component
 *
 * Client Component - Dialog to confirm booking with Airbnb
 */

'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useReserveBooking } from '../../hooks';
import {
  reserveBookingSchema,
  type ReserveBookingFormData,
} from '../../schemas';
import { useAuthStore } from '@/store/auth-store';
import { Loader2, Info } from 'lucide-react';
import type { BookingDto } from '../../types';

interface ReserveBookingDialogProps {
  booking: BookingDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReserveBookingDialog({
  booking,
  open,
  onOpenChange,
}: ReserveBookingDialogProps) {
  const { mutate: reserve, isPending } = useReserveBooking();
  const user = useAuthStore((state) => state.user);

  const form = useForm<ReserveBookingFormData>({
    resolver: zodResolver(reserveBookingSchema),
    defaultValues: {
      airbnbConfirmationCode: '',
      totalAmount: 0,
      currency: 'USD',
      checkInDate: booking.checkInDate.split('T')[0], // Format to YYYY-MM-DD
      checkOutDate: booking.checkOutDate.split('T')[0], // Format to YYYY-MM-DD
    },
  });

  function onSubmit(data: ReserveBookingFormData) {
    if (!user?.id) {
      console.error('User ID not available');
      return;
    }

    // Include adminId in the request
    const request = {
      ...data,
      adminId: parseInt(user.id), // Convert string ID to number
    };

    reserve(
      { id: booking.id, data: request },
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
          <DialogTitle>Confirmar Reserva en Airbnb</DialogTitle>
          <DialogDescription>
            Ingresa los detalles de la confirmación de Airbnb para completar la reserva.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="airbnbConfirmationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Confirmación Airbnb</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="HMABCDEF123"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Código proporcionado por Airbnb al confirmar la reserva
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="checkInDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-in</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Modificar si cambió la fecha
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkOutDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-out</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Modificar si cambió la fecha
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Monto Total Neto
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            Este es el valor <strong>total neto</strong> de la reserva que el
                            huésped pagó en Airbnb. Se usa para calcular las comisiones del
                            anfitrión (platform fee) y del afiliado.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="1500.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Monto total neto confirmado en Airbnb (base para comisiones)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moneda</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar moneda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      <SelectItem value="USD">USD - Dólar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
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
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar Reserva
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
