/**
 * CountryCitySelector Component
 * Dependent selector for Country and City with autocomplete
 */

'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COUNTRIES_CITIES, getCitiesByCountry } from '@/lib/data/countries-cities';

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
 * Dependent selector where cities update based on selected country
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
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [internalCountry, setInternalCountry] = useState(countryValue);
  const [internalCity, setInternalCity] = useState(cityValue);

  // Sync internal state with external props whenever they provide a valid value
  // This allows the component to react to late-loading data or parent updates
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

  const handleCountryChange = (value: string) => {
    if (value === 'ALL') {
      setInternalCountry('');
      setInternalCity('');
      onCountryChange('');
      onCityChange('');
    } else {
      setInternalCountry(value);
      onCountryChange(value);
      // When user manually changes country, reset city
      // Check if current city exists in new country's cities
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

  return (
    <div className={`grid gap-4 md:grid-cols-2 ${className}`}>
      {/* Country Selector */}
      <div className="space-y-2">
        {showLabels && (
          <Label htmlFor="country">
            Country {required && <span className="text-red-600" style={{ color: '#dc2626' }}>*</span>}
          </Label>
        )}
        <Select
          value={internalCountry && internalCountry.trim() !== '' ? internalCountry : 'ALL'}
          onValueChange={handleCountryChange}
          disabled={disabled}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Selecciona un país" />
          </SelectTrigger>
          <SelectContent>
            {!required && <SelectItem value="ALL">Todos los países</SelectItem>}
            {COUNTRIES_CITIES.map((country) => (
              <SelectItem key={country.code} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {countryError && (
          <p className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
            <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
            {countryError}
          </p>
        )}
      </div>

      {/* City Selector */}
      <div className="space-y-2">
        {showLabels && (
          <Label htmlFor="city">
            City {required && <span className="text-red-600" style={{ color: '#dc2626' }}>*</span>}
          </Label>
        )}
        <Select
          value={internalCity && internalCity.trim() !== '' ? internalCity : 'ALL'}
          onValueChange={handleCityChange}
          disabled={disabled || !internalCountry}
        >
          <SelectTrigger className="h-10">
            <SelectValue
              placeholder={
                internalCountry
                  ? 'Selecciona una ciudad'
                  : 'Primero selecciona un país'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {!required && <SelectItem value="ALL">Todas las ciudades</SelectItem>}
            {availableCities.length > 0 ? (
              availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))
            ) : (
              internalCountry && (
                <SelectItem value="no-cities" disabled>
                  No hay ciudades disponibles
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        {cityError && (
          <p className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
            <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
            {cityError}
          </p>
        )}</div>
    </div>
  );
}