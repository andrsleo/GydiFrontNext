/**
 * CountryCitySelector Component
 * Dependent selector for Country and City with autocomplete
 */

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { AlertCircle, ChevronDown, Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { COUNTRIES_CITIES, getCitiesByCountry } from '@/lib/data/countries-cities';
import { useTranslation } from '@/hooks/use-translation';
import { useLocaleStore } from '@/store/locale-store';

interface CountryCitySelectorProps {
  countryValue: string;
  cityValue: string;
  onCountryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  countryError?: string;
  cityError?: string;
  showLabels?: boolean;
  className?: string;
}

/**
 * CountryCitySelector Component
 *
 * Dependent selector where cities update based on selected country.
 * Country uses a searchable combobox; city uses a Select or free-text Input
 * as a fallback when the country has no predefined cities.
 *
 * @example
 * ```tsx
 * <CountryCitySelector
 *   countryValue={country}
 *   cityValue={city}
 *   onCountryChange={(value) => setCountry(value)}
 *   onCityChange={(value) => setCity(value)}
 *   required
 * />
 * ```
 */
export function CountryCitySelector({
  countryValue,
  cityValue,
  onCountryChange,
  onCityChange,
  disabled = false,
  required = false,
  countryError,
  cityError,
  showLabels = true,
  className = '',
}: CountryCitySelectorProps) {
  const { t } = useTranslation('common');
  const locale = useLocaleStore((state) => state.locale);

  // Intl.DisplayNames for country name translation
  const displayNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([locale], { type: 'region' });
    } catch {
      return null;
    }
  }, [locale]);

  const getDisplayName = (code: string, fallback: string): string =>
    displayNames?.of(code) ?? fallback;

  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [internalCountry, setInternalCountry] = useState(countryValue);
  const [internalCity, setInternalCity] = useState(cityValue);

  // Combobox state
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync internal state with external props whenever they provide a valid value
  useEffect(() => {
    if (countryValue && countryValue !== internalCountry) {
      setInternalCountry(countryValue);
    }
  }, [countryValue, internalCountry]);

  useEffect(() => {
    if (cityValue && cityValue !== internalCity) {
      setInternalCity(cityValue);
    }
  }, [cityValue, internalCity]);

  // Update available cities when country changes
  useEffect(() => {
    if (internalCountry) {
      const cities = getCitiesByCountry(internalCountry);
      setAvailableCities(cities);
    } else {
      setAvailableCities([]);
    }
  }, [internalCountry]);

  // Focus search input when combobox opens
  useEffect(() => {
    if (isCountryOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isCountryOpen]);

  const handleCountryChange = (value: string) => {
    if (value === 'ALL' || value === '') {
      setInternalCountry('');
      setInternalCity('');
      onCountryChange('');
      onCityChange('');
    } else {
      setInternalCountry(value);
      onCountryChange(value);
      // When user manually changes country, reset city if it doesn't exist in new country
      const newCities = getCitiesByCountry(value);
      if (internalCity && !newCities.includes(internalCity)) {
        setInternalCity('');
        onCityChange('');
      }
    }
  };

  const handleCityChange = (value: string) => {
    if (value === 'ALL') {
      setInternalCity('');
      onCityChange('');
    } else {
      setInternalCity(value);
      onCityChange(value);
    }
  };

  const handleCityTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalCity(e.target.value);
    onCityChange(e.target.value);
  };

  const handleSelectCountry = (name: string) => {
    setIsCountryOpen(false);
    setCountrySearch('');
    handleCountryChange(name);
  };

  const handleClearCountry = () => {
    setIsCountryOpen(false);
    setCountrySearch('');
    handleCountryChange('ALL');
  };

  // Filtered countries based on search (matches translated name or English name)
  const filteredCountries = COUNTRIES_CITIES.filter((c) => {
    const translated = getDisplayName(c.code, c.name).toLowerCase();
    const query = countrySearch.toLowerCase();
    return translated.includes(query) || c.name.toLowerCase().includes(query);
  });

  // Whether city should use free-text Input (country selected but has no predefined cities)
  const useCityFreeText =
    internalCountry.trim() !== '' && availableCities.length === 0;

  return (
    <div className={`grid gap-4 md:grid-cols-2 ${className}`}>
      {/* Country Combobox */}
      <div className="space-y-2">
        {showLabels && (
          <Label htmlFor="country">
            {t('location.country')}{' '}
            {required && (
              <span className="text-red-600" style={{ color: '#dc2626' }}>
                *
              </span>
            )}
          </Label>
        )}

        <div className="relative">
          {/* Trigger button */}
          <button
            id="country"
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setIsCountryOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isCountryOpen}
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background',
              'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              !internalCountry && 'text-muted-foreground'
            )}
          >
            <span className="truncate">
              {internalCountry
                ? getDisplayName(
                    COUNTRIES_CITIES.find((c) => c.name === internalCountry)?.code ?? '',
                    internalCountry
                  )
                : t('location.selectCountry')}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 opacity-50 transition-transform',
                isCountryOpen && 'rotate-180'
              )}
            />
          </button>

          {/* Dropdown */}
          {isCountryOpen && !disabled && (
            <>
              <div className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-lg max-h-60 overflow-hidden flex flex-col">
                {/* Search input */}
                <div className="p-2 border-b">
                  <Input
                    ref={searchInputRef}
                    placeholder={t('location.searchCountry')}
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>

                {/* Options list */}
                <ul
                  role="listbox"
                  className="overflow-y-auto flex-1 py-1"
                >
                  {!required && (
                    <li>
                      <button
                        type="button"
                        role="option"
                        aria-selected={internalCountry === ''}
                        onClick={handleClearCountry}
                        className={cn(
                          'w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-accent transition-colors',
                          internalCountry === '' && 'bg-accent'
                        )}
                      >
                        <span className="flex-1">{t('location.allCountries')}</span>
                        {internalCountry === '' && (
                          <Check className="h-4 w-4 shrink-0" />
                        )}
                      </button>
                    </li>
                  )}

                  {filteredCountries.length === 0 ? (
                    <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                      {t('location.noCountriesFound')}
                    </li>
                  ) : (
                    filteredCountries.map((country) => (
                      <li key={country.code}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={internalCountry === country.name}
                          onClick={() => handleSelectCountry(country.name)}
                          className={cn(
                            'w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-accent transition-colors',
                            internalCountry === country.name && 'bg-accent'
                          )}
                        >
                          <span className="flex-1">{getDisplayName(country.code, country.name)}</span>
                          {internalCountry === country.name && (
                            <Check className="h-4 w-4 shrink-0" />
                          )}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* Backdrop to close on outside click */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => {
                  setIsCountryOpen(false);
                  setCountrySearch('');
                }}
                aria-hidden="true"
              />
            </>
          )}
        </div>

        {countryError && (
          <p
            className="text-sm text-red-600 font-bold flex items-center gap-1"
            style={{ color: '#dc2626' }}
          >
            <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
            {countryError}
          </p>
        )}
      </div>

      {/* City Selector */}
      <div className="space-y-2">
        {showLabels && (
          <Label htmlFor="city">
            {t('location.city')}{' '}
            {required && (
              <span className="text-red-600" style={{ color: '#dc2626' }}>
                *
              </span>
            )}
          </Label>
        )}

        {useCityFreeText ? (
          /* Free-text input when country has no predefined cities */
          <Input
            id="city"
            value={internalCity}
            onChange={handleCityTextChange}
            placeholder={t('location.enterCity')}
            disabled={disabled}
            className={cityError ? 'border-red-600' : ''}
          />
        ) : (
          /* Select with predefined cities */
          <Select
            value={internalCity && internalCity.trim() !== '' ? internalCity : 'ALL'}
            onValueChange={handleCityChange}
            disabled={disabled || !internalCountry}
          >
            <SelectTrigger className="h-10">
              <SelectValue
                placeholder={
                  internalCountry
                    ? t('location.selectCity')
                    : t('location.selectCountryFirst')
                }
              />
            </SelectTrigger>
            <SelectContent>
              {!required && <SelectItem value="ALL">{t('location.allCities')}</SelectItem>}
              {availableCities.length > 0 ? (
                availableCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))
              ) : (
                internalCountry && (
                  <SelectItem value="no-cities" disabled>
                    {t('location.noCitiesAvailable')}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        )}

        {cityError && (
          <p
            className="text-sm text-red-600 font-bold flex items-center gap-1"
            style={{ color: '#dc2626' }}
          >
            <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
            {cityError}
          </p>
        )}
      </div>
    </div>
  );
}
