'use client';

import { forwardRef, useState } from 'react';
import { BOOKLET_SCREEN_DIMENSIONS, BOOKLET_COLORS } from '@/lib/flyer/bookletDimensions';
import type { BookletContainerProps, PageNumber } from './types';
import BookletSheet from './BookletSheet';
import BookletPage from './BookletPage';
import CoverPage from './pages/CoverPage';
import MenuLeftPage from './pages/MenuLeftPage';
import MenuRightPage from './pages/MenuRightPage';
import BackPage from './pages/BackPage';

/**
 * BookletContainer - Main orchestrator for the 4-page booklet
 * Supports different view modes: pages, sheets, spread
 */
const BookletContainer = forwardRef<HTMLDivElement, BookletContainerProps>(
  function BookletContainer(
    {
      className = '',
      showFoldLine = true,
      viewMode = 'sheets',
      currentPage = 1,
    },
    ref
  ) {
    const { sheet, page } = BOOKLET_SCREEN_DIMENSIONS;

    // Map page numbers to components
    const pageComponents: Record<PageNumber, React.ReactNode> = {
      1: <CoverPage />,
      2: <MenuLeftPage />,
      3: <MenuRightPage />,
      4: <BackPage />,
    };

    // Render based on view mode
    if (viewMode === 'pages') {
      // Single page view with navigation
      return (
        <div ref={ref} className={`inline-block ${className}`}>
          <BookletPage pageNumber={currentPage}>
            {pageComponents[currentPage]}
          </BookletPage>
        </div>
      );
    }

    if (viewMode === 'spread') {
      // Interior spread view (pages 2-3 side by side)
      return (
        <div
          ref={ref}
          className={`inline-flex ${className}`}
          style={{
            width: `${sheet.width}px`,
            height: `${page.height}px`,
            backgroundColor: BOOKLET_COLORS.cream,
          }}
        >
          <BookletPage pageNumber={2}>
            <MenuLeftPage />
          </BookletPage>
          {showFoldLine && (
            <div
              className="flex-shrink-0"
              style={{
                width: '2px',
                background: `repeating-linear-gradient(
                  to bottom,
                  ${BOOKLET_COLORS.primaryYellowDark} 0px,
                  ${BOOKLET_COLORS.primaryYellowDark} 8px,
                  transparent 8px,
                  transparent 16px
                )`,
                opacity: 0.5,
              }}
            />
          )}
          <BookletPage pageNumber={3}>
            <MenuRightPage />
          </BookletPage>
        </div>
      );
    }

    // Default: sheets view (for print/export)
    return (
      <div ref={ref} className={`flex flex-col gap-4 ${className}`}>
        {/* Outside sheet (Pages 4 + 1) - for print */}
        <div className="relative">
          <div
            className="absolute -top-6 left-0 text-xs font-medium"
            style={{ color: BOOKLET_COLORS.textMuted }}
          >
            Feuille Extérieure (Recto)
          </div>
          <BookletSheet side="outside" showFoldLine={showFoldLine} />
        </div>

        {/* Inside sheet (Pages 2 + 3) - for print */}
        <div className="relative">
          <div
            className="absolute -top-6 left-0 text-xs font-medium"
            style={{ color: BOOKLET_COLORS.textMuted }}
          >
            Feuille Intérieure (Verso)
          </div>
          <BookletSheet side="inside" showFoldLine={showFoldLine} />
        </div>
      </div>
    );
  }
);

export default BookletContainer;

/**
 * BookletOutsideSheet - Export helper for outside sheet only
 */
export const BookletOutsideSheet = forwardRef<HTMLDivElement, { showFoldLine?: boolean }>(
  function BookletOutsideSheet({ showFoldLine = false }, ref) {
    return (
      <div ref={ref}>
        <BookletSheet side="outside" showFoldLine={showFoldLine} />
      </div>
    );
  }
);

/**
 * BookletInsideSheet - Export helper for inside sheet only
 */
export const BookletInsideSheet = forwardRef<HTMLDivElement, { showFoldLine?: boolean }>(
  function BookletInsideSheet({ showFoldLine = false }, ref) {
    return (
      <div ref={ref}>
        <BookletSheet side="inside" showFoldLine={showFoldLine} />
      </div>
    );
  }
);
