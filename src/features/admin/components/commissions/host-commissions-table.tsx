/**
 * Host Commissions Table Component
 *
 * Client Component - Table with host commissions (platform charges hosts)
 */

'use client';

import { useState } from 'react';
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
import { useHostCommissions, useRetryHostCommission } from '../../hooks';
import { CommissionStatusBadge } from './commission-status-badge';
import type { HostCommissionStatus } from '../../types';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';

export function HostCommissionsTable() {
  const [statusFilter, setStatusFilter] = useState<HostCommissionStatus | 'ALL'>('ALL');

  const { data: commissions, isLoading, error } = useHostCommissions(
    statusFilter !== 'ALL' ? { status: statusFilter } : undefined
  );

  const { mutate: retry, isPending: isRetrying } = useRetryHostCommission();

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">Error al cargar comisiones de hosts</p>
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
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as HostCommissionStatus | 'ALL')}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los estados</SelectItem>
            <SelectItem value="PENDING">Pendiente</SelectItem>
            <SelectItem value="PROCESSING">Procesando</SelectItem>
            <SelectItem value="CHARGED">Cobrado</SelectItem>
            <SelectItem value="FAILED">Fallido</SelectItem>
            <SelectItem value="REFUNDED">Reembolsado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Reserva</TableHead>
              <TableHead>Host ID</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Monto Reserva</TableHead>
              <TableHead>Tasa</TableHead>
              <TableHead>Comisión</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[100px] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : commissions && commissions.length > 0 ? (
              commissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell className="font-medium">#{commission.id}</TableCell>
                  <TableCell>#{commission.bookingId}</TableCell>
                  <TableCell>#{commission.hostId}</TableCell>
                  <TableCell>
                    <span className="font-medium">{commission.hostPlan}</span>
                  </TableCell>
                  <TableCell>
                    {commission.currency} {commission.bookingAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {(commission.commissionRate * 100).toFixed(0)}%
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {commission.currency} {commission.commissionAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <CommissionStatusBadge status={commission.status} type="host" />
                  </TableCell>
                  <TableCell className="text-right">
                    {commission.status === 'FAILED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retry(commission.id)}
                        disabled={isRetrying}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                  No se encontraron comisiones
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {commissions && commissions.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Mostrando {commissions.length} comisión(es) de hosts
        </p>
      )}
    </div>
  );
}
