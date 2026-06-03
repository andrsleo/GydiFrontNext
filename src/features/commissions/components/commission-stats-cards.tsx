/**
 * Commission Stats Cards Component
 *
 * Displays summary statistics for commissions.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import type { SupportedCurrency } from '@/lib/constants/currency-config';
import type { CommissionStats } from '../types';

interface Props {
  stats: CommissionStats;
  type: 'affiliate' | 'host';
}

export function CommissionStatsCards({ stats, type }: Props) {
  const { totalEarned, totalPaid, pending, currency } = stats;

  const mainAmount = type === 'affiliate' ? totalEarned : totalPaid;
  const mainLabel = type === 'affiliate' ? 'Total Ganado' : 'Total Pagado';
  const mainDescription =
    type === 'affiliate'
      ? 'Comisiones que recibes de la plataforma'
      : 'Comisiones que pagas a la plataforma';

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Main Amount (Earned or Paid) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{mainLabel}</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(mainAmount, currency as SupportedCurrency)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{mainDescription}</p>
        </CardContent>
      </Card>

      {/* Pending */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendiente</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(pending, currency as SupportedCurrency)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {type === 'affiliate' ? 'Por recibir' : 'Por pagar'}
          </p>
        </CardContent>
      </Card>

      {/* Rate or Average */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {type === 'affiliate' ? 'Ingresos' : 'Costos'}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(mainAmount, currency as SupportedCurrency)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {type === 'affiliate' ? 'De comisiones' : 'De plataforma'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
