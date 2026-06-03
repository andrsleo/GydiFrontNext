'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { socialApi } from '../api/social.api';

export function useToggleSave(contentPostId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => socialApi.toggleSave(contentPostId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', contentPostId] });
    },
  });
}
