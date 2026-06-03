'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import type { MultiSelectOption } from '@/components/ui/multi-select';
import { useTranslation } from '@/hooks/use-translation';
import {
  SEASON_COUNTRIES,
  COUNTRY_SUBREGIONS,
  getSubregionOptions,
  parseSubregionValue,
} from '../constants/locations';
import type {
  SeasonRegionDto,
  SeasonType,
  SeasonScope,
  SeasonRecurrence,
  CreateSeasonDefinitionRequest,
  GroupedSeason,
} from '../types';

// ─── Props ─────────────────────────────────────────────────────────────────────

interface SeasonFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Group to edit — null means "create new" */
  editingGroup?: GroupedSeason | null;
  regions: SeasonRegionDto[];
  onSubmit: (records: CreateSeasonDefinitionRequest[]) => void;
  isPending: boolean;
}

// ─── Form values ───────────────────────────────────────────────────────────────

type FormValues = {
  name: string;
  seasonType: SeasonType;
  scope: SeasonScope;
  startDate: string;
  endDate: string;
  recurrence: SeasonRecurrence;
};

const SEASON_TYPES: SeasonType[] = ['HIGH', 'MEDIUM', 'LOW'];
const SCOPES: SeasonScope[] = ['GLOBAL', 'REGION', 'COUNTRY', 'SUBREGION'];
const RECURRENCES: SeasonRecurrence[] = ['NONE', 'YEARLY'];

// ─── Component ─────────────────────────────────────────────────────────────────

export function SeasonFormModal({
  open,
  onOpenChange,
  editingGroup,
  regions,
  onSubmit,
  isPending,
}: SeasonFormModalProps) {
  const { t } = useTranslation('seasons');
  const isEdit = !!editingGroup;

  // Location selection state — managed outside react-hook-form for simplicity
  const [selectedRegions, setSelectedRegions]     = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSubregions, setSelectedSubregions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      seasonType: 'HIGH',
      scope: 'COUNTRY',
      startDate: '',
      endDate: '',
      recurrence: 'YEARLY',
    },
  });

  const scope = watch('scope');

  // ─── Region options for multiselect ─────────────────────────────────────────

  const regionOptions: MultiSelectOption[] = regions.map((r) => ({
    value: r.code,
    label: r.name,
  }));

  // ─── Subregion options — derived from selected countries ────────────────────

  const subregionOptions = getSubregionOptions(selectedCountries);
  const hasSubregionsForCountries = selectedCountries.some(
    (c) => (COUNTRY_SUBREGIONS[c]?.length ?? 0) > 0
  );

  // ─── Reset / pre-populate when dialog opens ─────────────────────────────────

  useEffect(() => {
    if (!open) return;

    if (editingGroup) {
      const rep = editingGroup.representative;
      reset({
        name: rep.name,
        seasonType: rep.seasonType,
        scope: rep.scope,
        startDate: rep.startDate,
        endDate: rep.endDate,
        recurrence: rep.recurrence,
      });

      // Populate location multiselects from all seasons in the group
      switch (rep.scope) {
        case 'REGION':
          setSelectedRegions(
            editingGroup.seasons.map((s) => s.regionCode ?? '').filter(Boolean)
          );
          setSelectedCountries([]);
          setSelectedSubregions([]);
          break;
        case 'COUNTRY':
          setSelectedCountries(
            editingGroup.seasons.map((s) => s.country ?? '').filter(Boolean)
          );
          setSelectedRegions([]);
          setSelectedSubregions([]);
          break;
        case 'SUBREGION':
          setSelectedCountries([
            ...new Set(editingGroup.seasons.map((s) => s.country ?? '').filter(Boolean)),
          ]);
          setSelectedSubregions(
            editingGroup.seasons
              .map((s) => (s.country && s.region ? `${s.country} > ${s.region}` : null))
              .filter(Boolean) as string[]
          );
          setSelectedRegions([]);
          break;
        default:
          setSelectedRegions([]);
          setSelectedCountries([]);
          setSelectedSubregions([]);
      }
    } else {
      reset({
        name: '',
        seasonType: 'HIGH',
        scope: 'COUNTRY',
        startDate: '',
        endDate: '',
        recurrence: 'YEARLY',
      });
      setSelectedRegions([]);
      setSelectedCountries([]);
      setSelectedSubregions([]);
    }
  }, [open, editingGroup, reset]);

  // When scope changes, clear stale location selections
  useEffect(() => {
    setSelectedRegions([]);
    setSelectedCountries([]);
    setSelectedSubregions([]);
  }, [scope]);

  // When countries change in SUBREGION mode, remove subregions that no longer belong
  useEffect(() => {
    if (scope !== 'SUBREGION') return;
    setSelectedSubregions((prev) =>
      prev.filter((v) => {
        const { country } = parseSubregionValue(v);
        return selectedCountries.includes(country);
      })
    );
  }, [selectedCountries, scope]);

  // ─── Build records array from form values ────────────────────────────────────

  function buildRecords(data: FormValues): CreateSeasonDefinitionRequest[] {
    const base = {
      name: data.name,
      seasonType: data.seasonType,
      startDate: data.startDate,
      endDate: data.endDate,
      recurrence: data.recurrence,
    };

    switch (data.scope) {
      case 'GLOBAL':
        return [{ ...base, scope: 'GLOBAL' }];

      case 'REGION':
        if (!selectedRegions.length) return [];
        return selectedRegions.map((regionCode) => ({
          ...base,
          scope: 'REGION' as SeasonScope,
          regionCode,
        }));

      case 'COUNTRY':
        if (!selectedCountries.length) return [];
        return selectedCountries.map((country) => ({
          ...base,
          scope: 'COUNTRY' as SeasonScope,
          country,
        }));

      case 'SUBREGION':
        if (!selectedSubregions.length) return [];
        return selectedSubregions.map((sub) => {
          const { country, region } = parseSubregionValue(sub);
          return {
            ...base,
            scope: 'SUBREGION' as SeasonScope,
            country,
            region,
          };
        });
    }
  }

  // ─── Validation helpers ──────────────────────────────────────────────────────

  function locationError(): string | null {
    switch (scope) {
      case 'REGION':
        return selectedRegions.length === 0 ? t('validation.regionRequired') : null;
      case 'COUNTRY':
        return selectedCountries.length === 0 ? t('validation.countryRequired') : null;
      case 'SUBREGION':
        if (selectedCountries.length === 0) return t('validation.countryRequired');
        if (selectedSubregions.length === 0) return t('validation.subregionRequired');
        return null;
      default:
        return null;
    }
  }

  function onValid(data: FormValues) {
    const locErr = locationError();
    if (locErr) return; // error shown inline

    const records = buildRecords(data);
    if (!records.length) return;

    onSubmit(records);
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  const locErr = locationError();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('form.titleEdit') : t('form.titleCreate')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValid)} className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="name">{t('form.name')}</Label>
            <Input
              id="name"
              placeholder={t('form.namePlaceholder')}
              {...register('name', { required: t('validation.nameRequired') })}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Season type */}
          <div className="space-y-1">
            <Label>{t('form.seasonType')}</Label>
            <Select
              value={watch('seasonType')}
              onValueChange={(v) => setValue('seasonType', v as SeasonType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEASON_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`type.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Scope */}
          <div className="space-y-1">
            <Label>{t('form.scope')}</Label>
            <Select
              value={scope}
              onValueChange={(v) => setValue('scope', v as SeasonScope)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCOPES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(`scope.${s}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{t('form.scopeHint')}</p>
          </div>

          {/* ── Region multiselect ──────────────────────────────────────────── */}
          {scope === 'REGION' && (
            <div className="space-y-1">
              <Label>{t('form.region')}</Label>
              <MultiSelect
                options={regionOptions}
                value={selectedRegions}
                onChange={setSelectedRegions}
                placeholder={t('form.regionPlaceholder')}
                searchPlaceholder={t('form.searchPlaceholder')}
                emptyMessage={t('form.noResults')}
              />
              {locErr && scope === 'REGION' && (
                <p className="text-xs text-destructive">{locErr}</p>
              )}
            </div>
          )}

          {/* ── Country multiselect ─────────────────────────────────────────── */}
          {(scope === 'COUNTRY' || scope === 'SUBREGION') && (
            <div className="space-y-1">
              <Label>{t('form.countries')}</Label>
              <MultiSelect
                options={SEASON_COUNTRIES}
                value={selectedCountries}
                onChange={setSelectedCountries}
                placeholder={t('form.countriesPlaceholder')}
                searchPlaceholder={t('form.searchPlaceholder')}
                emptyMessage={t('form.noResults')}
              />
              {locErr && scope === 'COUNTRY' && (
                <p className="text-xs text-destructive">{locErr}</p>
              )}
            </div>
          )}

          {/* ── Subregion multiselect — only when SUBREGION + countries selected ── */}
          {scope === 'SUBREGION' && selectedCountries.length > 0 && (
            <div className="space-y-1">
              <Label>{t('form.subregions')}</Label>
              {hasSubregionsForCountries ? (
                <>
                  <MultiSelect
                    options={subregionOptions}
                    value={selectedSubregions}
                    onChange={setSelectedSubregions}
                    placeholder={t('form.subregionsPlaceholder')}
                    searchPlaceholder={t('form.searchPlaceholder')}
                    emptyMessage={t('form.noResults')}
                  />
                  {locErr && scope === 'SUBREGION' && selectedCountries.length > 0 && (
                    <p className="text-xs text-destructive">{locErr}</p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground py-2">
                  {t('form.noSubregionsForCountries')}
                </p>
              )}
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="startDate">{t('form.startDate')}</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate', { required: t('validation.startDateRequired') })}
              />
              {errors.startDate && (
                <p className="text-xs text-destructive">{errors.startDate.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="endDate">{t('form.endDate')}</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate', { required: t('validation.endDateRequired') })}
              />
              {errors.endDate && (
                <p className="text-xs text-destructive">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Recurrence */}
          <div className="space-y-1">
            <Label>{t('form.recurrence')}</Label>
            <Select
              value={watch('recurrence')}
              onValueChange={(v) => setValue('recurrence', v as SeasonRecurrence)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RECURRENCES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {t(`recurrence.${r}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{t('form.recurrenceHint')}</p>
          </div>

          {/* Summary of records to be created */}
          {!isEdit && (() => {
            const count = buildRecords(watch() as FormValues).length;
            return count > 1 ? (
              <div className="rounded-md bg-muted/50 border px-3 py-2 text-xs text-muted-foreground">
                {t('form.willCreate').replace('{{count}}', String(count))}
              </div>
            ) : null;
          })()}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {t('form.cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t('form.saving') : t('form.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
