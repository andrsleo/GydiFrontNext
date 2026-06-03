'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { socialApi } from '../api/social.api';

export function useToggleFollow(targetUserId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => socialApi.toggleFollow(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['creator-profile', targetUserId],
      });
    },
  });
}
