/**
 * Inserts Cloudinary auto-format + auto-quality transformations into a delivery
 * URL so the browser gets WebP/AVIF at an appropriate quality. Non-Cloudinary
 * URLs (or already-transformed ones) are returned unchanged.
 */
export function optimizedImageUrl(
  url: string | null | undefined,
): string | null {
  if (!url) return null
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url
  }
  if (url.includes('/upload/f_auto')) return url
  return url.replace('/upload/', '/upload/f_auto,q_auto/')
}
