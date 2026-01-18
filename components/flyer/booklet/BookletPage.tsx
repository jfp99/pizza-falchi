'use client';

import { BOOKLET_SCREEN_DIMENSIONS, BOOKLET_COLORS } from '@/lib/flyer/bookletDimensions';
import type { BookletPageProps } from './types';

/**
 * BookletPage - Single A5 page wrapper
 * Provides consistent sizing, margins, and background for each page
 */
export default function BookletPage({
  pageNumber,
  className = '',
  children
}: BookletPageProps) {
  const { page, safeMargin } = BOOKLET_SCREEN_DIMENSIONS;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: `${page.width}px`,
        height: `${page.height}px`,
        backgroundColor: BOOKLET_COLORS.cream,
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      }}
      data-page={pageNumber}
      aria-label={`Page ${pageNumber} du booklet`}
    >
      {/* Safe content area with margins */}
      <div
        className="relative h-full"
        style={{
          padding: `${safeMargin}px`,
        }}
      >
        {children}
      </div>

      {/* Page number indicator (hidden in export) */}
      <div
        className="absolute bottom-2 opacity-30 text-xs print:hidden"
        style={{
          left: pageNumber % 2 === 0 ? '8px' : 'auto',
          right: pageNumber % 2 === 1 ? '8px' : 'auto',
          color: BOOKLET_COLORS.textMuted,
        }}
      >
        {pageNumber}
      </div>
    </div>
  );
}
