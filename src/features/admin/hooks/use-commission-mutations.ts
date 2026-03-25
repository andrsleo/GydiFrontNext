/**
 * Commission Mutation Hooks
 *
 * TanStack Query hooks for commission mutations
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { commissionsAdminApi } from '../api';
import { commissionKeys } from './use-commissions';

/**
 * Hook to retry failed host commission charge
 */
export function useRetryHostCommission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => commissionsAdminApi.retryHostCommission(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.hostDetail(data.id) });
      queryClient.invalidateQueries({ queryKey: commissionKeys.hostList() });
      queryClient.invalidateQueries({ queryKey: commissionKeys.stats() });

      toast.success('Reintento programado', {
        description: `Comisión de host #${data.id} será procesada nuevamente`,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al reintentar cobro';
      toast.error('Error', { description: message });
    },
  });
}

/**
 * Hook to retry failed affiliate commission payment
 */
export function useRetryAffiliateCommission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => commissionsAdminApi.retryAffiliateCommission(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.affiliateDetail(data.id) });
      queryClient.invalidateQueries({ queryKey: commissionKeys.affiliateList() });
      queryClient.invalidateQueries({ queryKey: commissionKeys.stats() });

      toast.success('Reintento programado', {
        description: `Comisión de referido #${data.id} será procesada nuevamente`,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al reintentar pago';
      toast.error('Error', { description: message });
    },
  });
}

/**
 * Hook to approve affiliate commission for payment
 */
export function useApproveAffiliateCommission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => commissionsAdminApi.approveAffiliateCommission(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.affiliateDetail(data.id) });
      queryClient.invalidateQueries({ queryKey: commissionKeys.affiliateList() });
      queryClient.invalidateQueries({ queryKey: commissionKeys.stats() });

      toast.success('Comisión aprobada', {
        description: `Comisión #${data.id} aprobada para pago`,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al aprobar comisión';
      toast.error('Error', { description: message });
    },
  });
}

/**
 * Hook to cancel affiliate commission
 */
export function useCancelAffiliateCommission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => commissionsAdminApi.cancelAffiliateCommission(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.affiliateDetail(data.id) });
      queryClient.invalidateQueries({ queryKey: commissionKeys.affiliateList() });
      queryClient.invalidateQueries({ queryKey: commissionKeys.stats() });

      toast.success('Comisión cancelada', {
        description: `Comisión #${data.id} cancelada`,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al cancelar comisión';
      toast.error('Error', { description: message });
    },
  });
}
