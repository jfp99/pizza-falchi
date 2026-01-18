/**
 * BookletCoverFront - Page 1 (Couverture avant)
 * Image four + logo + tagline + téléphone
 * Format A5 Portrait (148mm x 210mm)
 */

'use client';

import React from 'react';
import { flyerContactInfo, flyerHeritage } from '@/lib/flyer/menuData';

// A5 dimensions at 96 DPI
const A5_WIDTH = 559; // 148mm
const A5_HEIGHT = 794; // 210mm

const COLORS = {
  primary: '#B91C1C',
  primaryDark: '#991B1B',
  gold: '#B8860B',
  goldLight: '#DAA520',
  cream: '#FFFBF5',
  white: '#FFFFFF',
  text: '#1F1510',
};

const TEXT_BASE = {
  WebkitFontSmoothing: 'antialiased' as const,
  MozOsxFontSmoothing: 'grayscale' as const,
  textRendering: 'geometricPrecision' as const,
};

export default function BookletCoverFront() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${A5_WIDTH}px`,
        height: `${A5_HEIGHT}px`,
        backgroundColor: COLORS.cream,
      }}
    >
      {/* Hero Image - Full bleed */}
      <div className="absolute inset-0">
        <img
          src="/images/restaurant/wood-fired-oven.jpg"
          alt="Four à bois Pizza Falchi"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center top' }}
        />
        {/* Gradient overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg,
              rgba(0,0,0,0.3) 0%,
              rgba(0,0,0,0.1) 30%,
              rgba(0,0,0,0.1) 50%,
              rgba(0,0,0,0.4) 75%,
              rgba(0,0,0,0.7) 100%
            )`,
          }}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        {/* Top: Logo badge */}
        <div className="flex justify-center pt-4">
          <div
            className="px-6 py-3 rounded-2xl flex items-center gap-3"
            style={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              border: `3px solid ${COLORS.gold}`,
            }}
          >
            <img
              src="/images/branding/logo-badge.png"
              alt=""
              aria-hidden="true"
              className="w-14 h-14 object-contain"
            />
            <div>
              <p
                className="text-[24px] font-black tracking-wider"
                style={{ color: COLORS.primary, ...TEXT_BASE, letterSpacing: '0.1em' }}
              >
                PIZZA FALCHI
              </p>
              <p className="text-[10px] font-semibold tracking-wide" style={{ color: COLORS.gold }}>
                Depuis {flyerHeritage.since} &bull; {flyerHeritage.cooking}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: Tagline + Phone */}
        <div className="flex flex-col items-center gap-6 pb-4">
          {/* Tagline banner */}
          <div
            className="px-8 py-3 rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
              boxShadow: '0 4px 20px rgba(185, 28, 28, 0.4)',
            }}
          >
            <p
              className="text-[18px] font-black tracking-widest uppercase text-white text-center"
              style={{ ...TEXT_BASE, letterSpacing: '0.2em' }}
            >
              Authentique Pizza Italienne
            </p>
          </div>

          {/* Phone number */}
          <div
            className="flex items-center gap-3 px-6 py-3 rounded-xl"
            style={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              border: `2px solid ${COLORS.gold}`,
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary }}
            >
              <svg className="w-5 h-5" fill={COLORS.white} viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </div>
            <p
              className="text-[24px] font-black tracking-wider"
              style={{ color: COLORS.primary, ...TEXT_BASE }}
            >
              {flyerContactInfo.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const BOOKLET_COVER_FRONT_DIMENSIONS = {
  width: A5_WIDTH,
  height: A5_HEIGHT,
};
