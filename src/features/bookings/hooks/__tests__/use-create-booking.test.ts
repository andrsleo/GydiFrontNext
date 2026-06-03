import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

// Mock sonner before imports
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

// Mock bookingsApi before imports
vi.mock('@/features/bookings/api/bookings.api', () => ({
  bookingsApi: {
    create: vi.fn(),
    confirm: vi.fn(),
    reject: vi.fn(),
  },
}));

import { useCreateBooking } from '../use-create-booking';
import { bookingsApi } from '@/features/bookings/api/bookings.api';
import { toast } from 'sonner';
import type { CreateBookingRequest, BookingDto } from '../../types';

// ─── Test helpers ─────────────────────────────────────────────────────────────

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
}

const VALID_REQUEST: CreateBookingRequest = {
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

describe('useCreateBooking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna mutation en estado idle inicial', () => {
    const { result } = renderHook(() => useCreateBooking(), { wrapper: makeWrapper() });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('llama bookingsApi.create con el request recibido', async () => {
    vi.mocked(bookingsApi.create).mockResolvedValue(MOCK_BOOKING_DTO);

    const { result } = renderHook(() => useCreateBooking(), { wrapper: makeWrapper() });

    await act(async () => {
      result.current.mutate(VALID_REQUEST);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(bookingsApi.create).toHaveBeenCalledWith(VALID_REQUEST);
  });

  it('muestra toast.success con booking.id tras creación exitosa', async () => {
    vi.mocked(bookingsApi.create).mockResolvedValue(MOCK_BOOKING_DTO);

    const { result } = renderHook(() => useCreateBooking(), { wrapper: makeWrapper() });

    await act(async () => {
      result.current.mutate(VALID_REQUEST);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(toast.success).toHaveBeenCalledWith(
      expect.stringMatching(/Reserva creada/i),
      expect.objectContaining({ description: expect.stringContaining('999') })
    );
  });

  it('muestra toast.error cuando la API falla', async () => {
    vi.mocked(bookingsApi.create).mockRejectedValue({
      response: { data: { message: 'Las fechas no están disponibles' } },
    });

    const { result } = renderHook(() => useCreateBooking(), { wrapper: makeWrapper() });

    await act(async () => {
      result.current.mutate(VALID_REQUEST);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith(
      'Error',
      expect.objectContaining({ description: 'Las fechas no están disponibles' })
    );
  });

  it('usa mensaje de error por defecto si response.data.message es undefined', async () => {
    vi.mocked(bookingsApi.create).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useCreateBooking(), { wrapper: makeWrapper() });

    await act(async () => {
      result.current.mutate(VALID_REQUEST);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith(
      'Error',
      expect.objectContaining({ description: 'Error al crear la reserva' })
    );
  });

  it('isPending es true mientras la mutación está en vuelo', async () => {
    let resolve!: (v: BookingDto) => void;
    vi.mocked(bookingsApi.create).mockReturnValue(
      new Promise<BookingDto>((r) => { resolve = r; })
    );

    const { result } = renderHook(() => useCreateBooking(), { wrapper: makeWrapper() });

    act(() => {
      result.current.mutate(VALID_REQUEST);
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));

    await act(async () => {
      resolve(MOCK_BOOKING_DTO);
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
  });
});
