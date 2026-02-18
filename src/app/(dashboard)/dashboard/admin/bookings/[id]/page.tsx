/**
 * Admin Booking Detail Page
 *
 * Server Component + Client Components - Detailed view of a single booking
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookingDetailClient } from './booking-detail-client';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = {
  title: 'Detalle de Reserva | GYDI Admin',
  description: 'Ver detalles completos de la reserva',
};

export default async function AdminBookingDetailPage({ params }: PageProps) {
  // Next.js 15: params is now a Promise and must be awaited
  const { id } = await params;
  const bookingId = parseInt(id);

  if (isNaN(bookingId)) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reserva #{bookingId}</h1>
        <p className="text-muted-foreground mt-2">Detalles completos de la reserva</p>
      </div>

      {/* Booking Detail */}
      <Suspense
        fallback={
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        }
      >
        <BookingDetailClient bookingId={bookingId} />
      </Suspense>
    </div>
  );
}
