/**
 * Helper to slugify a string, safe for URLs.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')         // Replace spaces with -
    .replace(/-+/g, '-')          // Collapse duplicate -
    .replace(/^-+|-+$/g, '');     // Trim trailing/leading -
}

/**
 * Generate couple Names slug for wedding invitation URLs.
 */
export function getCoupleSlug(groomName: string, brideName: string): string {
  // Use first name / first word if names are very long, or use full names if preferred.
  // The standard is to slugify the names provided.
  const groom = slugify(groomName.split(' ')[0] || groomName);
  const bride = slugify(brideName.split(' ')[0] || brideName);
  return `${groom}-and-${bride}`;
}

/**
 * Format raw video URLs (YouTube, Shorts, GDrive) into embeddable iframe URLs.
 */
export function getEmbedUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) {
    return url.replace('watch?v=', 'embed/').split('&')[0];
  }
  if (url.includes('youtu.be/')) {
    return url.replace('youtu.be/', 'youtube.com/embed/').split('?')[0];
  }
  if (url.includes('youtube.com/shorts/')) {
    return url.replace('youtube.com/shorts/', 'youtube.com/embed/').split('?')[0];
  }
  if (url.includes('drive.google.com/file/d/')) {
    return url.replace('/view', '/preview').split('?')[0];
  }
  return url;
}

