'use client';

import { useSession } from 'next-auth/react';
import {
  TrendingUp,
  DollarSign,
  Users,
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

// Mock data - replace with real API calls
const stats = [
  {
    name: 'Comisiones del Mes',
    value: '$2,450',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    name: 'Referidos Activos',
    value: '48',
    change: '+8',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'Clicks Totales',
    value: '1,234',
    change: '+23.1%',
    trend: 'up',
    icon: MousePointerClick,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    name: 'Tasa de Conversión',
    value: '3.8%',
    change: '-0.4%',
    trend: 'down',
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

const recentReferrals = [
  {
    id: 1,
    property: 'Villa Paradise - Cancún',
    date: '2025-10-18',
    commission: '$350',
    status: 'pending',
  },
  {
    id: 2,
    property: 'Beach House - Playa del Carmen',
    date: '2025-10-15',
    commission: '$280',
    status: 'approved',
  },
  {
    id: 3,
    property: 'Mountain Cabin - Valle de Bravo',
    date: '2025-10-12',
    commission: '$420',
    status: 'paid',
  },
  {
    id: 4,
    property: 'City Loft - CDMX',
    date: '2025-10-10',
    commission: '$190',
    status: 'paid',
  },
];

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Aprobado', color: 'bg-blue-100 text-blue-800' },
  paid: { label: 'Pagado', color: 'bg-green-100 text-green-800' },
};

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenido, {session?.user?.name || 'Usuario'}
        </h1>
        <p className="text-muted-foreground">
          Aquí está un resumen de tu actividad reciente
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;

          return (
            <div
              key={stat.name}
              className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div
                  className={`flex items-center text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  <TrendIcon className="mr-1 h-4 w-4" />
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="mt-1 text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Referrals */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Referidos Recientes</h2>
            <button className="text-sm font-medium text-primary hover:underline">
              Ver todos
            </button>
          </div>

          <div className="space-y-4">
            {recentReferrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="font-medium">{referral.property}</p>
                  <p className="text-sm text-muted-foreground">{referral.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{referral.commission}</span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      statusConfig[referral.status as keyof typeof statusConfig].color
                    }`}
                  >
                    {statusConfig[referral.status as keyof typeof statusConfig].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Acciones Rápidas</h2>

          <div className="space-y-3">
            <button className="flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-gray-50">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Generar Link de Referido</p>
                <p className="text-sm text-muted-foreground">
                  Crea un nuevo enlace para compartir
                </p>
              </div>
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-gray-50">
              <div className="rounded-lg bg-blue-50 p-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Ver Estadísticas</p>
                <p className="text-sm text-muted-foreground">
                  Analiza tu rendimiento
                </p>
              </div>
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-gray-50">
              <div className="rounded-lg bg-green-50 p-2">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Solicitar Pago</p>
                <p className="text-sm text-muted-foreground">
                  Retira tus comisiones
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Performance Chart Section */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Rendimiento de los Últimos 30 Días</h2>
        <div className="flex h-64 items-center justify-center border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            Gráfico de rendimiento (próximamente con Chart.js o Recharts)
          </p>
        </div>
      </div>
    </div>
  );
}
