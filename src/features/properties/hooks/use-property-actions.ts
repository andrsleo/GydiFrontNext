'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyActionsApi } from '../api/property-actions.api';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';

export function usePublishProperty() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('properties');

  return useMutation({
    mutationFn: (propertyId: string) => propertyActionsApi.publish(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success(t('toasts.property.published'));
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      let errorMessage = errorData?.message || t('toasts.property.publishError');

      const transformErrorMessage = (msg: string): string => {
        const imageMatch = msg.match(/must have at least (\d+) images.*currently has (\d+)/i);
        if (imageMatch) {
          return t('toasts.property.publishMinImages', { required: imageMatch[1], current: imageMatch[2] });
        }
        const videoMatch = msg.match(/must have at least (\d+) videos/i);
        if (videoMatch) {
          return t('toasts.property.publishMinVideos', { required: videoMatch[1] });
        }
        if (msg.includes('Description') && msg.includes('required')) {
          return t('toasts.property.publishMissingDesc');
        }
        if (msg.includes('Title') && msg.includes('required')) {
          return t('toasts.property.publishMissingTitle');
        }
        if (msg.includes('Address') && msg.includes('required')) {
          return t('toasts.property.publishMissingAddress');
        }
        if (msg.includes('amenities') || msg.includes('Amenities')) {
          return t('toasts.property.publishMissingAmenities');
        }
        if (msg.includes('Property domain exception:')) {
          return msg.replace('Property domain exception:', '').trim();
        }
        return msg;
      };

      if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
        const errorsList = errorData.errors
          .map((err: any) => `• ${transformErrorMessage(err.message)}`)
          .join('\n');
        toast.error(`${t('toasts.property.publishCannotMsg')}\n\n${errorsList}`, {
          duration: 10000,
          style: { whiteSpace: 'pre-line' },
        });
      } else {
        toast.error(transformErrorMessage(errorMessage), { duration: 6000 });
      }
    },
  });
}

export function useSubmitForApproval() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('properties');

  return useMutation({
    mutationFn: (propertyId: string) => propertyActionsApi.submitForApproval(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success(t('toasts.property.submitForApproval'));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || t('toasts.property.submitError');
      toast.error(message);
    },
  });
}

export function useActivateProperty() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('properties');

  return useMutation({
    mutationFn: (propertyId: string) => propertyActionsApi.activate(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success(t('toasts.property.activated'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('toasts.property.activateError'));
    },
  });
}

export function useDeactivateProperty() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('properties');

  return useMutation({
    mutationFn: (propertyId: string) => propertyActionsApi.deactivate(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success(t('toasts.property.deactivated'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('toasts.property.deactivateError'));
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('properties');

  return useMutation({
    mutationFn: (propertyId: string) => propertyActionsApi.delete(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success(t('toasts.property.deleted'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('toasts.property.deleteError'));
    },
  });
}

export function useAdminApproveProperty() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('properties');

  return useMutation({
    mutationFn: (propertyId: string) => propertyActionsApi.adminApprove(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      toast.success(t('toasts.property.approved'));
    },
    onError: () => {
      toast.error(t('toasts.property.approveError'));
    },
  });
}

export function useAdminDenyProperty() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('properties');

  return useMutation({
    mutationFn: ({ propertyId, reason }: { propertyId: string; reason: string }) =>
      propertyActionsApi.adminDeny(propertyId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      toast.success(t('toasts.property.denied'));
    },
    onError: () => {
      toast.error(t('toasts.property.denyError'));
    },
  });
}
