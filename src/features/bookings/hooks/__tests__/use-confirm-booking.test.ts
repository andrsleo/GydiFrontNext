import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('@/features/bookings/api/bookings.api', () => ({
  bookingsApi: {
    confirm: vi.fn(),
    reject: vi.fn(),
    create: vi.fn(),
  },
}));

import { useConfirmBooking, useRejectBooking } from '../use-confirm-booking';
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

const RESERVED_BOOKING_DTO: BookingDto = {
  id: 999,
  referralLinkId: 42,
  propertyId: 1,
  checkInDate: '2026-06-10',
  checkOutDate: '2026-06-13',
  guestName: 'Juan Pérez García',
  guestEmail: 'juan@test.com',
  guestsCount: 2,
  currency: 'USD',
  status: 'RESERVED',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const CANCELLED_BOOKING_DTO: BookingDto = {
  ...RESERVED_BOOKING_DTO,
  status: 'CANCELLED',
};

// ─── useConfirmBooking ────────────────────────────────────────────────────────

describe('useConfirmBooking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna mutation en estado idle inicial', () => {
    const { result } = renderHook(() => useConfirmBooking(), { wrapper: makeWrapper() });

    expect(result.current.isPending).toBe(false);
  });

  it('llama bookingsApi.confirm con el bookingId correcto', async () => {
    vi.mocked(bookingsApi.confirm).mockResolvedValue(RESERVED_BOOKING_DTO);

    const { result } = renderHook(() => useConfirmBooking(), { wrapper: makeWrapper() });

    await act(async () => {
      result.current.mutate(999);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(bookingsApi.confirm).toHaveBeenCalledWith(999);
    expect(bookingsApi.confirm).toHaveBeenCalledTimes(1);
  });

  it('muestra toast.success con guestName y checkInDate', async () => {
    vi.mocked(bookingsApi.confirm).mockResolvedValue(RESERVED_BOOKING_DTO);

    const { result } = renderHook(() => useConfirmBooking(), { wrapper: makeWrapper() });

    await act(async () => {
      result.current.mutate(999);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(toast.success).toHaveBeenCalledWith(
      'Reserva confirmada',
      expect.objectContaining({
        description: expect.stringContaining('Juan Pérez García'),
      })
    );
    expect(toast.success).toHaveBeenCalledWith(
      'Reserva confirmada',
      expect.objectContaining({
        description: expect.stringContaining('2026-06-10'),
      })
    );
  });

  it('muestra toast.error cuando la confirmación falla', async () => {
    vi.mocked(bookingsApi.confirm).mockRejectedValue(new Error('Booking not found'));

    const { result } = renderHook(() => useConfirmBooking(), { wrapper: makeWrapper() });

    await act(async () => {
      result.current.mutate(999);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith(
      'Error al confirmar reserva',
      expect.objectContaining({ description: 'Booking not found' })
    );
  });

  it('no llama bookingsApi.confirm antes de mutate', () => {
    renderHook(() => useConfirmBooking(), { wrapper: makeWrapper() });

    expect(bookingsApi.confirm).not.toHaveBeenCalled();
  });
});

// ─── useRejectBooking ─────────────────────────────────────────────────────────

describe('useRejectBooking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna mutation en estado idle inicial', () => {
    const { result } = renderHook(() => useRejectBooking(), { wrapper: makeWrapper() });

    expect(result.current.isPending).toBe(false);
  });

  it('llama bookingsApi.reject con bookingId y reason correctos', async () => {
    vi.mocked(bookingsApi.reject).mockResolvedValue(CANCELLED_BOOKING_DTO);

    const { result } = renderHook(() => useRejectBooking(), { wrapper: makeWrapper() });

    await act(async () => {
      result.current.mutate({ bookingId: 999, reason: 'Fechas no disponibles' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(bookingsApi.reject).toHaveBeenCalledWith(999, 'Fechas no disponibles');
  });

  it('muestra toast.success "Reserva rechazada" tras rechazo exitoso', async () => {
    vi.mocked(bookingsApi.reject).mockResolvedValue(CANCELLED_BOOKING_DTO);

    const { result } = renderHook(() => useRejectBooking(), { wrapper: makeWrapper() });

    await act(async () => {
      result.current.mutate({ bookingId: 999, reason: 'Mantenimiento' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(toast.success).toHaveBeenCalledWith('Reserva rechazada');
  });

  it('muestra toast.error cuando el rechazo falla', async () => {
    vi.mocked(bookingsApi.reject).mockRejectedValue(new Error('Access denied'));

    const { result } = renderHook(() => useRejectBooking(), { wrapper: makeWrapper() });

    await act(async () => {
      result.current.mutate({ bookingId: 999, reason: 'reason' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith(
      'Error al rechazar reserva',
      expect.objectContaining({ description: 'Access denied' })
    );
  });

  it('no llama bookingsApi.reject antes de mutate', () => {
    renderHook(() => useRejectBooking(), { wrapper: makeWrapper() });

    expect(bookingsApi.reject).not.toHaveBeenCalled();
  });

  it('isPending es true mientras la mutación está en vuelo', async () => {
    let resolve!: (v: BookingDto) => void;
    vi.mocked(bookingsApi.reject).mockReturnValue(
      new Promise<BookingDto>((r) => { resolve = r; })
    );

    const { result } = renderHook(() => useRejectBooking(), { wrapper: makeWrapper() });

    act(() => {
      result.current.mutate({ bookingId: 999, reason: 'test' });
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));

    await act(async () => {
      resolve(CANCELLED_BOOKING_DTO);
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
  });
});
