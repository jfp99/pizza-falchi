/**
 * Booklet Components - Pizza Falchi
 * A4 booklet folded to A5 pocket size
 */

// Main components
export { default as BookletContainer, BookletOutsideSheet, BookletInsideSheet } from './BookletContainer';
export { default as BookletSheet } from './BookletSheet';
export { default as BookletPage } from './BookletPage';

// Page components (legacy)
export { default as CoverPage } from './pages/CoverPage';
export { default as BackPage } from './pages/BackPage';

// New simplified components
export { default as BookletCoverFront, BOOKLET_COVER_FRONT_DIMENSIONS } from './BookletCoverFront';
export { default as BookletMenuSpread, BOOKLET_MENU_SPREAD_DIMENSIONS } from './BookletMenuSpread';
export { default as BookletCoverBack, BOOKLET_COVER_BACK_DIMENSIONS } from './BookletCoverBack';
export { default as BookletCoverSpread, BOOKLET_COVER_SPREAD_DIMENSIONS } from './BookletCoverSpread';

// Types
export * from './types';
