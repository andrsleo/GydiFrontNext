export type SharePlatform =
  | 'WHATSAPP'
  | 'INSTAGRAM'
  | 'TWITTER'
  | 'FACEBOOK'
  | 'TIKTOK'
  | 'COPY_LINK'
  | 'OTHER';

export interface ToggleLikeResponse {
  liked: boolean;
  likeCount: number;
}

export interface ToggleSaveResponse {
  saved: boolean;
  saveCount: number;
}

export interface CommentDto {
  id: number;
  contentPostId: number;
  userId: number;
  body: string;
  parentCommentId?: number;
  status: 'VISIBLE' | 'HIDDEN' | 'DELETED';
  createdAt: string;
  updatedAt?: string;
  // enriched
  authorDisplayName?: string;
  authorAvatarUrl?: string;
}

export interface AddCommentRequest {
  body: string;
  parentCommentId?: number;
}

export interface InteractionState {
  liked: boolean;
  saved: boolean;
  following: boolean;
}
