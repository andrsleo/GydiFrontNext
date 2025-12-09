/**
 * useImportFromAirbnb Hook
 * React Query mutation for importing property from Airbnb
 */

'use client';

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { propertiesApi } from '../api/properties.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import { toast } from 'sonner';
import type { ImportPropertyFromAirbnbRequest, PropertyDetailResponse } from '../types';

interface UseImportFromAirbnbOptions
  extends Omit<
    UseMutationOptions<PropertyDetailResponse, Error, ImportPropertyFromAirbnbRequest>,
    'mutationFn'
  > {}

/**
 * Hook to import a property from Airbnb
 * Automatically invalidates property list queries on success
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useImportFromAirbnb({
 *   onSuccess: (data) => {
 *     console.log('Property imported:', data.id);
 *     router.push(`/dashboard/properties/${data.id}`);
 *   }
 * });
 *
 * mutate({
 *   airbnbUrl: 'https://www.airbnb.com/rooms/12345',
 *   priceAmount: 150,
 *   priceCurrency: 'USD',
 *   country: 'United States',
 *   city: 'Miami',
 *   address: '123 Beach Road',
 *   postalCode: '33139',
 *   bedrooms: 2,
 *   bathrooms: 2,
 *   maxGuests: 4,
 *   propertyType: 'APARTMENT',
 *   listingType: 'SHORT_TERM_RENTAL',
 * });
 * ```
 */
export function useImportFromAirbnb(options?: UseImportFromAirbnbOptions) {
  const queryClient = useQueryClient();

  return useMutation<PropertyDetailResponse, Error, ImportPropertyFromAirbnbRequest>({
    mutationFn: (request) => propertiesApi.importFromAirbnb(request),
    onSuccess: (data, variables, context) => {
      // Invalidate property lists to refetch
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.myProperties() });

      // Show success toast
      toast.success('Property imported successfully', {
        description: `${data.title} has been imported from Airbnb`,
      });

      // Call custom onSuccess if provided
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      console.error('Import from Airbnb error:', error);

      // Extract error message from backend
      let errorMessage = 'Import Failed';
      let errorDescription = 'An unexpected error occurred';

      if (error.response?.data) {
        const backendError = error.response.data;

        // Handle validation errors (400)
        if (error.response.status === 400 && backendError.errors) {
          errorMessage = 'Validation Error';
          errorDescription = backendError.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
        }
        // Handle duplicate listing error
        else if (error.response.status === 409) {
          errorMessage = 'Property Already Exists';
          errorDescription = 'This Airbnb listing has already been imported';
        }
        // Handle other backend errors
        else if (backendError.message) {
          errorMessage = backendError.error || 'Server Error';
          errorDescription = backendError.message;
        }
      } else if (error.message) {
        errorDescription = error.message;
      }

      // Show error toast with details
      toast.error(errorMessage, {
        description: errorDescription,
        duration: 5000,
      });

      // Call custom onError if provided
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}
