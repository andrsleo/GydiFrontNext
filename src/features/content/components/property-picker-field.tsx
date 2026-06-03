/**
 * PropertyPickerField
 * Custom modal picker for selecting a property.
 * Shows cover photo + name + location for each option.
 * Supports text search and country/city dropdown filters.
 */

'use client';

import { useState, useDeferredValue, useMemo } from 'react';
import Image from 'next/image';
import { Building2, Check, ChevronDown, MapPin, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { resolveMediaUrl } from '@/lib/utils/image';
import { useMyProperties } from '@/features/properties/hooks/use-my-properties';
import { useProperties } from '@/features/properties/hooks/use-properties';
import type { PropertyResponse } from '@/features/properties/types';
import { useTranslation } from '@/hooks/use-translation';

/** Image with fallback icon on load error */
function PropertyImage({
  src,
  alt,
  iconSize = 'h-5 w-5',
}: {
  src: string | null | undefined;
  alt: string;
  iconSize?: string;
}) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Building2 className={cn(iconSize, 'text-muted-foreground/40')} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="56px"
      className="object-cover"
      onError={() => setErrored(true)}
    />
  );
}

interface PropertyPickerFieldProps {
  value?: number;
  onChange: (id: number, property: PropertyResponse) => void;
  error?: string;
}

export function PropertyPickerField({ value, onChange, error }: PropertyPickerFieldProps) {
  const { t } = useTranslation('content');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<PropertyResponse | null>(null);

  const deferredSearch = useDeferredValue(search);

  // Load user's own properties (all statuses)
  const { data: myData, isLoading: myLoading } = useMyProperties({ size: 100 });

  // Also load published properties as fallback (in case user is an affiliate with no own properties)
  const { data: pubData, isLoading: pubLoading } = useProperties({
    filters: { status: 'PUBLISHED', size: 100 },
  });

  // Merge: own properties first, then published ones not already in own list
  const allProperties = useMemo(() => {
    const myProps = myData?.content ?? [];
    const pubProps = pubData?.content ?? [];
    const myIds = new Set(myProps.map((p) => p.id));
    const extra = pubProps.filter((p) => !myIds.has(p.id));
    return [...myProps, ...extra];
  }, [myData, pubData]);

  const isLoading = myLoading && pubLoading;

  // Unique countries from the full list
  const availableCountries = useMemo(() => {
    const countries = allProperties
      .map((p) => p.country)
      .filter((c): c is string => Boolean(c));
    return [...new Set(countries)].sort();
  }, [allProperties]);

  // Cities filtered by selected country
  const availableCities = useMemo(() => {
    const base = selectedCountry
      ? allProperties.filter((p) => p.country === selectedCountry)
      : allProperties;
    const cities = base
      .map((p) => p.city)
      .filter((c): c is string => Boolean(c));
    return [...new Set(cities)].sort();
  }, [allProperties, selectedCountry]);

  // Client-side filtering for the displayed list
  const properties = useMemo(() => {
    let result = allProperties;

    if (deferredSearch) {
      const q = deferredSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.country?.toLowerCase().includes(q)
      );
    }

    if (selectedCountry) {
      result = result.filter((p) => p.country === selectedCountry);
    }

    if (selectedCity) {
      result = result.filter((p) => p.city === selectedCity);
    }

    return result;
  }, [allProperties, deferredSearch, selectedCountry, selectedCity]);

  const hasActiveFilters = Boolean(search || selectedCountry || selectedCity);

  const clearFilters = () => {
    setSearch('');
    setSelectedCountry('');
    setSelectedCity('');
  };

  const handleSelect = (prop: PropertyResponse) => {
    setSelectedProperty(prop);
    onChange(Number(prop.id), prop);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProperty(null);
    onChange(0, null as unknown as PropertyResponse);
  };

  return (
    <>
      {/* Trigger */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setOpen(true);
        }}
        className={cn(
          'flex w-full cursor-pointer items-center gap-3 rounded-xl border bg-background px-3 py-2 text-left transition-colors hover:bg-muted/50',
          error ? 'border-destructive' : 'border-input',
          !selectedProperty && 'text-muted-foreground'
        )}
      >
        {selectedProperty ? (
          <>
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
              <PropertyImage
                src={resolveMediaUrl(selectedProperty.mainImageUrl)}
                alt={selectedProperty.title}
                iconSize="h-5 w-5"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {selectedProperty.title}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {selectedProperty.city}, {selectedProperty.country}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 rounded-full p-1 hover:bg-muted"
              aria-label={t('picker.clearAriaLabel')}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <Building2 className="h-5 w-5 shrink-0 text-muted-foreground/50" />
            <span className="flex-1 text-sm">{t('picker.placeholder')}</span>
            <ChevronDown className="h-4 w-4 shrink-0" />
          </>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Picker modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg gap-0 overflow-hidden p-0">
          <DialogHeader className="border-b px-4 pb-3 pt-4">
            <DialogTitle className="text-base">{t('picker.title')}</DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="border-b bg-muted/30 px-4 py-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('picker.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-8 text-sm"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Country + City dropdowns */}
            <div className="mt-2 flex gap-2">
              <Select
                value={selectedCountry}
                onValueChange={(v) => {
                  setSelectedCountry(v === '__all__' ? '' : v);
                  setSelectedCity(''); // reset city when country changes
                }}
              >
                <SelectTrigger className="h-8 flex-1 text-xs">
                  <SelectValue placeholder={t('picker.countryPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{t('picker.allCountries')}</SelectItem>
                  {availableCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedCity}
                onValueChange={(v) => setSelectedCity(v === '__all__' ? '' : v)}
                disabled={availableCities.length === 0}
              >
                <SelectTrigger className="h-8 flex-1 text-xs">
                  <SelectValue placeholder={t('picker.cityPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{t('picker.allCities')}</SelectItem>
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Property list */}
          <div className="max-h-[360px] overflow-y-auto">
            {isLoading ? (
              <div className="space-y-2 p-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex h-16 animate-pulse items-center gap-3 rounded-xl bg-muted"
                  />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <Building2 className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">{t('picker.noProperties')}</p>
                {hasActiveFilters && (
                  <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                    {t('picker.clearFilters')}
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {properties.map((prop) => {
                  const isSelected = value === Number(prop.id);
                  const imgSrc = prop.mainImageUrl
                    ? (resolveMediaUrl(prop.mainImageUrl) ?? prop.mainImageUrl)
                    : null;

                  return (
                    <button
                      key={prop.id}
                      type="button"
                      onClick={() => handleSelect(prop)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors',
                        isSelected
                          ? 'bg-[hsl(var(--gydi-primary))]/10 ring-1 ring-[hsl(var(--gydi-primary))]/30'
                          : 'hover:bg-muted'
                      )}
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                        <PropertyImage src={imgSrc} alt={prop.title} iconSize="h-6 w-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{prop.title}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {prop.city}, {prop.country}
                        </p>
                      </div>

                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 text-[hsl(var(--gydi-primary))]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
