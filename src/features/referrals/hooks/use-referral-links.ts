/**
 * TanStack Query hooks for Referral Links
 */
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { generateReferralLink, getReferralLinks, getReferralLinkById } from '../api/referrals-api';
import type { GenerateReferralLinkRequest, ReferralLink, GenerateReferralLinkResponse } from '../types';
import { toast } from 'sonner';

// Query keys
export const referralKeys = {
  all: ['referrals'] as const,
  links: () => [...referralKeys.all, 'links'] as const,
  link: (id: string) => [...referralKeys.links(), id] as const,
  stats: () => [...referralKeys.all, 'stats'] as const,
  earnings: () => [...referralKeys.all, 'earnings'] as const,
};

/**
 * Hook to fetch all referral links
 */
export function useReferralLinks() {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;

  return useQuery({
    queryKey: referralKeys.links(),
    queryFn: () => getReferralLinks(token),
    staleTime: 1000 * 60, // 1 minute
    enabled: !!session, // Only fetch when authenticated
  });
}

/**
 * Hook to fetch a single referral link by ID
 */
export function useReferralLink(id: string) {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;

  return useQuery({
    queryKey: referralKeys.link(id),
    queryFn: () => getReferralLinkById(id, token),
    enabled: !!id && !!session,
    staleTime: 1000 * 60,
  });
}

/**
 * Hook to generate a new referral link
 */
export function useGenerateReferralLink() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;

  return useMutation({
    mutationFn: (request: GenerateReferralLinkRequest) => generateReferralLink(request, token),
    onSuccess: (data: GenerateReferralLinkResponse) => {
      // Invalidate links query to refetch
      queryClient.invalidateQueries({ queryKey: referralKeys.links() });

      toast.success('Referral link created!', {
        description: `Short code: ${data.shortCode}`,
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to create referral link', {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to get active links count
 */
export function useActiveLinksCount() {
  const { data: links } = useReferralLinks();
  return links?.filter((link) => link.status === 'ACTIVE').length ?? 0;
}

/**
 * Hook to copy referral link to clipboard
 */
export function useCopyReferralLink() {
  return async (fullUrl: string) => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
      console.error('Copy error:', error);
    }
  };
}