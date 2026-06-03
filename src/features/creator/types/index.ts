export type CreatorTier = 'EMERGING' | 'RISING' | 'ESTABLISHED' | 'ELITE';

export interface CreatorProfile {
  userId: number;
  contentCount: number;
  followerCount: number;
  followingCount: number;
  totalViews: number;
  avgEngagementRate: number;
  tier: CreatorTier;
  lastContentAt?: string;
  updatedAt: string;
  // enriched
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  isVerified?: boolean;
}

export interface CreatorsPage {
  content: CreatorProfile[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export const CREATOR_TIER_LABELS: Record<CreatorTier, string> = {
  EMERGING: 'Emerging',
  RISING: 'Rising',
  ESTABLISHED: 'Established',
  ELITE: 'Elite',
};

export const CREATOR_TIER_COLORS: Record<CreatorTier, string> = {
  EMERGING: 'hsl(220 14% 60%)',
  RISING: 'hsl(38 92% 50%)',
  ESTABLISHED: 'hsl(177 100% 42%)',
  ELITE: 'hsl(252 100% 64%)',
};

// ── Analytics types (Phase 3 — Creator Economy) ────────────────────────────

export interface CreatorAnalyticsOverview {
  totalViews: number;
  totalLikes: number;
  totalSaves: number;
  totalBookings: number;
  totalEarnings: number;
  followerCount: number;
  contentCount: number;
  avgEngagementRate: number;
  tier: CreatorTier | null;
}

export interface CreatorContentAnalytics {
  contentPostId: number;
  caption: string | null;
  thumbnailUrl: string | null;
  views: number;
  likes: number;
  saves: number;
  bookingsGenerated: number;
  earnings: number;
  publishedAt: string | null;
}

export interface CreatorEarnings {
  contentPostId: number;
  contentCaption: string;
  bookingId: number | null;
  attributionType: 'DIRECT_VIEW' | 'SHARED_LINK' | 'CREATOR_LINK';
  amount: number;
  earnedAt: string;
}

// ── Attribution types ──────────────────────────────────────────────────────

export type AttributionType = 'DIRECT_VIEW' | 'SHARED_LINK' | 'CREATOR_LINK';

export interface ContentAttribution {
  id: number;
  bookingId: number | null;
  contentPostId: number;
  creatorId: number;
  referralLinkId: number | null;
  attributionType: AttributionType;
  createdAt: string;
}

export interface CreateContentAttributionRequest {
  bookingId?: number;
  contentPostId: number;
  creatorId: number;
  referralLinkId?: number;
  attributionType: AttributionType;
}
