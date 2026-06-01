/**
 * TypeScript types for Collaborations feature
 * Matches backend DTOs from Spring Boot collaborations bounded context
 */

// ── Enums ──────────────────────────────────────────────────────────────────

export type PitchStatus =
  | 'PENDING'
  | 'COUNTERED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'COMPLETED';

export type CompensationType =
  | 'free_stay'
  | 'cash'
  | 'hybrid'
  | 'affiliate'
  | 'experience_exchange';

export type DeliverableType =
  | 'reel'
  | 'photo'
  | 'story'
  | 'video'
  | 'blog_post'
  | 'tiktok';

export type AgreementStatus =
  | 'ACTIVE'
  | 'IN_PROGRESS'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export type ContentRightType =
  | 'organic_social'
  | 'paid_ads'
  | 'website'
  | 'email'
  | 'unlimited'
  | 'time_limited';

export type DeliverableStatus =
  | 'PENDING'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REVISION_REQUESTED';

export type AssetReviewStatus = 'PENDING' | 'APPROVED' | 'REVISION_REQUESTED';

export type OfferedBy = 'HOST' | 'CREATOR';

// ── Value Objects ──────────────────────────────────────────────────────────

export interface Compensation {
  type: CompensationType;
  nights?: number;
  amount?: number;
  currency?: string;
  bookingCommissionPct?: number;
  experienceItems?: string[];
}

export interface Deliverable {
  type: DeliverableType;
  quantity: number;
  notes?: string;
}

export interface ContentRight {
  id?: number;
  type: ContentRightType;
  durationMonths?: 3 | 6 | 12 | 24;
}

// ── Marketplace ────────────────────────────────────────────────────────────

export interface MarketplacePropertySummary {
  propertyId: number;
  slug: string;
  title: string;
  location: { country: string; city: string };
  propertyType: string;
  thumbnailUrl?: string;
  acceptedCompensations: CompensationType[];
  activePitchCount: number;
}

export interface MarketplacePropertyDetail {
  propertyId: number;
  slug: string;
  title: string;
  description?: string;
  location: { country: string; city: string; address?: string };
  propertyType: string;
  images: { url: string; displayOrder: number }[];
  amenities: string[];
  acceptedCompensations: CompensationType[];
  hostId: number;
  hostDisplayName: string;
}

export interface MarketplacePage {
  content: MarketplacePropertySummary[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// ── Pitch ──────────────────────────────────────────────────────────────────

export interface CounterOffer {
  id: number;
  roundNumber: number;
  offeredBy: OfferedBy;
  message?: string;
  deliverables: Deliverable[];
  compensation: Compensation;
  createdAt: string;
}

export interface PitchSummary {
  pitchId: number;
  propertyId: number;
  propertyTitle: string;
  propertyThumbnail?: string;
  status: PitchStatus;
  compensation: Compensation;
  counterOfferRounds: number;
  expiresAt: string;
  createdAt: string;
}

export interface PitchDetail {
  pitchId: number;
  propertyId: number;
  hostId: number;
  creatorId: number;
  introduction: string;
  portfolioUrl?: string;
  status: PitchStatus;
  counterOfferRounds: number;
  canCounterOffer: boolean;
  preferredCheckIn: string;
  preferredCheckOut: string;
  expiresAt: string;
  deliverables: Deliverable[];
  compensation: Compensation;
  counterOffers: CounterOffer[];
  createdAt: string;
}

export interface PitchCreatedResponse {
  pitchId: number;
  status: PitchStatus;
  expiresAt: string;
  createdAt: string;
}

export interface PitchPage {
  content: PitchSummary[];
  totalElements: number;
  totalPages: number;
}

// ── Host Inbox ─────────────────────────────────────────────────────────────

export interface InboxPitchItem {
  pitchId: number;
  propertyId: number;
  propertyTitle: string;
  creatorId: number;
  creatorDisplayName: string;
  creatorTier: string;
  creatorFollowers: number;
  creatorEngagementRate: number;
  creatorVerified: boolean;
  portfolioUrl?: string;
  status: PitchStatus;
  compensation: Compensation;
  deliverablesSummary: string;
  expiresAt: string;
  createdAt: string;
}

export interface InboxPage {
  content: InboxPitchItem[];
  totalElements: number;
  totalPages: number;
}

// ── Negotiation Responses ──────────────────────────────────────────────────

export interface AcceptPitchResponse {
  pitchId: number;
  status: PitchStatus;
  agreementId: number;
}

export interface DeclinePitchResponse {
  pitchId: number;
  status: PitchStatus;
}

export interface CounterOfferResponse {
  pitchId: number;
  counterOfferId: number;
  roundNumber: number;
  status: PitchStatus;
  canCounterOfferAgain: boolean;
  expiresAt: string;
}

// ── Agreement ──────────────────────────────────────────────────────────────

export interface AgreementDeliverable {
  id: number;
  type: DeliverableType;
  quantity: number;
  status: DeliverableStatus;
  revisionFeedback?: string;
}

export interface AgreementDetail {
  agreementId: number;
  pitchId: number;
  propertyId: number;
  propertyTitle: string;
  hostId: number;
  creatorId: number;
  status: AgreementStatus;
  checkInDate: string;
  checkOutDate: string;
  deliveryDeadline: string;
  postingDeadline: string;
  compensation: Compensation;
  deliverables: AgreementDeliverable[];
  contentRights: ContentRight[];
  cancellationPolicy: string;
  createdAt: string;
}

// ── Delivery Assets ────────────────────────────────────────────────────────

export interface DeliveryAsset {
  assetId: number;
  fileUrl: string;
  fileType: 'mp4' | 'jpg' | 'png' | 'zip';
  fileSizeBytes: number;
  reviewStatus: AssetReviewStatus;
}

export interface ApproveDeliverableResponse {
  deliverableId: number;
  status: DeliverableStatus;
  agreementStatus: AgreementStatus;
}

export interface RevisionRequestedResponse {
  deliverableId: number;
  status: DeliverableStatus;
  feedback: string;
}

// ── Collaboration Settings ─────────────────────────────────────────────────

export interface CollaborationSettings {
  propertyId: number;
  acceptCreatorCollaborations: boolean;
  acceptedCompensations: CompensationType[];
}

// ── Marketplace Filters ────────────────────────────────────────────────────

export interface MarketplaceFilters {
  country?: string;
  city?: string;
  propertyType?: string;
  compensationType?: CompensationType;
  page?: number;
  size?: number;
}
