/**
 * Booking Actions Dropdown Component
 *
 * Client Component - Dropdown menu with booking actions for admin management.
 *
 * Available actions by status:
 * - REQUEST: "Confirmar en Airbnb" (opens ReserveBookingDialog), "Cancelar Reserva"
 * - RESERVED: "Finalizar (Check-out)" [manual override], "Marcar como Disputada", "Cancelar Reserva"
 *   Note: Check-in (RESERVED → IN_PROGRESS) is automated by the scheduler. No manual button shown.
 * - IN_PROGRESS: "Finalizar (Check-out)" [manual override], "Marcar como Disputada", "Cancelar Reserva"
 * - FINISHED: "Marcar como Disputada"
 * - CANCELLED / DISPUTED: No actions available
 */

'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  CheckSquare,
  AlertTriangle,
} from 'lucide-react';
import { ReserveBookingDialog } from './reserve-booking-dialog';
import { CancelBookingDialog } from './cancel-booking-dialog';
import { DisputeBookingDialog } from './dispute-booking-dialog';
import {
  useFinishBooking,
} from '../../hooks';
import type { BookingDto } from '../../types';

interface BookingActionsDropdownProps {
  booking: BookingDto;
}

export function BookingActionsDropdown({ booking }: BookingActionsDropdownProps) {
  const [reserveOpen, setReserveOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);

  const { mutate: finish, isPending: isFinishing } = useFinishBooking();

  const isActionPending = isFinishing;

  // Determine which actions are available based on booking status
  const canReserve = booking.status === 'REQUEST';
  const canFinish = booking.status === 'IN_PROGRESS';
  // Note: canStart (RESERVED → IN_PROGRESS) is intentionally excluded.
  // Check-in is automated by the BookingStatusScheduler daily at 12 PM.
  const canCancel = ['REQUEST', 'RESERVED'].includes(booking.status);
  const canDispute = ['RESERVED', 'IN_PROGRESS', 'FINISHED'].includes(booking.status);

  const hasNoActions = !canReserve && !canFinish && !canCancel && !canDispute;

  if (hasNoActions) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isActionPending}>
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {canReserve && (
            <DropdownMenuItem onClick={() => setReserveOpen(true)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirmar en Airbnb
            </DropdownMenuItem>
          )}

          {canFinish && (
            <DropdownMenuItem onClick={() => finish(booking.id)}>
              <CheckSquare className="mr-2 h-4 w-4" />
              Finalizar (Check-out)
            </DropdownMenuItem>
          )}

          {canDispute && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDisputeOpen(true)}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Marcar como Disputada
              </DropdownMenuItem>
            </>
          )}

          {canCancel && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setCancelOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancelar Reserva
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ReserveBookingDialog
        booking={booking}
        open={reserveOpen}
        onOpenChange={setReserveOpen}
      />

      <CancelBookingDialog
        bookingId={booking.id}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
      />

      <DisputeBookingDialog
        bookingId={booking.id}
        open={disputeOpen}
        onOpenChange={setDisputeOpen}
      />
    </>
  );
}
