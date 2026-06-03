'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { PropertySocialProof } from '../types';

async function fetchPropertySocialProof(propertyId: number): Promise<PropertySocialProof> {
  const { data } = await apiClient.get<PropertySocialProof>(
    `/api/v1/properties/${propertyId}/social-proof`
  );
  return data;
}

export function usePropertySocialProof(propertyId: number | undefined) {
  return useQuery({
    queryKey: ['properties', propertyId, 'social-proof'],
    queryFn: () => fetchPropertySocialProof(propertyId!),
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
