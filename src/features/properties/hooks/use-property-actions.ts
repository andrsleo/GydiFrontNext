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
      let errorMessage = errorData?.message || 'Error al publicar la propiedad';

      // Transform technical error messages into user-friendly messages
      const transformErrorMessage = (msg: string): string => {
        // Pattern: "Property must have at least X images (currently has Y)"
        const imageMatch = msg.match(/must have at least (\d+) images.*currently has (\d+)/i);
        if (imageMatch) {
          const required = imageMatch[1];
          const current = imageMatch[2];
          return `Necesitas al menos ${required} imágenes para publicar (tienes ${current})`;
        }

        // Pattern: "Property must have at least X videos"
        const videoMatch = msg.match(/must have at least (\d+) videos/i);
        if (videoMatch) {
          const required = videoMatch[1];
          return `Necesitas al menos ${required} video(s) para publicar`;
        }

        // Pattern: "Description is required" or "Title is required"
        if (msg.includes('Description') && msg.includes('required')) {
          return 'La descripción es obligatoria para publicar';
        }
        if (msg.includes('Title') && msg.includes('required')) {
          return 'El título es obligatorio para publicar';
        }

        // Pattern: "Address is required"
        if (msg.includes('Address') && msg.includes('required')) {
          return 'La dirección es obligatoria para publicar';
        }

        // Pattern: "Amenities" validation
        if (msg.includes('amenities') || msg.includes('Amenities')) {
          return 'Debes agregar al menos 3 amenidades para publicar';
        }

        // Pattern: "Property domain exception:" - remove technical prefix
        if (msg.includes('Property domain exception:')) {
          return msg.replace('Property domain exception:', '').trim();
        }

        return msg;
      };

      // Check if there are validation errors with details
      if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
        const errorsList = errorData.errors
          .map((err: any) => `• ${transformErrorMessage(err.message)}`)
          .join('\n');

        toast.error(
          `No se puede publicar la propiedad:\n\n${errorsList}`,
          {
            duration: 10000,
            style: {
              whiteSpace: 'pre-line',
            },
          }
        );
      } else {
        const friendlyMessage = transformErrorMessage(errorMessage);
        toast.error(friendlyMessage, {
          duration: 6000,
        });
      }
    },
  });
}

export function useSubmitForApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: string) => propertyActionsApi.submitForApproval(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Propiedad enviada a revisión exitosamente');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Error al enviar a revisión';
      toast.error(message);
    },
  });
}

export function useActivateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: string) => propertyActionsApi.activate(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Propiedad reactivada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al reactivar la propiedad');
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

export function useAdminApproveProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: string) => propertyActionsApi.adminApprove(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      toast.success('Propiedad aprobada exitosamente');
    },
    onError: () => {
      toast.error('Error al aprobar la propiedad');
    },
  });
}

export function useAdminDenyProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, reason }: { propertyId: string; reason: string }) =>
      propertyActionsApi.adminDeny(propertyId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      toast.success('Propiedad rechazada');
    },
    onError: () => {
      toast.error('Error al rechazar la propiedad');
    },
  });
}
