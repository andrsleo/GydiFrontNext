import { apiClient } from '@/lib/api/client';
import type { PropertyResponse, PaginatedPropertyResponse } from '../types';

export const propertyActionsApi = {
  async publish(propertyId: string): Promise<PropertyResponse> {
    const { data } = await apiClient.post<PropertyResponse>(`/api/properties/${propertyId}/publish`);
    return data;
  },

  async submitForApproval(propertyId: string): Promise<PropertyResponse> {
    const { data } = await apiClient.post<PropertyResponse>(`/api/properties/${propertyId}/submit-for-approval`);
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

  async adminApprove(propertyId: string): Promise<PropertyResponse> {
    const { data } = await apiClient.post<PropertyResponse>(`/api/admin/properties/${propertyId}/approve`);
    return data;
  },

  async adminDeny(propertyId: string, reason: string): Promise<PropertyResponse> {
    const { data } = await apiClient.post<PropertyResponse>(`/api/admin/properties/${propertyId}/deny`, { reason });
    return data;
  },

  async getPendingProperties(params?: { page?: number; size?: number }): Promise<PaginatedPropertyResponse> {
    const { data } = await apiClient.get<PaginatedPropertyResponse>('/api/admin/properties/pending', { params });
    return data;
  },
};
