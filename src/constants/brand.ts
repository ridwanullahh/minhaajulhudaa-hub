
// Brand colors and design tokens
export const BRAND_COLORS = {
  primary: {
    900: '#2d1810', // Darkest brown
    800: '#441f14', // Dark brown
    700: '#552c20', // Base brand brown
    600: '#6b3826', // Medium brown
    500: '#8b4513', // Lighter brown
    400: '#a0522d', // Light brown
    300: '#cd853f', // Sand brown
    200: '#ddb892', // Very light brown
    100: '#f5deb3', // Wheat
    50: '#fffafa'   // Snow white with warm tint
  },
  accent: {
    600: '#b8860b', // Dark goldenrod
    500: '#dd9d08', // Golden yellow
    400: '#f0b90b', // Light gold
    300: '#ffd700', // Gold
    200: '#ffe135', // Light yellow
    100: '#fff8dc'  // Cornsilk
  },
  neutral: {
    900: '#1a1a1a',
    800: '#2d2d2d',
    700: '#404040',
    600: '#525252',
    500: '#737373',
    400: '#a3a3a3',
    300: '#d4d4d4',
    200: '#e5e5e5',
    100: '#f5f5f5',
    50: '#fafafa'
  },
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  }
} as const;

// Unified brand colors for all platforms with creative layout variations
export const PLATFORM_THEMES = {
  school: {
    primary: BRAND_COLORS.primary[700],
    secondary: BRAND_COLORS.accent[500],
    accent: BRAND_COLORS.primary[600],
    gradient: `from-[${BRAND_COLORS.primary[50]}] via-[${BRAND_COLORS.accent[100]}] to-[${BRAND_COLORS.primary[100]}]`,
    heroGradient: `from-[${BRAND_COLORS.primary[900]}]/20 via-[${BRAND_COLORS.primary[800]}]/10 to-[${BRAND_COLORS.accent[600]}]/20`,
    cardGradient: `from-[${BRAND_COLORS.primary[100]}]/50 to-[${BRAND_COLORS.accent[100]}]/30`,
    textGradient: `from-[${BRAND_COLORS.primary[800]}] via-[${BRAND_COLORS.primary[700]}] to-[${BRAND_COLORS.accent[600]}]`,
    layoutStyle: 'academic' // Academic grid layouts, structured sections
  },
  masjid: {
    primary: BRAND_COLORS.primary[700],
    secondary: BRAND_COLORS.accent[500],
    accent: BRAND_COLORS.primary[600],
    gradient: `from-[${BRAND_COLORS.primary[50]}] via-[${BRAND_COLORS.accent[100]}] to-[${BRAND_COLORS.primary[100]}]`,
    heroGradient: `from-[${BRAND_COLORS.primary[900]}]/20 via-[${BRAND_COLORS.primary[800]}]/10 to-[${BRAND_COLORS.accent[600]}]/20`,
    cardGradient: `from-[${BRAND_COLORS.primary[100]}]/50 to-[${BRAND_COLORS.accent[100]}]/30`,
    textGradient: `from-[${BRAND_COLORS.primary[800]}] via-[${BRAND_COLORS.primary[700]}] to-[${BRAND_COLORS.accent[600]}]`,
    layoutStyle: 'spiritual' // Circular elements, flowing layouts, prayer-focused
  },
  charity: {
    primary: BRAND_COLORS.primary[700],
    secondary: BRAND_COLORS.accent[500],
    accent: BRAND_COLORS.primary[600],
    gradient: `from-[${BRAND_COLORS.primary[50]}] via-[${BRAND_COLORS.accent[100]}] to-[${BRAND_COLORS.primary[100]}]`,
    heroGradient: `from-[${BRAND_COLORS.primary[900]}]/20 via-[${BRAND_COLORS.primary[800]}]/10 to-[${BRAND_COLORS.accent[600]}]/20`,
    cardGradient: `from-[${BRAND_COLORS.primary[100]}]/50 to-[${BRAND_COLORS.accent[100]}]/30`,
    textGradient: `from-[${BRAND_COLORS.primary[800]}] via-[${BRAND_COLORS.primary[700]}] to-[${BRAND_COLORS.accent[600]}]`,
    layoutStyle: 'compassionate' // Heart-centered designs, impact-focused layouts
  },
  travels: {
    primary: BRAND_COLORS.primary[700],
    secondary: BRAND_COLORS.accent[500],
    accent: BRAND_COLORS.primary[600],
    gradient: `from-[${BRAND_COLORS.primary[50]}] via-[${BRAND_COLORS.accent[100]}] to-[${BRAND_COLORS.primary[100]}]`,
    heroGradient: `from-[${BRAND_COLORS.primary[900]}]/20 via-[${BRAND_COLORS.primary[800]}]/10 to-[${BRAND_COLORS.accent[600]}]/20`,
    cardGradient: `from-[${BRAND_COLORS.primary[100]}]/50 to-[${BRAND_COLORS.accent[100]}]/30`,
    textGradient: `from-[${BRAND_COLORS.primary[800]}] via-[${BRAND_COLORS.primary[700]}] to-[${BRAND_COLORS.accent[600]}]`,
    layoutStyle: 'journey' // Adventure-themed layouts, destination-focused designs
  }
} as const;

export type PlatformType = keyof typeof PLATFORM_THEMES;
