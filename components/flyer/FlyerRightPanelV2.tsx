/**
 * FlyerRightPanelV2 - Redesigned cover panel (35% width)
 * Premium épuré with large hero image
 * QR code prominent, contact info compact
 */

'use client';

import React from 'react';
import FlyerQRCode from './FlyerQRCode';
import { flyerContactInfo, flyerHeritage } from '@/lib/flyer/menuData';

// Brand colors - matching left panel
const COLORS = {
  primary: '#B91C1C',
  primaryDark: '#991B1B',
  gold: '#B8860B',
  goldLight: '#DAA520',
  cream: '#FFFBF5',
  text: '#1F1510',
  textMuted: '#5C4A3D',
  white: '#FFFFFF',
};

// Text styles
const TEXT_BASE = {
  WebkitFontSmoothing: 'antialiased' as const,
  MozOsxFontSmoothing: 'grayscale' as const,
  textRendering: 'geometricPrecision' as const,
};

export default function FlyerRightPanelV2() {
  return (
    <section
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ backgroundColor: COLORS.cream }}
      aria-label="Cover et informations de contact Pizza Falchi"
    >
      {/* ===== HERO IMAGE SECTION (Top 55%) ===== */}
      <div className="relative flex-[5.5]">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img
            src="/images/restaurant/wood-fired-oven.jpg"
            alt="Pizza authentique au feu de bois"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center top' }}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg,
                rgba(255,251,245,0.3) 0%,
                rgba(255,251,245,0.1) 30%,
                rgba(185,28,28,0.2) 70%,
                rgba(185,28,28,0.5) 100%
              )`,
            }}
          />
        </div>

        {/* Floating Brand Badge */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
          <div
            className="px-4 py-2 rounded-full flex items-center gap-2"
            style={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              border: `2px solid ${COLORS.gold}`,
            }}
          >
            <img
              src="/images/branding/logo-badge.png"
              alt=""
              aria-hidden="true"
              className="w-8 h-8 object-contain"
            />
            <div>
              <p
                className="text-[14px] font-black tracking-wider"
                style={{ color: COLORS.primary, ...TEXT_BASE, letterSpacing: '0.1em' }}
              >
                PIZZA FALCHI
              </p>
              <p className="text-[7px] font-semibold tracking-wide" style={{ color: COLORS.textMuted }}>
                Depuis {flyerHeritage.since} &bull; {flyerHeritage.cooking}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom tagline banner */}
        <div
          className="absolute bottom-0 left-0 right-0 py-2 text-center"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
          }}
        >
          <p
            className="text-[11px] font-bold tracking-widest uppercase text-white"
            style={{ ...TEXT_BASE, letterSpacing: '0.15em' }}
          >
            Authentique Pizza Italienne
          </p>
        </div>
      </div>

      {/* ===== QR CODE + LOCATION SECTION (Middle 25%) ===== */}
      <div
        className="relative flex-[2.5] flex items-center justify-center gap-4 px-3 py-2"
        style={{ backgroundColor: COLORS.white }}
      >
        {/* QR Code - Large and prominent */}
        <div className="flex flex-col items-center">
          <div
            className="p-2 rounded-xl"
            style={{
              backgroundColor: COLORS.white,
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              border: `2px solid ${COLORS.gold}`,
            }}
          >
            <FlyerQRCode size={85} />
          </div>
          <p
            className="text-[8px] font-bold mt-1 text-center"
            style={{ color: COLORS.primary }}
          >
            Scannez pour<br />l&apos;itinéraire
          </p>
        </div>

        {/* Vertical separator */}
        <div className="h-20 w-px" style={{ backgroundColor: 'rgba(184, 134, 11, 0.3)' }} />

        {/* Address */}
        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-2">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(185, 28, 28, 0.1)' }}
            >
              <svg className="w-3 h-3" fill={COLORS.primary} viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold" style={{ color: COLORS.text, ...TEXT_BASE }}>
                {flyerContactInfo.address}
              </p>
              <p className="text-[10px] font-bold" style={{ color: COLORS.text, ...TEXT_BASE }}>
                {flyerContactInfo.city}
              </p>
              <p className="text-[8px] italic mt-0.5" style={{ color: COLORS.textMuted }}>
                Parking gratuit
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTACT + PROMO SECTION (Bottom 20%) ===== */}
      <div
        className="relative flex-[2] px-3 py-2"
        style={{
          background: `linear-gradient(180deg, ${COLORS.cream} 0%, rgba(184, 134, 11, 0.08) 100%)`,
        }}
      >
        {/* Phone - Prominent */}
        <div
          className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg mb-2"
          style={{
            backgroundColor: COLORS.primary,
            boxShadow: '0 3px 12px rgba(185, 28, 28, 0.35)',
          }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: COLORS.white }}
          >
            <svg className="w-3.5 h-3.5" fill={COLORS.primary} viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
          </div>
          <div>
            <p
              className="text-[16px] font-black tracking-wider text-white"
              style={{ ...TEXT_BASE }}
            >
              {flyerContactInfo.phone}
            </p>
          </div>
        </div>

        {/* Hours + Website row */}
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill={COLORS.gold} viewBox="0 0 24 24">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
            <div>
              <p className="text-[9px] font-bold" style={{ color: COLORS.text }}>
                Mar - Dim : 18h - 21h30
              </p>
              <p className="text-[7px]" style={{ color: COLORS.textMuted }}>Fermé le Lundi</p>
            </div>
          </div>

          <div className="w-px h-6" style={{ backgroundColor: 'rgba(184, 134, 11, 0.3)' }} />

          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill={COLORS.gold} viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <p className="text-[9px] font-bold" style={{ color: COLORS.primary }}>
              {flyerContactInfo.website}
            </p>
          </div>
        </div>

        {/* Loyalty promo - Compact */}
        <div
          className="py-1.5 px-3 rounded-lg text-center"
          style={{
            background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
            boxShadow: '0 2px 8px rgba(184, 134, 11, 0.3)',
          }}
        >
          <p className="text-[10px] font-black uppercase tracking-wide text-white">
            🎁 10ème Pizza Offerte !
          </p>
          <p className="text-[7px] font-medium text-white opacity-90">
            Demandez votre carte de fidélité
          </p>
        </div>
      </div>
    </section>
  );
}
