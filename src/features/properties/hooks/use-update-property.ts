/**
 * useUpdateProperty Hook
 * React Query mutation for updating existing property
 */

'use client';

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { propertiesApi } from '../api/properties.api';
import { propertyKeys } from '@/lib/constants/query-keys';
import { toast } from 'sonner';
import type { UpdatePropertyRequest, PropertyResponse } from '../types';

interface UpdatePropertyVariables {
  id: string;
  data: UpdatePropertyRequest;
}

interface UseUpdatePropertyOptions
  extends Omit<
    UseMutationOptions<PropertyResponse, Error, UpdatePropertyVariables>,
    'mutationFn'
  > { }

/**
 * Hook to update an existing property
 * Automatically invalidates relevant queries on success
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateProperty({
 *   onSuccess: (data) => {
 *     console.log('Property updated:', data.id);
 *   }
 * });
 *
 * mutate({
 *   id: 'property-123',
 *   data: {
 *     title: 'Updated Title',
 *     pricePerNight: 200,
 *   }
 * });
 * ```
 */
export function useUpdateProperty(options?: UseUpdatePropertyOptions) {
  const queryClient = useQueryClient();

  return useMutation<PropertyResponse, Error, UpdatePropertyVariables>({
    mutationFn: ({ id, data }) => propertiesApi.update(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch specific property detail
      queryClient.invalidateQueries({
        queryKey: propertyKeys.detail(variables.id),
        refetchType: 'active',
      });

      // Invalidate ALL property lists (including filtered queries)
      queryClient.invalidateQueries({
        queryKey: propertyKeys.all,
        refetchType: 'active',
      });

      // Show success toast
      toast.success('Propiedad actualizada', {
        description: `${data.title} se ha actualizado correctamente`,
      });
    },
    onError: (error: any, variables, context) => {
      console.error('Update property error:', error);

      // Extract error message from backend
      let errorMessage = 'Error al actualizar propiedad';
      let errorDescription = 'Ocurrió un error inesperado';

      if (error.response?.data) {
        const backendError = error.response.data;

        // Handle validation errors (400)
        if (error.response.status === 400 && backendError.errors) {
          errorMessage = 'Error de validación';
          errorDescription = backendError.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
        }
        // Handle iCal URL validation errors and other IllegalArgumentException
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
            errorDescription = 'No pudimos guardar los cambios. Inténtalo de nuevo.';
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
