/**
 * Affiliate Commissions Table Component
 *
 * Client Component - Table with affiliate commissions (platform pays affiliates)
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useAffiliateCommissions,
  useRetryAffiliateCommission,
  useApproveAffiliateCommission,
  useCancelAffiliateCommission,
} from '../../hooks';
import { CommissionStatusBadge } from './commission-status-badge';
import type { AffiliateCommissionStatus } from '../../types';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export function AffiliateCommissionsTable() {
  const [statusFilter, setStatusFilter] = useState<AffiliateCommissionStatus | 'ALL'>('ALL');

  const { data: commissions, isLoading, error } = useAffiliateCommissions(
    statusFilter !== 'ALL' ? { status: statusFilter } : undefined
  );

  const { mutate: retry, isPending: isRetrying } = useRetryAffiliateCommission();
  const { mutate: approve, isPending: isApproving } = useApproveAffiliateCommission();
  const { mutate: cancel, isPending: isCancelling } = useCancelAffiliateCommission();

  const isActionPending = isRetrying || isApproving || isCancelling;

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">Error al cargar comisiones de afiliados</p>
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
          onValueChange={(value) => setStatusFilter(value as AffiliateCommissionStatus | 'ALL')}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los estados</SelectItem>
            <SelectItem value="PENDING">Pendiente</SelectItem>
            <SelectItem value="APPROVED">Aprobado</SelectItem>
            <SelectItem value="PAID">Pagado</SelectItem>
            <SelectItem value="CANCELLED">Cancelado</SelectItem>
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
              <TableHead>Afiliado ID</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Monto Reserva</TableHead>
              <TableHead>Tasa</TableHead>
              <TableHead>Comisión</TableHead>
              <TableHead>Fecha Pago</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[100px] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 10 }).map((_, j) => (
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
                  <TableCell>#{commission.affiliateId}</TableCell>
                  <TableCell>
                    <span className="font-medium">{commission.affiliatePlan}</span>
                  </TableCell>
                  <TableCell>
                    {commission.currency} {commission.bookingAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {(commission.commissionRate * 100).toFixed(0)}%
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    +{commission.currency} {commission.commissionAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {new Date(commission.scheduledPaymentDate).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell>
                    <CommissionStatusBadge status={commission.status} type="affiliate" />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          disabled={isActionPending}
                        >
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {commission.status === 'PENDING' && (
                          <DropdownMenuItem onClick={() => approve(commission.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Aprobar para Pago
                          </DropdownMenuItem>
                        )}

                        {commission.status === 'APPROVED' && commission.attemptCount > 0 && (
                          <DropdownMenuItem onClick={() => retry(commission.id)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reintentar Pago
                          </DropdownMenuItem>
                        )}

                        {['PENDING', 'APPROVED'].includes(commission.status) && (
                          <DropdownMenuItem
                            onClick={() => cancel(commission.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancelar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                  No se encontraron comisiones
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {commissions && commissions.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Mostrando {commissions.length} comisión(es) de afiliados
        </p>
      )}
    </div>
  );
}
