/**
 * BookletCoverBack - Page 4 (Quatrième de couverture)
 * QR code + horaires + site web + bannière fidélité
 * Format A5 Portrait (148mm x 210mm)
 */

'use client';

import React from 'react';
import FlyerQRCode from '../FlyerQRCode';
import { flyerContactInfo, flyerHeritage, flyerLocationData } from '@/lib/flyer/menuData';

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
  textMuted: '#5C4A3D',
};

const TEXT_BASE = {
  WebkitFontSmoothing: 'antialiased' as const,
  MozOsxFontSmoothing: 'grayscale' as const,
  textRendering: 'geometricPrecision' as const,
};

export default function BookletCoverBack() {
  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{
        width: `${A5_WIDTH}px`,
        height: `${A5_HEIGHT}px`,
        backgroundColor: COLORS.cream,
      }}
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.gold} 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-6">
        {/* Top section with decorative border */}
        <div
          className="pb-4 mb-4 border-b-2"
          style={{ borderColor: COLORS.gold }}
        >
          {/* QR Code Section */}
          <div className="flex flex-col items-center">
            <p
              className="text-[12px] font-bold mb-2 uppercase tracking-wide"
              style={{ color: COLORS.text, ...TEXT_BASE }}
            >
              Trouvez-nous facilement
            </p>

            <div
              className="rounded-2xl mb-3"
              style={{
                backgroundColor: COLORS.white,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: `3px solid ${COLORS.gold}`,
                padding: '12px',
                paddingBottom: '16px',
              }}
            >
              <FlyerQRCode size={140} />
            </div>

            <p
              className="text-[11px] font-semibold text-center"
              style={{ color: COLORS.primary }}
            >
              Scannez pour l&apos;itinéraire Google Maps
            </p>
          </div>
        </div>

        {/* Address Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(185, 28, 28, 0.1)' }}
            >
              <svg className="w-5 h-5" fill={COLORS.primary} viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[14px] font-bold" style={{ color: COLORS.text, ...TEXT_BASE }}>
                {flyerContactInfo.address}
              </p>
              <p className="text-[14px] font-bold" style={{ color: COLORS.text, ...TEXT_BASE }}>
                {flyerContactInfo.city}
              </p>
            </div>
          </div>
          <p className="text-[11px] italic" style={{ color: COLORS.textMuted }}>
            {flyerLocationData.parking}
          </p>
        </div>

        {/* Hours Section */}
        <div
          className="flex items-center justify-center gap-4 px-6 rounded-xl mb-6"
          style={{
            backgroundColor: COLORS.white,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: `1px solid rgba(184, 134, 11, 0.2)`,
            paddingTop: '16px',
            paddingBottom: '20px',
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(184, 134, 11, 0.1)' }}
          >
            <svg className="w-6 h-6" fill={COLORS.gold} viewBox="0 0 24 24">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-bold" style={{ color: COLORS.text, ...TEXT_BASE }}>
              {flyerContactInfo.hours}
            </p>
            <p className="text-[12px] font-medium" style={{ color: COLORS.primary }}>
              {flyerContactInfo.closedDay}
            </p>
          </div>
        </div>

        {/* Website Section */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(184, 134, 11, 0.1)' }}
          >
            <svg className="w-5 h-5" fill={COLORS.gold} viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
          <p
            className="text-[16px] font-bold"
            style={{ color: COLORS.primary, ...TEXT_BASE }}
          >
            {flyerContactInfo.website}
          </p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Loyalty Banner */}
        <div
          className="px-6 rounded-2xl text-center"
          style={{
            background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
            boxShadow: '0 4px 20px rgba(184, 134, 11, 0.4)',
            paddingTop: '16px',
            paddingBottom: '20px',
          }}
        >
          <p
            className="text-[18px] font-black uppercase tracking-wider text-white mb-1"
            style={{ ...TEXT_BASE }}
          >
            Carte de Fidélité
          </p>
          <p className="text-[14px] font-bold text-white">
            {flyerHeritage.loyalty}
          </p>
          <p className="text-[10px] font-medium text-white opacity-90 mt-1">
            Demandez-la lors de votre prochaine commande !
          </p>
        </div>

        {/* Footer brand */}
        <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
          <img
            src="/images/branding/logo-badge.png"
            alt=""
            aria-hidden="true"
            className="w-8 h-8 object-contain"
          />
          <div className="text-center">
            <p
              className="text-[12px] font-black tracking-wider"
              style={{ color: COLORS.primary, ...TEXT_BASE, letterSpacing: '0.1em' }}
            >
              PIZZA FALCHI
            </p>
            <p className="text-[8px] font-medium" style={{ color: COLORS.textMuted }}>
              {flyerHeritage.cooking} &bull; Depuis {flyerHeritage.since}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const BOOKLET_COVER_BACK_DIMENSIONS = {
  width: A5_WIDTH,
  height: A5_HEIGHT,
};
