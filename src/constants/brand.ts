/**
 * Brand tokens and per-platform theme configuration
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * The color system uses CSS variables (see src/index.css) so that
 * per-platform accents can be applied by adding a platform-NAME class
 * to the layout root. This avoids the broken template-literal class
 * names that Tailwind's JIT cannot see (the previous build constructed
 * gradient class names by interpolating hex codes into bracket
 * notation, which produced unparseable CSS).
 *
 * Platforms share:
 *   - Neutral foundation (warm off-white background, soft slate text)
 *   - Primary teal for global actions
 *   - Warm gold accent for Islamic aesthetic touches
 *
 * Each platform has its own accent (set via .platform-<name> on the
 * layout wrapper):
 *   - school  : amber   (knowledge, warmth)
 *   - masjid  : teal    (spiritual calm)
 *   - charity : rose    (compassion)
 *   - travels : indigo  (journey, trust)
 */

export type PlatformType = 'school' | 'masjid' | 'charity' | 'travels';

export interface PlatformTheme {
  /** CSS class to apply on the layout root to activate the accent */
  platformClass: string;
  /** Human-readable platform name */
  name: string;
  /** Short tagline */
  tagline: string;
  /** Layout style hint for page composition */
  layoutStyle: 'academic' | 'spiritual' | 'compassionate' | 'journey';
}

export const PLATFORM_THEMES: Record<PlatformType, PlatformTheme> = {
  school: {
    platformClass: 'platform-school',
    name: 'Minhaajulhudaa Islamic School',
    tagline: 'Authentic Islamic education with academic excellence',
    layoutStyle: 'academic',
  },
  masjid: {
    platformClass: 'platform-masjid',
    name: 'Minhaajulhudaa Masjid',
    tagline: 'A community anchored in worship and knowledge',
    layoutStyle: 'spiritual',
  },
  charity: {
    platformClass: 'platform-charity',
    name: 'Minhaajulhudaa Charity',
    tagline: 'Serving the Ummah with compassion and accountability',
    layoutStyle: 'compassionate',
  },
  travels: {
    platformClass: 'platform-travels',
    name: 'Minhaajulhudaa Travels',
    tagline: 'Your companion for Hajj, Umrah, and spiritual journeys',
    layoutStyle: 'journey',
  },
};

/**
 * Reusable gradient class strings - all static so Tailwind JIT can
 * see and generate them. These use the CSS-variable-backed `platform`
 * color tokens so the same class produces a different gradient on each
 * platform.
 */
export const GRADIENT_CLASSES = {
  /** Subtle platform-tinted hero background */
  heroSubtle: 'bg-platform-accent-soft',
  /** Platform accent solid */
  accentSolid: 'bg-platform-accent text-platform-accent-foreground',
  /** Soft card surface */
  cardSurface: 'bg-card border border-border',
  /** Muted section divider */
  sectionMuted: 'bg-secondary text-secondary-foreground',
} as const;

export default PLATFORM_THEMES;
