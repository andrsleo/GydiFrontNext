/**
 * Admin Bookings Page
 *
 * Server Component - List of all bookings with filters and actions
 */

import { Suspense } from 'react';
import { BookingsTable } from '@/features/admin/components';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Gestión de Reservas | GYDI Admin',
  description: 'Administra todas las reservas de la plataforma',
};

export default function AdminBookingsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Reservas</h1>
          <p className="text-muted-foreground mt-2">
            Administra y monitorea todas las reservas de la plataforma
          </p>
        </div>
      </div>

      {/* Bookings Table */}
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <BookingsTable />
      </Suspense>
    </div>
  );
}
