/**
 * Host Bookings Table Component
 *
 * Displays bookings on the user's properties.
 * User must have canPublish capability.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useHostBookings, useHostBookingStats } from '../hooks';
import { BookingStatsCards } from './booking-stats-cards';
import { BookingFilters as BookingFiltersComponent } from './booking-filters';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { BookingFilters as Filters } from '../types';
import { getStatusVariant, getStatusLabel } from '../types';

export function HostBookingsTable() {
  const [filters, setFilters] = useState<Filters>({});

  const { data: bookings, isLoading, error } = useHostBookings(filters);
  const { data: stats } = useHostBookingStats();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error al cargar reservas</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'Error desconocido'}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && <BookingStatsCards stats={stats} />}

      {/* Filters */}
      <BookingFiltersComponent filters={filters} onChange={setFilters} />

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Propiedad</TableHead>
                <TableHead>Huésped</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings && bookings.length > 0 ? (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">#{booking.id}</TableCell>
                    <TableCell>
                      {booking.propertyTitle || `#${booking.propertyId}`}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {booking.guestFirstName} {booking.guestLastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {booking.guestEmail}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(booking.checkInDate).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.checkOutDate).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {booking.totalAmount ? (
                        <span className="font-medium">
                          {booking.currency} {booking.totalAmount.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Pendiente</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(booking.status)}>
                        {getStatusLabel(booking.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/bookings/${booking.id}` as any}
                        className="text-primary hover:underline text-sm"
                      >
                        Ver detalle
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No tienes reservas en tus propiedades aún.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Las reservas aparecerán cuando alguien reserve una de tus
                        propiedades.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
