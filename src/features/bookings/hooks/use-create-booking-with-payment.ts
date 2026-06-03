'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { bookingsApi } from '../api/bookings.api';
import type { CreateBookingRequest, BookingDto } from '../types';

type CreateBookingWithPaymentInput = Omit<CreateBookingRequest, 'stripePaymentMethodId'> & {
  guestEmail: string;
};

/**
 * Fase 2 — Create a booking with Stripe payment method tokenisation.
 *
 * Flow:
 *   1. Tokenise card via Stripe.js (createPaymentMethod — no charge)
 *   2. Create booking with the resulting paymentMethodId
 *   3. Trigger backend payment intent + auth hold
 *
 * Must be used inside a component wrapped by <StripeProvider>.
 */
export function useCreateBookingWithPayment() {
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookingWithPaymentInput): Promise<BookingDto> => {
      if (!stripe || !elements) {
        throw new Error('Stripe no está inicializado. Recarga la página e intenta de nuevo.');
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('El elemento de tarjeta no está disponible.');
      }

      // Step 1 — Tokenise card (no charge, just creates a reusable PaymentMethod)
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: { email: data.guestEmail },
      });

      if (error) {
        throw new Error(error.message ?? 'Error al procesar la tarjeta');
      }

      // Step 2 — Create booking record in backend
      const booking = await bookingsApi.create({
        ...data,
        stripePaymentMethodId: paymentMethod.id,
      });

      // Step 3 — Create payment intent + auth hold in backend
      await bookingsApi.createPayment(booking.id, paymentMethod.id);

      // Return the full BookingDto from the create response
      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Reserva creada', {
        description: 'El anfitrión recibirá tu solicitud y la confirmará en breve.',
      });
    },
    onError: (error: Error) => {
      toast.error('Error al crear reserva', { description: error.message });
    },
  });
}
