/**
 * PizzaFalchiFlyerA4V2 - Redesigned A4 Landscape Flyer
 * 65/35 ratio for better menu readability
 *
 * Dimensions:
 * - A4 Landscape: 297mm x 210mm
 * - Screen (96 DPI): 1118px x 794px
 * - Print (300 DPI): 3508px x 2480px
 */

'use client';

import React, { forwardRef } from 'react';
import FlyerLeftPanelV2 from './FlyerLeftPanelV2';
import FlyerRightPanelV2 from './FlyerRightPanelV2';

// A4 Landscape dimensions at 96 DPI (screen preview)
const A4_WIDTH = 1118;
const A4_HEIGHT = 794;

// Panel ratio: 65% menu, 35% cover
const MENU_RATIO = 0.65;
const COVER_RATIO = 0.35;

// Brand colors
const COLORS = {
  gold: '#B8860B',
  cream: '#FFFBF5',
};

interface PizzaFalchiFlyerA4V2Props {
  showFoldLine?: boolean;
  className?: string;
}

const PizzaFalchiFlyerA4V2 = forwardRef<HTMLDivElement, PizzaFalchiFlyerA4V2Props>(
  function PizzaFalchiFlyerA4V2({ showFoldLine = false, className = '' }, ref) {
    const menuWidth = Math.round(A4_WIDTH * MENU_RATIO);
    const coverWidth = Math.round(A4_WIDTH * COVER_RATIO);

    return (
      <article
        ref={ref}
        role="document"
        aria-label="Pizza Falchi - Menu et Informations - Format A4 Paysage"
        aria-describedby="flyer-description-v2"
        className={`relative ${className}`}
        style={{
          width: `${A4_WIDTH}px`,
          height: `${A4_HEIGHT}px`,
          backgroundColor: COLORS.cream,
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        }}
      >
        {/* Screen reader description */}
        <span id="flyer-description-v2" className="sr-only">
          Flyer A4 paysage présentant le menu complet de Pizza Falchi avec pizzas,
          informations de contact, QR code et carte de localisation.
        </span>

        {/* Two-panel layout with custom ratio */}
        <div className="w-full h-full flex">
          {/* Left Panel - Menu (65%) */}
          <div style={{ width: `${menuWidth}px`, height: '100%' }}>
            <FlyerLeftPanelV2 />
          </div>

          {/* Right Panel - Cover (35%) */}
          <div style={{ width: `${coverWidth}px`, height: '100%' }}>
            <FlyerRightPanelV2 />
          </div>
        </div>

        {/* Fold Line Indicator (for preview only) */}
        {showFoldLine && (
          <div
            className="absolute top-0 h-full pointer-events-none z-50"
            style={{
              left: `${menuWidth}px`,
              width: '2px',
              transform: 'translateX(-50%)',
              background: `repeating-linear-gradient(
                to bottom,
                ${COLORS.gold} 0px,
                ${COLORS.gold} 8px,
                transparent 8px,
                transparent 16px
              )`,
            }}
          >
            {/* Fold Label */}
            <div
              className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[8px] whitespace-nowrap"
              style={{
                backgroundColor: COLORS.gold,
                color: 'white',
                fontWeight: 600,
              }}
            >
              PLIURE
            </div>
          </div>
        )}

        {/* Corner trim marks (preview only) */}
        {showFoldLine && (
          <>
            <div
              className="absolute top-0 left-0 w-3 h-3 border-t border-l opacity-30"
              style={{ borderColor: COLORS.gold }}
              aria-hidden="true"
            />
            <div
              className="absolute top-0 right-0 w-3 h-3 border-t border-r opacity-30"
              style={{ borderColor: COLORS.gold }}
              aria-hidden="true"
            />
            <div
              className="absolute bottom-0 left-0 w-3 h-3 border-b border-l opacity-30"
              style={{ borderColor: COLORS.gold }}
              aria-hidden="true"
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 border-b border-r opacity-30"
              style={{ borderColor: COLORS.gold }}
              aria-hidden="true"
            />
          </>
        )}
      </article>
    );
  }
);

export default PizzaFalchiFlyerA4V2;

// Export dimensions for use in export utilities
export const FLYER_A4_V2_DIMENSIONS = {
  width: A4_WIDTH,
  height: A4_HEIGHT,
  menuWidth: Math.round(A4_WIDTH * MENU_RATIO),
  coverWidth: Math.round(A4_WIDTH * COVER_RATIO),
  printWidth: 3508,
  printHeight: 2480,
  mmWidth: 297,
  mmHeight: 210,
  ratio: { menu: MENU_RATIO, cover: COVER_RATIO },
};
