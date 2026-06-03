/**
 * Affiliate Commissions Table Component
 *
 * Displays commissions EARNED by affiliate (platform PAYS affiliate).
 * User must have canRefer capability.
 */

'use client';

import { useState } from 'react';
import { useAffiliateCommissions, useAffiliateCommissionStats } from '../hooks';
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
import { formatCurrency } from '@/lib/utils/format';
import type { SupportedCurrency } from '@/lib/constants/currency-config';
import type { CommissionFiltersInput as Filters } from '../types';
import { getCommissionStatusVariant, getCommissionStatusLabel } from '../types';

export function AffiliateCommissionsTable() {
  const [filters, setFilters] = useState<Filters>({});

  const { data: commissions, isLoading, error } = useAffiliateCommissions(filters);
  const { data: stats } = useAffiliateCommissionStats();

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
      {stats && <CommissionStatsCards stats={stats} type="affiliate" />}

      {/* Filters */}
      <CommissionFilters filters={filters} onChange={setFilters} />

      {/* Mobile cards (< md) */}
      <div className="md:hidden space-y-3">
        {commissions && commissions.length > 0 ? (
          commissions.map((commission) => (
            <Card key={commission.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  #{commission.id} · Reserva #{commission.bookingId}
                </span>
                <Badge variant={getCommissionStatusVariant(commission.status)}>
                  {getCommissionStatusLabel(commission.status)}
                </Badge>
              </div>
              <p className="text-sm font-medium">
                {commission.propertyTitle || `Propiedad #${commission.bookingId}`}
              </p>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Monto Reserva</p>
                  <p className="text-sm">{formatCurrency(commission.bookingAmount, commission.currency as SupportedCurrency)}</p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="text-xs text-muted-foreground">Comisión ({(commission.commissionRate * 100).toFixed(0)}%)</p>
                  <p className="text-sm font-bold text-green-600">
                    +{formatCurrency(commission.commissionAmount, commission.currency as SupportedCurrency)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">{commission.plan}</Badge>
                <span>{new Date(commission.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center gap-2 py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground text-center">No tienes comisiones ganadas aún.</p>
          </div>
        )}
      </div>

      {/* Desktop table (≥ md) */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Reserva</TableHead>
                <TableHead>Propiedad</TableHead>
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
                      <Badge variant="outline">{commission.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(commission.bookingAmount, commission.currency as SupportedCurrency)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      +{formatCurrency(commission.commissionAmount, commission.currency as SupportedCurrency)}
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
                  <TableCell colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No tienes comisiones ganadas aún.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Las comisiones aparecerán cuando se completen reservas a través de tus
                        enlaces de referido.
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
