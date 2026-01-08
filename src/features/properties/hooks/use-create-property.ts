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

type UseCreatePropertyOptions = Omit<
  UseMutationOptions<PropertyResponse, Error, CreatePropertyRequest>,
  'mutationFn'
>;

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
    ...options,
    onSuccess: (data, variables, context) => {
      // Invalidate property lists to refetch
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.myProperties() });

      // Show success toast
      toast.success('Property created successfully', {
        description: `${data.title} has been created`,
      });
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
          // Check if it's an iCal URL error
          if (backendError.message.includes('Invalid iCal URL')) {
            errorMessage = 'Problema con el enlace del calendario';

            const backendMsg = backendError.message;

            if (backendMsg.includes('HTTPS protocol')) {
              errorDescription = 'El enlace debe ser seguro (comenzar con https://)';
            } else if (backendMsg.includes('HTTP 404') || backendMsg.includes('Unable to access')) {
              errorDescription = 'No pudimos acceder al enlace. Verifica que sea correcto y público.';
            } else if (backendMsg.includes('missing BEGIN:VCALENDAR') || backendMsg.includes('does not contain valid iCal')) {
              errorDescription = 'El enlace no parece ser un calendario válido de Airbnb/iCal.';
            } else if (backendMsg.includes('Timeout') || backendMsg.includes('time out')) {
              errorDescription = 'Tardó demasiado en responder. Inténtalo de nuevo más tarde.';
            } else if (backendMsg.includes('too large')) {
              errorDescription = 'El archivo del calendario es demasiado grande.';
            } else {
              // Fallback for other iCal errors
              errorDescription = 'El enlace proporcionado no es válido. Por favor verifícalo.';
            }
          } else {
            errorMessage = backendError.error || 'Algo salió mal';
            errorDescription = 'No pudimos crear la propiedad. Inténtalo de nuevo.';
          }
        }
      } else if (error.message) {
        errorDescription = error.message;
      }

      // Show error toast with details
      toast.error(errorMessage, {
        description: errorDescription,
        duration: 5000, // Show for 5 seconds
      });
    },
  });
}
