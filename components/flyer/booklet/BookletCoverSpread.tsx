/**
 * BookletCoverSpread - Pages 1 + 4 (Exterior spread for printing)
 * Cover front (page 1) + Cover back (page 4) side by side
 * Format A4 Landscape when printed (297mm x 210mm)
 * Note: Page 4 on LEFT, Page 1 on RIGHT (for correct folding)
 */

'use client';

import React from 'react';
import BookletCoverFront from './BookletCoverFront';
import BookletCoverBack from './BookletCoverBack';

// A4 Landscape dimensions at 96 DPI (two A5 pages side by side)
const A4_WIDTH = 1122; // 297mm
const A4_HEIGHT = 794; // 210mm

const COLORS = {
  primary: '#B91C1C',
  cream: '#FFFBF5',
};

interface BookletCoverSpreadProps {
  showFoldLine?: boolean;
}

export default function BookletCoverSpread({ showFoldLine = true }: BookletCoverSpreadProps) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${A4_WIDTH}px`,
        height: `${A4_HEIGHT}px`,
        backgroundColor: COLORS.cream,
      }}
    >
      {/* Fold line indicator */}
      {showFoldLine && (
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
          style={{ width: '2px' }}
        >
          <div
            className="w-full h-full"
            style={{
              background: `repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 8px,
                rgba(185, 28, 28, 0.3) 8px,
                rgba(185, 28, 28, 0.3) 16px
              )`,
            }}
          />
        </div>
      )}

      {/* Content - Two A5 pages side by side */}
      <div className="relative z-10 h-full flex">
        {/* LEFT SIDE: Page 4 (Back cover) - Will be on the outside when folded */}
        <div className="flex-1">
          <BookletCoverBack />
        </div>

        {/* RIGHT SIDE: Page 1 (Front cover) - Will be on the outside when folded */}
        <div className="flex-1">
          <BookletCoverFront />
        </div>
      </div>
    </div>
  );
}

export const BOOKLET_COVER_SPREAD_DIMENSIONS = {
  width: A4_WIDTH,
  height: A4_HEIGHT,
};
