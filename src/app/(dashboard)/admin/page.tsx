import { Metadata } from 'next';
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Dashboard Admin | GYDI',
  description: 'Panel de administración con métricas globales de la plataforma',
};

/**
 * Admin Dashboard Page
 *
 * Main admin dashboard with global platform metrics.
 * Shows overview of users, properties, commissions, and system health.
 */
export default function AdminDashboardPage() {
  // TODO: Fetch real metrics from backend API
  const metrics = {
    totalUsers: 1247,
    activeUsers: 892,
    totalProperties: 3456,
    activeProperties: 2891,
    totalCommissions: 45678.90,
    pendingCommissions: 3456.78,
    conversionRate: 12.5,
    systemHealth: 'healthy',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-muted-foreground mt-2">
          Vista general de métricas globales de la plataforma
        </p>
      </div>

      {/* System Health Alert */}
      {metrics.systemHealth !== 'healthy' && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-900">Sistema requiere atención</h3>
              <p className="text-sm text-yellow-700">
                Algunos servicios están experimentando problemas. Revisa los logs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">
                {metrics.activeUsers.toLocaleString()}
              </span>{' '}
              activos
            </p>
          </CardContent>
        </Card>

        {/* Total Properties */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propiedades</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProperties.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">
                {metrics.activeProperties.toLocaleString()}
              </span>{' '}
              publicadas
            </p>
          </CardContent>
        </Card>

        {/* Total Commissions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comisiones</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.totalCommissions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-yellow-600 font-medium">
                ${metrics.pendingCommissions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>{' '}
              pendientes
            </p>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">+2.3%</span> vs. mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones en la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* TODO: Replace with real activity feed */}
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nuevo usuario registrado</p>
                  <p className="text-xs text-muted-foreground">john.doe@example.com • hace 5 min</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nueva propiedad publicada</p>
                  <p className="text-xs text-muted-foreground">Casa en Marbella • hace 1 hora</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Comisión aprobada</p>
                  <p className="text-xs text-muted-foreground">$125.00 • hace 2 horas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>Estado del Sistema</CardTitle>
            <CardDescription>Monitoreo de servicios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">API Backend</span>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Operativo
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Base de Datos</span>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Operativo
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">CDN</span>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Operativo
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email Service</span>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Operativo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder Notice */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">🚧 En Desarrollo</CardTitle>
          <CardDescription>
            Esta página está en construcción. Los datos mostrados son de ejemplo.
            <br />
            Próximamente se integrarán métricas en tiempo real desde el backend.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
