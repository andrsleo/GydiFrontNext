/**
 * Image utility functions for handling backend image URLs
 */

/**
 * Extracts the path from a full backend image URL
 *
 * In development, returns the full backend URL so Next.js can load images from localhost:8080.
 * In production, extracts the pathname for CDN/S3 URLs.
 *
 * @param url - Full URL from backend (e.g., http://localhost:8080/uploads/properties/123/image.jpg)
 * @returns Full URL in dev or pathname in production, or placeholder if empty
 *
 * @example
 * ```ts
 * // Development
 * getImagePath('http://localhost:8080/uploads/properties/123/image.jpg')
 * // Returns: 'http://localhost:8080/uploads/properties/123/image.jpg'
 *
 * // Production
 * getImagePath('https://cdn.gydi.com/uploads/properties/123/image.jpg')
 * // Returns: 'https://cdn.gydi.com/uploads/properties/123/image.jpg'
 *
 * getImagePath(undefined)
 * // Returns: '/images/property-placeholder.jpg'
 * ```
 */
export function getImagePath(url: string | undefined | null): string {
  if (!url) return '/images/property-placeholder.jpg';

  try {
    const _urlObj = new URL(url);

    // In development, return full URL for backend images
    if (process.env.NODE_ENV === 'development' && url.includes('localhost:8080')) {
      return url;
    }

    // In production or for external URLs (S3, CDN), return the full URL
    return url;
  } catch {
    // If URL parsing fails, assume it's already a path
    return url;
  }
}

/**
 * Checks if an image URL is valid
 *
 * @param url - Image URL to validate
 * @returns true if URL is valid, false otherwise
 */
export function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    // Check if it's a valid relative path
    return url.startsWith('/');
  }
}