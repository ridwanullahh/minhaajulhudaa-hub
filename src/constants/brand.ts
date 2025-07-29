
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
    accent: '#4f46e5', // Indigo for education
    gradient: 'from-amber-50 via-orange-50 to-yellow-50'
  },
  masjid: {
    primary: BRAND_COLORS.primary[800],
    secondary: BRAND_COLORS.accent[600],
    accent: '#059669', // Emerald for spirituality
    gradient: 'from-emerald-50 via-teal-50 to-green-50'
  },
  charity: {
    primary: BRAND_COLORS.primary[600],
    secondary: BRAND_COLORS.accent[400],
    accent: '#dc2626', // Red for urgency/help
    gradient: 'from-rose-50 via-pink-50 to-red-50'
  },
  travels: {
    primary: BRAND_COLORS.primary[700],
    secondary: BRAND_COLORS.accent[500],
    accent: '#2563eb', // Blue for travel/adventure
    gradient: 'from-blue-50 via-sky-50 to-cyan-50'
  }
} as const;

export type PlatformType = keyof typeof PLATFORM_THEMES;
