'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Check, Users, User, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  useConfirmBooking,
  useRejectBooking,
} from '@/features/bookings/hooks/use-confirm-booking';
import { getStatusLabel, getStatusVariant } from '@/features/bookings/types';
import type { BookingDto } from '@/features/bookings/types';

interface HostBookingCardProps {
  booking: BookingDto;
  showActions?: boolean;
}

export function HostBookingCard({ booking, showActions = false }: HostBookingCardProps) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const confirmMutation = useConfirmBooking();
  const rejectMutation = useRejectBooking();

  const nights = Math.ceil(
    (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const handleConfirm = () => {
    confirmMutation.mutate(booking.id);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    rejectMutation.mutate(
      { bookingId: booking.id, reason: rejectReason },
      {
        onSuccess: () => {
          setShowRejectForm(false);
          setRejectReason('');
        },
      }
    );
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        {/* Header: guest name + status badge */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {booking.guestName}
            </span>
            <span className="text-sm text-muted-foreground">{booking.guestEmail}</span>
          </div>
          <Badge variant={getStatusVariant(booking.status)}>
            {getStatusLabel(booking.status)}
          </Badge>
        </div>

        {/* Dates + guests */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(booking.checkInDate), 'dd MMM', { locale: es })}
              {' → '}
              {format(new Date(booking.checkOutDate), 'dd MMM yyyy', { locale: es })}
            </span>
            <span className="text-muted-foreground">
              ({nights} {nights === 1 ? 'noche' : 'noches'})
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{booking.guestsCount} {booking.guestsCount === 1 ? 'huésped' : 'huéspedes'}</span>
          </div>
        </div>

        {/* Total amount */}
        {booking.totalAmount != null && (
          <div className="text-lg font-semibold">
            {booking.totalAmount.toLocaleString('es-CO')} {booking.currency}
          </div>
        )}

        {/* Rejection reason (already set) */}
        {booking.rejectionReason && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Motivo de rechazo:</span> {booking.rejectionReason}
          </p>
        )}

        {/* Inline reject form */}
        {showRejectForm && (
          <div className="space-y-2">
            <Textarea
              placeholder="Razón del rechazo (el huésped recibirá esta información)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
        )}
      </CardContent>

      {showActions && booking.status === 'REQUEST' && (
        <CardFooter className="gap-2">
          {!showRejectForm ? (
            <>
              <Button
                onClick={handleConfirm}
                disabled={confirmMutation.isPending}
                className="flex-1"
              >
                <Check className="h-4 w-4 mr-2" />
                Confirmar reserva
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRejectForm(true)}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Rechazar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={rejectMutation.isPending || !rejectReason.trim()}
                className="flex-1"
              >
                Confirmar rechazo
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectReason('');
                }}
              >
                Cancelar
              </Button>
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
