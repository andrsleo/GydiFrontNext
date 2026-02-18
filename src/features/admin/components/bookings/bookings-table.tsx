/**
 * Bookings Table Component
 *
 * Client Component - Table with bookings list and filters
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBookings } from '../../hooks';
import { BookingStatusBadge } from './booking-status-badge';
import { BookingActionsDropdown } from './booking-actions-dropdown';
import type { BookingStatus } from '../../types';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Search } from 'lucide-react';

export function BookingsTable() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all bookings (backend doesn't support filtering yet)
  const { data: bookings, isLoading, error } = useBookings();

  // Client-side filtering (status + search)
  const filteredBookings = bookings?.filter((booking) => {
    // Filter by status
    if (statusFilter !== 'ALL' && booking.status !== statusFilter) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        booking.id.toString().includes(query) ||
        booking.guestEmail?.toLowerCase().includes(query) ||
        booking.guestFirstName?.toLowerCase().includes(query) ||
        booking.guestLastName?.toLowerCase().includes(query) ||
        booking.airbnbConfirmationCode?.toLowerCase().includes(query)
      );

      if (!matchesSearch) {
        return false;
      }
    }

    return true;
  });

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">Error al cargar reservas</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, email, nombre o código Airbnb..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as BookingStatus | 'ALL')}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los estados</SelectItem>
            <SelectItem value="REQUEST">Solicitud</SelectItem>
            <SelectItem value="RESERVED">Confirmada</SelectItem>
            <SelectItem value="IN_PROGRESS">En curso</SelectItem>
            <SelectItem value="FINISHED">Finalizada</SelectItem>
            <SelectItem value="CANCELLED">Cancelada</SelectItem>
            <SelectItem value="DISPUTED">En disputa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Huésped</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Código Airbnb</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[100px] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredBookings && filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/admin/bookings/${booking.id}` as any}
                      className="hover:underline flex items-center gap-1"
                    >
                      #{booking.id}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {booking.guestFirstName} {booking.guestLastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{booking.guestEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(booking.checkInDate).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell>
                    {new Date(booking.checkOutDate).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell>
                    {booking.airbnbConfirmationCode || (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {booking.totalAmount ? (
                      <>
                        {booking.currency} {booking.totalAmount.toFixed(2)}
                      </>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <BookingStatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <BookingActionsDropdown booking={booking} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  No se encontraron reservas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      {filteredBookings && filteredBookings.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredBookings.length} reserva(s)
        </p>
      )}
    </div>
  );
}
