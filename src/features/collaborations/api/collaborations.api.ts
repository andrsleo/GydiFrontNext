/**
 * API Client for Collaborations endpoints
 * Uses apiClient (Axios) for CSRF token handling and authentication
 */

import { apiClient } from '@/lib/api/client';
import type {
  MarketplacePage,
  MarketplacePropertyDetail,
  CollaborationSettings,
  PitchCreatedResponse,
  PitchPage,
  PitchDetail,
  InboxPage,
  AcceptPitchResponse,
  DeclinePitchResponse,
  CounterOfferResponse,
  AgreementDetail,
  DeliveryAsset,
  ApproveDeliverableResponse,
  RevisionRequestedResponse,
  MarketplaceFilters,
} from '../types';

const BASE_PATH = '/api/v1/collaborations';

// ── Input types ──────────────────────────────────────────────────────────────

export interface CreatePitchInput {
  propertyId: number;
  introduction: string;
  portfolioUrl?: string;
  preferredCheckIn: string;
  preferredCheckOut: string;
  deliverables: { type: string; quantity: number; notes?: string }[];
  compensation: {
    type: string;
    nights?: number;
    amount?: number;
    currency?: string;
    bookingCommissionPct?: number;
    experienceItems?: string[];
  };
}

export interface CreateCounterOfferInput {
  message?: string;
  deliverables: { type: string; quantity: number }[];
  compensation: { type: string; nights?: number; amount?: number; currency?: string };
}

// ── API Object ───────────────────────────────────────────────────────────────

export const collaborationsApi = {
  /**
   * Get paginated marketplace listing
   * Public endpoint — ISR compatible
   */
  async getMarketplace(filters: MarketplaceFilters): Promise<MarketplacePage> {
    const params = new URLSearchParams();
    if (filters.country) params.append('country', filters.country);
    if (filters.city) params.append('city', filters.city);
    if (filters.propertyType) params.append('propertyType', filters.propertyType);
    if (filters.compensationType) params.append('compensationType', filters.compensationType);
    if (filters.page !== undefined) params.append('page', String(filters.page));
    if (filters.size !== undefined) params.append('size', String(filters.size));

    const query = params.toString();
    const { data } = await apiClient.get<MarketplacePage>(
      `${BASE_PATH}/marketplace${query ? `?${query}` : ''}`
    );
    return data;
  },

  /**
   * Get single marketplace property detail
   * Public endpoint
   */
  async getMarketplaceProperty(propertyId: number): Promise<MarketplacePropertyDetail> {
    const { data } = await apiClient.get<MarketplacePropertyDetail>(
      `${BASE_PATH}/marketplace/${propertyId}`
    );
    return data;
  },

  /**
   * Get host collaboration settings for a property
   * Requires authentication + HOST role
   */
  async getCollaborationSettings(propertyId: number): Promise<CollaborationSettings> {
    const { data } = await apiClient.get<CollaborationSettings>(
      `${BASE_PATH}/settings/properties/${propertyId}`
    );
    return data;
  },

  /**
   * Update host collaboration settings for a property
   * Requires authentication + HOST role
   * Property must be in PUBLISHED status to enable collaborations
   */
  async updateCollaborationSettings(
    propertyId: number,
    settings: { acceptCollaborations: boolean; acceptedCompensations: string[] }
  ): Promise<CollaborationSettings> {
    const { data } = await apiClient.put<CollaborationSettings>(
      `${BASE_PATH}/settings/properties/${propertyId}`,
      settings
    );
    return data;
  },

  /**
   * Submit a pitch from a creator to a host property
   * Requires authentication + CREATOR role
   */
  async createPitch(pitchData: CreatePitchInput): Promise<PitchCreatedResponse> {
    const { data } = await apiClient.post<PitchCreatedResponse>(
      `${BASE_PATH}/pitches`,
      pitchData
    );
    return data;
  },

  /**
   * Get current creator's pitches with optional filters
   * Requires authentication
   */
  async getMyPitches(params: {
    status?: string;
    page?: number;
    size?: number;
  }): Promise<PitchPage> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append('status', params.status);
    if (params.page !== undefined) searchParams.append('page', String(params.page));
    if (params.size !== undefined) searchParams.append('size', String(params.size));

    const query = searchParams.toString();
    const { data } = await apiClient.get<PitchPage>(
      `${BASE_PATH}/pitches/mine${query ? `?${query}` : ''}`
    );
    return data;
  },

  /**
   * Get full pitch detail including counter-offer history
   * Requires authentication
   */
  async getPitchDetail(pitchId: number): Promise<PitchDetail> {
    const { data } = await apiClient.get<PitchDetail>(`${BASE_PATH}/pitches/${pitchId}`);
    return data;
  },

  /**
   * Cancel a pending pitch
   * Requires authentication + ownership
   */
  async cancelPitch(pitchId: number): Promise<void> {
    await apiClient.post(`${BASE_PATH}/pitches/${pitchId}/cancel`);
  },

  /**
   * Get host's pitch inbox with optional filters
   * Requires authentication + HOST role
   */
  async getHostInbox(params: {
    status?: string;
    propertyId?: number;
    page?: number;
    size?: number;
  }): Promise<InboxPage> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append('status', params.status);
    if (params.propertyId !== undefined)
      searchParams.append('propertyId', String(params.propertyId));
    if (params.page !== undefined) searchParams.append('page', String(params.page));
    if (params.size !== undefined) searchParams.append('size', String(params.size));

    const query = searchParams.toString();
    const { data } = await apiClient.get<InboxPage>(
      `${BASE_PATH}/pitches/inbox${query ? `?${query}` : ''}`
    );
    return data;
  },

  /**
   * Accept a pitch and create an agreement
   * Requires authentication + HOST role
   */
  async acceptPitch(pitchId: number): Promise<AcceptPitchResponse> {
    const { data } = await apiClient.post<AcceptPitchResponse>(
      `${BASE_PATH}/pitches/${pitchId}/accept`
    );
    return data;
  },

  /**
   * Decline a pitch with an optional reason
   * Requires authentication + HOST role
   */
  async declinePitch(pitchId: number, reason: string): Promise<DeclinePitchResponse> {
    const { data } = await apiClient.post<DeclinePitchResponse>(
      `${BASE_PATH}/pitches/${pitchId}/decline`,
      { reason }
    );
    return data;
  },

  /**
   * Create a counter-offer on a pitch (max 3 rounds)
   * Requires authentication (HOST or CREATOR depending on round)
   */
  async createCounterOffer(
    pitchId: number,
    counterData: CreateCounterOfferInput
  ): Promise<CounterOfferResponse> {
    const { data } = await apiClient.post<CounterOfferResponse>(
      `${BASE_PATH}/pitches/${pitchId}/counter-offer`,
      counterData
    );
    return data;
  },

  /**
   * Get full agreement detail
   * Requires authentication
   */
  async getAgreement(agreementId: number): Promise<AgreementDetail> {
    const { data } = await apiClient.get<AgreementDetail>(
      `${BASE_PATH}/agreements/${agreementId}`
    );
    return data;
  },

  /**
   * Cancel an active agreement
   * Requires authentication
   */
  async cancelAgreement(agreementId: number): Promise<void> {
    await apiClient.post(`${BASE_PATH}/agreements/${agreementId}/cancel`);
  },

  /**
   * Upload a delivery asset for a specific deliverable
   * Requires authentication + CREATOR role
   */
  async uploadDeliveryAsset(
    agreementId: number,
    deliverableId: number,
    file: File
  ): Promise<DeliveryAsset> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post<DeliveryAsset>(
      `${BASE_PATH}/agreements/${agreementId}/deliverables/${deliverableId}/assets`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  },

  /**
   * Approve a submitted deliverable
   * Requires authentication + HOST role
   */
  async approveDeliverable(
    agreementId: number,
    deliverableId: number
  ): Promise<ApproveDeliverableResponse> {
    const { data } = await apiClient.post<ApproveDeliverableResponse>(
      `${BASE_PATH}/agreements/${agreementId}/deliverables/${deliverableId}/approve`
    );
    return data;
  },

  /**
   * Request a revision on a submitted deliverable
   * Requires authentication + HOST role
   */
  async requestRevision(
    agreementId: number,
    deliverableId: number,
    feedback: string
  ): Promise<RevisionRequestedResponse> {
    const { data } = await apiClient.post<RevisionRequestedResponse>(
      `${BASE_PATH}/agreements/${agreementId}/deliverables/${deliverableId}/revision`,
      { feedback }
    );
    return data;
  },
};
