/**
 * Booking Detail Client Component
 *
 * Client Component - Displays booking details with actions
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useBooking } from '@/features/admin/hooks';
import {
  BookingStatusBadge,
  BookingActionsDropdown,
} from '@/features/admin/components';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, User, MapPin, DollarSign, Hash, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface BookingDetailClientProps {
  bookingId: number;
}

export function BookingDetailClient({ bookingId }: BookingDetailClientProps) {
  const { data: booking, isLoading, error } = useBooking(bookingId);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error al cargar los detalles de la reserva. Por favor intenta de nuevo.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
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
    );
  }

  if (!booking) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No se encontró la reserva.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href={"/dashboard/admin/bookings" as any}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Reservas
        </Link>
      </Button>

      {/* Main Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl">Reserva #{booking.id}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Creada el {new Date(booking.createdAt).toLocaleDateString('es-ES')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <BookingStatusBadge status={booking.status} />
            <BookingActionsDropdown booking={booking} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Guest Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Información del Huésped</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nombre Completo</p>
                <p className="font-medium">
                  {booking.guestFirstName} {booking.guestLastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{booking.guestEmail}</p>
              </div>
              {booking.guestPhone && (
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-medium">{booking.guestPhone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Número de Huéspedes</p>
                <p className="font-medium">{booking.guestsCount}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Fechas</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Check-in</p>
                <p className="font-medium">
                  {new Date(booking.checkInDate).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Check-out</p>
                <p className="font-medium">
                  {new Date(booking.checkOutDate).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Detalles de la Reserva</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID Propiedad</p>
                <p className="font-medium">#{booking.propertyId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID Referral Link</p>
                <p className="font-medium">#{booking.referralLinkId}</p>
              </div>
              {booking.airbnbConfirmationCode && (
                <div>
                  <p className="text-sm text-muted-foreground">Código Airbnb</p>
                  <p className="font-medium font-mono">{booking.airbnbConfirmationCode}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Información de Pago</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Monto Total</p>
                <p className="text-2xl font-bold">
                  {booking.totalAmount ? (
                    <>
                      {booking.currency} {booking.totalAmount.toFixed(2)}
                    </>
                  ) : (
                    <span className="text-muted-foreground">Pendiente</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Moneda</p>
                <p className="font-medium">{booking.currency}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Timeline</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Creada:</span>
                <span className="font-medium">
                  {new Date(booking.createdAt).toLocaleString('es-ES')}
                </span>
              </div>
              {booking.reservedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confirmada:</span>
                  <span className="font-medium">
                    {new Date(booking.reservedAt).toLocaleString('es-ES')}
                  </span>
                </div>
              )}
              {booking.startedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Iniciada (Check-in):</span>
                  <span className="font-medium">
                    {new Date(booking.startedAt).toLocaleString('es-ES')}
                  </span>
                </div>
              )}
              {booking.finishedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Finalizada (Check-out):</span>
                  <span className="font-medium">
                    {new Date(booking.finishedAt).toLocaleString('es-ES')}
                  </span>
                </div>
              )}
              {booking.cancelledAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cancelada:</span>
                  <span className="font-medium text-destructive">
                    {new Date(booking.cancelledAt).toLocaleString('es-ES')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Última actualización:</span>
                <span className="font-medium">
                  {new Date(booking.updatedAt).toLocaleString('es-ES')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
