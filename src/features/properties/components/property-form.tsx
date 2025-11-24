/**
 * PropertyForm Component
 * Form for creating and editing properties with React Hook Form + Zod
 */

'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { CountryCitySelector } from '@/components/shared/country-city-selector';
import { AlertCircle } from 'lucide-react';
import {
  createPropertySchema,
  updatePropertySchema,
  type CreatePropertyFormData,
  type UpdatePropertyFormData,
} from '../schemas/property.schema';
import { PropertyType, PropertyListingType, Currency, LISTING_TYPE_LABELS } from '../types';
import { useAmenities } from '../hooks/use-amenities';

interface PropertyFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<CreatePropertyFormData | UpdatePropertyFormData>;
  onSubmit: (data: CreatePropertyFormData | UpdatePropertyFormData) => void;
  isSubmitting?: boolean;
}

/**
 * Property Form Component
 * Handles both create and edit modes with validation
 *
 * @example
 * ```tsx
 * <PropertyForm
 *   mode="create"
 *   onSubmit={(data) => createMutation.mutate(data)}
 *   isSubmitting={createMutation.isPending}
 * />
 * ```
 */
export function PropertyForm({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting = false,
}: PropertyFormProps) {
  const schema = mode === 'create' ? createPropertySchema : updatePropertySchema;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields },
    watch,
  } = useForm<CreatePropertyFormData | UpdatePropertyFormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched', // Validate immediately when field is touched
    reValidateMode: 'onChange', // Re-validate on every change after first validation
    defaultValues: defaultValues || {
      currency: Currency.USD,
      propertyType: PropertyType.APARTMENT,
      listingType: PropertyListingType.SHORT_TERM_RENTAL,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      amenities: [],
    },
  });

  // Fetch available amenities
  const { data: amenities, isLoading: isLoadingAmenities } = useAmenities();

  // Debug wrapper for onSubmit
  const handleFormSubmit = (data: CreatePropertyFormData | UpdatePropertyFormData) => {
    console.log('=== HANDLESUBMIT WRAPPER CALLED ===');
    console.log('Data received:', data);
    console.log('Calling parent onSubmit...');
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Beautiful beach house with ocean view"
          disabled={isSubmitting}
          error={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
            <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-red-600" style={{ color: '#dc2626' }}>*</span>
        </Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe your property..."
          rows={5}
          disabled={isSubmitting}
          error={!!errors.description}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && (
          <p id="description-error" className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
            <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Listing Type - DESPUÉS DE DESCRIPCIÓN */}
      <div className="space-y-2">
        <Label htmlFor="listingType">
          Tipo de Publicación <span className="text-destructive">*</span>
        </Label>
        <select
          id="listingType"
          {...register('listingType')}
          className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.listingType
            ? 'border-destructive focus-visible:ring-destructive'
            : 'border-input focus-visible:ring-ring'
            }`}
          disabled={isSubmitting}
          aria-invalid={errors.listingType ? 'true' : 'false'}
          aria-describedby={errors.listingType ? 'listingType-error' : undefined}
        >
          {Object.entries(LISTING_TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        {errors.listingType && (
          <p id="listingType-error" className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
            <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
            {errors.listingType.message}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          Define si la propiedad es para renta corta, venta, o ambas opciones
        </p>
      </div>

      {/* Precios Condicionales */}
      <div className="space-y-4">
        {/* Precio por Noche - Si es RENTA CORTA o AMBAS */}
        {(watch('listingType') === PropertyListingType.SHORT_TERM_RENTAL ||
          watch('listingType') === PropertyListingType.BOTH) && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pricePerNight">
                  Precio por Noche <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="pricePerNight"
                  type="number"
                  step="0.01"
                  {...register('pricePerNight', { valueAsNumber: true })}
                  placeholder="150"
                  disabled={isSubmitting}
                  error={!!errors.pricePerNight}
                  aria-describedby={errors.pricePerNight ? 'pricePerNight-error' : undefined}
                />
                {errors.pricePerNight && (
                  <p id="pricePerNight-error" className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
                    <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
                    {errors.pricePerNight.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">
                  Moneda <span className="text-destructive">*</span>
                </Label>
                <select
                  id="currency"
                  {...register('currency')}
                  className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.currency
                    ? 'border-destructive focus-visible:ring-destructive'
                    : 'border-input focus-visible:ring-ring'
                    }`}
                  disabled={isSubmitting}
                  aria-invalid={errors.currency ? 'true' : 'false'}
                  aria-describedby={errors.currency ? 'currency-error' : undefined}
                >
                  {Object.values(Currency).map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </select>
                {errors.currency && (
                  <p id="currency-error" className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
                    <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
                    {errors.currency.message}
                  </p>
                )}
              </div>
            </div>
          )}

        {/* Precio de Venta - Si es VENTA o AMBAS */}
        {(watch('listingType') === PropertyListingType.SALE ||
          watch('listingType') === PropertyListingType.BOTH) && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salePrice">
                  Precio de Venta <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  {...register('salePrice', { valueAsNumber: true })}
                  placeholder="250000"
                  disabled={isSubmitting}
                  error={!!errors.salePrice}
                  aria-describedby={errors.salePrice ? 'salePrice-error' : undefined}
                />
                {errors.salePrice && (
                  <p id="salePrice-error" className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
                    <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
                    {errors.salePrice.message}
                  </p>
                )}
              </div>

              {/* Moneda solo aparece si NO se mostró arriba */}
              {watch('listingType') !== PropertyListingType.BOTH && (
                <div className="space-y-2">
                  <Label htmlFor="currency">
                    Moneda <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="currency"
                    {...register('currency')}
                    className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.currency
                      ? 'border-destructive focus-visible:ring-destructive'
                      : 'border-input focus-visible:ring-ring'
                      }`}
                    disabled={isSubmitting}
                    aria-invalid={errors.currency ? 'true' : 'false'}
                    aria-describedby={errors.currency ? 'currency-error' : undefined}
                  >
                    {Object.values(Currency).map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                  {errors.currency && (
                    <p id="currency-error" className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
                      <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
                      {errors.currency.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <Label htmlFor="propertyType">
          Property Type <span className="text-destructive">*</span>
        </Label>
        <select
          id="propertyType"
          {...register('propertyType')}
          className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.propertyType
            ? 'border-destructive focus-visible:ring-destructive'
            : 'border-input focus-visible:ring-ring'
            }`}
          disabled={isSubmitting}
          aria-invalid={errors.propertyType ? 'true' : 'false'}
          aria-describedby={errors.propertyType ? 'propertyType-error' : undefined}
        >
          {Object.values(PropertyType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.propertyType && (
          <p id="propertyType-error" className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
            <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
            {errors.propertyType.message}
          </p>
        )}
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Location</h3>

        <Controller
          name="country"
          control={control}
          render={({ field: countryField }: { field: any }) => (
            <Controller
              name="city"
              control={control}
              render={({ field: cityField }: { field: any }) => (
                <CountryCitySelector
                  countryValue={countryField.value || ''}
                  cityValue={cityField.value || ''}
                  onCountryChange={countryField.onChange}
                  onCityChange={cityField.onChange}
                  disabled={isSubmitting}
                  required
                  countryError={errors.country?.message}
                  cityError={errors.city?.message}
                  showLabels
                />
              )}
            />
          )}
        />

        <div className="space-y-2">
          <Label htmlFor="address">
            Address <span className="text-red-600" style={{ color: '#dc2626' }}>*</span>
          </Label>
          <Input
            id="address"
            {...register('address')}
            placeholder="123 Ocean Drive"
            disabled={isSubmitting}
            error={!!errors.address}
            aria-describedby={errors.address ? 'address-error' : undefined}
          />
          {errors.address && (
            <p id="address-error" className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
              <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">
            Postal Code <span className="text-red-600" style={{ color: '#dc2626' }}>*</span>
          </Label>
          <Input
            id="postalCode"
            {...register('postalCode')}
            placeholder="33139"
            disabled={isSubmitting}
            error={!!errors.postalCode}
            aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
          />
          {errors.postalCode && (
            <p id="postalCode-error" className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
              <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
              {errors.postalCode.message}
            </p>
          )}
        </div>
      </div>

      {/* Property Specs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Property Details</h3>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">
              Bedrooms <span className="text-destructive">*</span>
            </Label>
            <Input
              id="bedrooms"
              type="number"
              {...register('bedrooms', { valueAsNumber: true })}
              min="0"
              disabled={isSubmitting}
              error={!!errors.bedrooms}
              aria-describedby={errors.bedrooms ? 'bedrooms-error' : undefined}
            />
            {errors.bedrooms && (
              <p id="bedrooms-error" className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
                <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
                {errors.bedrooms.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bathrooms">
              Bathrooms <span className="text-destructive">*</span>
            </Label>
            <Input
              id="bathrooms"
              type="number"
              {...register('bathrooms', { valueAsNumber: true })}
              min="0"
              disabled={isSubmitting}
              error={!!errors.bathrooms}
              aria-describedby={errors.bathrooms ? 'bathrooms-error' : undefined}
            />
            {errors.bathrooms && (
              <p id="bathrooms-error" className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
                <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
                {errors.bathrooms.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxGuests">
              Max Guests <span className="text-destructive">*</span>
            </Label>
            <Input
              id="maxGuests"
              type="number"
              {...register('maxGuests', { valueAsNumber: true })}
              min="1"
              disabled={isSubmitting}
              error={!!errors.maxGuests}
              aria-describedby={errors.maxGuests ? 'maxGuests-error' : undefined}
            />
            {errors.maxGuests && (
              <p id="maxGuests-error" className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
                <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
                {errors.maxGuests.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-2">
        <Label htmlFor="amenities">
          Amenities <span className="text-sm text-muted-foreground">(select multiple)</span>
        </Label>
        <Controller
          name="amenities"
          control={control}
          render={({ field }: { field: any }) => (
            <MultiSelect
              options={
                amenities?.map((amenity) => ({
                  value: amenity.name,
                  label: amenity.name,
                  description: amenity.description || undefined,
                  category: amenity.category,
                })) || []
              }
              value={field.value || []}
              onChange={field.onChange}
              placeholder={
                isLoadingAmenities
                  ? 'Loading amenities...'
                  : 'Select amenities...'
              }
              disabled={isSubmitting || isLoadingAmenities}
              searchPlaceholder="Search amenities..."
              emptyMessage="No amenities found."
            />
          )}
        />
        {errors.amenities && (
          <p id="amenities-error" className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
            <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
            {errors.amenities.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={() => {
            console.log('🔘 Submit button clicked!');
            console.log('📝 Current form errors:', errors);
            console.log('❌ Has validation errors:', Object.keys(errors).length > 0);
            console.log('⏳ Is submitting:', isSubmitting);
          }}
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Property' : 'Update Property'}
        </Button>
      </div>
    </form>
  );
}
