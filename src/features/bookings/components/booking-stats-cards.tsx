/**
 * Booking Stats Cards Component
 *
 * Displays summary statistics for bookings (total, active, revenue).
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, DollarSign, TrendingUp } from 'lucide-react';
import type { BookingStats } from '../types';

interface Props {
  stats: BookingStats;
}

export function BookingStatsCards({ stats }: Props) {
  const { totalBookings, activeBookings, totalRevenue, currency } = stats;

  const averageRevenue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBookings}</div>
          <p className="text-xs text-muted-foreground mt-1">Reservas totales</p>
        </CardContent>
      </Card>

      {/* Active Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeBookings}</div>
          <p className="text-xs text-muted-foreground mt-1">En curso o confirmadas</p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currency} {totalRevenue.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Suma de todas las reservas</p>
        </CardContent>
      </Card>

      {/* Average Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Promedio</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currency} {averageRevenue.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Por reserva</p>
        </CardContent>
      </Card>
    </div>
  );
}
