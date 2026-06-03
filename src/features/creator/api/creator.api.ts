import { apiClient } from '@/lib/api/client';
import type {
  CreatorProfile,
  CreatorsPage,
  CreatorAnalyticsOverview,
  CreatorContentAnalytics,
  CreatorEarnings,
  ContentAttribution,
  CreateContentAttributionRequest,
} from '../types';

const BASE = '/api/v1/users';
const ANALYTICS_BASE = '/api/v1/creator/analytics';
const ATTRIBUTION_BASE = '/api/v1/content-attributions';

export const creatorApi = {
  // ── Profile ──────────────────────────────────────────────────────────────

  getCreatorProfile: async (userId: number): Promise<CreatorProfile | null> => {
    const { data, status } = await apiClient.get(
      `${BASE}/${userId}/creator-profile`,
      { validateStatus: (s) => s < 500 }
    );
    if (status === 404 || status === 400) return null;
    return data as CreatorProfile;
  },

  browseCreators: async (page = 0, size = 12): Promise<CreatorsPage> => {
    const { data } = await apiClient.get(
      `${BASE}/creators?page=${page}&size=${size}`
    );
    return data;
  },

  getTopCreators: async (limit = 6): Promise<CreatorProfile[]> => {
    const { data } = await apiClient.get(
      `${BASE}/creators/top?limit=${limit}`
    );
    return data;
  },

  upgradeToCreator: async (): Promise<{ message: string }> => {
    const { data } = await apiClient.post(`${BASE}/upgrade-to-creator`);
    return data;
  },

  // ── Analytics (Phase 3) ───────────────────────────────────────────────────

  getAnalyticsOverview: async (): Promise<CreatorAnalyticsOverview> => {
    const { data } = await apiClient.get(`${ANALYTICS_BASE}/overview`);
    return data;
  },

  getContentAnalytics: async (
    page = 0,
    size = 20
  ): Promise<CreatorContentAnalytics[]> => {
    const { data } = await apiClient.get(
      `${ANALYTICS_BASE}/content?page=${page}&size=${size}`
    );
    return data;
  },

  getEarnings: async (): Promise<CreatorEarnings[]> => {
    const { data } = await apiClient.get(`${ANALYTICS_BASE}/earnings`);
    return data;
  },

  getTopContent: async (limit = 5): Promise<CreatorContentAnalytics[]> => {
    const { data } = await apiClient.get(
      `${ANALYTICS_BASE}/top-content?limit=${limit}`
    );
    return data;
  },

  // ── Attributions ─────────────────────────────────────────────────────────

  createAttribution: async (
    request: CreateContentAttributionRequest
  ): Promise<ContentAttribution> => {
    const { data } = await apiClient.post(ATTRIBUTION_BASE, request);
    return data;
  },

  getAttributionsByCreator: async (
    creatorId: number
  ): Promise<ContentAttribution[]> => {
    const { data } = await apiClient.get(`${ATTRIBUTION_BASE}/creator/${creatorId}`);
    return data;
  },
};
