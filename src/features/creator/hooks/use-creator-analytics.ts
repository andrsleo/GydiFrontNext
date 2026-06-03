'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creatorApi } from '../api/creator.api';
import type { CreateContentAttributionRequest } from '../types';
import { toast } from 'sonner';

export function useCreatorAnalyticsOverview() {
  return useQuery({
    queryKey: ['creator-analytics', 'overview'],
    queryFn: () => creatorApi.getAnalyticsOverview(),
    staleTime: 5 * 60_000,
  });
}

export function useCreatorContentAnalytics(page = 0, size = 20) {
  return useQuery({
    queryKey: ['creator-analytics', 'content', page, size],
    queryFn: () => creatorApi.getContentAnalytics(page, size),
    staleTime: 5 * 60_000,
  });
}

export function useCreatorEarnings() {
  return useQuery({
    queryKey: ['creator-analytics', 'earnings'],
    queryFn: () => creatorApi.getEarnings(),
    staleTime: 5 * 60_000,
  });
}

export function useCreatorTopContent(limit = 5) {
  return useQuery({
    queryKey: ['creator-analytics', 'top-content', limit],
    queryFn: () => creatorApi.getTopContent(limit),
    staleTime: 10 * 60_000,
  });
}

export function useCreateAttribution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateContentAttributionRequest) =>
      creatorApi.createAttribution(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-analytics'] });
    },
    onError: (error: Error) => {
      toast.error(`Error registering attribution: ${error.message}`);
    },
  });
}
