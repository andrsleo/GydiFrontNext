import { Metadata } from 'next';
import { TrendingUp, Users, Building2, DollarSign, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Analíticas Globales | Admin GYDI',
  description: 'Reportes de ingresos, conversiones y top afiliados',
};

export default function AdminAnalyticsPage() {
  const metrics = {
    revenue: {
      total: 125678.90,
      growth: 23.5,
      thisMonth: 18234.50,
    },
    conversions: {
      total: 1247,
      rate: 12.5,
      avgValue: 99.99,
    },
    topAffiliates: [
      { name: 'María García', commissions: 12456.78, referrals: 120, conversionRate: 18.5 },
      { name: 'Juan Pérez', commissions: 8234.50, referrals: 89, conversionRate: 15.2 },
      { name: 'Carlos López', commissions: 6789.45, referrals: 67, conversionRate: 14.8 },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analíticas Globales</h1>
          <p className="text-muted-foreground mt-2">
            Reportes de ingresos, conversiones y top afiliados
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Seleccionar Período
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.revenue.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">+{metrics.revenue.growth}%</span> vs. mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${metrics.revenue.thisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{metrics.conversions.rate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Valor promedio: ${metrics.conversions.avgValue}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución de Ingresos</CardTitle>
          <CardDescription>Ingresos mensuales de los últimos 12 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Gráfico de ingresos (próximamente)</p>
              <p className="text-xs text-muted-foreground mt-1">
                Integración con librerías de gráficos (Chart.js / Recharts)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Affiliates */}
      <Card>
        <CardHeader>
          <CardTitle>Top Afiliados</CardTitle>
          <CardDescription>Usuarios con mayor rendimiento en comisiones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.topAffiliates.map((affiliate, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{affiliate.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {affiliate.referrals} referidos • {affiliate.conversionRate}% conversión
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ${affiliate.commissions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground">comisiones totales</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Funnel Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Embudo de Conversión</CardTitle>
          <CardDescription>Análisis del flujo de usuarios en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed">
            <div className="text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Embudo de conversión (próximamente)</p>
              <p className="text-xs text-muted-foreground mt-1">
                Visualización de métricas de conversión por etapa
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">🚧 En Desarrollo</CardTitle>
          <CardDescription>
            Próximamente: Gráficos interactivos, filtros avanzados y exportación de datos
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
