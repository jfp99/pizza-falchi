/**
 * FlyerRightPanel - Right side of A4 landscape flyer
 * Contains: Cover section, Location with map, Contact info
 * This is the "front" when folded
 */

'use client';

import React from 'react';
import FlyerBackgroundLayer from './FlyerBackgroundLayer';
import FlyerQRCode from './FlyerQRCode';
import { flyerContactInfo, flyerHeritage } from '@/lib/flyer/menuData';

// Brand colors - WCAG AA compliant contrast ratios
const COLORS = {
  primary: '#C41E1A',
  primaryDark: '#A01815',
  gold: '#D4A84B',
  goldLight: '#E8C87A',
  goldDark: '#B8943F',
  cream: '#FDF8F0',
  text: '#2C1810',
  textLight: '#3D2A1F',
  white: '#FFFFFF',
};

// Text styles for better PDF rendering
const TEXT_STYLES = {
  letterSpacing: '0.02em',
  wordSpacing: '0.1em',
};

const TEXT_STYLES_WIDE = {
  letterSpacing: '0.05em',
  wordSpacing: '0.15em',
};

export default function FlyerRightPanel() {
  return (
    <section
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ backgroundColor: COLORS.cream }}
      aria-label="Couverture et informations de contact"
    >
      {/* ===== COVER SECTION (Top 33%) ===== */}
      <div className="relative flex-[3.3]">
        {/* Background Image */}
        <FlyerBackgroundLayer
          src="/images/hero/hero-main.avif"
          opacity={0.22}
          gradientOverlay={`linear-gradient(180deg, ${COLORS.cream}60 0%, ${COLORS.cream}30 40%, ${COLORS.primary}15 100%)`}
        />

        {/* Cover Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
          {/* Logo with glow effect */}
          <div className="relative">
            <div
              className="absolute inset-0 blur-xl opacity-30 rounded-full"
              style={{ backgroundColor: COLORS.gold }}
              aria-hidden="true"
            />
            <img
              src="/images/branding/logo-badge.png"
              alt="Logo Pizza Falchi - Pizzeria authentique depuis 2001"
              className="relative w-24 h-24 object-contain drop-shadow-lg"
            />
          </div>

          {/* Brand Name */}
          <h1
            className="text-[28px] font-black tracking-widest text-center mt-2"
            style={{
              color: COLORS.primary,
              textShadow: '2px 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            PIZZA FALCHI
          </h1>

          {/* Tagline */}
          <div className="flex items-center gap-2 mt-1">
            <div className="h-[1.5px] w-8" style={{ background: `linear-gradient(to right, transparent, ${COLORS.gold})` }} />
            <p
              className="text-[10px] tracking-[0.15em] uppercase font-semibold"
              style={{ color: COLORS.textLight, ...TEXT_STYLES_WIDE }}
            >
              {flyerHeritage.tagline} &bull; Depuis {flyerHeritage.since}
            </p>
            <div className="h-[1.5px] w-8" style={{ background: `linear-gradient(to left, transparent, ${COLORS.gold})` }} />
          </div>

          {/* Wood Fire Badge */}
          <div
            className="mt-4 px-6 py-2.5 rounded-full relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 40%, ${COLORS.gold} 100%)`,
              boxShadow: '0 4px 20px rgba(212, 168, 75, 0.5), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.1)',
            }}
          >
            <span
              className="text-[12px] font-black tracking-wider uppercase relative z-10 flex items-center gap-1.5"
              style={{ color: COLORS.text, textShadow: '0 1px 0 rgba(255,255,255,0.3)', ...TEXT_STYLES_WIDE }}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={COLORS.primary}>
                <path d="M12 23c-3.6 0-6.5-2.4-6.5-6.5 0-1.5.5-2.9 1.3-4.1.3.9 1 1.6 1.9 2 .1-2.2.7-4.4 2.5-5.9.3.9.9 1.7 1.7 2.2C11.9 8 12 5.2 14 3c.9 2.3 1.6 4.7 1.6 7.4.8-.6 1.5-1.3 1.8-2.2.8 1.2 1.1 2.6 1.1 4.1 0 4.1-2.9 6.5-6.5 6.5z"/>
              </svg>
              Cuisson au Feu de Bois
            </span>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 mt-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-[11px]" style={{ color: COLORS.gold }}>★</span>
                ))}
              </div>
              <p className="text-[9px] font-semibold" style={{ color: COLORS.text, ...TEXT_STYLES }}>
                4.4/5 Google
              </p>
              <p className="text-[7px] font-medium" style={{ color: COLORS.textLight, ...TEXT_STYLES }}>
                (161 avis)
              </p>
            </div>
            <div className="w-px h-8" style={{ backgroundColor: `${COLORS.gold}50` }} />
            <div className="text-center">
              <p className="text-[16px] font-black" style={{ color: COLORS.primary }}>
                20+
              </p>
              <p className="text-[9px] font-medium -mt-0.5" style={{ color: COLORS.textLight, ...TEXT_STYLES }}>
                Ans d&apos;expérience
              </p>
            </div>
          </div>
        </div>

        {/* Decorative wave bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-3"
          style={{
            background: `linear-gradient(to right, transparent 5%, ${COLORS.gold}50 50%, transparent 95%)`,
            clipPath: 'polygon(0 100%, 100% 100%, 100% 50%, 50% 0%, 0 50%)',
          }}
        />
      </div>

      {/* ===== LOCATION SECTION (Middle 36%) ===== */}
      <div className="relative flex-[3.6]" style={{ backgroundColor: `${COLORS.white}90` }}>
        {/* Section Header Badge */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div
            className="px-4 py-1.5 rounded-full text-[8px] font-black tracking-wider uppercase"
            style={{
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              boxShadow: '0 3px 10px rgba(196, 30, 26, 0.3)',
            }}
          >
            Nous Trouver
          </div>
        </div>

        {/* Location Content - 50/50 Split */}
        <div className="h-full flex items-center justify-center px-3 pt-4 pb-2 gap-4">
          {/* Left: Google Maps image - centered, matching right side height */}
          <div
            className="p-1.5 rounded-lg overflow-hidden flex items-center justify-center"
            style={{
              backgroundColor: COLORS.white,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              border: `1.5px solid ${COLORS.gold}50`,
            }}
          >
            <img
              src="/images/map/google-maps-pizza-falchi.png"
              alt="Plan d'accès Pizza Falchi - Avenue de la Touloubre, Puyricard"
              className="rounded"
              style={{
                width: '150px',
                height: '120px',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Right: QR Code + Address */}
          <div className="flex flex-col items-center justify-center gap-1.5">
            {/* QR Code */}
            <div
              className="p-1.5 rounded-lg"
              style={{
                backgroundColor: COLORS.white,
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                border: `2px solid ${COLORS.gold}`,
              }}
            >
              <FlyerQRCode size={55} />
            </div>
            <p className="text-[8px] font-bold" style={{ color: COLORS.primary, ...TEXT_STYLES }}>
              Scannez pour l&apos;itinéraire
            </p>

            {/* Address */}
            <div className="flex items-start gap-1.5">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${COLORS.primary}15` }}
              >
                <svg
                  className="w-2.5 h-2.5"
                  fill={COLORS.primary}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-[8px] font-bold leading-tight" style={{ color: COLORS.text, ...TEXT_STYLES }}>
                  {flyerContactInfo.address}
                </p>
                <p className="text-[8px] font-bold leading-tight" style={{ color: COLORS.text, ...TEXT_STYLES }}>
                  {flyerContactInfo.city}
                </p>
                <p className="text-[6px] italic" style={{ color: COLORS.textLight, ...TEXT_STYLES }}>
                  Parking gratuit
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTACT & PROMO SECTION (Bottom 31%) ===== */}
      <div className="relative flex-[3.1]">
        {/* Background */}
        <FlyerBackgroundLayer
          src="/images/restaurant/fresh-dough.jpg"
          opacity={0.09}
          grayscale
          gradientOverlay={`linear-gradient(180deg, ${COLORS.cream}90 0%, ${COLORS.cream}70 100%)`}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-4 py-2">
          {/* Loyalty Promo Banner */}
          <div
            className="mb-3 py-3 px-5 rounded-2xl text-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 40%, ${COLORS.gold} 100%)`,
              boxShadow: '0 4px 16px rgba(212, 168, 75, 0.4), inset 0 2px 0 rgba(255,255,255,0.5)',
              border: `2px solid ${COLORS.goldDark}30`,
            }}
          >
            <p className="text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5" style={{ color: COLORS.text, ...TEXT_STYLES }}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={COLORS.primary}>
                <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
              </svg>
              Offre Fidélité
            </p>
            <p
              className="text-[18px] font-black uppercase tracking-wide"
              style={{
                color: COLORS.primary,
                textShadow: '0 1px 2px rgba(255,255,255,0.6)',
                ...TEXT_STYLES_WIDE
              }}
            >
              10ème Pizza Offerte!
            </p>
            <p className="text-[9px] font-semibold" style={{ color: COLORS.text, ...TEXT_STYLES }}>
              Demandez votre carte de fidélité
            </p>
          </div>

          {/* Contact Row - 3 columns */}
          <div className="flex items-center justify-between gap-2">
            {/* Phone */}
            <div
              className="flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
              style={{
                backgroundColor: COLORS.primary,
                boxShadow: '0 4px 16px rgba(196, 30, 26, 0.4)',
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: COLORS.white,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }}
              >
                <svg className="w-4.5 h-4.5" fill={COLORS.primary} viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <div>
                <p
                  className="text-[16px] font-black tracking-wider"
                  style={{
                    color: COLORS.white,
                    textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    ...TEXT_STYLES
                  }}
                >
                  {flyerContactInfo.phone}
                </p>
                <p className="text-[8px] font-medium" style={{ color: 'rgba(255,255,255,0.9)', ...TEXT_STYLES }}>
                  Commande &amp; Réservation
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <svg className="w-3.5 h-3.5" fill={COLORS.gold} viewBox="0 0 24 24">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
                <p className="text-[9px] font-bold" style={{ color: COLORS.text, ...TEXT_STYLES }}>
                  Horaires
                </p>
              </div>
              <p className="text-[8px] font-semibold" style={{ color: COLORS.text, ...TEXT_STYLES }}>
                Mar - Dim
              </p>
              <p className="text-[11px] font-bold" style={{ color: COLORS.primary, ...TEXT_STYLES }}>
                18h - 21h30
              </p>
              <p className="text-[8px] font-medium" style={{ color: COLORS.textLight, ...TEXT_STYLES }}>
                Fermé le Lundi
              </p>
            </div>

            {/* Website */}
            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <svg className="w-3.5 h-3.5" fill={COLORS.gold} viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                <p className="text-[9px] font-bold" style={{ color: COLORS.text, ...TEXT_STYLES }}>
                  En ligne
                </p>
              </div>
              <p className="text-[8px] font-medium" style={{ color: COLORS.textLight, ...TEXT_STYLES }}>
                Commandez sur
              </p>
              <p className="text-[10px] font-bold" style={{ color: COLORS.primary, ...TEXT_STYLES }}>
                {flyerContactInfo.website}
              </p>
            </div>
          </div>
        </div>

        {/* Fait Maison Badge */}
        <div className="absolute bottom-2 right-2 opacity-70">
          <img
            src="/images/branding/fait-maison-badge.png"
            alt="Fait Maison"
            className="w-9 h-9 object-contain"
          />
        </div>
      </div>
    </section>
  );
}
