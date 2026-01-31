/**
 * CSRF Token Utilities
 *
 * Utilities for obtaining and managing CSRF tokens for API requests.
 * Implements the "Double Submit Cookie" pattern used by Spring Security.
 */

/**
 * Retrieves the value of a cookie by name.
 *
 * @param name - The name of the cookie to retrieve
 * @returns The cookie value, or null if not found
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    // SSR - no cookies available
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }

  return null;
}

/**
 * Gets the CSRF token from the cookie.
 *
 * <p>
 * The CSRF token is stored in a cookie named "XSRF-TOKEN" by Spring Security's
 * CookieCsrfTokenRepository. This cookie is set with HttpOnly=false, which allows
 * JavaScript to read it.
 * </p>
 *
 * <p>
 * <strong>Security Note:</strong> The CSRF token itself is not a secret.
 * The security comes from the Same-Origin Policy, which prevents attacker
 * websites from reading the cookie value.
 * </p>
 *
 * @returns The CSRF token value, or null if not found
 *
 * @see {@link https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html#csrf-integration-javascript}
 */
export function getCsrfToken(): string | null {
  return getCookie('XSRF-TOKEN');
}

/**
 * Fetches a new CSRF token from the backend.
 *
 * <p>
 * This function makes a GET request to the `/api/csrf` endpoint,
 * which triggers Spring Security to generate a new CSRF token and
 * set it in the XSRF-TOKEN cookie.
 * </p>
 *
 * <p>
 * <strong>When to use:</strong>
 * </p>
 * <ul>
 *   <li>On application startup (in a React useEffect or Next.js layout)</li>
 *   <li>After session expiration/refresh</li>
 *   <li>When CSRF token is missing from cookies</li>
 * </ul>
 *
 * @param apiUrl - The base URL of the API (defaults to NEXT_PUBLIC_API_URL)
 * @returns Promise that resolves with the CSRF token details
 *
 * @example
 * ```typescript
 * // Fetch CSRF token on app initialization
 * useEffect(() => {
 *   fetchCsrfToken().then(token => {
 *   });
 * }, []);
 * ```
 */
export async function fetchCsrfToken(
  apiUrl: string = typeof window === 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080')
    : '/api/proxy'  // Use proxy in browser for Safari compatibility
): Promise<{ token: string; headerName: string; parameterName: string }> {
  const response = await fetch(`${apiUrl}/api/csrf`, {
    method: 'GET',
    credentials: 'include', // Important: include cookies
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch CSRF token: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Gets the CSRF token, fetching a new one if necessary.
 *
 * <p>
 * This function first checks if a CSRF token exists in the cookie.
 * If not found, it fetches a new one from the backend.
 * </p>
 *
 * @returns Promise that resolves with the CSRF token value
 *
 * @example
 * ```typescript
 * const token = await ensureCsrfToken();
 * // Use token in request header: { 'X-XSRF-TOKEN': token }
 * ```
 */
export async function ensureCsrfToken(): Promise<string> {
  // Try to get existing token from cookie
  let token = getCsrfToken();

  if (!token) {
    // No token found - fetch a new one
    const csrfData = await fetchCsrfToken();
    token = csrfData.token;
  }

  return token;
}
