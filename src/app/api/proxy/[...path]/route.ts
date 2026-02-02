/**
 * API Proxy Route - Safari Cookie Compatibility
 *
 * This server-side proxy solves Safari's third-party cookie blocking (ITP).
 *
 * PROBLEM:
 * - Frontend: gydi-front-next.vercel.app (Domain A)
 * - Backend: gydimicroservices-production.up.railway.app (Domain B)
 * - Safari blocks cookies from Domain B as "third-party"
 *
 * SOLUTION:
 * - All API calls go through this proxy: /api/proxy/...
 * - Browser sends cookies to Domain A (first-party, works in Safari)
 * - Proxy forwards request to Backend with cookies
 * - Proxy forwards backend cookies back to browser
 *
 * This makes all cookies "first-party" from Safari's perspective.
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Headers that should NOT be forwarded to the backend
 */
const EXCLUDED_REQUEST_HEADERS = [
  'host',
  'connection',
  'content-length',
  'transfer-encoding',
];

/**
 * Headers that should NOT be forwarded to the client
 */
const EXCLUDED_RESPONSE_HEADERS = [
  'content-encoding',
  'content-length',
  'transfer-encoding',
  'connection',
];

/**
 * Forward request to backend
 */
async function proxyRequest(
  request: NextRequest,
  path: string
): Promise<Response> {
  const url = `${BACKEND_URL}/${path}${request.nextUrl.search}`;

  // Build headers to forward
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!EXCLUDED_REQUEST_HEADERS.includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  // Forward cookies from the request
  const cookies = request.headers.get('cookie');
  if (cookies) {
    headers.set('cookie', cookies);
  }

  // Prepare request body for non-GET requests
  let body: BodyInit | null = null;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      // For file uploads, pass the raw body
      body = await request.blob();
    } else if (contentType.includes('application/json')) {
      body = await request.text();
    } else {
      body = await request.text();
    }
  }

  // Make request to backend
  const backendResponse = await fetch(url, {
    method: request.method,
    headers,
    body,
    // Don't follow redirects - let the client handle them
    redirect: 'manual',
  });

  return backendResponse;
}

/**
 * Build response with forwarded headers and cookies
 *
 * NOTE: HTTP status 204 (No Content) and 304 (Not Modified) cannot have a body.
 * The Response constructor will throw an error if we try to create a response
 * with a body for these status codes.
 */
function buildResponse(backendResponse: Response, body: ArrayBuffer): NextResponse {
  const status = backendResponse.status;

  // Status codes that must not have a body (RFC 7230)
  const noBodyStatuses = [204, 304];
  const hasNoBody = noBodyStatuses.includes(status);

  const response = new NextResponse(hasNoBody ? null : body, {
    status,
    statusText: backendResponse.statusText,
  });

  // Forward headers from backend
  backendResponse.headers.forEach((value, key) => {
    if (!EXCLUDED_RESPONSE_HEADERS.includes(key.toLowerCase())) {
      // For Set-Cookie headers, forward them directly
      if (key.toLowerCase() === 'set-cookie') {
        response.headers.append(key, value);
      } else {
        response.headers.set(key, value);
      }
    }
  });

  return response;
}

/**
 * Handle all HTTP methods
 */
async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  try {
    const { path } = await params;
    const fullPath = path.join('/');

    // Proxy the request
    const backendResponse = await proxyRequest(request, fullPath);

    // Read the response body
    const body = await backendResponse.arrayBuffer();

    // Build and return the response
    return buildResponse(backendResponse, body);
  } catch (error) {
    console.error('[API Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Proxy error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 502 }
    );
  }
}

// Export handlers for all HTTP methods
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;

// Configure the route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
