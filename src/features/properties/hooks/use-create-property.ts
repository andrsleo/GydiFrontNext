/**
 * useCreateProperty Hook
 * React Query mutation for creating new property
 */

'use client';

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { propertiesApi } from '../api/properties.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';
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
  const { t } = useTranslation('properties');

  return useMutation<PropertyResponse, Error, CreatePropertyRequest>({
    mutationFn: (request) => propertiesApi.create(request),
    ...options,
    onSuccess: (data, variables, context) => {
      // Invalidate property lists to refetch
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.myProperties() });

      // Show success toast
      toast.success(t('toasts.property.created'), {
        description: t('toasts.property.createdDesc', { title: data.title }),
      });
    },
    onError: (error: any, variables, context) => {
      console.error('Create property error:', error);

      // Extract error message from backend
      let errorMessage = t('toasts.property.createError');
      let errorDescription = t('toasts.property.createErrorRetry');

      if (error.response?.data) {
        const backendError = error.response.data;

        // Handle validation errors (400)
        if (error.response.status === 400 && backendError.errors) {
          errorMessage = t('toasts.property.validationError');
          errorDescription = backendError.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
        }
        // Handle other backend errors
        else if (backendError.message) {
          // Check if it's an iCal URL error
          if (backendError.message.includes('Invalid iCal URL')) {
            errorMessage = t('toasts.property.icalError');

            const backendMsg = backendError.message;

            if (backendMsg.includes('HTTPS protocol')) {
              errorDescription = t('toasts.property.icalHttps');
            } else if (backendMsg.includes('HTTP 404') || backendMsg.includes('Unable to access')) {
              errorDescription = t('toasts.property.icalNotFound');
            } else if (backendMsg.includes('missing BEGIN:VCALENDAR') || backendMsg.includes('does not contain valid iCal')) {
              errorDescription = t('toasts.property.icalInvalid');
            } else if (backendMsg.includes('Timeout') || backendMsg.includes('time out')) {
              errorDescription = t('toasts.property.icalTimeout');
            } else if (backendMsg.includes('too large')) {
              errorDescription = t('toasts.property.icalTooLarge');
            } else {
              errorDescription = t('toasts.property.icalGeneric');
            }
          } else {
            errorMessage = backendError.error || t('toasts.property.genericError');
            errorDescription = t('toasts.property.genericCreateError');
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
