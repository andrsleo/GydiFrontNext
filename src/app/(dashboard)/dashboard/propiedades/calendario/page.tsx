'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Building2, MapPin, Search, ChevronRight } from 'lucide-react';

import { propertiesApi } from '@/features/properties/api/properties.api';
import { PropertyCalendar, SeasonPricingConfig } from '@/features/calendar';
import { propertyKeys } from '@/lib/constants/query-keys';
import { cn } from '@/lib/utils/cn';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';
import { useCurrencyFormat } from '@/hooks/use-currency-format';
import type { SupportedCurrency } from '@/lib/constants/currency-config';
import type { PropertyResponse } from '@/features/properties/types';
import { PropertyStatus } from '@/features/properties/types';

// ─── Status badge styles (labels come from t()) ───────────────────────────────

const STATUS_STYLES: Record<PropertyStatus, string> = {
  [PropertyStatus.PUBLISHED]: 'bg-[hsl(var(--gydi-teal)/0.12)] text-[hsl(var(--gydi-teal))] border-[hsl(var(--gydi-teal)/0.3)]',
  [PropertyStatus.PENDING_APPROVAL]: 'bg-[hsl(var(--gydi-gold)/0.12)] text-[hsl(var(--gydi-gold))] border-[hsl(var(--gydi-gold)/0.3)]',
  [PropertyStatus.DRAFT]: 'bg-muted text-muted-foreground border-border',
  [PropertyStatus.DENY]: 'bg-destructive/10 text-destructive border-destructive/20',
  [PropertyStatus.INACTIVE]: 'bg-[hsl(var(--gydi-primary)/0.08)] text-[hsl(var(--gydi-primary))] border-[hsl(var(--gydi-primary)/0.2)]',
  [PropertyStatus.DELETED]: 'bg-muted text-muted-foreground/60 border-border',
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PropertyStatus }) {
  const { t } = useTranslation('calendar');
  const className = STATUS_STYLES[status] ?? STATUS_STYLES[PropertyStatus.DRAFT];
  return (
    <Badge variant="outline" className={cn('text-xs font-medium border', className)}>
      {t(`status.${status}`)}
    </Badge>
  );
}

function PropertyCardSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-border">
      <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

interface PropertyListCardProps {
  property: PropertyResponse;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function PropertyListCard({ property, isSelected, onSelect }: PropertyListCardProps) {
  const { t } = useTranslation('calendar');

  // Conversión reactiva: convierte el pricePerNight desde la moneda original
  // de la propiedad (property.currency) a la moneda activa del usuario.
  // Cuando el usuario cambia moneda en el header → re-render automático.
  const { formatAmount, displayCurrency } = useCurrencyFormat();
  const propertyCurrency = (property.currency || 'USD') as SupportedCurrency;
  const formattedPrice = `${formatAmount(property.pricePerNight, propertyCurrency)} ${displayCurrency}`;

  return (
    <button
      type="button"
      onClick={() => onSelect(property.id)}
      className={cn(
        'w-full flex items-start gap-3 p-3 rounded-xl border text-left',
        'transition-all duration-200 min-h-11',
        'hover:shadow-md hover:scale-[1.01]',
        isSelected
          ? 'border-l-4 border-l-[hsl(var(--gydi-primary))] border-r border-t border-b bg-[hsl(var(--gydi-primary)/0.06)] shadow-sm'
          : 'border-border hover:bg-muted/50'
      )}
      aria-pressed={isSelected}
      aria-label={`${t('page.selectPropertyLabel')} ${property.title}`}
    >
      {/* Thumbnail */}
      <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0 bg-muted flex items-center justify-center">
        {property.mainImageUrl ? (
          <Image
            src={property.mainImageUrl}
            alt={property.title}
            width={64}
            height={64}
            className="object-cover w-full h-full"
            sizes="64px"
          />
        ) : (
          <Building2 className="h-7 w-7 text-muted-foreground" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight truncate font-heading">
          {property.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
          <MapPin className="h-3 w-3 shrink-0" />
          {property.city}, {property.country}
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <StatusBadge status={property.status} />
          <span className="text-xs text-muted-foreground">
            {formattedPrice}
            <span className="ml-0.5">{t('page.perNight')}</span>
          </span>
        </div>
      </div>

      {isSelected && (
        <ChevronRight className="h-4 w-4 shrink-0 text-[hsl(var(--gydi-primary))] mt-1" />
      )}
    </button>
  );
}

interface MobilePillProps {
  property: PropertyResponse;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function MobilePill({ property, isSelected, onSelect }: MobilePillProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(property.id)}
      className={cn(
        'flex-shrink-0 flex flex-col items-start gap-1 p-3 rounded-xl border',
        'min-w-[140px] min-h-11 text-left transition-all duration-200',
        isSelected
          ? 'border-transparent bg-gradient-to-br from-[hsl(252,100%,64%)] to-[hsl(177,100%,42%)] text-white shadow-md'
          : 'border-border bg-card hover:bg-muted/50'
      )}
      aria-pressed={isSelected}
    >
      <span
        className={cn(
          'text-xs font-semibold leading-tight line-clamp-2 font-heading',
          isSelected ? 'text-white' : 'text-foreground'
        )}
      >
        {property.title}
      </span>
      <span
        className={cn(
          'text-xs truncate',
          isSelected ? 'text-white/80' : 'text-muted-foreground'
        )}
      >
        {property.city}
      </span>
    </button>
  );
}

function EmptyState() {
  const { t } = useTranslation('calendar');
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[320px] gap-4 text-center px-6">
      <div className="relative">
        <div
          className="h-20 w-20 rounded-2xl flex items-center justify-center"
          style={{
            background:
              'linear-gradient(135deg, hsl(252,100%,64%) 0%, hsl(255,89%,72%) 50%, hsl(177,100%,42%) 100%)',
          }}
        >
          <CalendarDays className="h-10 w-10 text-white" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="font-heading text-base font-semibold text-foreground">
          {t('page.emptyTitle')}
        </p>
        <p className="text-sm text-muted-foreground max-w-xs">
          {t('page.emptySubtitle')}
        </p>
      </div>
    </div>
  );
}

function NoPropertiesEmpty() {
  const { t } = useTranslation('calendar');
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center py-12 px-4">
      <div
        className="h-14 w-14 rounded-2xl flex items-center justify-center"
        style={{
          background:
            'linear-gradient(135deg, hsl(252,100%,64%) 0%, hsl(177,100%,42%) 100%)',
        }}
      >
        <Building2 className="h-7 w-7 text-white" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold font-heading">{t('page.noPropertiesTitle')}</p>
        <p className="text-xs text-muted-foreground">{t('page.noPropertiesSubtitle')}</p>
      </div>
      <Link
        href="/dashboard/propiedades/nueva"
        className="text-xs font-medium text-[hsl(var(--gydi-primary))] hover:underline underline-offset-2"
      >
        {t('page.createProperty')}
      </Link>
    </div>
  );
}

interface RightPanelProps {
  property: PropertyResponse;
}

function RightPanelContent({ property }: RightPanelProps) {
  const { t } = useTranslation('calendar');
  return (
    <div className="space-y-6">
      {/* Property mini-header */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 border border-border">
        <div className="h-[60px] w-[60px] rounded-xl overflow-hidden shrink-0 bg-muted flex items-center justify-center">
          {property.mainImageUrl ? (
            <Image
              src={property.mainImageUrl}
              alt={property.title}
              width={60}
              height={60}
              className="object-cover w-full h-full"
              sizes="60px"
            />
          ) : (
            <Building2 className="h-7 w-7 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-semibold text-base leading-tight truncate">
            {property.title}
          </h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {property.city}, {property.country}
          </p>
          <div className="mt-1.5">
            <StatusBadge status={property.status} />
          </div>
        </div>
      </div>

      {/* Gradient divider */}
      <div
        className="h-px w-full"
        style={{
          background:
            'linear-gradient(to right, transparent, hsl(252,100%,64%), hsl(177,100%,42%), transparent)',
        }}
      />

      {/* Calendar — currency es la moneda original de la propiedad (para el backend).
          El display de precios es manejado internamente por useCurrencyFormat. */}
      <PropertyCalendar
        propertyId={Number(property.id)}
        currency={(property.currency || 'USD') as SupportedCurrency}
        isHost={true}
      />

      {/* Season pricing divider */}
      <div className="flex items-center gap-3">
        <div
          className="h-px flex-1"
          style={{
            background:
              'linear-gradient(to right, transparent, hsl(252,100%,64%,0.4))',
          }}
        />
        <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--gydi-primary))]">
          {t('page.seasonPricingTitle')}
        </span>
        <div
          className="h-px flex-1"
          style={{
            background:
              'linear-gradient(to left, transparent, hsl(177,100%,42%,0.4))',
          }}
        />
      </div>

      {/* Season pricing */}
      <SeasonPricingConfig propertyId={Number(property.id)} country={property.country} />
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function CalendarHubPage() {
  const { t } = useTranslation('calendar');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: propertyKeys.myProperties({}),
    queryFn: () => propertiesApi.getMyProperties({}),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const filteredProperties = useMemo<PropertyResponse[]>(() => {
    if (!data?.content) return [];
    if (!searchQuery.trim()) return data.content;
    const q = searchQuery.toLowerCase();
    return data.content.filter((p) => p.title.toLowerCase().includes(q));
  }, [data?.content, searchQuery]);

  const selectedProperty = useMemo<PropertyResponse | null>(
    () => filteredProperties.find((p) => p.id === selectedPropertyId) ?? null,
    [filteredProperties, selectedPropertyId]
  );

  // Auto-select if nothing selected and list loaded
  const displayedProperty =
    selectedProperty ??
    (data?.content?.find((p) => p.id === selectedPropertyId) ?? null);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="space-y-1">
        <h1
          className="font-heading text-2xl sm:text-3xl font-bold bg-clip-text text-transparent"
          style={{
            backgroundImage:
              'linear-gradient(135deg, hsl(252,100%,64%) 0%, hsl(255,89%,72%) 50%, hsl(177,100%,42%) 100%)',
          }}
        >
          {t('page.title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('page.subtitle')}
        </p>
      </div>

      {/* ── Mobile pill selector (< md) ─────────────────────────────────────── */}
      <div className="md:hidden">
        {isLoading ? (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-0.5 px-0.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 min-w-[140px] rounded-xl shrink-0" />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? null : (
          <div
            className="flex gap-2 overflow-x-auto pb-2 -mx-0.5 px-0.5"
            role="listbox"
            aria-label={t('page.selectPropertyLabel')}
          >
            {filteredProperties.map((property) => (
              <MobilePill
                key={property.id}
                property={property}
                isSelected={selectedPropertyId === property.id}
                onSelect={setSelectedPropertyId}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Two-panel layout ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">

        {/* ── Left panel — property list (desktop only) ───────────────────── */}
        <aside
          className={cn(
            'hidden md:flex flex-col gap-3',
            'w-[320px] shrink-0',
            'sticky top-0 max-h-[calc(100vh-120px)] overflow-hidden'
          )}
          aria-label={t('page.selectPropertyLabel')}
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t('page.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 min-h-11"
              aria-label={t('page.searchLabel')}
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))
            ) : filteredProperties.length === 0 ? (
              <NoPropertiesEmpty />
            ) : (
              filteredProperties.map((property) => (
                <PropertyListCard
                  key={property.id}
                  property={property}
                  isSelected={selectedPropertyId === property.id}
                  onSelect={setSelectedPropertyId}
                />
              ))
            )}
          </div>
        </aside>

        {/* ── Right panel — calendar view ─────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* Mobile: search (shown below pills, above calendar) */}
          <div className="md:hidden mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={t('page.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 min-h-11"
                aria-label={t('page.searchLabel')}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-[480px] w-full rounded-2xl" />
            </div>
          ) : !displayedProperty ? (
            <div className="clay-card rounded-2xl border border-border bg-card h-full min-h-[320px] flex items-center justify-center">
              <EmptyState />
            </div>
          ) : (
            <div className="space-y-6 pb-8">
              <RightPanelContent property={displayedProperty} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
