'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  MousePointerClick,
  Users,
  TrendingUp,
  Calendar,
  Search,
  Download,
  ExternalLink,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useReferralLinks, useReferralStats } from '@/features/referrals/hooks';
import { formatDate, formatCurrency, formatNumber } from '@/lib/utils/format';

const statusConfig = {
  ACTIVE: { label: 'Activo', color: 'bg-green-100 text-green-800' },
  INACTIVE: { label: 'Inactivo', color: 'bg-gray-100 text-gray-800' },
  EXPIRED: { label: 'Expirado', color: 'bg-red-100 text-red-800' },
  DELETED: { label: 'Eliminado', color: 'bg-red-200 text-red-900' },
};

export default function ReferidosPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch real data from API
  const { data: links, isLoading: linksLoading, error: linksError } = useReferralLinks();
  const { data: stats, isLoading: statsLoading, error: statsError } = useReferralStats(
    session?.user?.id ? parseInt(session.user.id) : undefined
  );

  // Prepare stats data
  const referralStatsDisplay = stats ? [
    {
      name: 'Total de Clicks',
      value: formatNumber(stats.totalClicks),
      change: `${stats.clicksLast30Days} en últimos 30 días`,
      icon: MousePointerClick,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Conversiones',
      value: formatNumber(stats.totalConversions),
      change: `+${stats.conversionsLast30Days} este mes`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Tasa de Conversión',
      value: `${stats.overallConversionRate.toFixed(2)}%`,
      change: stats.overallConversionRate > 3 ? 'Excelente' : 'Promedio',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Enlaces Activos',
      value: formatNumber(stats.activeLinks),
      change: `${stats.totalLinks} totales`,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ] : [];

  const filteredReferrals = links?.filter(
    (link) =>
      link.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.fullUrl.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCopyLink = (fullUrl: string, id: string) => {
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Loading state
  if (linksLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Error state
  if (linksError || statsError) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h3 className="text-lg font-semibold text-red-900">Error al cargar datos</h3>
          <p className="mt-2 text-sm text-red-700">
            {linksError?.message || statsError?.message || 'Ocurrió un error inesperado'}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Referidos</h1>
          <p className="text-muted-foreground">
            Monitorea tus enlaces de referido y su rendimiento
          </p>
        </div>
        <Button className="gap-2" disabled>
          <Download className="h-4 w-4" />
          Exportar Reporte
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {referralStatsDisplay.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.name}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por código o propiedad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Filtrar por Fecha
        </Button>
      </div>

      {/* Referrals Table */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Propiedad
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Clicks
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Conversiones
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Tasa Conv.
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Comisión
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Estado
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredReferrals.map((link) => (
                <tr key={link.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-gray-100 px-2 py-1 text-sm font-mono">
                        {link.shortCode}
                      </code>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-xs truncate max-w-xs">{link.fullUrl}</p>
                      <p className="text-xs text-muted-foreground">
                        Creado: {formatDate(link.createdAt)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold">{link.clicksCount}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-blue-600">
                      {link.conversionsCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-green-600">
                      {link.conversionRate.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold">{formatCurrency(link.totalCommission)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        statusConfig[link.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {statusConfig[link.status as keyof typeof statusConfig]?.label || link.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyLink(link.fullUrl, link.id)}
                        title="Copiar enlace"
                      >
                        {copiedId === link.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          window.open(link.fullUrl, '_blank')
                        }
                        title="Abrir enlace"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredReferrals.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              No se encontraron referidos
            </h3>
            <p className="text-sm text-muted-foreground">
              Intenta con otro término de búsqueda
            </p>
          </div>
        )}
      </div>

      {/* Performance Tips */}
      <div className="rounded-lg border bg-blue-50 p-6">
        <h3 className="mb-2 font-semibold text-blue-900">
          💡 Consejos para mejorar tu tasa de conversión
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
          <li>Comparte tus enlaces en grupos relevantes de Facebook y WhatsApp</li>
          <li>Crea contenido de valor en Instagram y TikTok mostrando las propiedades</li>
          <li>Usa descripciones atractivas y fotos de alta calidad en tus publicaciones</li>
          <li>Incluye un llamado a la acción claro en cada publicación</li>
        </ul>
      </div>
    </div>
  );
}
