import { apiClient } from '@/lib/api/client';
import type {
  SeasonDefinitionDto,
  SeasonRegionDto,
  CreateSeasonDefinitionRequest,
  UpdateSeasonDefinitionRequest,
} from '../types';

export const seasonsApi = {
  listAll: async (): Promise<SeasonDefinitionDto[]> => {
    const { data } = await apiClient.get<SeasonDefinitionDto[]>('/api/v1/admin/seasons');
    return data;
  },

  create: async (payload: CreateSeasonDefinitionRequest): Promise<SeasonDefinitionDto> => {
    const { data } = await apiClient.post<SeasonDefinitionDto>('/api/v1/admin/seasons', payload);
    return data;
  },

  update: async (id: number, payload: UpdateSeasonDefinitionRequest): Promise<SeasonDefinitionDto> => {
    const { data } = await apiClient.put<SeasonDefinitionDto>(`/api/v1/admin/seasons/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/seasons/${id}`);
  },

  listRegions: async (): Promise<SeasonRegionDto[]> => {
    const { data } = await apiClient.get<SeasonRegionDto[]>('/api/v1/seasons/regions');
    return data;
  },
};
