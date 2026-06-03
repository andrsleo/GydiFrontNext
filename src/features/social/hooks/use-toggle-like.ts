'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { socialApi } from '../api/social.api';

export function useToggleLike(contentPostId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => socialApi.toggleLike(contentPostId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', contentPostId] });
      queryClient.invalidateQueries({ queryKey: ['content-feed'] });
    },
  });
}
