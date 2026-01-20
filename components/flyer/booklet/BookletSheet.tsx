'use client';

import { BOOKLET_SCREEN_DIMENSIONS, BOOKLET_COLORS, BOOKLET_PAGE_ORDER } from '@/lib/flyer/bookletDimensions';
import type { BookletSheetProps } from './types';
import BookletPage from './BookletPage';
import CoverPage from './pages/CoverPage';
import BackPage from './pages/BackPage';
import BookletMenuSpread from './BookletMenuSpread';

/**
 * BookletSheet - A4 landscape sheet with 2 A5 pages side by side
 * Used for print layout (outside: pages 4+1, inside: pages 2+3)
 */
export default function BookletSheet({
  side,
  className = '',
  showFoldLine = false,
}: BookletSheetProps) {
  const { sheet } = BOOKLET_SCREEN_DIMENSIONS;

  // For the inside sheet (pages 2+3), use BookletMenuSpread directly
  // as it renders both pages as a single spread
  if (side === 'inside') {
    return (
      <div
        className={`relative ${className}`}
        data-sheet={side}
        aria-label="Feuille intérieure"
      >
        <BookletMenuSpread showFoldLine={showFoldLine} />
      </div>
    );
  }

  // For outside sheet (pages 4+1), render individual pages
  const pageOrder = BOOKLET_PAGE_ORDER[side];

  // Map page numbers to components (only for outside sheet)
  const pageComponents: Record<number, React.ReactNode> = {
    1: <CoverPage />,
    4: <BackPage />,
  };

  return (
    <div
      className={`relative flex ${className}`}
      style={{
        width: `${sheet.width}px`,
        height: `${sheet.height}px`,
        backgroundColor: BOOKLET_COLORS.cream,
      }}
      data-sheet={side}
      aria-label="Feuille extérieure"
    >
      {/* Left page */}
      <BookletPage pageNumber={pageOrder.left as 1 | 2 | 3 | 4}>
        {pageComponents[pageOrder.left]}
      </BookletPage>

      {/* Fold line indicator */}
      {showFoldLine && (
        <div
          className="absolute top-0 bottom-0 z-10"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            width: '2px',
            background: `repeating-linear-gradient(
              to bottom,
              ${BOOKLET_COLORS.primaryYellowDark} 0px,
              ${BOOKLET_COLORS.primaryYellowDark} 8px,
              transparent 8px,
              transparent 16px
            )`,
            opacity: 0.6,
          }}
        />
      )}

      {/* Right page */}
      <BookletPage pageNumber={pageOrder.right as 1 | 2 | 3 | 4}>
        {pageComponents[pageOrder.right]}
      </BookletPage>
    </div>
  );
}
