/**
 * Hook for agreement detail
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { collaborationsApi } from '../api/collaborations.api';
import { collaborationKeys } from './use-marketplace';

export function useAgreement(agreementId: number) {
  return useQuery({
    queryKey: collaborationKeys.agreementDetail(agreementId),
    queryFn: () => collaborationsApi.getAgreement(agreementId),
    staleTime: 2 * 60 * 1000,
    enabled: agreementId > 0,
  });
}
