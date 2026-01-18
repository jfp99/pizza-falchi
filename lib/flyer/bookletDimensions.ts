/**
 * Booklet Dimensions - Pizza Falchi
 * A4 booklet folded to A5 pocket size
 */

// Physical dimensions in mm
export const BOOKLET_DIMENSIONS = {
  // A4 Sheet (unfolded, landscape orientation for printing)
  sheet: {
    width: 297,  // mm
    height: 210, // mm
  },
  // A5 Page (single page, portrait orientation)
  page: {
    width: 148,  // mm (half of A4 width)
    height: 210, // mm
  },
  // Print specifications
  bleed: 3,      // mm - extra area for trimming
  safeMargin: 5, // mm - keep important content inside this
  foldLine: 148.5, // mm - center fold position
} as const;

// Screen dimensions at 96 DPI (preview)
export const BOOKLET_SCREEN_DIMENSIONS = {
  sheet: {
    width: 1118,  // px (297mm at 96 DPI)
    height: 794,  // px (210mm at 96 DPI)
  },
  page: {
    width: 559,   // px (148mm at 96 DPI)
    height: 794,  // px (210mm at 96 DPI)
  },
  bleed: 11,      // px
  safeMargin: 6,  // px (aggressive reduction to maximize content space)
} as const;

// Print dimensions at 300 DPI (high quality export)
export const BOOKLET_PRINT_DIMENSIONS = {
  sheet: {
    width: 3508,  // px (297mm at 300 DPI)
    height: 2480, // px (210mm at 300 DPI)
  },
  page: {
    width: 1748,  // px (148mm at 300 DPI)
    height: 2480, // px (210mm at 300 DPI)
  },
  bleed: 35,      // px
  safeMargin: 59, // px
  scale: 4,       // html2canvas scale for ~384 DPI
} as const;

// Typography scale for booklet (increased for better space utilization)
export const BOOKLET_TYPOGRAPHY = {
  // Brand & Headers
  brandName: {
    size: 32,      // px (increased from 28)
    weight: 900,   // black
    lineHeight: 1.1,
  },
  sectionHeader: {
    size: 16,      // px (increased from 14)
    weight: 800,   // extrabold
    letterSpacing: '0.08em',
    lineHeight: 1.2,
  },
  subHeader: {
    size: 13,      // px (increased from 12)
    weight: 700,   // bold
    lineHeight: 1.2,
  },
  // Menu Items
  pizzaName: {
    size: 12,      // px (increased from 11)
    weight: 600,   // semibold
    lineHeight: 1.35,
  },
  pizzaDescription: {
    size: 10,      // px (increased from 9)
    weight: 400,   // normal
    lineHeight: 1.35,
  },
  price: {
    size: 12,      // px (increased from 11)
    weight: 700,   // bold
    lineHeight: 1.2,
  },
  // Drinks & Small Items
  drinkItem: {
    size: 10,      // px (increased from 9)
    weight: 500,   // medium
    lineHeight: 1.35,
  },
  // Labels & Legends
  label: {
    size: 9,       // px (increased from 8)
    weight: 500,   // medium
    lineHeight: 1.2,
  },
  micro: {
    size: 8,       // px (increased from 7)
    weight: 400,   // normal
    lineHeight: 1.2,
  },
} as const;

// Color palette for booklet
export const BOOKLET_COLORS = {
  // Primary
  primaryRed: '#E30613',
  primaryRedDark: '#C41E1A',
  primaryYellow: '#FFD200',
  primaryYellowDark: '#D4A84B',
  // Soft variants
  softRed: '#F2828B',
  softYellow: '#FFE999',
  // Background
  cream: '#FDF8F0',
  warmCream: '#FFF9F0',
  white: '#FFFFFF',
  // Text
  textDark: '#2D1810',
  textBrown: '#4A3F35',
  textMuted: '#6B5B4D',
  // Indicators
  basilGreen: '#2D5016',
  spicyRed: '#E30613',
  goldBadge: '#D4A84B',
} as const;

// Page numbers (booklet imposition)
export const BOOKLET_PAGE_ORDER = {
  // Outside sheet (printed first for duplex)
  outside: {
    left: 4,   // Back cover
    right: 1,  // Front cover
  },
  // Inside sheet (printed second / duplex back)
  inside: {
    left: 2,   // Menu left
    right: 3,  // Menu right
  },
} as const;

// Helper function to convert mm to px at specific DPI
export function mmToPx(mm: number, dpi: number = 96): number {
  return Math.round((mm / 25.4) * dpi);
}

// Helper function to convert px to mm at specific DPI
export function pxToMm(px: number, dpi: number = 96): number {
  return (px * 25.4) / dpi;
}

// Export quality presets
export const EXPORT_QUALITY = {
  print: {
    scale: 4,
    format: 'png' as const,
    dpi: 300,
    quality: 1,
  },
  web: {
    scale: 2,
    format: 'png' as const,
    dpi: 150,
    quality: 0.92,
  },
  preview: {
    scale: 1,
    format: 'png' as const,
    dpi: 96,
    quality: 0.8,
  },
} as const;
