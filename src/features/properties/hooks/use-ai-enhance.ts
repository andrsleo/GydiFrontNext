'use client';

import { useMutation } from '@tanstack/react-query';

interface EnhanceRequest {
  field: 'title' | 'description';
  content: string;
}

interface EnhanceResponse {
  enhanced: string;
}

async function enhanceWithAI(request: EnhanceRequest): Promise<EnhanceResponse> {
  const response = await fetch('/api/ai/enhance-property', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to enhance content');
  }

  return response.json();
}

export function useAiEnhance() {
  const mutation = useMutation({
    mutationFn: enhanceWithAI,
  });

  return {
    enhance: mutation.mutate,
    isPending: mutation.isPending,
    result: mutation.data?.enhanced ?? null,
    error: mutation.error,
    reset: mutation.reset,
  };
}
