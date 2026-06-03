'use client';
import { useCallback } from 'react';
import { contentApi } from '../api/content.api';

export function useRegisterView() {
  const registerView = useCallback(async (contentPostId: number) => {
    try {
      await contentApi.registerView(contentPostId);
    } catch {
      // Silently ignore view registration failures
    }
  }, []);

  return { registerView };
}
