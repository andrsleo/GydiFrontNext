'use client';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHostBookings } from '@/features/bookings/hooks';
import type { BookingStatus } from '@/features/bookings/types';
import { HostBookingCard } from './host-booking-card';

function EmptyState({ message }: { message: string }) {
  return (
    <p className="py-12 text-center text-sm text-muted-foreground">{message}</p>
  );
}

const PAST_STATUSES: BookingStatus[] = ['FINISHED', 'CANCELLED', 'DISPUTED'];

export function HostBookingsList() {
  const { data: bookings, isLoading } = useHostBookings();

  if (isLoading) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">Cargando reservas...</p>
    );
  }

  const pending = bookings?.filter((b) => b.status === 'REQUEST') ?? [];
  const confirmed = bookings?.filter((b) => b.status === 'RESERVED') ?? [];
  const active = bookings?.filter((b) => b.status === 'IN_PROGRESS') ?? [];
  const past = bookings?.filter((b) => PAST_STATUSES.includes(b.status)) ?? [];

  return (
    <Tabs defaultValue="pending">
      <TabsList>
        <TabsTrigger value="pending" className="gap-2">
          Pendientes
          {pending.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {pending.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="confirmed">Confirmadas</TabsTrigger>
        <TabsTrigger value="active">En curso</TabsTrigger>
        <TabsTrigger value="past">Historial</TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="mt-4 space-y-4">
        {pending.length > 0
          ? pending.map((booking) => (
              <HostBookingCard key={booking.id} booking={booking} showActions />
            ))
          : <EmptyState message="No hay reservas pendientes de aprobación" />}
      </TabsContent>

      <TabsContent value="confirmed" className="mt-4 space-y-4">
        {confirmed.length > 0
          ? confirmed.map((booking) => (
              <HostBookingCard key={booking.id} booking={booking} />
            ))
          : <EmptyState message="No hay reservas confirmadas" />}
      </TabsContent>

      <TabsContent value="active" className="mt-4 space-y-4">
        {active.length > 0
          ? active.map((booking) => (
              <HostBookingCard key={booking.id} booking={booking} />
            ))
          : <EmptyState message="No hay reservas actualmente en curso" />}
      </TabsContent>

      <TabsContent value="past" className="mt-4 space-y-4">
        {past.length > 0
          ? past.map((booking) => (
              <HostBookingCard key={booking.id} booking={booking} />
            ))
          : <EmptyState message="No hay historial de reservas" />}
      </TabsContent>
    </Tabs>
  );
}
