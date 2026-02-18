/**
 * Host Commissions Table Component
 *
 * Displays commissions PAID by host (platform CHARGES host).
 * User must have canPublish capability.
 */

'use client';

import { useState } from 'react';
import { useHostCommissions, useHostCommissionStats } from '../hooks';
import { CommissionStatsCards } from './commission-stats-cards';
import { CommissionFilters } from './commission-filters';
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
import type { CommissionFiltersInput as Filters } from '../types';
import { getCommissionStatusVariant, getCommissionStatusLabel } from '../types';

export function HostCommissionsTable() {
  const [filters, setFilters] = useState<Filters>({});

  const { data: commissions, isLoading, error } = useHostCommissions(filters);
  const { data: stats } = useHostCommissionStats();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error al cargar comisiones</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'Error desconocido'}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
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
      {stats && <CommissionStatsCards stats={stats} type="host" />}

      {/* Filters */}
      <CommissionFilters filters={filters} onChange={setFilters} />

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Reserva</TableHead>
                <TableHead>Propiedad</TableHead>
                <TableHead>Afiliado</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Monto Reserva</TableHead>
                <TableHead className="text-right">Comisión</TableHead>
                <TableHead>Tasa</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions && commissions.length > 0 ? (
                commissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell className="font-medium">#{commission.id}</TableCell>
                    <TableCell>#{commission.bookingId}</TableCell>
                    <TableCell>
                      {commission.propertyTitle || `Propiedad #${commission.bookingId}`}
                    </TableCell>
                    <TableCell>
                      {commission.affiliateName || 'Directo'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{commission.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      {commission.currency} {commission.bookingAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-red-600">
                      - {commission.currency} {commission.commissionAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {(commission.commissionRate * 100).toFixed(0)}%
                    </TableCell>
                    <TableCell>
                      <Badge variant={getCommissionStatusVariant(commission.status)}>
                        {getCommissionStatusLabel(commission.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(commission.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No tienes comisiones pagadas aún.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Las comisiones aparecerán cuando se completen reservas en tus
                        propiedades a través de afiliados.
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
