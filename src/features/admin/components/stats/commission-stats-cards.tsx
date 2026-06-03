/**
 * Commission Stats Cards Component
 *
 * Client Component - Display commission statistics
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCommissionStats } from '../../hooks';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import type { SupportedCurrency } from '@/lib/constants/currency-config';

export function CommissionStatsCards() {
  const { data: stats, isLoading, error } = useCommissionStats();

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>Error al cargar estadísticas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {/* Host Commissions (Platform charges hosts) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Comisiones Hosts</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(stats.totalHostCommissions, stats.currency as SupportedCurrency)}
          </div>
          <p className="text-xs text-muted-foreground">Total cobrado a hosts</p>
        </CardContent>
      </Card>

      {/* Affiliate Commissions (Platform pays affiliates) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Comisiones referidos</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(stats.totalAffiliateCommissions, stats.currency as SupportedCurrency)}
          </div>
          <p className="text-xs text-muted-foreground">Total pagado a referidos</p>
        </CardContent>
      </Card>

      {/* Platform Profit */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ganancia Plataforma</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(stats.platformProfit, stats.currency as SupportedCurrency)}
          </div>
          <p className="text-xs text-muted-foreground">
            Profit (cobrado - pagado)
          </p>
        </CardContent>
      </Card>

      {/* Pending Host Charges */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendiente Cobrar</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(stats.pendingHostCharges, stats.currency as SupportedCurrency)}
          </div>
          <p className="text-xs text-muted-foreground">Por cobrar a hosts</p>
        </CardContent>
      </Card>

      {/* Pending Affiliate Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendiente Pagar</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(stats.pendingAffiliatePayments, stats.currency as SupportedCurrency)}
          </div>
          <p className="text-xs text-muted-foreground">Por pagar a referidos</p>
        </CardContent>
      </Card>
    </div>
  );
}
