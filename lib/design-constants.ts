/**
 * Design System Constants for Pizza Falchi
 *
 * These constants ensure consistency across the application
 * and align with the design philosophy from CLAUDE.md
 */

export const SPACING = {
  // Grid gaps for card layouts
  cardGap: 'gap-6',

  // Section spacing
  sectionPadding: 'py-20 md:py-28',
  sectionGap: 'space-y-16 md:space-y-20',

  // Card interior padding
  cardPadding: 'p-6',
  cardPaddingLg: 'p-8',

  // Content gaps
  contentGap: 'gap-4',
  contentGapSm: 'gap-2',

  // Container padding
  containerPadding: 'px-4 sm:px-6 lg:px-8',

  // Margins
  marginBottom: 'mb-8',
  marginBottomLg: 'mb-12',
} as const;

export const TYPOGRAPHY = {
  // Headings
  h1: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black',
  h2: 'text-3xl sm:text-4xl md:text-5xl font-black',
  h3: 'text-2xl sm:text-3xl md:text-4xl font-bold',
  h4: 'text-xl sm:text-2xl md:text-3xl font-bold',
  h5: 'text-lg sm:text-xl md:text-2xl font-bold',
  h6: 'text-base sm:text-lg md:text-xl font-bold',

  // Body text
  body: 'text-base leading-relaxed',
  bodyLg: 'text-lg leading-relaxed',
  bodySm: 'text-sm leading-relaxed',

  // Special
  lead: 'text-xl sm:text-2xl leading-relaxed',
} as const;

export const ROUNDED = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  full: 'rounded-full',
} as const;

export const SHADOWS = {
  sm: 'shadow-sm',
  md: 'shadow-lg',
  lg: 'shadow-2xl',
  xl: 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]',
} as const;

export const TRANSITIONS = {
  fast: 'transition-all duration-150',
  base: 'transition-all duration-200',
  slow: 'transition-colors duration-300',
} as const;

export const GRADIENTS = {
  primary: 'bg-gradient-to-r from-primary-red to-soft-red',
  secondary: 'bg-gradient-to-r from-primary-yellow to-soft-yellow',
  dark: 'bg-gradient-to-br from-charcoal via-gray-700 to-gray-900',
  cream: 'bg-gradient-to-br from-warm-cream to-primary-yellow/10',
} as const;

export const BORDERS = {
  default: 'border-2 border-gray-100',
  accent: 'border-2 border-primary-red',
  light: 'border border-gray-200',
  glass: 'border-2 border-white/20',
} as const;

export const HOVER_EFFECTS = {
  scale: 'hover:scale-105 active:scale-100',
  lift: 'hover:-translate-y-2',
  shadow: 'hover:shadow-2xl',
  glow: 'hover:shadow-lg hover:shadow-primary-red/20',
} as const;

/**
 * WCAG AA compliant text colors
 * Ensuring minimum 4.5:1 contrast ratio for normal text
 * and 3:1 for large text on white backgrounds
 */
export const ACCESSIBLE_COLORS = {
  // Primary text - very dark gray (contrast ratio 15.8:1 on white)
  textPrimary: 'text-gray-900',
  // Secondary text - dark gray (contrast ratio 7:1 on white)
  textSecondary: 'text-gray-700',
  // Tertiary text - medium gray (contrast ratio 4.6:1 on white - WCAG AA compliant)
  textTertiary: 'text-gray-600',
  // Placeholder text - meets WCAG AA for large text only
  textPlaceholder: 'text-gray-500',
  // Muted text - for non-essential information
  textMuted: 'text-gray-500',
} as const;
