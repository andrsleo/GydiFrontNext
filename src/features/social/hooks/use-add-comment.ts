'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { socialApi } from '../api/social.api';
import type { AddCommentRequest } from '../types';

export function useAddComment(contentPostId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddCommentRequest) =>
      socialApi.addComment(contentPostId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', contentPostId] });
      queryClient.invalidateQueries({ queryKey: ['content', contentPostId] });
    },
  });
}
