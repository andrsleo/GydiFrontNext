/**
 * Booking Detail Page (USER)
 *
 * Shows detailed information about a specific booking.
 * User must have permission to view this booking (affiliate, host, or admin).
 */

import { BookingDetailClient } from './booking-detail-client';

interface Props {
  params: { id: string };
}

export default function BookingDetailPage({ params }: Props) {
  const bookingId = parseInt(params.id, 10);

  if (isNaN(bookingId) || bookingId <= 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Reserva no encontrada</h1>
          <p className="text-muted-foreground mt-2">
            El ID de reserva proporcionado no es válido.
          </p>
        </div>
      </div>
    );
  }

  return <BookingDetailClient bookingId={bookingId} />;
}
