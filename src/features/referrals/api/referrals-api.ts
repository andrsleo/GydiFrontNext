/**
 * API client for Referrals endpoints
 * Uses apiClient (Axios) for proper CSRF token handling and authentication
 */

import { apiClient } from '@/lib/api/client';
import {
  ReferralLink,
  GenerateReferralLinkRequest,
  GenerateReferralLinkResponse,
  TrackClickRequest,
  ReferralStats,
  Earnings,
} from '../types';

/**
 * Generate a new referral link
 * @param request - Request payload
 */
export async function generateReferralLink(
  request: GenerateReferralLinkRequest,
): Promise<GenerateReferralLinkResponse> {
  const response = await apiClient.post<GenerateReferralLinkResponse>(
    '/api/v1/referrals/links',
    request
  );
  return response.data;
}

/**
 * Get all referral links for the authenticated user
 */
export async function getReferralLinks(): Promise<ReferralLink[]> {
  const response = await apiClient.get<ReferralLink[]>('/api/v1/referrals/links');
  return response.data;
}

/**
 * Get a specific referral link by ID
 * @param id - Referral link ID
 */
export async function getReferralLinkById(id: string): Promise<ReferralLink> {
  const response = await apiClient.get<ReferralLink>(`/api/v1/referrals/links/${id}`);
  return response.data;
}

/**
 * Track a click on a referral link (public endpoint)
 */
export async function trackClick(request: TrackClickRequest): Promise<void> {
  await apiClient.post<void>('/api/v1/referrals/clicks', request);
}

/**
 * Get referral statistics for the authenticated user
 * @param affiliateId - Optional affiliate ID
 */
export async function getReferralStats(affiliateId?: number): Promise<ReferralStats> {
  const params = affiliateId ? { affiliateId } : {};
  const response = await apiClient.get<ReferralStats>('/api/v1/referrals/stats', { params });
  return response.data;
}

/**
 * Get earnings for the authenticated user
 * @param currentPlan - Optional current plan filter
 */
export async function getEarnings(currentPlan?: string): Promise<Earnings> {
  const params = currentPlan ? { currentPlan } : {};
  const response = await apiClient.get<Earnings>('/api/v1/referrals/earnings', { params });
  return response.data;
}

/**
 * Helper: Get client IP address
 */
export async function getClientIpAddress(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return '0.0.0.0';
  }
}

/**
 * Helper: Generate browser fingerprint
 */
export function generateFingerprint(): string {
  if (typeof window === 'undefined') return '';

  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.width + 'x' + screen.height,
    screen.colorDepth,
  ];

  // Simple hash function
  const hash = components.join('|');
  let hashNum = 0;
  for (let i = 0; i < hash.length; i++) {
    hashNum = ((hashNum << 5) - hashNum) + hash.charCodeAt(i);
    hashNum = hashNum & hashNum;
  }

  return Math.abs(hashNum).toString(36);
}