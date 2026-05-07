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
import { MultiSelect } from '@/components/ui/multi-select';
import { Separator } from '@/components/ui/separator';
import { CountryCitySelector } from '@/components/shared/country-city-selector';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertCircle,
  HelpCircle,
  FileText,
  Link2,
  MapPin,
  BedDouble,
  Bath,
  Users,
  DollarSign,
  Star,
} from 'lucide-react';
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import {
  createPropertySchema,
  updatePropertySchema,
  type CreatePropertyFormData,
  type UpdatePropertyFormData,
} from '../schemas';
import { useAmenities, useValidateICalUrl } from '../hooks';
import { AiEnhanceButton } from './ai-enhance-button';
import { PropertyType, PropertyListingType, Currency } from '../types';
import { useTranslation } from '@/hooks/use-translation';
import { usePriceField } from '@/hooks/use-price-field';
import { useCurrencyStore } from '@/store/currency-store';
import { CURRENCY_META } from '@/lib/constants/currency-config';

// ── Amenity helper functions (module scope — no component state dependency) ──

const toAmenityKey = (name: string): string =>
  name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');

const getAmenityLabel = (name: string, t: (key: string) => string): string => {
  const translated = t(`form.amenities.names.${toAmenityKey(name)}`);
  return translated.startsWith('form.amenities.names.') ? name : translated;
};

const getCategoryLabel = (category: string, t: (key: string) => string): string => {
  const translated = t(`form.amenities.categories.${category}`);
  return translated.startsWith('form.amenities.categories.') ? category : translated;
};

const getAmenityDescription = (name: string, fallback: string | null, t: (key: string) => string): string | undefined => {
  if (!fallback) return undefined;
  const translated = t(`form.amenities.descriptions.${toAmenityKey(name)}`);
  return translated.startsWith('form.amenities.descriptions.') ? fallback : translated;
};

interface PropertyFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<CreatePropertyFormData | UpdatePropertyFormData>;
  onSubmit: (data: CreatePropertyFormData | UpdatePropertyFormData) => Promise<any> | void;
  isSubmitting?: boolean;
  hideSubmitButton?: boolean;
}

export interface PropertyFormHandle {
  submit: () => void;
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
export const PropertyForm = forwardRef<PropertyFormHandle, PropertyFormProps>(function PropertyForm({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting = false,
  hideSubmitButton = false,
}: PropertyFormProps, ref) {
  const schema = mode === 'create' ? createPropertySchema : updatePropertySchema;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setError,
    setValue,
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

  const { t } = useTranslation('properties');

  const listingTypeValue = watch('listingType');
  const storeCurrency = useCurrencyStore((state) => state.currency);

  // Sync form currency field with Zustand store whenever store changes
  useEffect(() => {
    setValue('currency', storeCurrency as Currency);
  }, [storeCurrency, setValue]);

  const perNightMeta = usePriceField('per-night');
  const saleMeta = usePriceField('sale');

  // Fetch available amenities
  const { data: amenities, isLoading: isLoadingAmenities } = useAmenities();

  // iCal URL validation
  const { mutate: validateICalUrl, isPending: isValidating, data: validationResult } = useValidateICalUrl();
  const [icalUrlValidated, setIcalUrlValidated] = useState<string>('');
  const icalUrlValue = watch('icalUrlAirbnb');
  const titleValue = (watch('title') as string) || '';
  const descriptionValue = (watch('description') as string) || '';

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
        let userMsg = t('form.icalUrl.errors.invalidData');

        if (backendMessage.includes('missing BEGIN:VCALENDAR') || backendMessage.includes('does not contain valid iCal')) {
          userMsg = t('form.icalUrl.errors.missingVcalendar');
        } else if (backendMessage.includes('HTTPS protocol')) {
          userMsg = t('form.icalUrl.errors.notHttps');
        } else if (backendMessage.includes('HTTP 404') || backendMessage.includes('Unable to access')) {
          userMsg = t('form.icalUrl.errors.notFound');
        } else if (backendMessage.includes('Timeout')) {
          userMsg = t('form.icalUrl.errors.timeout');
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

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(handleFormSubmit)(),
  }));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">

      {/* ── Section: Basic Info ── */}
      <section aria-labelledby="section-basic">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-md bg-muted">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <h2 id="section-basic" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t('form.sections.basic')}
          </h2>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium">
              {t('form.title.label')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              {...register('title')}
              placeholder={t('form.title.placeholder')}
              disabled={isSubmitting}
              error={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
              className="text-base"
            />
            {errors.title && (
              <p id="title-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.title.message}
              </p>
            )}
            {!errors.title && titleValue.length >= 10 && (
              <AiEnhanceButton
                field="title"
                currentValue={titleValue}
                onAccept={(enhanced) => setValue('title', enhanced, { shouldValidate: true })}
                disabled={isSubmitting}
                labels={{
                  trigger: t('form.title.ai.trigger'),
                  loading: t('form.title.ai.loading'),
                  badge: t('form.title.ai.badge'),
                  accept: t('form.title.ai.accept'),
                  discard: t('form.title.ai.discard'),
                  error: t('form.title.ai.error'),
                }}
              />
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">
              {t('form.description.label')} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder={t('form.description.placeholder')}
              rows={5}
              disabled={isSubmitting}
              className={errors.description ? 'border-destructive' : ''}
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && (
              <p id="description-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.description.message}
              </p>
            )}
            {!errors.description && descriptionValue.length >= 20 && (
              <AiEnhanceButton
                field="description"
                currentValue={descriptionValue}
                onAccept={(enhanced) => setValue('description', enhanced, { shouldValidate: true })}
                disabled={isSubmitting}
                labels={{
                  trigger: t('form.description.ai.trigger'),
                  loading: t('form.description.ai.loading'),
                  badge: t('form.description.ai.badge'),
                  accept: t('form.description.ai.accept'),
                  discard: t('form.description.ai.discard'),
                  error: t('form.description.ai.error'),
                }}
              />
            )}
          </div>

          {/* Listing Type + Property Type side by side on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="listingType" className="text-sm font-medium">
                {t('form.listingType.label')} <span className="text-destructive">*</span>
              </Label>
              <select
                id="listingType"
                {...register('listingType')}
                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.listingType
                    ? 'border-destructive focus-visible:ring-destructive'
                    : 'border-input focus-visible:ring-ring'
                }`}
                disabled={isSubmitting}
                aria-invalid={errors.listingType ? 'true' : 'false'}
                aria-describedby={errors.listingType ? 'listingType-error' : 'listingType-help'}
              >
                {Object.values(PropertyListingType).map((key) => (
                  <option key={key} value={key}>{t(`form.listingType.options.${key}`)}</option>
                ))}
              </select>
              {errors.listingType ? (
                <p id="listingType-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.listingType.message}
                </p>
              ) : (
                <p id="listingType-help" className="text-xs text-muted-foreground">{t('form.listingType.helper')}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="propertyType" className="text-sm font-medium">
                {t('form.propertyType.label')} <span className="text-destructive">*</span>
              </Label>
              <select
                id="propertyType"
                {...register('propertyType')}
                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.propertyType
                    ? 'border-destructive focus-visible:ring-destructive'
                    : 'border-input focus-visible:ring-ring'
                }`}
                disabled={isSubmitting}
                aria-invalid={errors.propertyType ? 'true' : 'false'}
                aria-describedby={errors.propertyType ? 'propertyType-error' : undefined}
              >
                {Object.values(PropertyType).map((key) => (
                  <option key={key} value={key}>{t(`form.propertyType.options.${key}`)}</option>
                ))}
              </select>
              {errors.propertyType && (
                <p id="propertyType-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.propertyType.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Section: Links ── */}
      <section aria-labelledby="section-links">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-md bg-muted">
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <h2 id="section-links" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t('form.sections.links')}
          </h2>
        </div>

        <div className="space-y-5">
          {/* Airbnb URL */}
          <div className="space-y-1.5">
            <Label htmlFor="airbnbUrl" className="text-sm font-medium">
              {t('form.airbnbUrl.label')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="airbnbUrl"
              {...register('airbnbUrl')}
              placeholder="https://www.airbnb.com/rooms/12345 or https://abnb.me/..."
              disabled={isSubmitting}
              error={!!errors.airbnbUrl}
              aria-describedby={errors.airbnbUrl ? 'airbnbUrl-error' : 'airbnbUrl-help'}
            />
            {errors.airbnbUrl ? (
              <p id="airbnbUrl-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.airbnbUrl.message}
              </p>
            ) : (
              <p id="airbnbUrl-help" className="text-xs text-muted-foreground">{t('form.airbnbUrl.helper')}</p>
            )}
          </div>

          {/* iCal URL */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="icalUrlAirbnb" className="text-sm font-medium">
                {t('form.icalUrl.label')}
              </Label>
              <span className="text-xs text-muted-foreground">({t('form.icalUrl.optional')})</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="inline-flex items-center ml-0.5" aria-label="Ayuda iCal">
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs p-4" side="right">
                    <div className="space-y-2">
                      <p className="font-semibold text-sm">{t('form.icalUrl.tooltip.title')}</p>
                      <ol className="text-xs space-y-1 list-decimal list-inside">
                        <li>{t('form.icalUrl.tooltip.step1')}</li>
                        <li>{t('form.icalUrl.tooltip.step2')}</li>
                        <li>{t('form.icalUrl.tooltip.step3')}</li>
                        <li>{t('form.icalUrl.tooltip.step4')}</li>
                        <li>{t('form.icalUrl.tooltip.step5')}</li>
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
              aria-describedby={errors.icalUrlAirbnb ? 'icalUrlAirbnb-error' : 'icalUrlAirbnb-help'}
              onBlur={handleICalUrlBlur}
            />
            {errors.icalUrlAirbnb && (
              <p id="icalUrlAirbnb-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.icalUrlAirbnb.message}
              </p>
            )}
            {isValidating && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" aria-hidden="true" />
                {t('form.icalUrl.validating')}
              </p>
            )}
            {!isValidating && validationResult && (
              <p className={`text-xs font-medium flex items-center gap-1 ${validationResult.valid ? 'text-green-600' : 'text-destructive'}`}>
                {validationResult.valid ? '✓' : '✗'} {validationResult.message}
              </p>
            )}
            {!errors.icalUrlAirbnb && !isValidating && !validationResult && (
              <p id="icalUrlAirbnb-help" className="text-xs text-muted-foreground">{t('form.icalUrl.helper')}</p>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Section: Location ── */}
      <section aria-labelledby="section-location">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-md bg-muted">
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <h2 id="section-location" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t('form.location.sectionTitle')}
          </h2>
        </div>

        <div className="space-y-5">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-sm font-medium">
                {t('form.location.address.label')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                {...register('address')}
                placeholder={t('form.location.address.placeholder')}
                disabled={isSubmitting}
                error={!!errors.address}
                aria-describedby={errors.address ? 'address-error' : undefined}
              />
              {errors.address && (
                <p id="address-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="postalCode" className="text-sm font-medium">
                {t('form.location.postalCode.label')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="postalCode"
                {...register('postalCode')}
                placeholder={t('form.location.postalCode.placeholder')}
                disabled={isSubmitting}
                error={!!errors.postalCode}
                aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
              />
              {errors.postalCode && (
                <p id="postalCode-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.postalCode.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Section: Property Specs ── */}
      <section aria-labelledby="section-specs">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-md bg-muted">
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </div>
          <h2 id="section-specs" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t('form.details.sectionTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="bedrooms" className="text-sm font-medium flex items-center gap-1.5">
              <BedDouble className="h-3.5 w-3.5 text-muted-foreground" />
              {t('form.details.bedrooms')} <span className="text-destructive">*</span>
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
              <p id="bedrooms-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.bedrooms.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bathrooms" className="text-sm font-medium flex items-center gap-1.5">
              <Bath className="h-3.5 w-3.5 text-muted-foreground" />
              {t('form.details.bathrooms')} <span className="text-destructive">*</span>
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
              <p id="bathrooms-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.bathrooms.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="maxGuests" className="text-sm font-medium flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              {t('form.details.maxGuests')} <span className="text-destructive">*</span>
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
              <p id="maxGuests-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.maxGuests.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Section: Pricing ── */}
      <section aria-labelledby="section-pricing">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-md bg-muted">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <h2 id="section-pricing" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t('form.pricing.sectionTitle')}
          </h2>
        </div>

        {/* Currency badge */}
        <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          <span className="text-xs font-semibold text-green-700">
            {perNightMeta.code} — {CURRENCY_META[perNightMeta.currency]?.name}
          </span>
          <span className="text-xs text-muted-foreground">· {t('form.pricing.currencyBadge', { code: perNightMeta.code, name: CURRENCY_META[perNightMeta.currency]?.name })}</span>
        </div>

        <div className={
          listingTypeValue === PropertyListingType.BOTH
            ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg'
            : 'max-w-xs'
        }>
          {/* pricePerNight — shown for SHORT_TERM_RENTAL and BOTH */}
          {(listingTypeValue === PropertyListingType.SHORT_TERM_RENTAL ||
            listingTypeValue === PropertyListingType.BOTH) && (
            <div className="space-y-1.5">
              <Label htmlFor="pricePerNight" className="text-sm font-medium">
                {t('form.pricing.pricePerNight')} <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center border-[1.5px] border-violet-500 rounded-lg overflow-hidden shadow-[0_0_0_3px_rgba(99,102,241,0.1)]">
                <span className="bg-violet-50 px-3 py-2.5 text-sm text-violet-700 border-r border-violet-200 font-bold select-none">
                  {perNightMeta.code}
                </span>
                <Input
                  id="pricePerNight"
                  type="number"
                  {...register('pricePerNight', { valueAsNumber: true })}
                  min="1"
                  step="0.01"
                  placeholder={perNightMeta.placeholder}
                  disabled={isSubmitting}
                  error={!!errors.pricePerNight}
                  className="border-0 shadow-none rounded-none focus-visible:ring-0"
                  aria-describedby={errors.pricePerNight ? 'pricePerNight-error' : undefined}
                />
              </div>
              {errors.pricePerNight && (
                <p id="pricePerNight-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.pricePerNight.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">{perNightMeta.helperText}</p>
            </div>
          )}

          {/* salePrice — shown for SALE and BOTH */}
          {(listingTypeValue === PropertyListingType.SALE ||
            listingTypeValue === PropertyListingType.BOTH) && (
            <div className="space-y-1.5">
              <Label htmlFor="salePrice" className="text-sm font-medium">
                {t('form.pricing.salePrice')} <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center border-[1.5px] border-cyan-500 rounded-lg overflow-hidden shadow-[0_0_0_3px_rgba(8,145,178,0.08)]">
                <span className="bg-cyan-50 px-3 py-2.5 text-sm text-cyan-700 border-r border-cyan-200 font-bold select-none">
                  {saleMeta.code}
                </span>
                <Input
                  id="salePrice"
                  type="number"
                  {...register('salePrice', { valueAsNumber: true })}
                  min="1"
                  step="0.01"
                  placeholder={saleMeta.placeholder}
                  disabled={isSubmitting}
                  error={!!errors.salePrice}
                  className="border-0 shadow-none rounded-none focus-visible:ring-0"
                  aria-describedby={errors.salePrice ? 'salePrice-error' : undefined}
                />
              </div>
              {errors.salePrice && (
                <p id="salePrice-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.salePrice.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">{saleMeta.helperText}</p>
            </div>
          )}
        </div>
      </section>

      <Separator />

      {/* ── Section: Amenities ── */}
      <section aria-labelledby="section-amenities">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-md bg-muted">
            <Star className="h-4 w-4 text-muted-foreground" />
          </div>
          <h2 id="section-amenities" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t('form.amenities.label')}
          </h2>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="amenities" className="text-sm font-medium">
            {t('form.amenities.label')}
            <span className="ml-1 text-xs text-muted-foreground">({t('form.amenities.selectMultiple')})</span>
          </Label>
          <Controller
            name="amenities"
            control={control}
            render={({ field }: { field: any }) => (
              <MultiSelect
                options={
                  amenities?.map((amenity) => ({
                    value: amenity.name,
                    label: getAmenityLabel(amenity.name, t),
                    description: getAmenityDescription(amenity.name, amenity.description, t),
                    category: getCategoryLabel(amenity.category, t),
                  })) || []
                }
                value={field.value || []}
                onChange={field.onChange}
                placeholder={isLoadingAmenities ? t('form.amenities.loading') : t('form.amenities.placeholder')}
                disabled={isSubmitting || isLoadingAmenities}
                searchPlaceholder={t('form.amenities.search')}
                emptyMessage={t('form.amenities.empty')}
              />
            )}
          />
          {errors.amenities && (
            <p id="amenities-error" className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {errors.amenities.message}
            </p>
          )}
        </div>
      </section>

      {/* Submit Button */}
      {!hideSubmitButton && (
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4 pt-2">
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting
              ? t('form.buttons.saving')
              : mode === 'create'
                ? t('form.buttons.create')
                : t('form.buttons.update')}
          </Button>
        </div>
      )}
    </form>
  );
});
