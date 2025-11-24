/**
 * useCreateProperty Hook
 * React Query mutation for creating new property
 */

'use client';

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { propertiesApi } from '../api/properties.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import { toast } from 'sonner';
import type { CreatePropertyRequest, PropertyResponse } from '../types';

interface UseCreatePropertyOptions
  extends Omit<
    UseMutationOptions<PropertyResponse, Error, CreatePropertyRequest>,
    'mutationFn'
  > { }

/**
 * Hook to create a new property
 * Automatically invalidates property list queries on success
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateProperty({
 *   onSuccess: (data) => {
 *     console.log('Property created:', data.id);
 *     router.push(`/dashboard/properties/${data.id}`);
 *   }
 * });
 *
 * mutate({
 *   title: 'Beautiful Beach House',
 *   pricePerNight: 150,
 *   // ... other fields
 * });
 * ```
 */
export function useCreateProperty(options?: UseCreatePropertyOptions) {
  const queryClient = useQueryClient();

  return useMutation<PropertyResponse, Error, CreatePropertyRequest>({
    mutationFn: (request) => propertiesApi.create(request),
    onSuccess: (data, variables, context) => {
      // Invalidate property lists to refetch
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.myProperties() });

      // Show success toast
      toast.success('Property created successfully', {
        description: `${data.title} has been created`,
      });

      // Call custom onSuccess if provided
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      console.error('Create property error:', error);

      // Extract error message from backend
      let errorMessage = 'An unexpected error occurred';
      let errorDescription = 'Please try again later';

      if (error.response?.data) {
        const backendError = error.response.data;

        // Handle validation errors (400)
        if (error.response.status === 400 && backendError.errors) {
          errorMessage = 'Validation Error';
          errorDescription = backendError.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
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
        duration: 5000, // Show for 5 seconds
      });

      // Call custom onError if provided
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}
