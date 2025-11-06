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
import {
  createPropertySchema,
  updatePropertySchema,
  type CreatePropertyFormData,
  type UpdatePropertyFormData,
} from '../schemas/property.schema';
import { PropertyType, Currency } from '../types';
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
    formState: { errors },
    watch,
  } = useForm<CreatePropertyFormData | UpdatePropertyFormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      currency: Currency.USD,
      propertyType: PropertyType.APARTMENT,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      amenities: [],
    },
  });

  // Fetch available amenities
  const { data: amenities, isLoading: isLoadingAmenities } = useAmenities();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe your property..."
          rows={5}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Price & Currency */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pricePerNight">
            Price per Night <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pricePerNight"
            type="number"
            step="0.01"
            {...register('pricePerNight', { valueAsNumber: true })}
            placeholder="150"
            disabled={isSubmitting}
          />
          {errors.pricePerNight && (
            <p className="text-sm text-destructive">{errors.pricePerNight.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">
            Currency <span className="text-destructive">*</span>
          </Label>
          <select
            id="currency"
            {...register('currency')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
          >
            {Object.values(Currency).map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
          {errors.currency && <p className="text-sm text-destructive">{errors.currency.message}</p>}
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <Label htmlFor="propertyType">
          Property Type <span className="text-destructive">*</span>
        </Label>
        <select
          id="propertyType"
          {...register('propertyType')}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
        >
          {Object.values(PropertyType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.propertyType && (
          <p className="text-sm text-destructive">{errors.propertyType.message}</p>
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
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            {...register('address')}
            placeholder="123 Ocean Drive"
            disabled={isSubmitting}
          />
          {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            {...register('postalCode')}
            placeholder="33139"
            disabled={isSubmitting}
          />
          {errors.postalCode && (
            <p className="text-sm text-destructive">{errors.postalCode.message}</p>
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
            />
            {errors.bedrooms && (
              <p className="text-sm text-destructive">{errors.bedrooms.message}</p>
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
            />
            {errors.bathrooms && (
              <p className="text-sm text-destructive">{errors.bathrooms.message}</p>
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
            />
            {errors.maxGuests && (
              <p className="text-sm text-destructive">{errors.maxGuests.message}</p>
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
        <p className="text-xs text-muted-foreground">
          Select all amenities available at your property. You can search and select multiple items.
        </p>
        {errors.amenities && (
          <p className="text-sm text-destructive">{errors.amenities.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Property' : 'Update Property'}
        </Button>
      </div>
    </form>
  );
}
