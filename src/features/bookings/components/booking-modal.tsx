'use client';

import { useMemo, useState, useEffect } from 'react';
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
import { BookingCalendar } from './booking-calendar';

import { Currency } from '@/features/properties/types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    pricePerNight: number;
    currency: Currency;
    airbnbUrl?: string;
  };
  referralLinkId: string;
}

export function BookingModal({ isOpen, onClose, property, referralLinkId }: BookingModalProps) {
  const createBooking = useCreateBooking();
  const [selectedDates, setSelectedDates] = useState<{ from: Date; to: Date } | undefined>();

  const form = useForm<CreateBookingFormData>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      referralLinkId: '',
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
    mode: 'onChange', // Validate on change
  });

  // Update referralLinkId when it changes
  useEffect(() => {
    if (referralLinkId) {
      form.setValue('referralLinkId', referralLinkId, { shouldValidate: true });
    }
  }, [referralLinkId, form]);

  // Handle calendar date selection
  const handleDateSelect = (dates: { from: Date; to: Date } | undefined) => {
    setSelectedDates(dates);
    if (dates?.from && dates?.to) {
      // Convert dates to YYYY-MM-DD format
      form.setValue('startDate', format(dates.from, 'yyyy-MM-dd'));
      form.setValue('endDate', format(dates.to, 'yyyy-MM-dd'));
    } else {
      form.setValue('startDate', '');
      form.setValue('endDate', '');
    }
  };

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
    try {
      await createBooking.mutateAsync(data);

      // Si la propiedad tiene URL de Airbnb, construir la URL con las fechas y abrir en nueva pestaña
      if (property.airbnbUrl) {
        const checkInDate = data.startDate; // Already in YYYY-MM-DD format
        const checkOutDate = data.endDate; // Already in YYYY-MM-DD format

        // Construir URL de Airbnb con parámetros de fechas
        const url = new URL(property.airbnbUrl);
        url.searchParams.set('check_in', checkInDate);
        url.searchParams.set('check_out', checkOutDate);

        // Abrir en nueva pestaña
        window.open(url.toString(), '_blank');
      }

      onClose();
      form.reset();
      setSelectedDates(undefined);
    } catch (error) {
      // Error ya manejado por el hook
      console.error('Error creating booking:', error);
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
    setSelectedDates(undefined);
  };

  const hasSelectedDates = startDate && endDate;
  const subtotal = nights * property.pricePerNight;
  const serviceFee = subtotal * 0.1;

  // Check if form is valid for submission
  const isFormValid = form.formState.isValid && hasSelectedDates && nights > 0 && referralLinkId;

  // Show loading state if referralLinkId is not ready yet
  const isLoadingReferralLink = !referralLinkId;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Validar Disponibilidad - {property.title}</DialogTitle>
          <DialogDescription>
            {isLoadingReferralLink
              ? 'Preparando formulario...'
              : 'Completa los siguientes datos para validar la disponibilidad'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Calendar Selection */}
            <div className="space-y-4">
              <FormLabel>Selecciona las fechas</FormLabel>

              <div className="flex justify-center">
                <BookingCalendar
                  propertyId={property.id}
                  onDateSelect={handleDateSelect}
                />
              </div>

              {hasSelectedDates && nights > 0 && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Fechas seleccionadas:</span>
                    <span>{nights} {nights === 1 ? 'noche' : 'noches'}</span>
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
                disabled={!isFormValid || createBooking.isPending || isLoadingReferralLink}
              >
                {isLoadingReferralLink ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cargando...
                  </>
                ) : createBooking.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validando...
                  </>
                ) : (
                  'Validar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
