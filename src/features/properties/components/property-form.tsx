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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import {
  createPropertySchema,
  updatePropertySchema,
  type CreatePropertyFormData,
  type UpdatePropertyFormData,
} from '../schemas';
import { useAmenities, useValidateICalUrl } from '../hooks';
import { PropertyType, PropertyListingType, Currency, LISTING_TYPE_LABELS } from '../types';

interface PropertyFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<CreatePropertyFormData | UpdatePropertyFormData>;
  onSubmit: (data: CreatePropertyFormData | UpdatePropertyFormData) => Promise<any> | void;
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
 *   onSubmit={(data) => createMutation.mutateAsync(data)}
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
    setError,
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
      airbnbUrl: '',
      icalUrlAirbnb: '',
    },
  });

  // Fetch available amenities
  const { data: amenities, isLoading: isLoadingAmenities } = useAmenities();

  // iCal URL validation
  const { mutate: validateICalUrl, isPending: isValidating, data: validationResult } = useValidateICalUrl();
  const [icalUrlValidated, setIcalUrlValidated] = useState<string>('');
  const icalUrlValue = watch('icalUrlAirbnb');

  // Validate iCal URL on blur
  const handleICalUrlBlur = () => {
    const url = icalUrlValue as string | undefined;
    if (url && url.trim() && url !== icalUrlValidated) {
      validateICalUrl({ icalUrl: url }, {
        onSuccess: () => {
          setIcalUrlValidated(url);
        }
      });
    }
  };

  const handleFormSubmit = async (data: CreatePropertyFormData | UpdatePropertyFormData) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      // Extract backend error data safely
      const backendData = error?.response?.data;
      const backendMessage = backendData?.message || error?.message || '';

      // Check for iCal URL errors (case insensitive)
      const isICalError =
        backendMessage.toLowerCase().includes('ical url') ||
        backendMessage.toLowerCase().includes('ical data') ||
        backendMessage.toLowerCase().includes('begin:vcalendar');

      if (isICalError) {
        let userMsg = 'El enlace no contiene datos válidos de iCal';

        if (backendMessage.includes('missing BEGIN:VCALENDAR') || backendMessage.includes('does not contain valid iCal')) {
          userMsg = 'El enlace no contiene datos válidos de iCal (falta BEGIN:VCALENDAR)';
        } else if (backendMessage.includes('HTTPS protocol')) {
          userMsg = 'El enlace debe ser seguro (comenzar con https://)';
        } else if (backendMessage.includes('HTTP 404') || backendMessage.includes('Unable to access')) {
          userMsg = 'No pudimos acceder al enlace (Error 404). Verifica que sea público.';
        } else if (backendMessage.includes('Timeout')) {
          userMsg = 'Tardó demasiado en responder. Inténtalo de nuevo.';
        }

        // Set error on the field
        setError('icalUrlAirbnb', {
          type: 'manual',
          message: userMsg
        }, { shouldFocus: true });

        // Force scroll to the field with a slight delay to ensure UI update
        setTimeout(() => {
          const element = document.getElementById('icalUrlAirbnb');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
            // Add a temporary highlight effect
            element.classList.add('ring-2', 'ring-red-500', 'ring-offset-2');
            setTimeout(() => element.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2'), 2000);
          }
        }, 100);
      }
    }
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
          className={errors.description ? 'border-red-600' : ''}
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

      {/* Airbnb URL - Shown in both create and edit modes */}
      <div className="space-y-2">
        <Label htmlFor="airbnbUrl">
          Airbnb URL <span className="text-destructive">*</span>
        </Label>
        <Input
          id="airbnbUrl"
          {...register('airbnbUrl')}
          placeholder="https://www.airbnb.com/rooms/12345 or https://abnb.me/..."
          disabled={isSubmitting}
          error={!!errors.airbnbUrl}
          aria-describedby={errors.airbnbUrl ? 'airbnbUrl-error' : undefined}
        />
        {errors.airbnbUrl && (
          <p id="airbnbUrl-error" className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
            <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
            {errors.airbnbUrl.message}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          Paste the URL from the Airbnb listing (mobile or web links supported)
        </p>
      </div>

      {/* Airbnb iCal URL - Optional */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="icalUrlAirbnb">
            Airbnb iCal URL <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="inline-flex items-center">
                  <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-4" side="right">
                <div className="space-y-2">
                  <p className="font-semibold text-sm">¿Cómo obtener tu link iCal desde Airbnb?</p>
                  <ol className="text-xs space-y-1 list-decimal list-inside">
                    <li>Entra a tu cuenta de Airbnb y abre la propiedad que deseas sincronizar.</li>
                    <li>Ve al menú Calendario.</li>
                    <li>Haz clic en Exportar calendario (o Export Calendar).</li>
                    <li>Copia el enlace que Airbnb te genera en formato .ics.</li>
                    <li>Pégalo aquí para sincronizar tu disponibilidad automáticamente.</li>
                  </ol>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="icalUrlAirbnb"
          {...register('icalUrlAirbnb')}
          placeholder="https://www.airbnb.com/calendar/ical/..."
          disabled={isSubmitting}
          error={!!errors.icalUrlAirbnb}
          aria-describedby={errors.icalUrlAirbnb ? 'icalUrlAirbnb-error' : undefined}
          onBlur={handleICalUrlBlur}
        />
        {errors.icalUrlAirbnb && (
          <p id="icalUrlAirbnb-error" className="text-sm text-red-600 font-bold flex items-center gap-1" style={{ color: '#dc2626' }}>
            <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
            {errors.icalUrlAirbnb.message}
          </p>
        )}
        {/* Validation feedback */}
        {isValidating && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <span className="animate-spin">⏳</span>
            Validating iCal URL...
          </p>
        )}
        {!isValidating && validationResult && (
          <p className={`text-sm font-medium flex items-center gap-1 ${validationResult.valid ? 'text-green-600' : 'text-red-600'
            }`}>
            {validationResult.valid ? '✓' : '✗'} {validationResult.message}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          Paste the iCal URL from Airbnb to sync availability
        </p>
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
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Property' : 'Update Property'}
        </Button>
      </div>
    </form>
  );
}
