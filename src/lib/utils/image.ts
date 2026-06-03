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
 * Generates a Cloudinary blur placeholder URL.
 * Returns a 20px wide, low quality version of the image for use as
 * Next.js Image blurDataURL (progressive loading).
 *
 * @param url - A Cloudinary image URL
 * @returns Low-res URL for blur placeholder, or empty string if not Cloudinary
 */
export function getBlurDataURL(cloudinaryUrl: string | undefined | null): string {
  if (!cloudinaryUrl || !cloudinaryUrl.includes('res.cloudinary.com')) return '';
  if (cloudinaryUrl.includes('/video/')) return ''; // Not for videos
  return cloudinaryUrl.replace('/upload/', '/upload/w_20,h_20,q_10,f_auto/');
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

/**
 * Resolves a media URL from the backend.
 *
 * Handles three cases:
 *  - Absolute URL (http/https) → returned as-is (with Cloudinary optimization if applicable)
 *  - Root-relative URL (/uploads/...) → returned as-is
 *  - Bare filename (uuid.ext) → prepended with backend uploads base URL
 *
 * @param url - Raw URL from backend (may be absolute, root-relative, or bare filename)
 * @param folder - Storage folder used when URL is a bare filename (default: "content")
 * @returns Fully qualified URL ready for display, or undefined if empty
 */
export function resolveMediaUrl(
  url: string | undefined | null,
  folder = 'content'
): string | undefined {
  if (!url) return undefined;

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return optimizeCloudinaryUrl(url);
  }

  if (url.startsWith('/')) {
    return url;
  }

  // Bare filename — prepend backend base URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
  return `${apiUrl}/uploads/${folder}/${url}`;
}