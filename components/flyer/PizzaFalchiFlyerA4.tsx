/**
 * PizzaFalchiFlyerA4 - A4 Landscape Flyer Container
 * Two A5 panels side by side, designed to fold in half
 *
 * Dimensions:
 * - A4 Landscape: 297mm x 210mm
 * - Screen (96 DPI): 1118px x 794px
 * - Print (300 DPI): 3508px x 2480px
 */

'use client';

import React, { forwardRef } from 'react';
import FlyerLeftPanel from './FlyerLeftPanel';
import FlyerRightPanel from './FlyerRightPanel';

// A4 Landscape dimensions at 96 DPI (screen preview)
const A4_WIDTH = 1118;
const A4_HEIGHT = 794;

// Brand colors
const COLORS = {
  gold: '#D4A84B',
  cream: '#FDF8F0',
};

interface PizzaFalchiFlyerA4Props {
  showFoldLine?: boolean;
  className?: string;
}

const PizzaFalchiFlyerA4 = forwardRef<HTMLDivElement, PizzaFalchiFlyerA4Props>(
  function PizzaFalchiFlyerA4({ showFoldLine = false, className = '' }, ref) {
    return (
      <article
        ref={ref}
        role="document"
        aria-label="Pizza Falchi - Menu et Informations - Format A4 Paysage Pliable"
        aria-describedby="flyer-description"
        className={`relative ${className}`}
        style={{
          width: `${A4_WIDTH}px`,
          height: `${A4_HEIGHT}px`,
          backgroundColor: COLORS.cream,
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Screen reader description */}
        <span id="flyer-description" className="sr-only">
          Flyer A4 paysage présentant le menu complet de Pizza Falchi avec pizzas, boissons,
          informations de contact et carte de localisation. Se plie en deux pour format A5.
        </span>
        {/* Two-panel grid layout */}
        <div className="w-full h-full grid grid-cols-2">
          {/* Left Panel - Menu (visible when unfolded) */}
          <div className="relative">
            <FlyerLeftPanel />
          </div>

          {/* Right Panel - Cover/Location (front when folded) */}
          <div className="relative">
            <FlyerRightPanel />
          </div>
        </div>

        {/* Fold Line Indicator (for preview only) */}
        {showFoldLine && (
          <div
            className="absolute top-0 left-1/2 h-full -translate-x-1/2 pointer-events-none z-50"
            style={{
              width: '2px',
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

        {/* Corner trim marks (for preview only - hidden in export) */}
        {showFoldLine && (
          <>
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l opacity-20" style={{ borderColor: COLORS.gold }} aria-hidden="true" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r opacity-20" style={{ borderColor: COLORS.gold }} aria-hidden="true" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l opacity-20" style={{ borderColor: COLORS.gold }} aria-hidden="true" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r opacity-20" style={{ borderColor: COLORS.gold }} aria-hidden="true" />
          </>
        )}
      </article>
    );
  }
);

export default PizzaFalchiFlyerA4;

// Export dimensions for use in export utilities
export const FLYER_A4_DIMENSIONS = {
  width: A4_WIDTH,
  height: A4_HEIGHT,
  printWidth: 3508,
  printHeight: 2480,
  mmWidth: 297,
  mmHeight: 210,
};
