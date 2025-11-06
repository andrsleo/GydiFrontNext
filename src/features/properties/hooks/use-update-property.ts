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
  > {}

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
    onError: (error) => {
      // Show error toast
      toast.error('Error al actualizar propiedad', {
        description: error.message || 'Ocurrió un error inesperado',
      });
    },
    ...options,
  });
}
