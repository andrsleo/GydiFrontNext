/**
 * API Client for Content endpoints
 * Uses apiClient (Axios) for CSRF token handling and authentication
 */

import { apiClient } from '@/lib/api/client';
import type {
  ContentPost,
  ContentFeedPage,
  ContentMedia,
  CreateContentPostRequest,
  PageResponse,
} from '../types';

const BASE_PATH = '/api/v1/content';

export const contentApi = {
  /**
   * Get content feed (cursor-based pagination)
   * Public endpoint
   */
  async getContentFeed(cursor?: string, limit = 10): Promise<ContentFeedPage> {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', String(limit));
    const { data } = await apiClient.get<ContentFeedPage>(
      `${BASE_PATH}/feed?${params.toString()}`
    );
    return data;
  },

  /**
   * Get a single content post by ID
   * Public endpoint
   */
  async getContentById(id: number): Promise<ContentPost> {
    const { data } = await apiClient.get<ContentPost>(`${BASE_PATH}/${id}`);
    return data;
  },

  /**
   * Get authenticated user's content (paginated)
   * Requires authentication
   */
  async getMyContent(page = 0, size = 12): Promise<PageResponse<ContentPost>> {
    const { data } = await apiClient.get<PageResponse<ContentPost>>(
      `${BASE_PATH}/my-content?page=${page}&size=${size}`
    );
    return data;
  },

  /**
   * Get content tagged to a specific property (paginated)
   * Public endpoint
   */
  async getPropertyContent(
    propertyId: number,
    page = 0
  ): Promise<PageResponse<ContentPost>> {
    const { data } = await apiClient.get<PageResponse<ContentPost>>(
      `${BASE_PATH}/property/${propertyId}?page=${page}`
    );
    return data;
  },

  /**
   * Create a new content post
   * Requires authentication
   */
  async createContentPost(
    request: CreateContentPostRequest
  ): Promise<ContentPost> {
    const { data } = await apiClient.post<ContentPost>(BASE_PATH, request);
    return data;
  },

  /**
   * Update an existing content post
   * Requires authentication + ownership
   */
  async updateContentPost(
    id: number,
    request: Partial<CreateContentPostRequest>
  ): Promise<ContentPost> {
    const { data } = await apiClient.put<ContentPost>(
      `${BASE_PATH}/${id}`,
      request
    );
    return data;
  },

  /**
   * Archive a content post (soft delete)
   * Requires authentication + ownership
   */
  async archiveContentPost(id: number): Promise<void> {
    await apiClient.post(`${BASE_PATH}/${id}/archive`);
  },

  /**
   * Report a content post for moderation
   */
  async reportContent(
    id: number,
    reason: string,
    description?: string
  ): Promise<void> {
    await apiClient.post(`${BASE_PATH}/${id}/report`, { reason, description });
  },

  /**
   * Upload media file to a content post
   * Requires authentication + ownership
   */
  async uploadMedia(contentId: number, file: File, displayOrder = 0): Promise<ContentMedia> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('displayOrder', String(displayOrder));
    const { data } = await apiClient.post<ContentMedia>(
      `${BASE_PATH}/${contentId}/media`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  },

  /**
   * Delete a media item from a content post
   * Requires authentication + ownership
   */
  async deleteMedia(contentId: number, mediaId: number): Promise<void> {
    await apiClient.delete(`${BASE_PATH}/${contentId}/media/${mediaId}`);
  },

  /**
   * Register a view for a content post
   * Public endpoint — called after 3s of visibility
   */
  async registerView(contentId: number): Promise<void> {
    await apiClient.post(`${BASE_PATH}/${contentId}/view`);
  },

  /**
   * Get similar content for a given post (recommendation engine)
   * Public endpoint
   */
  async getSimilarContent(postId: number): Promise<ContentPost[]> {
    const { data } = await apiClient.get<ContentPost[]>(
      `${BASE_PATH}/${postId}/similar`
    );
    return data;
  },

  /**
   * Get personalised recommended content feed (cursor-based)
   * Public endpoint — anonymous users get trending feed
   */
  async getRecommendedContent(
    cursor?: string,
    limit = 10
  ): Promise<ContentFeedPage> {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', String(limit));
    const { data } = await apiClient.get<ContentFeedPage>(
      `${BASE_PATH}/recommended?${params.toString()}`
    );
    return data;
  },

  /**
   * Get following feed (cursor-based pagination)
   * Requires authentication
   */
  async getFollowingFeed(cursor?: string, limit = 10): Promise<ContentFeedPage> {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', String(limit));
    const { data } = await apiClient.get<ContentFeedPage>(
      `${BASE_PATH}/feed/following?${params.toString()}`
    );
    return data;
  },
};
