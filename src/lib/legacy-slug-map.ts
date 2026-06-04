// ============================================================
// Legacy Slug Map — Backward Compatibility
// Maps old religion-specific slug keys to new neutral slugs.
// Used by InvitationCard to resolve layouts from old DB records.
// New invitations will store the new neutral slugs directly.
// ============================================================

export const LEGACY_SLUG_MAP: Record<string, string> = {
  'islamic-minimalist': 'sand-dunes',
  'islamic-midnight':   'midnight-velvet',
  'islamic-arabesque':  'arabesque-pattern',
  'islamic-grace':      'forest-grace',
  'christian-elegant':  'garden-chapel',
  'hindu-mandala':      'mandala-fusion',
  'buddhist-zen':       'zen-garden',
  'confucian-oriental': 'oriental-luxe',
  'premium-charcoal':   'onyx-premium',
  'premium-javanese':   'batik-heritage',
};

/**
 * Resolves a potentially legacy layout slug to its current neutral equivalent.
 * Returns the input unchanged if it's already a modern slug.
 */
export function resolveLayoutSlug(slug: string): string {
  return LEGACY_SLUG_MAP[slug] ?? slug;
}
