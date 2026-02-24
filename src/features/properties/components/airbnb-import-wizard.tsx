/**
 * Airbnb Import Wizard
 * Multi-step wizard for importing properties from Airbnb
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle, Check, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CountryCitySelector } from '@/components/shared/country-city-selector';

import { useValidateAirbnbUrl } from '../hooks/use-validate-airbnb-url';
import { useImportFromAirbnb } from '../hooks/use-import-from-airbnb';
import { validateAirbnbUrlSchema, importFromAirbnbSchema, type ValidateAirbnbUrlFormData, type ImportFromAirbnbFormData } from '../schemas/property.schema';
import type { ValidateAirbnbUrlResponse } from '../types';
import { PropertyType, PropertyListingType, Currency } from '../types';

export function AirbnbImportWizard() {
  const router = useRouter();
  const [step, setStep] = useState<'url' | 'form' | 'importing'>('url');
  const [validationResult, setValidationResult] = useState<ValidateAirbnbUrlResponse | null>(null);

  // Step 1: Validate URL form
  const urlForm = useForm<ValidateAirbnbUrlFormData>({
    resolver: zodResolver(validateAirbnbUrlSchema),
    defaultValues: {
      airbnbUrl: '',
    },
  });

  // Step 2: Import form
  const importForm = useForm<ImportFromAirbnbFormData>({
    resolver: zodResolver(importFromAirbnbSchema),
    defaultValues: {
      airbnbUrl: '',
      priceAmount: 0,
      priceCurrency: Currency.USD,
      country: '',
      city: '',
      address: '',
      postalCode: '',
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      propertyType: PropertyType.APARTMENT,
      listingType: PropertyListingType.SHORT_TERM_RENTAL,
    },
  });

  const {
    control: importControl,
    formState: { errors: importErrors },
  } = importForm;

  // Mutations
  const validateMutation = useValidateAirbnbUrl({
    onSuccess: (data) => {
      if (data.valid) {
        setValidationResult(data);
        // Pre-fill form with extracted data
        importForm.setValue('airbnbUrl', urlForm.getValues('airbnbUrl'));

        // Basic info
        if (data.title) {
          importForm.setValue('titleOverride', data.title);
        }
        if (data.description) {
          importForm.setValue('descriptionOverride', data.description);
        }

        // Specs - only set if extracted
        if (data.bedrooms !== undefined && data.bedrooms !== null) {
          importForm.setValue('bedrooms', data.bedrooms);
        }
        if (data.bathrooms !== undefined && data.bathrooms !== null) {
          importForm.setValue('bathrooms', Math.floor(data.bathrooms)); // Convert to int
        }
        if (data.maxGuests !== undefined && data.maxGuests !== null) {
          importForm.setValue('maxGuests', data.maxGuests);
        }

        // Location
        if (data.country) {
          importForm.setValue('country', data.country);
        }
        if (data.city) {
          importForm.setValue('city', data.city);
        }
        if (data.address) {
          importForm.setValue('address', data.address);
        }

        // Amenities
        if (data.amenities && data.amenities.length > 0) {
          importForm.setValue('additionalAmenities', data.amenities);
        }

        setStep('form');
      }
    },
  });

  const importMutation = useImportFromAirbnb({
    onSuccess: (data) => {
      router.push(`/dashboard/propiedades/${data.id}`);
    },
  });

  // Handlers
  const handleValidateUrl = (data: ValidateAirbnbUrlFormData) => {
    validateMutation.mutate(data);
  };

  const handleImport = (data: ImportFromAirbnbFormData) => {
    setStep('importing');
    importMutation.mutate(data);
  };

  const handleBack = () => {
    setStep('url');
    setValidationResult(null);
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Import from Airbnb</CardTitle>
          <CardDescription>
            Import property details from an Airbnb listing URL
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: URL Validation */}
          {step === 'url' && (
            <Form {...urlForm}>
              <form onSubmit={urlForm.handleSubmit(handleValidateUrl)} className="space-y-6">
                <FormField
                  control={urlForm.control}
                  name="airbnbUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Airbnb Listing URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.airbnb.com/rooms/12345"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Paste the URL of the Airbnb listing you want to import
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={validateMutation.isPending}
                  className="w-full"
                >
                  {validateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating URL...
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}

          {/* Step 2: Import Form */}
          {step === 'form' && validationResult && (
            <div className="space-y-6">
              {/* Preview of extracted data */}
              <Alert>
                <Check className="h-4 w-4" />
                <AlertTitle>Listing Found</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1">
                    <p><strong>Listing ID:</strong> {validationResult.listingId}</p>
                    {validationResult.title && (
                      <p><strong>Title:</strong> {validationResult.title}</p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>

              {/* Additional information form */}
              <Form {...importForm}>
                <form onSubmit={importForm.handleSubmit(handleImport)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                      control={importForm.control}
                      name="priceAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per Night</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={importForm.control}
                      name="priceCurrency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <FormControl>
                            <select {...field} className="w-full rounded-md border border-input bg-background px-3 py-2">
                              <option value={Currency.USD}>USD</option>
                              <option value={Currency.EUR}>EUR</option>
                              <option value={Currency.MXN}>MXN</option>
                              <option value={Currency.COP}>COP</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Country + City using CountryCitySelector */}
                  <Controller
                    name="country"
                    control={importControl}
                    render={({ field: countryField }) => (
                      <Controller
                        name="city"
                        control={importControl}
                        render={({ field: cityField }) => (
                          <CountryCitySelector
                            countryValue={countryField.value || ''}
                            cityValue={cityField.value || ''}
                            onCountryChange={countryField.onChange}
                            onCityChange={cityField.onChange}
                            disabled={importMutation.isPending}
                            required
                            countryError={importErrors.country?.message}
                            cityError={importErrors.city?.message}
                            showLabels
                          />
                        )}
                      />
                    )}
                  />

                  <FormField
                    control={importForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <FormField
                      control={importForm.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={importForm.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={importForm.control}
                      name="maxGuests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Guests</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={importForm.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full rounded-md border border-input bg-background px-3 py-2">
                            <option value={PropertyType.APARTMENT}>Apartment</option>
                            <option value={PropertyType.HOUSE}>House</option>
                            <option value={PropertyType.VILLA}>Villa</option>
                            <option value={PropertyType.CABIN}>Cabin</option>
                            <option value={PropertyType.STUDIO}>Studio</option>
                            <option value={PropertyType.CONDO}>Condo</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={importMutation.isPending}
                      className="flex-1"
                    >
                      {importMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        'Import Property'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}

          {/* Step 3: Importing */}
          {step === 'importing' && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Importing property...</h3>
              <p className="text-muted-foreground">Please wait while we import the property from Airbnb</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
