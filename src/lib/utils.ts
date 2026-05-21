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
  return `${groom}-dan-${bride}`;
}
