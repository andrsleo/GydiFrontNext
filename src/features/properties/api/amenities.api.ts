/**
 * Amenities API Client
 * API operations for property amenities
 */

import { apiClient } from '@/lib/api/client';
import type { Amenity } from '../types/amenity';

/**
 * API Base Path
 */
const BASE_PATH = '/api/amenities';

/**
 * Amenities API
 */
export const amenitiesApi = {
  /**
   * Get all available amenities
   * Public endpoint - no auth required
   */
  async getAll(): Promise<Amenity[]> {
    const { data } = await apiClient.get<Amenity[]>(BASE_PATH);
    return data;
  },

  /**
   * Get amenities by category
   */
  async getByCategory(category: string): Promise<Amenity[]> {
    const { data } = await apiClient.get<Amenity[]>(`${BASE_PATH}/category/${category}`);
    return data;
  },
};