/**
 * useValidateAirbnbUrl Hook
 * React Query mutation for validating Airbnb URL and extracting metadata
 */

'use client';

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { propertiesApi } from '../api/properties.api';
import { toast } from 'sonner';
import type { ValidateAirbnbUrlRequest, ValidateAirbnbUrlResponse } from '../types';

type UseValidateAirbnbUrlOptions = Omit<
  UseMutationOptions<ValidateAirbnbUrlResponse, Error, ValidateAirbnbUrlRequest>,
  'mutationFn'
>;

/**
 * Hook to validate an Airbnb URL and extract listing metadata
 *
 * @example
 * ```tsx
 * const { mutate, isPending, data } = useValidateAirbnbUrl({
 *   onSuccess: (data) => {
 *     if (data.valid) {
 *       console.log('Listing ID:', data.listingId);
 *       console.log('Title:', data.title);
 *     }
 *   }
 * });
 *
 * mutate({ airbnbUrl: 'https://www.airbnb.com/rooms/12345' });
 * ```
 */
export function useValidateAirbnbUrl(options?: UseValidateAirbnbUrlOptions) {
  return useMutation<ValidateAirbnbUrlResponse, Error, ValidateAirbnbUrlRequest>({
    mutationFn: (request) => propertiesApi.validateAirbnbUrl(request),
    onSuccess: (data, variables, context) => {
      if (!data.valid) {
        // Show error toast if validation failed
        toast.error('Invalid Airbnb URL', {
          description: data.errorMessage || 'Please check the URL and try again',
        });
      }

      // Call custom onSuccess if provided
      // @ts-expect-error - TanStack Query signature mismatch
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      console.error('Validate Airbnb URL error:', error);

      // Extract error message from backend
      let errorMessage = 'Validation Error';
      let errorDescription = 'An unexpected error occurred';

      if (error.response?.data) {
        const backendError = error.response.data;

        // Handle validation errors (400)
        if (error.response.status === 400 && backendError.errors) {
          errorDescription = backendError.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
        }
        // Handle other backend errors
        else if (backendError.message) {
          errorDescription = backendError.message;
        }
      } else if (error.message) {
        errorDescription = error.message;
      }

      // Show error toast
      toast.error(errorMessage, {
        description: errorDescription,
        duration: 5000,
      });

      // Call custom onError if provided
      // @ts-expect-error - TanStack Query signature mismatch
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}
