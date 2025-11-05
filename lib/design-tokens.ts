/**
 * Design Tokens - Pizza Falchi Design System
 * S-Tier UI/UX Standards
 *
 * Centralized design tokens for consistency across the application.
 * Based on authentic Italian pizza culture and food truck aesthetics.
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Primary Brand Colors (from logo and Italian heritage)
  primary: {
    red: '#C41E1A',      // Burgundy red
    redDark: '#A01816',  // Darker burgundy
    redLight: '#D64743', // Lighter red
    yellow: '#E6D5B3',   // Cream/beige
    yellowDark: '#D4C19A', // Darker cream
    yellowLight: '#F2E8D5', // Lighter cream
  },

  // Accent Colors
  accent: {
    gold: '#D4AF37',     // Metallic trim
    green: '#009246',    // Italian flag green
    basil: '#2D5016',    // Basil green (vegetarian indicator)
  },

  // Soft/Background Colors
  soft: {
    red: '#E8857A',      // Soft red
    redLight: '#F2A79F', // Lighter soft red
    redLighter: '#FFE5E3', // Lightest soft red
    yellow: '#F9F3E6',   // Soft yellow
    yellowLight: '#FFF9F0', // Warm cream
    yellowLighter: '#FFFCF7', // Lightest cream
  },

  // Supporting Colors
  charcoal: '#2C2C2C',   // Dark text

  // Semantic Colors
  semantic: {
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fee2e2',
    info: '#3b82f6',
    infoLight: '#dbeafe',
  },

  // Neutral Grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  fontFamily: {
    sans: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  fontSize: {
    // Display (hero sections)
    display: {
      desktop: '4rem',    // 64px
      tablet: '3.5rem',   // 56px
      mobile: '3rem',     // 48px
    },

    // Headings
    h1: {
      desktop: '3rem',    // 48px
      tablet: '2.5rem',   // 40px
      mobile: '2.25rem',  // 36px
    },
    h2: {
      desktop: '2.25rem', // 36px
      tablet: '2rem',     // 32px
      mobile: '1.875rem', // 30px
    },
    h3: {
      desktop: '1.875rem', // 30px
      tablet: '1.5rem',    // 24px
      mobile: '1.5rem',    // 24px
    },
    h4: {
      desktop: '1.5rem',   // 24px
      tablet: '1.25rem',   // 20px
      mobile: '1.25rem',   // 20px
    },
    h5: {
      desktop: '1.25rem',  // 20px
      tablet: '1.125rem',  // 18px
      mobile: '1.125rem',  // 18px
    },
    h6: {
      desktop: '1.125rem', // 18px
      tablet: '1rem',      // 16px
      mobile: '1rem',      // 16px
    },

    // Body
    body: {
      large: '1.125rem',   // 18px
      base: '1rem',        // 16px
      small: '0.875rem',   // 14px
      xs: '0.75rem',       // 12px
    },
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ============================================================================
// SPACING (8px grid system)
// ============================================================================

export const spacing = {
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px
  40: '10rem',      // 160px
  48: '12rem',      // 192px
  64: '16rem',      // 256px
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  // Standard shadows
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',

  // Hover shadows (more pronounced)
  hoverBase: '0 4px 8px 0 rgb(0 0 0 / 0.12)',
  hoverMd: '0 8px 16px -2px rgb(0 0 0 / 0.15)',
  hoverLg: '0 16px 32px -4px rgb(0 0 0 / 0.18)',
  hoverXl: '0 24px 48px -8px rgb(0 0 0 / 0.22)',
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',     // 4px
  base: '0.5rem',    // 8px
  md: '0.75rem',     // 12px
  lg: '1rem',        // 16px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '2rem',     // 32px
  full: '9999px',
} as const;

// ============================================================================
// TRANSITIONS & ANIMATIONS
// ============================================================================

export const transitions = {
  // Duration
  duration: {
    instant: '100ms',
    fast: '150ms',
    base: '300ms',
    slow: '500ms',
    slower: '700ms',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  // Common combinations
  default: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// Framer Motion variants
export const motionVariants = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  // Slide animations
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  },
  slideDown: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  },
  slideLeft: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  },
  slideRight: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
  },

  // Scale animations
  scaleIn: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  },
  scaleUp: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },

  // Stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  },
  staggerItem: {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  },

  // Hover effects
  hoverLift: {
    rest: { y: 0, scale: 1 },
    hover: {
      y: -4,
      scale: 1.02,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  },
  hoverScale: {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  },
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  sm: '640px',   // Mobile large
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Desktop large
  '2xl': '1536px', // Desktop extra large
} as const;

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
  max: 9999,
} as const;

// ============================================================================
// COMPONENT SIZING
// ============================================================================

export const components = {
  // Buttons
  button: {
    padding: {
      sm: '0.5rem 1rem',     // 8px 16px
      base: '0.75rem 1.5rem', // 12px 24px
      lg: '1rem 2rem',        // 16px 32px
    },
    height: {
      sm: '2rem',      // 32px
      base: '2.75rem', // 44px (WCAG touch target)
      lg: '3.5rem',    // 56px
    },
    iconSize: {
      sm: '1rem',      // 16px
      base: '1.25rem', // 20px
      lg: '1.5rem',    // 24px
    },
  },

  // Inputs
  input: {
    padding: {
      sm: '0.5rem 0.75rem',   // 8px 12px
      base: '0.75rem 1rem',    // 12px 16px
      lg: '1rem 1.25rem',      // 16px 20px
    },
    height: {
      sm: '2rem',      // 32px
      base: '2.75rem', // 44px
      lg: '3.5rem',    // 56px
    },
  },

  // Cards
  card: {
    padding: {
      sm: '1rem',      // 16px
      base: '1.5rem',  // 24px
      lg: '2rem',      // 32px
    },
  },

  // Icons
  icon: {
    size: {
      xs: '0.75rem',   // 12px
      sm: '1rem',      // 16px
      base: '1.25rem', // 20px
      md: '1.5rem',    // 24px
      lg: '2rem',      // 32px
      xl: '2.5rem',    // 40px
      '2xl': '3rem',   // 48px
    },
    strokeWidth: {
      thin: 1,
      base: 2,
      thick: 2.5,
    },
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create transition string for CSS
 */
export const createTransition = (
  property: string | string[],
  duration: keyof typeof transitions.duration = 'base',
  easing: keyof typeof transitions.easing = 'easeInOut'
): string => {
  const props = Array.isArray(property) ? property : [property];
  return props
    .map((prop) => `${prop} ${transitions.duration[duration]} ${transitions.easing[easing]}`)
    .join(', ');
};

/**
 * Get color with opacity (rgba)
 */
export const withOpacity = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Convert spacing token to pixels
 */
export const spacingToPx = (value: keyof typeof spacing): number => {
  const rem = parseFloat(spacing[value]);
  return rem * 16;
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ColorToken = typeof colors;
export type TypographyToken = typeof typography;
export type SpacingToken = typeof spacing;
export type ShadowToken = typeof shadows;
export type BorderRadiusToken = typeof borderRadius;
export type TransitionToken = typeof transitions;
export type BreakpointToken = typeof breakpoints;
export type ZIndexToken = typeof zIndex;
export type ComponentToken = typeof components;
