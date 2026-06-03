/**
 * TypeScript types for Content feature
 * Matches backend DTOs from Spring Boot
 */

export type ContentType = 'VIDEO' | 'PHOTO' | 'CAROUSEL';
export type ContentStatus =
  | 'DRAFT'
  | 'PROCESSING'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ARCHIVED'
  | 'HIDDEN';
export type MediaType = 'VIDEO' | 'IMAGE';
export type ProcessingStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';

export interface ContentMedia {
  id: number;
  contentPostId: number;
  originalUrl: string;
  processedUrl?: string;
  thumbnailUrl?: string;
  mediaType: MediaType;
  displayOrder: number;
  durationSeconds?: number;
  width?: number;
  height?: number;
  fileSizeBytes?: number;
  processingStatus: ProcessingStatus;
  createdAt: string;
}

export interface ContentPost {
  id: number;
  creatorId: number;
  propertyId?: number;
  caption?: string;
  type: ContentType;
  status: ContentStatus;
  thumbnailUrl?: string;
  viewCount: number;
  likeCount: number;
  saveCount: number;
  commentCount: number;
  shareCount: number;
  engagementScore: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  media?: ContentMedia[];
  // enriched by API
  creatorDisplayName?: string;
  creatorAvatarUrl?: string;
  propertyTitle?: string;
  propertySlug?: string;
}

export interface ContentFeedPage {
  content: ContentPost[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface CreateContentPostRequest {
  caption?: string;
  type: ContentType;
  propertyId?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
