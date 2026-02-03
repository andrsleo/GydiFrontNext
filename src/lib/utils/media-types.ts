/**
 * Media type detection utilities.
 *
 * Provides MIME type resolution with extension-based fallback
 * for browsers that don't report correct MIME types (e.g., Chrome for HEIC files).
 */

/**
 * MIME type mapping by file extension.
 * Used as fallback when `file.type` is empty or unrecognized.
 */
const EXTENSION_TO_MIME: Record<string, string> = {
  // Images
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.svg': 'image/svg+xml',
  // Videos
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.avi': 'video/x-msvideo',
  '.mkv': 'video/x-matroska',
};

/**
 * Allowed MIME types for image uploads.
 * Includes all formats supported by Cloudinary.
 */
export const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/avif',
  'image/gif',
  'image/bmp',
]);

/**
 * Allowed MIME types for video uploads.
 */
export const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
]);

/**
 * Accept string for image file inputs.
 * Includes both MIME types and file extensions for broad browser support.
 */
export const IMAGE_ACCEPT = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/avif',
  'image/gif',
  'image/bmp',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.heic',
  '.heif',
  '.avif',
  '.gif',
  '.bmp',
].join(',');

/**
 * Accept string for video file inputs.
 */
export const VIDEO_ACCEPT = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  '.mp4',
  '.webm',
  '.mov',
  '.avi',
].join(',');

/**
 * Resolves the MIME type of a file.
 *
 * Uses `file.type` when available, falls back to extension-based detection.
 * This is necessary because some browsers (Chrome, Firefox) report empty
 * `file.type` for formats like HEIC/HEIF.
 *
 * @param file - The file to resolve the MIME type for
 * @returns The resolved MIME type, or empty string if unknown
 */
export function resolveFileType(file: File): string {
  if (file.type && file.type !== 'application/octet-stream') {
    return file.type;
  }

  const name = file.name.toLowerCase();
  const dotIndex = name.lastIndexOf('.');
  if (dotIndex === -1) return '';

  const ext = name.slice(dotIndex);
  return EXTENSION_TO_MIME[ext] ?? '';
}

/**
 * Checks whether a file is an allowed image type.
 */
export function isAllowedImageType(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.has(resolveFileType(file));
}

/**
 * Checks whether a file is an allowed video type.
 */
export function isAllowedVideoType(file: File): boolean {
  return ALLOWED_VIDEO_TYPES.has(resolveFileType(file));
}

/**
 * Human-readable label for allowed image formats.
 */
export const IMAGE_FORMATS_LABEL = 'JPG, PNG, WEBP, HEIC, AVIF, GIF, BMP';

/**
 * Human-readable label for allowed video formats.
 */
export const VIDEO_FORMATS_LABEL = 'MP4, WEBM, MOV, AVI';
