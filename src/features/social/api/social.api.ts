import { apiClient } from '@/lib/api/client';
import type {
  ToggleLikeResponse,
  ToggleSaveResponse,
  CommentDto,
  AddCommentRequest,
  SharePlatform,
} from '../types';
import type { PageResponse } from '@/features/content/types';

const BASE = '/api/v1/social';

export interface FollowUserDto {
  userId: number;
  followedAt: string;
}

export interface SavedItemDto {
  contentPostId: number;
  createdAt: string;
}

export const socialApi = {
  toggleFollow: async (userId: number): Promise<{ following: boolean }> => {
    const { data } = await apiClient.post(`${BASE}/follow/${userId}`);
    return data;
  },

  getFollowers: async (
    userId: number,
    page = 0,
    size = 20
  ): Promise<PageResponse<FollowUserDto>> => {
    const { data } = await apiClient.get(
      `${BASE}/followers/${userId}?page=${page}&size=${size}`
    );
    return data;
  },

  getFollowing: async (
    userId: number,
    page = 0,
    size = 20
  ): Promise<PageResponse<FollowUserDto>> => {
    const { data } = await apiClient.get(
      `${BASE}/following/${userId}?page=${page}&size=${size}`
    );
    return data;
  },

  toggleLike: async (contentPostId: number): Promise<ToggleLikeResponse> => {
    const { data } = await apiClient.post(`${BASE}/like/${contentPostId}`);
    return data;
  },

  toggleSave: async (contentPostId: number): Promise<ToggleSaveResponse> => {
    const { data } = await apiClient.post(`${BASE}/save/${contentPostId}`);
    return data;
  },

  getSavedContent: async (
    page = 0,
    size = 12
  ): Promise<PageResponse<SavedItemDto>> => {
    const { data } = await apiClient.get(
      `${BASE}/saves?page=${page}&size=${size}`
    );
    return data;
  },

  getComments: async (
    contentPostId: number,
    page = 0,
    size = 20
  ): Promise<PageResponse<CommentDto>> => {
    const { data } = await apiClient.get(
      `${BASE}/comments/${contentPostId}?page=${page}&size=${size}`
    );
    return data;
  },

  addComment: async (
    contentPostId: number,
    request: AddCommentRequest
  ): Promise<CommentDto> => {
    const { data } = await apiClient.post(
      `${BASE}/comments/${contentPostId}`,
      request
    );
    return data;
  },

  updateComment: async (
    commentId: number,
    body: string
  ): Promise<CommentDto> => {
    const { data } = await apiClient.put(`${BASE}/comments/${commentId}`, {
      body,
    });
    return data;
  },

  deleteComment: async (commentId: number): Promise<void> => {
    await apiClient.delete(`${BASE}/comments/${commentId}`);
  },

  registerShare: async (
    contentPostId: number,
    platform: SharePlatform
  ): Promise<void> => {
    await apiClient.post(
      `${BASE}/share/${contentPostId}?platform=${platform}`
    );
  },
};
