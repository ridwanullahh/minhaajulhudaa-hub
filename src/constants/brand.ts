
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

export const PLATFORM_THEMES = {
  school: {
    primary: BRAND_COLORS.primary[700],
    secondary: BRAND_COLORS.accent[500],
    accent: BRAND_COLORS.primary[600],
    gradient: 'from-amber-50 via-orange-50 to-yellow-50',
    heroGradient: 'from-amber-900/20 via-orange-800/10 to-yellow-700/20',
    cardGradient: 'from-amber-100/50 to-orange-100/30',
    textGradient: 'from-amber-800 via-orange-700 to-yellow-600'
  },
  masjid: {
    primary: BRAND_COLORS.primary[700],
    secondary: BRAND_COLORS.accent[600],
    accent: BRAND_COLORS.primary[500],
    gradient: 'from-emerald-50 via-teal-50 to-cyan-50',
    heroGradient: 'from-emerald-900/20 via-teal-800/10 to-cyan-700/20',
    cardGradient: 'from-emerald-100/50 to-teal-100/30',
    textGradient: 'from-emerald-800 via-teal-700 to-cyan-600'
  },
  charity: {
    primary: BRAND_COLORS.primary[700],
    secondary: BRAND_COLORS.accent[400],
    accent: BRAND_COLORS.primary[500],
    gradient: 'from-rose-50 via-pink-50 to-red-50',
    heroGradient: 'from-rose-900/20 via-pink-800/10 to-red-700/20',
    cardGradient: 'from-rose-100/50 to-pink-100/30',
    textGradient: 'from-rose-800 via-pink-700 to-red-600'
  },
  travels: {
    primary: BRAND_COLORS.primary[700],
    secondary: BRAND_COLORS.accent[500],
    accent: BRAND_COLORS.primary[600],
    gradient: 'from-blue-50 via-indigo-50 to-purple-50',
    heroGradient: 'from-blue-900/20 via-indigo-800/10 to-purple-700/20',
    cardGradient: 'from-blue-100/50 to-indigo-100/30',
    textGradient: 'from-blue-800 via-indigo-700 to-purple-600'
  }
} as const;

export type PlatformType = keyof typeof PLATFORM_THEMES;
