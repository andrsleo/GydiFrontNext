'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { creatorApi } from '../api/creator.api';

export function useUpgradeToCreator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => creatorApi.upgradeToCreator(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creators'] });
    },
  });
}
