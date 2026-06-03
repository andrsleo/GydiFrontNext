'use client';

import { useMutation } from '@tanstack/react-query';
import { socialApi } from '../api/social.api';
import type { SharePlatform } from '../types';

export function useShareContent(contentPostId: number) {
  return useMutation({
    mutationFn: (platform: SharePlatform) =>
      socialApi.registerShare(contentPostId, platform),
  });
}
