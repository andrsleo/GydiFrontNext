'use client';

import { useState, useEffect, Suspense } from 'react';
import { useUser } from '@/features/auth/hooks/use-auth';
import { useSearchParams } from 'next/navigation';
import {
  TrendingUp,
  DollarSign,
  Users,
  MousePointerClick,
  AlertCircle,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfileByUserId } from '@/features/auth/hooks/use-profile';
import { useSubscription } from '@/features/subscriptions/hooks/use-subscription';
import { UpgradeModal } from '@/features/subscriptions/components/upgrade-modal';
import { useAffiliateDashboard } from '@/features/dashboard/hooks/use-dashboard-stats';
import type { PlanCode } from '@/lib/utils/plan-selection';

// ─── Status badge configuration ────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: 'Aprobado', color: 'bg-blue-100 text-blue-800' },
  PAID: { label: 'Pagado', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Rechazado', color: 'bg-red-100 text-red-800' },
};

// ─── Formatting helpers ─────────────────────────────────────────────────────────

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '--';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCount(value: number | null | undefined): string {
  if (value == null) return '--';
  return new Intl.NumberFormat('en-US').format(value);
}

function formatPercent(value: number | null | undefined): string {
  if (value == null) return '--';
  return value.toFixed(1) + '%';
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

// ─── Skeleton for stat cards while loading ──────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

// ─── Skeleton for recent commissions table while loading ────────────────────────

function CommissionsTableSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
        >
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main dashboard content ─────────────────────────────────────────────────────

function DashboardContent() {
  const user = useUser();
  const searchParams = useSearchParams();
  const userId = user?.id ? Number(user.id) : null;

  const { data: profile } = useProfileByUserId(userId!, {
    enabled: !!userId,
  });

  const { data: subscription } = useSubscription();
  const { data, loading, error } = useAffiliateDashboard();

  // Upgrade modal state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<PlanCode | null>(null);

  // Resolve display name: profile > user > fallback
  const displayName = profile
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() ||
      user?.name ||
      'Usuario'
    : user?.name || 'Usuario';

  // Auto-open upgrade modal when ?upgrade=XXX query param is present
  useEffect(() => {
    const upgradePlan = searchParams.get('upgrade')?.toUpperCase() as PlanCode | null;
    if (upgradePlan && ['PRO', 'ELITE'].includes(upgradePlan)) {
      setSelectedUpgradePlan(upgradePlan);
      setShowUpgradeModal(true);
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams]);

  // Derive conversion rate — use backend value when available, calculate client-side otherwise
  const conversionRate = (() => {
    const stats = data.referralStats;
    if (!stats) return null;
    if (stats.overallConversionRate > 0) return stats.overallConversionRate;
    if (stats.totalClicks > 0 && stats.totalConversions > 0) {
      return (stats.totalConversions / stats.totalClicks) * 100;
    }
    return 0;
  })();

  // Stat card definitions — each references its own loading/error state
  const statCards = [
    {
      name: 'Comisiones Ganadas',
      isLoading: loading.isLoadingCommissionStats,
      hasError: !!error.commissionStatsError,
      value: error.commissionStatsError
        ? '--'
        : formatCurrency(data.commissionStats?.totalEarned),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Links Activos',
      isLoading: loading.isLoadingReferralStats,
      hasError: !!error.referralStatsError,
      value: error.referralStatsError
        ? '--'
        : formatCount(data.referralStats?.activeLinks),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Clicks (30 dias)',
      isLoading: loading.isLoadingReferralStats,
      hasError: !!error.referralStatsError,
      value: error.referralStatsError
        ? '--'
        : formatCount(data.referralStats?.clicksLast30Days),
      icon: MousePointerClick,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Tasa de Conversion',
      isLoading: loading.isLoadingReferralStats,
      hasError: !!error.referralStatsError,
      value: error.referralStatsError
        ? '--'
        : formatPercent(conversionRate),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  // Use real commission history (max 4 items)
  const recentCommissions = data.earnings?.recentCommissions?.slice(0, 4) ?? [];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenido, {displayName}
        </h1>
        <p className="text-muted-foreground">
          Aqui esta un resumen de tu actividad reciente
        </p>
      </div>

      {/* Error banner — shown only when at least one query failed AND nothing is loading */}
      {error.hasAnyError && !loading.isAnyLoading && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>
            Algunos datos no pudieron cargarse. Verifica tu conexion o intenta recargar la pagina.
          </span>
        </div>
      )}

      {/* Stats Grid — 4 cards with per-card skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          if (stat.isLoading) {
            return <StatCardSkeleton key={stat.name} />;
          }

          const Icon = stat.icon;
          const isErrorValue = stat.value === '--';

          return (
            <div
              key={stat.name}
              className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p
                  className={`mt-1 text-3xl font-bold ${
                    isErrorValue ? 'text-muted-foreground' : ''
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Commissions */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Comisiones Recientes</h2>
            <a
              href="/dashboard/ganancias"
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver todas
            </a>
          </div>

          {loading.isLoadingEarnings ? (
            <CommissionsTableSkeleton />
          ) : recentCommissions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aun no tienes comisiones registradas. Comparte tus links de referido para
              comenzar a ganar.
            </p>
          ) : (
            <div className="space-y-4">
              {recentCommissions.map((commission) => {
                const badge = statusConfig[commission.status] ?? {
                  label: commission.status,
                  color: 'bg-gray-100 text-gray-800',
                };
                return (
                  <div
                    key={commission.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {`Propiedad #${commission.propertyId}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(commission.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">
                        {formatCurrency(commission.commissionAmount)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Acciones Rapidas</h2>

          <div className="space-y-3">
            <a
              href="/dashboard/referidos"
              className="flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-gray-50"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Generar Link de Referido</p>
                <p className="text-sm text-muted-foreground">
                  Crea un nuevo enlace para compartir
                </p>
              </div>
            </a>

            <a
              href="/dashboard/referidos"
              className="flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-gray-50"
            >
              <div className="rounded-lg bg-blue-50 p-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Ver Estadisticas</p>
                <p className="text-sm text-muted-foreground">
                  Analiza tu rendimiento de referidos
                </p>
              </div>
            </a>

            <a
              href="/dashboard/ganancias"
              className="flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-gray-50"
            >
              <div className="rounded-lg bg-green-50 p-2">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Ver Ganancias</p>
                <p className="text-sm text-muted-foreground">
                  Revisa el historial de comisiones
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Upgrade Modal — auto-opens when ?upgrade=XXX is detected in URL */}
      {subscription && selectedUpgradePlan && (
        <UpgradeModal
          open={showUpgradeModal}
          onOpenChange={setShowUpgradeModal}
          currentPlanCode={subscription.planCode}
          targetPlanCode={selectedUpgradePlan}
        />
      )}
    </div>
  );
}

// ─── Page wrapper with Suspense boundary (required for useSearchParams) ─────────

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-muted-foreground">Cargando...</div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
