/**
 * useUpdateProperty Hook
 * React Query mutation for updating existing property
 */

'use client';

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { propertiesApi } from '../api/properties.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';
import type { UpdatePropertyRequest, PropertyResponse } from '../types';
import { PropertyStatus } from '../types';

interface UpdatePropertyVariables {
  id: string;
  data: UpdatePropertyRequest;
}

type UseUpdatePropertyOptions = Omit<
  UseMutationOptions<PropertyResponse, Error, UpdatePropertyVariables>,
  'mutationFn'
>;

/**
 * Hook to update an existing property.
 * Automatically invalidates relevant queries on success.
 *
 * When the backend auto-transitions the property from DRAFT to PENDING_APPROVAL
 * (all minimums met), a toast informs the host their property is now under review.
 */
export function useUpdateProperty(options?: UseUpdatePropertyOptions) {
  const queryClient = useQueryClient();
  const { t } = useTranslation('properties');

  return useMutation<PropertyResponse, Error, UpdatePropertyVariables>({
    mutationFn: ({ id, data }) => propertiesApi.update(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: propertyKeys.detail(variables.id),
        refetchType: 'active',
      });
      queryClient.invalidateQueries({
        queryKey: propertyKeys.all,
        refetchType: 'active',
      });

      if (data.status === PropertyStatus.PENDING_APPROVAL) {
        toast.success(t('toasts.property.pendingApprovalTitle'), {
          description: t('toasts.property.pendingApprovalDesc'),
          duration: 6000,
        });
      } else {
        toast.success(t('toasts.property.updated'), {
          description: t('toasts.property.updatedDesc', { title: data.title }),
        });
      }

      (options as any)?.onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      console.error('Update property error:', error);

      let errorMessage = t('toasts.property.updateError');
      let errorDescription = t('toasts.property.createError');

      if (error.response?.data) {
        const backendError = error.response.data;

        if (error.response.status === 400 && backendError.errors) {
          errorMessage = t('toasts.property.validationError');
          errorDescription = backendError.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
        } else if (backendError.message) {
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
            errorDescription = t('toasts.property.genericSaveError');
          }
        }
      } else if (error.message) {
        errorDescription = error.message;
      }

      toast.error(errorMessage, { description: errorDescription, duration: 5000 });

      (options as any)?.onError?.(error, variables, context);
    },
  });
}
