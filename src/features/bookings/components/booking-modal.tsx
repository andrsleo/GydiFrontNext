'use client';

import { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addMonths, differenceInDays, format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from 'sonner';

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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils/format';

import { createBookingSchema, type CreateBookingFormData } from '../schemas/booking.schema';
import { useCreateBooking } from '../hooks';
import { useCreateBookingWithPayment } from '../hooks/use-create-booking-with-payment';
import { usePropertyCalendar } from '../hooks/use-property-calendar';
import { BookingCalendar } from './booking-calendar';
import { StripeCardElementWrapper } from '@/features/subscriptions/components/stripe-card-element';

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
  /** Phase 4 — Social Commerce: content post that originated this booking (optional) */
  contentPostId?: number;
}

export function BookingModal({ isOpen, onClose, property, referralLinkId, contentPostId }: BookingModalProps) {
  const createBooking = useCreateBooking();
  const createBookingWithPayment = useCreateBookingWithPayment();

  const [selectedDates, setSelectedDates] = useState<{ from: Date; to: Date } | undefined>();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Load blocked dates for the next 3 months
  const calendarFrom = format(new Date(), 'yyyy-MM-dd');
  const calendarTo = format(addMonths(new Date(), 3), 'yyyy-MM-dd');
  const { data: blockedDates = [] } = usePropertyCalendar(property.id, calendarFrom, calendarTo);

  const form = useForm<CreateBookingFormData>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      referralLinkId: '',
      propertyId: property.id,
      checkInDate: '',
      checkOutDate: '',
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      guestsCount: 1,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (referralLinkId) {
      form.setValue('referralLinkId', referralLinkId, { shouldValidate: true });
    }
  }, [referralLinkId, form]);

  const handleDateSelect = (dates: { from: Date; to: Date } | undefined) => {
    setSelectedDates(dates);
    if (dates?.from && dates?.to) {
      form.setValue('checkInDate', format(dates.from, 'yyyy-MM-dd'));
      form.setValue('checkOutDate', format(dates.to, 'yyyy-MM-dd'));
    } else {
      form.setValue('checkInDate', '');
      form.setValue('checkOutDate', '');
    }
  };

  const checkInDate = form.watch('checkInDate');
  const checkOutDate = form.watch('checkOutDate');

  const nights = useMemo(() => {
    if (checkInDate && checkOutDate) {
      return differenceInDays(new Date(checkOutDate), new Date(checkInDate));
    }
    return 0;
  }, [checkInDate, checkOutDate]);

  const subtotal = nights * property.pricePerNight;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;
  // Deposit: 1.5× price per night, clamped [$50, $500]
  const depositAmount = Math.min(Math.max(property.pricePerNight * 1.5, 50), 500);

  const hasSelectedDates = checkInDate && checkOutDate && nights > 0;
  const isFormValid = form.formState.isValid && hasSelectedDates && referralLinkId;
  const isLoadingReferralLink = !referralLinkId;

  // Step 1 submit: validate T&C + blocked dates, then advance to step 2
  const handleStep1Submit = (data: CreateBookingFormData) => {
    if (!termsAccepted) {
      toast.error('Debes aceptar los términos para continuar');
      return;
    }

    // Validate no selected date is blocked
    if (selectedDates?.from && selectedDates?.to) {
      const current = new Date(selectedDates.from);
      while (current <= selectedDates.to) {
        if (blockedDates.includes(format(current, 'yyyy-MM-dd'))) {
          toast.error('Las fechas seleccionadas no están disponibles');
          return;
        }
        current.setDate(current.getDate() + 1);
      }
    }

    setStep(2);
  };

  // Step 2 submit: create booking with Stripe payment
  const handleStep2Submit = async () => {
    const data = form.getValues();

    if (property.airbnbUrl) {
      // Fase 1 fallback: if no Stripe, use simple create booking
      try {
        await createBooking.mutateAsync({ ...data, termsAccepted: true, contentPostId });
        const url = new URL(property.airbnbUrl);
        url.searchParams.set('check_in', data.checkInDate);
        url.searchParams.set('check_out', data.checkOutDate);
        window.open(url.toString(), '_blank');
        // Show viral CTA instead of closing immediately
        setStep(3);
      } catch {
        // Error handled by hook
      }
      return;
    }

    try {
      await createBookingWithPayment.mutateAsync({ ...data, termsAccepted: true, contentPostId });
      // Show viral CTA instead of closing immediately
      setStep(3);
    } catch {
      // Error handled by hook
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
    setSelectedDates(undefined);
    setTermsAccepted(false);
    setStep(1);
  };

  const isPending = createBooking.isPending || createBookingWithPayment.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl max-sm:left-0 max-sm:right-0 max-sm:top-auto max-sm:bottom-0 max-sm:w-full max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-xl">
        <DialogHeader>
          <DialogTitle>
            {step === 1
            ? `Validar Disponibilidad — ${property.title}`
            : step === 2
            ? 'Confirmar reserva y pago'
            : '¡Reserva confirmada!'}
          </DialogTitle>
          <DialogDescription>
            {isLoadingReferralLink
              ? 'Preparando formulario...'
              : step === 1
              ? 'Completa los siguientes datos para validar la disponibilidad'
              : step === 2
              ? 'Ingresa tu tarjeta para confirmar la reserva'
              : 'Tu reserva ha sido registrada exitosamente.'}
          </DialogDescription>
        </DialogHeader>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleStep1Submit)} className="space-y-6">
              {/* Calendar */}
              <div className="space-y-4">
                <FormLabel>Selecciona las fechas</FormLabel>
                <div className="flex justify-center">
                  <BookingCalendar
                    propertyId={property.id}
                    onDateSelect={handleDateSelect}
                  />
                </div>
                {hasSelectedDates && (
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Fechas seleccionadas:</span>
                      <span>{nights} {nights === 1 ? 'noche' : 'noches'}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-4" />

              {/* Guest info */}
              <div className="space-y-4">
                <FormLabel>Datos del huésped</FormLabel>

                <FormField
                  control={form.control}
                  name="guestName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Pérez García" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guestEmail"
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
                  name="guestPhone"
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

                <FormField
                  control={form.control}
                  name="guestsCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Huéspedes</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="50"
                          placeholder="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* T&C checkbox */}
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                  Entiendo que el contrato de arrendamiento se celebra directamente con el anfitrión.
                  GYDI es una plataforma tecnológica y no es parte del contrato ni asume
                  responsabilidad por daños o incumplimientos.{' '}
                  <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline text-foreground">
                    Ver términos completos
                  </a>
                </label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid || isPending || isLoadingReferralLink || !termsAccepted}
                >
                  {isLoadingReferralLink ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    'Siguiente'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {/* ── STEP 3 — Éxito + Viral CTA ── */}
        {step === 3 && (
          <div className="space-y-6 py-2">
            {/* Success indicator */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--gydi-teal))]/10">
                <svg
                  className="h-8 w-8 text-[hsl(var(--gydi-teal))]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Tu solicitud de reserva en{' '}
                <span className="font-semibold text-foreground">{property.title}</span>{' '}
                fue enviada. El anfitrión te confirmará pronto.
              </p>
            </div>

            <Separator />

            {/* Viral CTA */}
            <div className="rounded-2xl border border-[hsl(var(--gydi-teal))]/30 bg-[hsl(var(--gydi-teal))]/5 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--gydi-teal))]/15">
                  <svg
                    className="h-4 w-4 text-[hsl(var(--gydi-teal))]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    ¿Te gustó esta propiedad?
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    Comparte tu experiencia y gana comisiones cuando otros la reserven.
                  </p>
                </div>
              </div>
              <a
                href={`/dashboard/content/new?propertyId=${property.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--gydi-teal))] px-4 py-2.5 text-sm font-semibold text-white min-h-[44px] transition-opacity hover:opacity-90 active:opacity-75"
              >
                Crear contenido
              </a>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Cerrar
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* ── STEP 2 — Pago ── */}
        {step === 2 && (
          <div className="space-y-6">
            <StripeCardElementWrapper className="w-full" />

            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Reserva ({nights} {nights === 1 ? 'noche' : 'noches'})</span>
                <span>{formatCurrency(subtotal, property.currency)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tarifa de servicio</span>
                <span>{formatCurrency(serviceFee, property.currency)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Depósito de seguridad (reembolsable)</span>
                <span>~{formatCurrency(depositAmount, property.currency)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total autorizado en tarjeta</span>
                <span>{formatCurrency(total + depositAmount, property.currency)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                El depósito de seguridad es un bloqueo temporal en tu tarjeta.
                Si no hay daños, se libera automáticamente 7 días después del check-out.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isPending}
              >
                Atrás
              </Button>
              <Button onClick={handleStep2Submit} disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'Confirmar reserva'
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
