import { apiClient } from '@/lib/api/client';
import type { PropertyResponse } from '../types';

export const propertyActionsApi = {
  async publish(propertyId: string): Promise<PropertyResponse> {
    const { data } = await apiClient.post<PropertyResponse>(`/api/properties/${propertyId}/publish`);
    return data;
  },

  async activate(propertyId: string): Promise<PropertyResponse> {
    const { data } = await apiClient.post<PropertyResponse>(`/api/properties/${propertyId}/activate`);
    return data;
  },

  async deactivate(propertyId: string): Promise<PropertyResponse> {
    const { data } = await apiClient.post<PropertyResponse>(`/api/properties/${propertyId}/deactivate`);
    return data;
  },

  async delete(propertyId: string): Promise<void> {
    await apiClient.delete(`/api/properties/${propertyId}`);
  },
};