'use client';
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useSeasonPricing } from '../hooks/use-season-pricing';
import { useUpdateSeasonPricing } from '../hooks/use-update-season-pricing';
import { calendarApi } from '../api/calendar.api';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { CURRENCY_META } from '@/lib/constants/currency-config';
import type { SeasonDefinitionDto } from '../types';

interface SeasonPricingConfigProps {
  propertyId: number;
  country?: string;
}

interface MultiplierField {
  key: 'highMultiplier' | 'mediumMultiplier' | 'lowMultiplier';
  seasonType: 'HIGH' | 'MEDIUM' | 'LOW';
  tKeyLabel: string;
  tKeyDesc: string;
  badgeClass: string;
  borderClass: string;
}

const FIELDS: MultiplierField[] = [
  {
    key: 'highMultiplier',
    seasonType: 'HIGH',
    tKeyLabel: 'season.highLabel',
    tKeyDesc: 'season.highDesc',
    badgeClass: 'bg-[hsl(var(--gydi-gold)/0.15)] text-[hsl(var(--gydi-gold))]',
    borderClass: 'border-[hsl(var(--gydi-gold)/0.3)]',
  },
  {
    key: 'mediumMultiplier',
    seasonType: 'MEDIUM',
    tKeyLabel: 'season.mediumLabel',
    tKeyDesc: 'season.mediumDesc',
    badgeClass: 'bg-[hsl(var(--gydi-primary)/0.10)] text-[hsl(var(--gydi-primary))]',
    borderClass: 'border-[hsl(var(--gydi-primary)/0.2)]',
  },
  {
    key: 'lowMultiplier',
    seasonType: 'LOW',
    tKeyLabel: 'season.lowLabel',
    tKeyDesc: 'season.lowDesc',
    badgeClass: 'bg-[hsl(var(--gydi-teal)/0.12)] text-[hsl(var(--gydi-teal))]',
    borderClass: 'border-[hsl(var(--gydi-teal)/0.25)]',
  },
];

function formatSeasonDate(dateStr: string, locale: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
  });
}

interface SeasonPeriodListProps {
  defs: SeasonDefinitionDto[];
  badgeClass: string;
  locale: string;
  labelAnnual: string;
  labelOnce: string;
  labelShowLess: string;
  labelShowMore: (count: number) => string;
}

function SeasonPeriodList({
  defs,
  badgeClass,
  locale,
  labelAnnual,
  labelOnce,
  labelShowLess,
  labelShowMore,
}: SeasonPeriodListProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? defs : defs.slice(0, 2);

  return (
    <div className="mt-2 space-y-1">
      {visible.map((def) => (
        <div key={def.id} className="flex items-center gap-1.5 flex-wrap">
          <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', badgeClass)}>
            {def.recurrence === 'YEARLY' ? labelAnnual : labelOnce}
          </span>
          <span className="text-[11px] text-foreground">
            {def.name}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {formatSeasonDate(def.startDate, locale)} — {formatSeasonDate(def.endDate, locale)}
          </span>
        </div>
      ))}
      {defs.length > 2 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-0.5 text-[11px] text-[hsl(var(--gydi-primary))] hover:underline"
        >
          {expanded ? (
            <>{labelShowLess} <ChevronUp className="w-3 h-3" /></>
          ) : (
            <>{labelShowMore(defs.length - 2)} <ChevronDown className="w-3 h-3" /></>
          )}
        </button>
      )}
    </div>
  );
}

export function SeasonPricingConfig({ propertyId, country }: SeasonPricingConfigProps) {
  const { t, locale } = useTranslation('calendar');
  const { data, isLoading } = useSeasonPricing(propertyId);
  const mutation = useUpdateSeasonPricing(propertyId);

  const { data: seasonDefs } = useQuery<SeasonDefinitionDto[]>({
    queryKey: ['seasons', country],
    queryFn: () => calendarApi.getSeasonsByCountry(country!),
    enabled: !!country,
    staleTime: 30 * 60 * 1000,
  });

  const seasonsByType = useMemo(() => {
    if (!seasonDefs) return {} as Record<string, SeasonDefinitionDto[]>;
    return seasonDefs.reduce(
      (acc, s) => {
        (acc[s.seasonType] ??= []).push(s);
        return acc;
      },
      {} as Record<string, SeasonDefinitionDto[]>,
    );
  }, [seasonDefs]);

  const [values, setValues] = useState({
    highMultiplier: '1.00',
    mediumMultiplier: '1.00',
    lowMultiplier: '1.00',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    if (data) {
      setValues({
        highMultiplier: data.highMultiplier.toFixed(2),
        mediumMultiplier: data.mediumMultiplier.toFixed(2),
        lowMultiplier: data.lowMultiplier.toFixed(2),
      });
    }
  }, [data]);

  function validateMultiplier(value: number): string | null {
    if (isNaN(value) || value < 0.1 || value > 10) {
      return t('season.validationError');
    }
    return null;
  }

  function handleChange(key: MultiplierField['key'], raw: string) {
    setValues((prev) => ({ ...prev, [key]: raw }));
    const err = validateMultiplier(parseFloat(raw));
    setErrors((prev) => {
      if (err) return { ...prev, [key]: err };
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function handleSave() {
    const newErrors: Record<string, string> = {};
    FIELDS.forEach(({ key }) => {
      const err = validateMultiplier(parseFloat(values[key]));
      if (err) newErrors[key] = err;
    });
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    await mutation.mutateAsync({
      highMultiplier: parseFloat(values.highMultiplier),
      mediumMultiplier: parseFloat(values.mediumMultiplier),
      lowMultiplier: parseFloat(values.lowMultiplier),
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted rounded-xl" />)}
      </div>
    );
  }

  const hasSeasonDefs = seasonDefs && seasonDefs.length > 0;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-base font-semibold text-[hsl(var(--gydi-ink))]">
          {t('season.title')}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t('season.subtitle')}
        </p>
      </div>

      {/* Season definitions info banner */}
      {country && !hasSeasonDefs && (
        <div className="flex items-start gap-2 p-3 bg-[hsl(var(--gydi-primary)/0.06)] border border-[hsl(var(--gydi-primary)/0.15)] rounded-xl">
          <Info className="w-4 h-4 text-[hsl(var(--gydi-primary))] shrink-0 mt-0.5" />
          <p className="text-xs text-[hsl(var(--gydi-primary))]">
            {t('season.noSeasonDefs', { country: country ?? '' })}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {FIELDS.map(({ key, seasonType, tKeyLabel, tKeyDesc, badgeClass, borderClass }) => {
          const defs = seasonsByType[seasonType] ?? [];
          return (
            <div
              key={key}
              className={cn('p-4 border rounded-2xl bg-card space-y-2', borderClass)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', badgeClass)}>
                    {t(tKeyLabel)}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">{t(tKeyDesc)}</p>

                  {/* Season date ranges */}
                  {defs.length > 0 && (
                    <SeasonPeriodList
                      defs={defs}
                      badgeClass={badgeClass}
                      locale={locale}
                      labelAnnual={t('season.annual')}
                      labelOnce={t('season.once')}
                      labelShowLess={t('season.showLess')}
                      labelShowMore={(count) => t('season.showMore', { count: String(count) })}
                    />
                  )}
                  {country && hasSeasonDefs && defs.length === 0 && (
                    <p className="text-[11px] text-muted-foreground mt-1 italic">
                      {t('season.noPeriodsForType')}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-muted-foreground">×</span>
                    <input
                      type="number"
                      min="0.10"
                      max="10.00"
                      step="0.01"
                      value={values[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      aria-label={`${t(tKeyLabel)}`}
                      className={cn(
                        'w-20 text-right text-sm font-medium border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gydi-primary))] bg-card text-foreground',
                        errors[key] ? 'border-destructive' : 'border-border',
                      )}
                    />
                  </div>
                  {errors[key] && (
                    <p className="text-[11px] text-destructive">{errors[key]}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        {savedMessage && (
          <p className="text-sm text-[hsl(var(--gydi-teal))] font-medium">{t('season.saveSuccess')}</p>
        )}
        {mutation.isError && !savedMessage && (
          <p className="text-sm text-destructive">{t('season.saveError')}</p>
        )}
        {!savedMessage && !mutation.isError && <div />}
        <button
          onClick={handleSave}
          disabled={mutation.isPending || Object.keys(errors).length > 0}
          className={cn(
            'px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity min-h-[44px] micro-press',
            'bg-gradient-to-r from-[hsl(252,100%,64%)] via-[hsl(255,89%,72%)] to-[hsl(177,100%,42%)]',
            (mutation.isPending || Object.keys(errors).length > 0) && 'opacity-60',
          )}
        >
          {mutation.isPending ? t('season.saving') : t('season.save')}
        </button>
      </div>
    </div>
  );
}
