'use client';

import { useState } from 'react';
import { useProperties } from '@/features/properties';
import { PropertyCard } from '@/features/properties/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { CountryCitySelector } from '@/components/shared/country-city-selector';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PropertyType, PropertyStatus } from '@/features/properties/types';

export default function PropertiesPage() {
  const [page, setPage] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minBedrooms, setMinBedrooms] = useState<number | undefined>(undefined);
  const [minBathrooms, setMinBathrooms] = useState<number | undefined>(undefined);
  const [minGuests, setMinGuests] = useState<number | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useProperties({
    filters: {
      status: PropertyStatus.PUBLISHED,
      propertyType: propertyType || undefined,
      country: country || undefined,
      city: city || undefined,
      minPrice,
      maxPrice,
      minBedrooms,
      minBathrooms,
      minGuests,
      searchText: searchText || undefined,
      page,
      size: 12,
    },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      {/* Header Section */}
      <div className="mb-8 sm:mb-10 md:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
          Propiedades en Renta
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Encuentra tu próximo hogar vacacional
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 sm:mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar por título o descripción..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-9 h-11"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="h-11 w-full sm:w-auto"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-4 p-4 sm:p-6 border rounded-lg bg-muted/30">
            {/* Ubicación - Country City Selector */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Ubicación</h4>
              <CountryCitySelector
                countryValue={country}
                cityValue={city}
                onCountryChange={setCountry}
                onCityChange={setCity}
                showLabels={false}
              />
            </div>

            {/* Other Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Propiedad</label>
                <Select value={propertyType || 'ALL'} onValueChange={(v) => setPropertyType(v === 'ALL' ? '' : v as PropertyType)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value={PropertyType.APARTMENT}>Apartamento</SelectItem>
                    <SelectItem value={PropertyType.HOUSE}>Casa</SelectItem>
                    <SelectItem value={PropertyType.VILLA}>Villa</SelectItem>
                    <SelectItem value={PropertyType.CABIN}>Cabaña</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rango de Precio */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Precio Mínimo (USD)</label>
                <Input
                  type="number"
                  placeholder="Ej: 50"
                  value={minPrice || ''}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="h-10"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Precio Máximo (USD)</label>
                <Input
                  type="number"
                  placeholder="Ej: 500"
                  value={maxPrice || ''}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="h-10"
                  min="0"
                />
              </div>

              {/* Specs */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Habitaciones (mín)</label>
                <Select
                  value={minBedrooms?.toString() || 'ALL'}
                  onValueChange={(v) => setMinBedrooms(v === 'ALL' ? undefined : Number(v))}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Cualquiera</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Baños (mín)</label>
                <Select
                  value={minBathrooms?.toString() || 'ALL'}
                  onValueChange={(v) => setMinBathrooms(v === 'ALL' ? undefined : Number(v))}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Cualquiera</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Huéspedes (mín)</label>
                <Select
                  value={minGuests?.toString() || 'ALL'}
                  onValueChange={(v) => setMinGuests(v === 'ALL' ? undefined : Number(v))}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Cualquiera</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="6">6+</SelectItem>
                    <SelectItem value="8">8+</SelectItem>
                    <SelectItem value="10">10+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Properties Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-[350px] sm:h-[400px] rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {data?.content.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                href={`/propiedades/${property.slug || property.id}`}
              />
            ))}
          </div>

          {data?.content.length === 0 && (
            <div className="text-center py-16 sm:py-20">
              <div className="max-w-md mx-auto">
                <p className="text-lg text-muted-foreground mb-2">
                  No se encontraron propiedades
                </p>
                <p className="text-sm text-muted-foreground">
                  Intenta ajustar tus filtros de búsqueda
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 sm:mt-12">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={data.first}
                className="w-full sm:w-auto min-w-[120px]"
              >
                Anterior
              </Button>
              <div className="flex items-center px-4 py-2 bg-muted/50 rounded-md text-sm font-medium">
                Página {data.page + 1} de {data.totalPages}
              </div>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={data.last}
                className="w-full sm:w-auto min-w-[120px]"
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
