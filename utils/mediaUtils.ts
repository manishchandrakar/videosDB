/**
 * Converts an absolute upload URL (e.g. http://localhost:5000/uploads/videos/x.mp4)
 * into a relative path (/uploads/videos/x.mp4) so the browser fetches it through
 * the Next.js /uploads rewrite proxy instead of cross-origin.
 */
export function getMediaPath(url: string | null | undefined): string {
  if (!url) return '';
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}
