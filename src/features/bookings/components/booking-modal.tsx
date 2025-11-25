'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInDays, format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils/format';

import { createBookingSchema, type CreateBookingFormData } from '../schemas/booking.schema';
import { useCreateBooking } from '../hooks';

import { Currency } from '@/features/properties/types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    pricePerNight: number;
    currency: Currency;
  };
  referralLinkId: string;
}

export function BookingModal({ isOpen, onClose, property, referralLinkId }: BookingModalProps) {
  const createBooking = useCreateBooking();

  const form = useForm<CreateBookingFormData>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      referralLinkId,
      propertyId: property.id,
      startDate: '',
      endDate: '',
      clientFirstName: '',
      clientLastName: '',
      clientEmail: '',
      clientPhone: '',
      totalAmount: 0,
      currency: property.currency,
    },
  });

  // Watch date fields to calculate quote
  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');

  // Calculate nights and total
  const nights = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return differenceInDays(end, start);
    }
    return 0;
  }, [startDate, endDate]);

  const total = useMemo(() => {
    if (nights > 0) {
      const subtotal = property.pricePerNight * nights;
      const serviceFee = subtotal * 0.1; // 10% service fee
      const calculatedTotal = subtotal + serviceFee;
      form.setValue('totalAmount', calculatedTotal);
      return calculatedTotal;
    }
    return 0;
  }, [nights, property.pricePerNight, form]);

  const onSubmit = async (data: CreateBookingFormData) => {
    await createBooking.mutateAsync(data);
    onClose();
    form.reset();
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const hasSelectedDates = startDate && endDate;
  const subtotal = nights * property.pricePerNight;
  const serviceFee = subtotal * 0.1;

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reservar {property.title}</DialogTitle>
          <DialogDescription>
            Completa los siguientes datos para realizar tu reserva
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date Selection */}
            <div className="space-y-4">
              <FormLabel>Selecciona las fechas</FormLabel>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-in</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          min={today}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-out</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          min={startDate || today}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {hasSelectedDates && nights > 0 && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{nights} {nights === 1 ? 'noche' : 'noches'}</span>
                    <span className="font-medium">
                      {formatCurrency(property.pricePerNight, property.currency)} x {nights}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal, property.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tarifa de servicio (10%):</span>
                    <span>{formatCurrency(serviceFee, property.currency)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2"></div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(total, property.currency)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-4"></div>

            {/* Client Information */}
            <div className="space-y-4">
              <FormLabel>Datos del huésped</FormLabel>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="juan.perez@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientPhone"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder="+57 300 123 4567"
                        value={value}
                        onChange={onChange}
                        defaultCountry="CO"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createBooking.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!hasSelectedDates || nights <= 0 || createBooking.isPending}
              >
                {createBooking.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  `Reservar ${total > 0 ? formatCurrency(total, property.currency) : ''}`
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
