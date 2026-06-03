import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

// Mock Stripe hooks — must be done before importing the hook
const mockCreatePaymentMethod = vi.fn();
const mockGetElement = vi.fn();

vi.mock('@stripe/react-stripe-js', () => ({
  useStripe: () => ({ createPaymentMethod: mockCreatePaymentMethod }),
  useElements: () => ({ getElement: mockGetElement }),
  CardElement: {},
}));

vi.mock('@/features/bookings/api/bookings.api', () => ({
  bookingsApi: {
    create: vi.fn(),
    createPayment: vi.fn(),
    confirm: vi.fn(),
    reject: vi.fn(),
  },
}));

import { useCreateBookingWithPayment } from '../use-create-booking-with-payment';
import { bookingsApi } from '@/features/bookings/api/bookings.api';
import { toast } from 'sonner';
import type { BookingDto } from '../../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
}

const MOCK_CARD_ELEMENT = { mount: vi.fn() };
const MOCK_PAYMENT_METHOD_ID = 'pm_test_mock_4242';

const BOOKING_INPUT = {
  referralLinkId: '42',
  propertyId: '1',
  checkInDate: '2026-06-10',
  checkOutDate: '2026-06-13',
  guestName: 'Juan Pérez García',
  guestEmail: 'juan@test.com',
  guestPhone: '+573001234567',
  guestsCount: 2,
  termsAccepted: true,
};

const MOCK_BOOKING_DTO: BookingDto = {
  id: 999,
  referralLinkId: 42,
  propertyId: 1,
  checkInDate: '2026-06-10',
  checkOutDate: '2026-06-13',
  guestName: 'Juan Pérez García',
  guestEmail: 'juan@test.com',
  guestsCount: 2,
  currency: 'USD',
  status: 'REQUEST',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useCreateBookingWithPayment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetElement.mockReturnValue(MOCK_CARD_ELEMENT);
  });

  it('retorna mutation en estado idle inicial', () => {
    const { result } = renderHook(() => useCreateBookingWithPayment(), { wrapper: makeWrapper() });

    expect(result.current.isPending).toBe(false);
  });

  it('flujo completo: tokeniza tarjeta → crea booking → crea pago', async () => {
    mockCreatePaymentMethod.mockResolvedValue({
      paymentMethod: { id: MOCK_PAYMENT_METHOD_ID },
      error: null,
    });
    vi.mocked(bookingsApi.create).mockResolvedValue(MOCK_BOOKING_DTO);
    vi.mocked(bookingsApi.createPayment).mockResolvedValue(undefined);

    const { result } = renderHook(() => useCreateBookingWithPayment(), { wrapper: makeWrapper() });

    await act(async () => {
      await result.current.mutateAsync(BOOKING_INPUT);
    });

    // 1. Stripe tokenization called
    expect(mockCreatePaymentMethod).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'card',
        card: MOCK_CARD_ELEMENT,
        billing_details: { email: BOOKING_INPUT.guestEmail },
      })
    );

    // 2. Booking created with stripePaymentMethodId
    expect(bookingsApi.create).toHaveBeenCalledWith(
      expect.objectContaining({
        stripePaymentMethodId: MOCK_PAYMENT_METHOD_ID,
      })
    );

    // 3. Payment created for booking ID
    expect(bookingsApi.createPayment).toHaveBeenCalledWith(MOCK_BOOKING_DTO.id, MOCK_PAYMENT_METHOD_ID);
  });

  it('muestra toast.success tras flujo exitoso', async () => {
    mockCreatePaymentMethod.mockResolvedValue({
      paymentMethod: { id: MOCK_PAYMENT_METHOD_ID },
      error: null,
    });
    vi.mocked(bookingsApi.create).mockResolvedValue(MOCK_BOOKING_DTO);
    vi.mocked(bookingsApi.createPayment).mockResolvedValue(undefined);

    const { result } = renderHook(() => useCreateBookingWithPayment(), { wrapper: makeWrapper() });

    await act(async () => {
      await result.current.mutateAsync(BOOKING_INPUT);
    });

    expect(toast.success).toHaveBeenCalledWith(
      'Reserva creada',
      expect.objectContaining({ description: expect.stringContaining('anfitrión') })
    );
  });

  it('lanza error si Stripe devuelve error en createPaymentMethod', async () => {
    mockCreatePaymentMethod.mockResolvedValue({
      paymentMethod: null,
      error: { message: 'Your card number is incomplete.' },
    });

    const { result } = renderHook(() => useCreateBookingWithPayment(), { wrapper: makeWrapper() });

    await act(async () => {
      await result.current.mutateAsync(BOOKING_INPUT).catch(() => {});
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith(
      'Error al crear reserva',
      expect.objectContaining({ description: 'Your card number is incomplete.' })
    );
    // Should NOT call bookingsApi.create
    expect(bookingsApi.create).not.toHaveBeenCalled();
  });

  it('lanza error si CardElement no está disponible', async () => {
    mockGetElement.mockReturnValue(null); // No card element

    const { result } = renderHook(() => useCreateBookingWithPayment(), { wrapper: makeWrapper() });

    await act(async () => {
      await result.current.mutateAsync(BOOKING_INPUT).catch(() => {});
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalled();
    expect(bookingsApi.create).not.toHaveBeenCalled();
  });

  it('retorna BookingDto tras flujo exitoso', async () => {
    mockCreatePaymentMethod.mockResolvedValue({
      paymentMethod: { id: MOCK_PAYMENT_METHOD_ID },
      error: null,
    });
    vi.mocked(bookingsApi.create).mockResolvedValue(MOCK_BOOKING_DTO);
    vi.mocked(bookingsApi.createPayment).mockResolvedValue(undefined);

    const { result } = renderHook(() => useCreateBookingWithPayment(), { wrapper: makeWrapper() });

    let returnValue: BookingDto | undefined;
    await act(async () => {
      returnValue = await result.current.mutateAsync(BOOKING_INPUT);
    });

    expect(returnValue).toEqual(MOCK_BOOKING_DTO);
  });

  it('muestra toast.error si bookingsApi.create falla después de tokenización', async () => {
    mockCreatePaymentMethod.mockResolvedValue({
      paymentMethod: { id: MOCK_PAYMENT_METHOD_ID },
      error: null,
    });
    vi.mocked(bookingsApi.create).mockRejectedValue(new Error('Server error'));

    const { result } = renderHook(() => useCreateBookingWithPayment(), { wrapper: makeWrapper() });

    await act(async () => {
      await result.current.mutateAsync(BOOKING_INPUT).catch(() => {});
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith(
      'Error al crear reserva',
      expect.objectContaining({ description: 'Server error' })
    );
    // Payment should NOT be called
    expect(bookingsApi.createPayment).not.toHaveBeenCalled();
  });
});
