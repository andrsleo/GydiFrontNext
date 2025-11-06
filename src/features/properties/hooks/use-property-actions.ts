'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyActionsApi } from '../api/property-actions.api';
import { toast } from 'sonner';

export function usePublishProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: string) => propertyActionsApi.publish(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Propiedad publicada exitosamente');
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || 'Error al publicar la propiedad';

      // Check if there are validation errors with details
      if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
        // Format the errors list
        const errorsList = errorData.errors
          .map((err: any) => `• ${err.message}`)
          .join('\n');

        toast.error(
          `No se puede publicar la propiedad. Faltan los siguientes requisitos:\n\n${errorsList}`,
          {
            duration: 8000, // Show for 8 seconds due to multiple errors
            style: {
              whiteSpace: 'pre-line',
            },
          }
        );
      } else {
        // Single error message
        toast.error(errorMessage);
      }
    },
  });
}

export function useActivateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: string) => propertyActionsApi.activate(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Propiedad activada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al activar la propiedad');
    },
  });
}

export function useDeactivateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: string) => propertyActionsApi.deactivate(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Propiedad desactivada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al desactivar la propiedad');
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: string) => propertyActionsApi.delete(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Propiedad eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar la propiedad');
    },
  });
}