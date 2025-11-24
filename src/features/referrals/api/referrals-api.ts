/**
 * API client for Referrals endpoints
 * Uses fetch with Next.js 15 optimizations
 */

import {
  ReferralLink,
  GenerateReferralLinkRequest,
  GenerateReferralLinkResponse,
  TrackClickRequest,
  ReferralStats,
  Earnings,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_PREFIX = '/api/v1/referrals';

/**
 * Create headers with optional auth token
 * @param token - Optional JWT token from NextAuth session
 */
function createHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Development: Use accessToken in Authorization header
  if (process.env.NODE_ENV === 'development' && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * Generate a new referral link
 * @param request - Request payload
 * @param token - Optional JWT token from NextAuth session
 */
export async function generateReferralLink(
  request: GenerateReferralLinkRequest,
  token?: string
): Promise<GenerateReferralLinkResponse> {
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}/links`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify(request),
    credentials: 'include', // Send httpOnly cookies
  });

  return handleResponse<GenerateReferralLinkResponse>(response);
}

/**
 * Get all referral links for the authenticated user
 * @param token - Optional JWT token from NextAuth session
 */
export async function getReferralLinks(token?: string): Promise<ReferralLink[]> {
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}/links`, {
    method: 'GET',
    headers: createHeaders(token),
    credentials: 'include',
    // Next.js 15: Cache for 60 seconds
    next: { revalidate: 60 },
  });

  return handleResponse<ReferralLink[]>(response);
}

/**
 * Get a specific referral link by ID
 * @param id - Referral link ID
 * @param token - Optional JWT token from NextAuth session
 */
export async function getReferralLinkById(id: string, token?: string): Promise<ReferralLink> {
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}/links/${id}`, {
    method: 'GET',
    headers: createHeaders(token),
    credentials: 'include',
    next: { revalidate: 60 },
  });

  return handleResponse<ReferralLink>(response);
}

/**
 * Track a click on a referral link (public endpoint)
 */
export async function trackClick(request: TrackClickRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}/clicks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  return handleResponse<void>(response);
}

/**
 * Get referral statistics for the authenticated user
 * @param affiliateId - Optional affiliate ID
 * @param token - Optional JWT token from NextAuth session
 */
export async function getReferralStats(affiliateId?: number, token?: string): Promise<ReferralStats> {
  const url = new URL(`${API_BASE_URL}${API_PREFIX}/stats`);
  if (affiliateId) {
    url.searchParams.append('affiliateId', affiliateId.toString());
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: createHeaders(token),
    credentials: 'include',
    // Revalidate every 5 minutes
    next: { revalidate: 300 },
  });

  return handleResponse<ReferralStats>(response);
}

/**
 * Get earnings for the authenticated user
 * @param currentPlan - Optional current plan filter
 * @param token - Optional JWT token from NextAuth session
 */
export async function getEarnings(currentPlan?: string, token?: string): Promise<Earnings> {
  const url = new URL(`${API_BASE_URL}${API_PREFIX}/earnings`);
  if (currentPlan) {
    url.searchParams.append('currentPlan', currentPlan);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: createHeaders(token),
    credentials: 'include',
    next: { revalidate: 300 },
  });

  return handleResponse<Earnings>(response);
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