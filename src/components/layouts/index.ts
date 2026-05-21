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

export const layouts = {
  'elegant-cream': ElegantCream,
  'luxury-emerald': LuxuryEmerald,
  'rose-garden': RoseGarden,
  'royal-blue': RoyalBlue,
  'golden-classic': GoldenClassic,
  'islamic-grace': IslamicGrace,
  'islamic-minimalist': IslamicClassic,
  'islamic-midnight': IslamicMidnight,
  'islamic-arabesque': IslamicArabesque,
  'christian-elegant': ChristianElegant,
  'hindu-mandala': HinduMandala,
  'buddhist-zen': BuddhistZen,
  'confucian-oriental': ConfucianOriental,
  'premium-charcoal': PremiumCharcoal,
} as const;

export type LayoutType = keyof typeof layouts;
