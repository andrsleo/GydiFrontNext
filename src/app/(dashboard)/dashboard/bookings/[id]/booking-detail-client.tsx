/**
 * Booking Detail Client Component
 *
 * Client component that displays booking details.
 */

'use client';

import { useBookingDetail } from '@/features/bookings/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Calendar, DollarSign, Mail, Phone, User, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getStatusVariant, getStatusLabel } from '@/features/bookings/types';

interface Props {
  bookingId: number;
}

export function BookingDetailClient({ bookingId }: Props) {
  const router = useRouter();
  const { data: booking, isLoading, error } = useBookingDetail(bookingId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al cargar reserva</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Error desconocido'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Reserva no encontrada</AlertTitle>
          <AlertDescription>
            No se encontró la reserva con ID {bookingId}.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Reserva #{booking.id}
          </h1>
          <p className="text-muted-foreground mt-1">
            Creada el {new Date(booking.createdAt).toLocaleDateString('es-ES')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={getStatusVariant(booking.status)} className="text-sm">
            {getStatusLabel(booking.status)}
          </Badge>
          <Button variant="outline" onClick={() => router.back()}>
            Volver
          </Button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Guest Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Huésped
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nombre</p>
              <p className="font-medium">
                {booking.guestName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{booking.guestEmail}</p>
              </div>
            </div>
            {booking.guestPhone && (
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{booking.guestPhone}</p>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Cantidad de huéspedes</p>
              <p className="font-medium">{booking.guestsCount}</p>
            </div>
          </CardContent>
        </Card>

        {/* Property Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información de la Propiedad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Propiedad</p>
              <p className="font-medium">
                {booking.propertyTitle || `Propiedad #${booking.propertyId}`}
              </p>
            </div>
            {booking.hostName && (
              <div>
                <p className="text-sm text-muted-foreground">Anfitrión</p>
                <p className="font-medium">{booking.hostName}</p>
              </div>
            )}
            {booking.affiliateName && (
              <div>
                <p className="text-sm text-muted-foreground">referido</p>
                <p className="font-medium">{booking.affiliateName}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Fechas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Check-in</p>
              <p className="font-medium">
                {new Date(booking.checkInDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check-out</p>
              <p className="font-medium">
                {new Date(booking.checkOutDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duración</p>
              <p className="font-medium">
                {Math.ceil(
                  (new Date(booking.checkOutDate).getTime() -
                    new Date(booking.checkInDate).getTime()) /
                  (1000 * 60 * 60 * 24)
                )}{' '}
                noches
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Información de Pago
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Monto Total</p>
              <p className="text-2xl font-bold">
                {booking.totalAmount ? (
                  <>
                    {booking.currency} {booking.totalAmount.toFixed(2)}
                  </>
                ) : (
                  <span className="text-muted-foreground text-base">Pendiente</span>
                )}
              </p>
            </div>
            {booking.airbnbConfirmationCode && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Código de confirmación Airbnb
                </p>
                <p className="font-medium font-mono">{booking.airbnbConfirmationCode}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Timeline (if available) */}
      {(booking.reservedAt || booking.startedAt || booking.finishedAt || booking.cancelledAt) && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Estados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="font-medium">Creada</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.createdAt).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
              {booking.reservedAt && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium">Confirmada</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.reservedAt).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
              )}
              {booking.startedAt && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium">Iniciada</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.startedAt).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
              )}
              {booking.finishedAt && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium">Finalizada</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.finishedAt).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
              )}
              {booking.cancelledAt && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-destructive" />
                  <div>
                    <p className="font-medium">Cancelada</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.cancelledAt).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
