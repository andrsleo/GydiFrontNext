import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { HostBookingsList } from './_components/host-bookings-list';

function HostBookingsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function HostBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reservas de mis propiedades</h1>
        <p className="text-muted-foreground mt-1">
          Acepta o rechaza solicitudes de reserva. El contrato es directamente con el huésped.
        </p>
      </div>

      <Suspense fallback={<HostBookingsSkeleton />}>
        <HostBookingsList />
      </Suspense>
    </div>
  );
}
