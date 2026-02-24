'use client';

import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  useAffiliateCommissions,
  useAffiliateCommissionStats,
} from '@/features/commissions/hooks/use-affiliate-commissions';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import type { CommissionStatus } from '@/features/commissions/types';

// Status configuration
const statusConfig: Record<
  CommissionStatus,
  { label: string; variant: 'default' | 'secondary' | 'success' | 'warning'; icon: any }
> = {
  PENDING: {
    label: 'Pendiente (7 días)',
    variant: 'warning',
    icon: Clock,
  },
  APPROVED: {
    label: 'Aprobado',
    variant: 'secondary',
    icon: CheckCircle,
  },
  PAID: {
    label: 'Pagado',
    variant: 'success',
    icon: CheckCircle,
  },
  WITHHELD: {
    label: 'Retenido',
    variant: 'default',
    icon: AlertCircle,
  },
  FAILED: {
    label: 'Fallido',
    variant: 'default',
    icon: AlertCircle,
  },
};

// Calculate next payout date (1st or 15th of month)
function getNextPayoutDate(): string {
  const today = new Date();
  const dayOfMonth = today.getDate();

  let nextDate: Date;

  if (dayOfMonth < 1) {
    nextDate = new Date(today.getFullYear(), today.getMonth(), 1);
  } else if (dayOfMonth < 15) {
    nextDate = new Date(today.getFullYear(), today.getMonth(), 15);
  } else {
    nextDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  }

  return formatDate(nextDate.toISOString());
}

// Calculate days until next payout
function getDaysUntilNextPayout(): number {
  const today = new Date();
  const dayOfMonth = today.getDate();

  let nextDate: Date;

  if (dayOfMonth < 1) {
    nextDate = new Date(today.getFullYear(), today.getMonth(), 1);
  } else if (dayOfMonth < 15) {
    nextDate = new Date(today.getFullYear(), today.getMonth(), 15);
  } else {
    nextDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  }

  const diffTime = nextDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export default function GananciasPage() {
  const [statusFilter, setStatusFilter] = useState<CommissionStatus | 'ALL'>('ALL');

  // Fetch data from API
  const {
    data: commissions = [],
    isLoading: isLoadingCommissions,
    error: commissionsError,
  } = useAffiliateCommissions({ status: statusFilter === 'ALL' ? undefined : statusFilter });

  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useAffiliateCommissionStats();

  // Loading state
  if (isLoadingCommissions || isLoadingStats) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Cargando ganancias...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (commissionsError || statsError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudieron cargar tus ganancias. Por favor, intenta de nuevo.
        </AlertDescription>
      </Alert>
    );
  }

  // Calculate stats
  const pendingAmount = stats?.pendingAmount || 0;
  const approvedAmount = stats?.approvedAmount || 0;
  const paidAmount = stats?.totalEarned || 0;
  const isEligibleForPayout = approvedAmount >= 50; // $50 minimum
  const nextPayoutDate = getNextPayoutDate();
  const daysUntilPayout = getDaysUntilNextPayout();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Ganancias de Afiliado</h1>
          <p className="text-muted-foreground">
            Monitorea tus comisiones y próximos pagos
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pending Amount */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente (7 días)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(pendingAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Período de disputa activo
            </p>
          </CardContent>
        </Card>

        {/* Approved Amount */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(approvedAmount)}
            </div>
            {isEligibleForPayout ? (
              <p className="text-xs text-green-600">
                ✓ Elegible para pago {nextPayoutDate}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Mínimo $50 requerido (falta {formatCurrency(50 - approvedAmount)})
              </p>
            )}
          </CardContent>
        </Card>

        {/* Paid Amount */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pagado</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(paidAmount)}</div>
            <p className="text-xs text-muted-foreground">
              Histórico total
            </p>
          </CardContent>
        </Card>

        {/* Next Payout */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Pago</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {daysUntilPayout} días
            </div>
            <p className="text-xs text-muted-foreground">
              {nextPayoutDate}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Banner */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Información sobre pagos</AlertTitle>
        <AlertDescription>
          Los pagos se procesan el <strong>1 y 15 de cada mes</strong>. Mínimo: <strong>$50 USD</strong>.
          Las comisiones se aprueban 7 días después del check-out del huésped (período de disputa).
        </AlertDescription>
      </Alert>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Filtrar:</span>
        {(['ALL', 'PENDING', 'APPROVED', 'PAID'] as const).map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(status)}
          >
            {status === 'ALL' ? 'Todas' : statusConfig[status].label}
          </Button>
        ))}
      </div>

      {/* Commissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Comisiones</CardTitle>
          <CardDescription>
            {commissions.length} comisión(es) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {commissions.length === 0 ? (
            <div className="py-12 text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                No tienes comisiones aún. ¡Comienza a referir usuarios para ganar!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Booking
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Referido
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Monto Reserva
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Tasa
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Comisión
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {commissions.map((commission) => {
                    const config = statusConfig[commission.status];
                    const StatusIcon = config.icon;

                    return (
                      <tr key={commission.id} className="hover:bg-muted/50">
                        <td className="px-4 py-4">
                          <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                            #{commission.bookingId}
                          </code>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium">{commission.referredUserName}</p>
                            <p className="text-xs text-muted-foreground">
                              {commission.referredUserEmail}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="font-medium">
                            {formatCurrency(commission.bookingAmount)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-sm font-medium text-primary">
                            {(commission.commissionRate * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency(commission.amount)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Badge variant={config.variant}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {config.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <p className="font-medium">
                              {formatDate(commission.createdAt)}
                            </p>
                            {commission.paidAt && (
                              <p className="text-xs text-muted-foreground">
                                Pagado: {formatDate(commission.paidAt)}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
