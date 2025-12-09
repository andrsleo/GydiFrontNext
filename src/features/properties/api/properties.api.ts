/**
 * Properties API Client
 * CRUD operations for properties
 */

import { apiClient } from '@/lib/api/client';
import type {
  PropertyResponse,
  PropertyDetailResponse,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  PropertyFilters,
  PaginatedPropertyResponse,
  ValidateAirbnbUrlRequest,
  ValidateAirbnbUrlResponse,
  ImportPropertyFromAirbnbRequest,
} from '../types';

/**
 * API Base Path
 */
const BASE_PATH = '/api/properties';

/**
 * Properties API
 */
export const propertiesApi = {
  /**
   * Get all properties with filters (paginated)
   * Public endpoint - no auth required
   */
  async getAll(filters?: PropertyFilters): Promise<PaginatedPropertyResponse> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const { data } = await apiClient.get<PaginatedPropertyResponse>(
      `${BASE_PATH}?${params.toString()}`
    );
    return data;
  },

  /**
   * Get property by ID
   * Public endpoint - no auth required
   */
  async getById(id: string): Promise<PropertyDetailResponse> {
    const { data } = await apiClient.get<PropertyDetailResponse>(`${BASE_PATH}/${id}`);
    return data;
  },

  /**
   * Get property by SEO-friendly slug
   * Public endpoint - no auth required
   * Supports optional referral token (ref query param)
   */
  async getBySlug(slug: string, ref?: string): Promise<PropertyDetailResponse> {
    const params = new URLSearchParams();
    if (ref) {
      params.append('ref', ref);
    }

    const queryString = params.toString();
    const url = `${BASE_PATH}/by-slug/${slug}${queryString ? `?${queryString}` : ''}`;

    const { data } = await apiClient.get<PropertyDetailResponse>(url);
    return data;
  },

  /**
   * Create new property
   * Requires authentication (HOST or ADMIN role)
   */
  async create(request: CreatePropertyRequest): Promise<PropertyResponse> {
    const { data } = await apiClient.post<PropertyResponse>(BASE_PATH, request);
    return data;
  },

  /**
   * Update existing property
   * Requires authentication + ownership
   */
  async update(id: string, request: UpdatePropertyRequest): Promise<PropertyResponse> {
    const { data } = await apiClient.put<PropertyResponse>(`${BASE_PATH}/${id}`, request);
    return data;
  },

  /**
   * Publish property (change status to PUBLISHED)
   * Requires authentication + ownership
   */
  async publish(id: string): Promise<PropertyResponse> {
    const { data } = await apiClient.post<PropertyResponse>(`${BASE_PATH}/${id}/publish`);
    return data;
  },

  /**
   * Delete property (soft delete)
   * Requires authentication + ownership
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${BASE_PATH}/${id}`);
  },

  /**
   * Get properties by current user (requires auth)
   */
  async getMyProperties(filters?: PropertyFilters): Promise<PaginatedPropertyResponse> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const { data } = await apiClient.get<PaginatedPropertyResponse>(
      `${BASE_PATH}/my-properties?${params.toString()}`
    );
    return data;
  },

  /**
   * Validate Airbnb URL and extract metadata
   * Public endpoint - no auth required
   */
  async validateAirbnbUrl(request: ValidateAirbnbUrlRequest): Promise<ValidateAirbnbUrlResponse> {
    const { data } = await apiClient.post<ValidateAirbnbUrlResponse>(
      `${BASE_PATH}/import/validate`,
      request
    );
    return data;
  },

  /**
   * Import property from Airbnb
   * Requires authentication (HOST or ADMIN role)
   */
  async importFromAirbnb(request: ImportPropertyFromAirbnbRequest): Promise<PropertyDetailResponse> {
    const { data } = await apiClient.post<PropertyDetailResponse>(
      `${BASE_PATH}/import/airbnb`,
      request
    );
    return data;
  },
};
