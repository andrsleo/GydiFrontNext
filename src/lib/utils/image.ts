/**
 * Image utility functions for handling backend image URLs
 */

/**
 * Adds automatic format and quality optimization to Cloudinary URLs.
 *
 * Inserts `f_auto,q_auto` after `/upload/` so Cloudinary converts images
 * to the best browser-compatible format (WebP, AVIF, JPEG).
 * This is essential for formats like HEIC that browsers cannot display natively.
 *
 * @param url - A Cloudinary URL
 * @returns The URL with f_auto,q_auto transformation, or original if not Cloudinary
 */
function optimizeCloudinaryUrl(url: string): string {
  if (!url.includes('res.cloudinary.com')) return url;

  // Already has f_auto transformation
  if (url.includes('/f_auto')) return url;

  // Insert f_auto,q_auto after /upload/ (before version or folder)
  return url.replace('/upload/', '/upload/f_auto,q_auto/');
}

/**
 * Returns a display-ready image URL.
 *
 * For Cloudinary URLs, adds `f_auto,q_auto` so formats like HEIC are
 * automatically converted to browser-compatible formats (WebP/JPEG).
 * Returns a placeholder for empty/null URLs.
 *
 * @param url - Image URL from backend
 * @returns Optimized URL ready for display, or placeholder if empty
 */
export function getImagePath(url: string | undefined | null): string {
  if (!url) return '/images/property-placeholder.jpg';

  return optimizeCloudinaryUrl(url);
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