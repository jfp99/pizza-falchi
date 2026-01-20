/**
 * Animation Library - Framer Motion Variants
 * S-Tier Animation System for Pizza Falchi
 *
 * Rich, professional animations with smooth easing and natural feel.
 * All animations are optimized for performance and respect reduced-motion preferences.
 */

import { Variants, Transition } from 'framer-motion';

// ============================================================================
// EASING PRESETS
// ============================================================================

export const easing = {
  // Standard easings
  linear: [0, 0, 1, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],

  // Custom easings
  sharp: [0.4, 0, 0.6, 1],
  spring: [0.34, 1.56, 0.64, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.65, 0, 0.35, 1],

  // Anticipate (slight back before forward)
  anticipate: [0.36, 0, 0.66, -0.56],
} as const;

// ============================================================================
// TRANSITION PRESETS
// ============================================================================

export const transitionPresets = {
  fast: { duration: 0.15, ease: easing.easeOut },
  base: { duration: 0.2, ease: easing.easeInOut },  // REFINED: 0.2s instead of 0.3s
  slow: { duration: 0.3, ease: easing.smooth },     // REFINED: 0.3s instead of 0.5s
  spring: { type: 'spring' as const, stiffness: 300, damping: 30 }, // Increased damping
  // REMOVED: springBouncy - Too playful for premium brand
  springSmooth: { type: 'spring' as const, stiffness: 200, damping: 35 }, // Calmer
} as const;

// ============================================================================
// FADE ANIMATIONS
// ============================================================================

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitionPresets.base },
  exit: { opacity: 0, transition: transitionPresets.fast },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ...transitionPresets.base, ease: easing.easeOut },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitionPresets.fast,
  },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ...transitionPresets.base, ease: easing.easeOut },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: transitionPresets.fast,
  },
};

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { ...transitionPresets.base, ease: easing.easeOut },
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: transitionPresets.fast,
  },
};

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { ...transitionPresets.base, ease: easing.easeOut },
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: transitionPresets.fast,
  },
};

// ============================================================================
// SCALE ANIMATIONS
// ============================================================================

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: transitionPresets.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitionPresets.fast,
  },
};

export const scaleInBounce: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: transitionPresets.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: transitionPresets.fast,
  },
};

export const scaleUp: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { ...transitionPresets.base, ease: easing.easeOut },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitionPresets.fast,
  },
};

// ============================================================================
// SLIDE ANIMATIONS
// ============================================================================

export const slideInUp: Variants = {
  initial: { y: '100%', opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { ...transitionPresets.slow, ease: easing.easeOut },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: transitionPresets.base,
  },
};

export const slideInDown: Variants = {
  initial: { y: '-100%', opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { ...transitionPresets.slow, ease: easing.easeOut },
  },
  exit: {
    y: '-100%',
    opacity: 0,
    transition: transitionPresets.base,
  },
};

export const slideInLeft: Variants = {
  initial: { x: '-100%', opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { ...transitionPresets.slow, ease: easing.easeOut },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: transitionPresets.base,
  },
};

export const slideInRight: Variants = {
  initial: { x: '100%', opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { ...transitionPresets.slow, ease: easing.easeOut },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: transitionPresets.base,
  },
};

// ============================================================================
// STAGGER ANIMATIONS
// ============================================================================

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ...transitionPresets.base, ease: easing.easeOut },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitionPresets.fast,
  },
};

export const staggerItemScale: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: transitionPresets.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitionPresets.fast,
  },
};

// ============================================================================
// HOVER EFFECTS - STANDARDIZED (3 tiers only)
// ============================================================================

/**
 * Card hover - For product cards, list items, clickable containers
 * Scale: 1.02, Lift: -4px
 */
export const hoverCard: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 4px 12px -4px rgba(28, 20, 16, 0.10)',
  },
  hover: {
    y: -4,
    scale: 1.02,
    boxShadow: '0 12px 32px -8px rgba(28, 20, 16, 0.16)',
    transition: { duration: 0.2, ease: easing.easeOut },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

/**
 * Button hover - For CTAs and interactive buttons
 * Scale: 1.03
 */
export const hoverButton: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.03,
    transition: { duration: 0.15, ease: easing.easeOut },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

/**
 * Icon hover - For icon buttons and small interactive elements
 * Scale: 1.05 (reduced from 1.10)
 */
export const hoverIcon: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.15, ease: easing.easeOut },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

// DEPRECATED ALIASES - For backward compatibility
/** @deprecated Use hoverCard instead */
export const hoverLift = hoverCard;
/** @deprecated Use hoverIcon instead */
export const hoverScale = hoverIcon;
// REMOVED: hoverGlow - Too flashy for premium brand
// REMOVED: hoverRotate - Too playful for premium brand

// ============================================================================
// BUTTON ANIMATIONS
// ============================================================================

export const buttonPress: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.03,  // STANDARDIZED
    transition: transitionPresets.fast,
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

// REMOVED: buttonPulse - Too playful for premium brand

// ============================================================================
// CARD ANIMATIONS
// ============================================================================

/** @deprecated Use hoverCard instead - standardized hover system */
export const cardHover: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 4px 12px -4px rgba(28, 20, 16, 0.10)',
  },
  hover: {
    y: -4,      // REFINED: -4px instead of -8px
    scale: 1.02,
    boxShadow: '0 12px 32px -8px rgba(28, 20, 16, 0.16)',
    transition: { duration: 0.2, ease: easing.easeOut },
  },
};

export const cardEnter: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...transitionPresets.slow, ease: easing.easeOut },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitionPresets.fast,
  },
};

// ============================================================================
// MODAL & OVERLAY ANIMATIONS
// ============================================================================

export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitionPresets.fast },
  exit: { opacity: 0, transition: transitionPresets.fast },
};

export const modalContent: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...transitionPresets.base, ease: easing.easeOut },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: transitionPresets.fast,
  },
};

export const drawerSlide: Variants = {
  initial: { x: '100%' },
  animate: {
    x: 0,
    transition: { ...transitionPresets.slow, ease: easing.easeOut },
  },
  exit: {
    x: '100%',
    transition: { ...transitionPresets.base, ease: easing.easeIn },
  },
};

// ============================================================================
// FORM & INPUT ANIMATIONS
// ============================================================================

export const inputFocus: Variants = {
  rest: { scale: 1 },
  focus: {
    scale: 1.01,
    transition: transitionPresets.fast,
  },
};

export const labelFloat: Variants = {
  empty: {
    y: 0,
    scale: 1,
    color: '#6b7280',
  },
  filled: {
    y: -24,
    scale: 0.85,
    color: '#C41E1A',
    transition: transitionPresets.base,
  },
};

export const errorShake: Variants = {
  initial: { x: 0 },
  animate: {
    x: [-10, 10, -10, 10, 0],
    transition: { duration: 0.4 },
  },
};

export const successCheck: Variants = {
  initial: { scale: 0, rotate: -180, opacity: 0 },
  animate: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: transitionPresets.spring,
  },
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

export const spinnerRotate: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const pulseGlow: Variants = {
  animate: {
    opacity: [1, 0.5, 1],
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const skeletonShimmer: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ============================================================================
// PAGE TRANSITION ANIMATIONS
// ============================================================================

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: easing.easeIn,
    },
  },
};

export const pageSlide: Variants = {
  initial: { x: '100%', opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: easing.easeIn,
    },
  },
};

// ============================================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================================

export const scrollReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easing.easeOut,
    },
  },
};

export const scrollRevealScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easing.easeOut,
    },
  },
};

export const scrollRevealStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// ============================================================================
// NOTIFICATION ANIMATIONS
// ============================================================================

export const toastSlideIn: Variants = {
  initial: {
    opacity: 0,
    x: 100,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { ...transitionPresets.spring, ease: easing.easeOut },
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.95,
    transition: transitionPresets.fast,
  },
};

// REMOVED: badgePulse - Too playful, use CSS animate-badge-pulse instead (opacity only)

// ============================================================================
// SPECIAL EFFECTS
// ============================================================================

// REMOVED: floatAnimation - Too playful for premium brand

export const rippleEffect: Variants = {
  initial: { scale: 0, opacity: 0.5 },
  animate: {
    scale: 2,
    opacity: 0,
    transition: { duration: 0.6, ease: easing.easeOut },
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a custom stagger container with specified delay
 */
export const createStaggerContainer = (
  staggerDelay: number = 0.1,
  childrenDelay: number = 0
): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: childrenDelay,
    },
  },
});

/**
 * Create a custom fade in with direction
 */
export const createFadeIn = (
  direction: 'up' | 'down' | 'left' | 'right' | 'none' = 'none',
  distance: number = 20
): Variants => {
  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return {
    initial: { opacity: 0, ...directionMap[direction] },
    animate: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { ...transitionPresets.base, ease: easing.easeOut },
    },
    exit: {
      opacity: 0,
      transition: transitionPresets.fast,
    },
  };
};

/**
 * Get reduced motion variant (no animation)
 */
export const getReducedMotionVariant = (variants: Variants): Variants => {
  const { initial, animate, exit, ...rest } = variants;
  return {
    initial: animate,
    animate,
    exit: animate,
    ...rest,
  };
};
