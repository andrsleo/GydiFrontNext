'use client';

import { useState } from 'react';
import { useUser } from '@/features/auth/hooks/use-auth';
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
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { useReferralLinks, useReferralStats } from '@/features/referrals/hooks';
import { formatDate, formatCurrency, formatNumber } from '@/lib/utils/format';

const statusConfig = {
  ACTIVE: { label: 'Activo', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  INACTIVE: { label: 'Inactivo', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  EXPIRED: { label: 'Expirado', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  DELETED: { label: 'Eliminado', color: 'bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-300' },
};

export default function ReferidosPage() {
  const user = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch real data from API
  const { data: links, isLoading: linksLoading, error: linksError } = useReferralLinks();
  const { data: stats, isLoading: statsLoading, error: statsError } = useReferralStats(
    user?.id ? parseInt(user.id) : undefined
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
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Referidos</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Monitorea tus enlaces de referido y su rendimiento
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" variant="outline" disabled>
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Exportar Reporte</span>
          <span className="sm:hidden">Exportar</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {referralStatsDisplay.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.name}
              className="p-4 sm:p-5 lg:p-6 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-1.5 sm:p-2 ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  {stat.name}
                </p>
                <p className="mt-1 text-xl sm:text-2xl lg:text-3xl font-bold">
                  {stat.value}
                </p>
                <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-muted-foreground truncate">
                  {stat.change}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por código o propiedad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Button variant="outline" className="gap-2 h-10 whitespace-nowrap" disabled>
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Filtrar por Fecha</span>
          <span className="sm:hidden">Fecha</span>
        </Button>
      </div>

      {/* Referrals - Desktop Table / Mobile Cards */}
      <div className="rounded-lg border bg-card shadow-sm">
        {/* Desktop Table (hidden on mobile/tablet) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Código
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Propiedad
                </th>
                <th className="px-4 xl:px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Clicks
                </th>
                <th className="px-4 xl:px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Conversiones
                </th>
                <th className="px-4 xl:px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Tasa
                </th>
                <th className="px-4 xl:px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Comisión
                </th>
                <th className="px-4 xl:px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Estado
                </th>
                <th className="px-4 xl:px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredReferrals.map((link) => (
                <tr key={link.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 xl:px-6 py-3">
                    <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                      {link.shortCode}
                    </code>
                  </td>
                  <td className="px-4 xl:px-6 py-3">
                    <div>
                      <p className="font-medium text-xs truncate max-w-[200px] xl:max-w-xs">
                        {link.fullUrl}
                      </p>
                      <p className="text-[10px] xl:text-xs text-muted-foreground mt-0.5">
                        {formatDate(link.createdAt)}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-3 text-center">
                    <span className="font-semibold text-sm">{link.clicksCount}</span>
                  </td>
                  <td className="px-4 xl:px-6 py-3 text-center">
                    <span className="font-semibold text-sm text-blue-600">
                      {link.conversionsCount}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-3 text-center">
                    <span className="font-semibold text-sm text-green-600">
                      {link.conversionRate?.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-3 text-center">
                    <span className="font-semibold text-sm">{formatCurrency(link.totalCommission)}</span>
                  </td>
                  <td className="px-4 xl:px-6 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] xl:text-xs font-medium ${
                        statusConfig[link.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {statusConfig[link.status as keyof typeof statusConfig]?.label || link.status}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
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
                        className="h-8 w-8"
                        onClick={() => window.open(link.fullUrl, '_blank')}
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

        {/* Mobile/Tablet Cards (visible on mobile/tablet, hidden on desktop) */}
        <div className="lg:hidden divide-y">
          {filteredReferrals.map((link) => (
            <div key={link.id} className="p-4 hover:bg-muted/30 transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <code className="inline-block rounded bg-muted px-2 py-1 text-xs font-mono mb-2">
                    {link.shortCode}
                  </code>
                  <p className="text-xs text-muted-foreground truncate">
                    {link.fullUrl}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium whitespace-nowrap ${
                    statusConfig[link.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {statusConfig[link.status as keyof typeof statusConfig]?.label || link.status}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Clicks</p>
                  <p className="text-lg font-semibold">{link.clicksCount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Conversiones</p>
                  <p className="text-lg font-semibold text-blue-600">{link.conversionsCount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Tasa Conv.</p>
                  <p className="text-lg font-semibold text-green-600">
                    {link.conversionRate?.toFixed(1)}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Comisión</p>
                  <p className="text-lg font-semibold">{formatCurrency(link.totalCommission)}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t">
                <p className="text-[10px] text-muted-foreground">
                  Creado: {formatDate(link.createdAt)}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
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
                    className="h-8 w-8"
                    onClick={() => window.open(link.fullUrl, '_blank')}
                    title="Abrir enlace"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReferrals.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
            <Search className="mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
            <h3 className="mb-1 sm:mb-2 text-base sm:text-lg font-semibold">
              No se encontraron referidos
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {searchQuery ? 'Intenta con otro término de búsqueda' : 'Aún no tienes enlaces de referido'}
            </p>
          </div>
        )}
      </div>

      {/* Performance Tips */}
      <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <div className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-100 mb-2 sm:mb-3">
                💡 Consejos para mejorar tu tasa de conversión
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-1.5 h-1 w-1 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>Comparte tus enlaces en grupos relevantes de Facebook y WhatsApp</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-1.5 h-1 w-1 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>Crea contenido de valor en Instagram y TikTok mostrando las propiedades</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-1.5 h-1 w-1 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>Usa descripciones atractivas y fotos de alta calidad en tus publicaciones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-1.5 h-1 w-1 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>Incluye un llamado a la acción claro en cada publicación</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
