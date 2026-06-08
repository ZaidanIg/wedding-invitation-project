import ElegantCream from './ElegantCream';
import LuxuryEmerald from './LuxuryEmerald';
import RoseGarden from './RoseGarden';
import RoyalBlue from './RoyalBlue';
import GoldenClassic from './GoldenClassic';
import IslamicGrace from './IslamicGrace';
import IslamicClassic from './IslamicMinimalist';
import IslamicMidnight from './IslamicMidnight';
import IslamicArabesque from './IslamicArabesque';
import ChristianElegant from './ChristianElegant';
import HinduMandala from './HinduMandala';
import BuddhistZen from './BuddhistZen';
import ConfucianOriental from './ConfucianOriental';
import PremiumCharcoal from './PremiumCharcoal';
import PremiumJavanese from './PremiumJavanese';
import ElegantSundanese from './ElegantSundanese';

export const layouts = {
  // ── Modern Neutral Slugs (used for new invitations) ──────────
  'elegant-cream':    ElegantCream,
  'luxury-emerald':   LuxuryEmerald,
  'rose-garden':      RoseGarden,
  'royal-blue':       RoyalBlue,
  'golden-classic':   GoldenClassic,

  // ── New neutral slugs (map to existing layout components) ────
  'sand-dunes':       IslamicClassic,
  'midnight-velvet':  IslamicMidnight,
  'arabesque-pattern': IslamicArabesque,
  'forest-grace':     IslamicGrace,
  'garden-chapel':    ChristianElegant,
  'mandala-fusion':   HinduMandala,
  'zen-garden':       BuddhistZen,
  'oriental-luxe':    ConfucianOriental,
  'onyx-premium':       PremiumCharcoal,
  'batik-heritage':     PremiumJavanese,
  'elegant-sundanese':  ElegantSundanese,

  // ── Legacy slugs — kept for backward compat (old DB records) ─
  'islamic-grace':        IslamicGrace,
  'islamic-minimalist':   IslamicClassic,
  'islamic-midnight':     IslamicMidnight,
  'islamic-arabesque':    IslamicArabesque,
  'christian-elegant':    ChristianElegant,
  'hindu-mandala':        HinduMandala,
  'buddhist-zen':         BuddhistZen,
  'confucian-oriental':   ConfucianOriental,
  'premium-charcoal':     PremiumCharcoal,
  'premium-javanese':     PremiumJavanese,
} as const;

export type LayoutType = keyof typeof layouts;

export const LAYOUT_LABELS: Record<string, string> = (() => {
  const allLabels: Record<string, string> = {
    'elegant-cream':     'Ivory Bloom',
    'royal-blue':        'Azure Classic',
    'rose-garden':       'Blush Garden',
    'golden-classic':    'Golden Classic',
    'luxury-emerald':    'Emerald Forest',
    'sand-dunes':        'Sand Dunes',
    'midnight-velvet':   'Midnight Velvet',
    'arabesque-pattern': 'Arabesque Pattern',
    'forest-grace':      'Forest Grace',
    'garden-chapel':     'Garden Chapel',
    'mandala-fusion':    'Mandala Fusion',
    'zen-garden':        'Zen Garden',
    'oriental-luxe':     'Oriental Luxe',
    'onyx-premium':       'Onyx Premium',
    'batik-heritage':     'Batik Heritage',
    'elegant-sundanese':  'Elegant Sundanese',
  };

  // Hide experimental themes in production (main branch)
  if (process.env.NEXT_PUBLIC_APP_URL === 'https://sahinaja.com') {
    const experimentalThemes = [
      'forest-grace',
      'garden-chapel',
      'mandala-fusion',
      'zen-garden',
      'oriental-luxe',
      // Legacy slugs just in case
      'islamic-grace',
      'christian-elegant',
      'hindu-mandala',
      'buddhist-zen',
      'confucian-oriental'
    ];
    
    experimentalThemes.forEach(theme => {
      delete allLabels[theme];
    });
  }

  return allLabels;
})();
