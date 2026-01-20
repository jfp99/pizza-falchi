/**
 * FlyerLeftPanel - Left side of A4 landscape flyer
 * Contains full menu: Best-Sellers, Classiques, Crèmes+Spécialités, Boissons
 * Visible when flyer is unfolded
 */

'use client';

import React from 'react';
import FlyerBackgroundLayer from './FlyerBackgroundLayer';
import { flyerMenuData, flyerHeritage, FlyerProduct, DUAL_BASE_PIZZAS } from '@/lib/flyer/menuData';

// Brand colors - WCAG AA compliant contrast ratios
const COLORS = {
  primary: '#C41E1A',
  primaryLight: '#E8403C',
  gold: '#D4A84B',
  goldLight: '#E8C87A',
  cream: '#FDF8F0',
  text: '#2C1810',
  textLight: '#3D2A1F',
  green: '#2D5016',
  white: '#FFFFFF',
};

// Text styles for crisp PDF/PNG export rendering
const TEXT_STYLES = {
  letterSpacing: '0.02em',
  wordSpacing: '0.1em',
  WebkitFontSmoothing: 'antialiased' as const,
  MozOsxFontSmoothing: 'grayscale' as const,
  textRendering: 'geometricPrecision' as const,
};

// Helper to create proper rgba colors from hex + opacity
function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Menu item row - Compact font size to fit content
function MenuItem({ item, showDualBase = false }: { item: FlyerProduct; showDualBase?: boolean }) {
  const isDualBase = item.hasDualBase || DUAL_BASE_PIZZAS.includes(item.name);

  return (
    <div className="py-[1px]">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-0.5">
          <span
            className="font-semibold text-[10px] leading-tight"
            style={{ color: COLORS.text, ...TEXT_STYLES }}
          >
            {item.name}
          </span>
          {showDualBase && isDualBase && (
            <span
              className="text-[6px] font-bold px-0.5 rounded"
              style={{
                backgroundColor: hexToRgba(COLORS.gold, 0.25),
                color: COLORS.text,
              }}
              title="Base tomate ou crème au choix"
            >
              T/C
            </span>
          )}
          {item.isVegetarian && (
            <span
              className="text-[7px] font-bold"
              style={{ color: COLORS.green }}
              title="Végétarien"
            >
              V
            </span>
          )}
          {item.isSpicy && (
            <span
              className="text-[7px] font-bold"
              style={{ color: COLORS.primary }}
              title="Épicé"
            >
              *
            </span>
          )}
        </div>
        <span
          className="font-bold text-[10px]"
          style={{ color: COLORS.primary, ...TEXT_STYLES }}
        >
          {item.price.toFixed(2)}€
        </span>
      </div>
      {item.description && (
        <p
          className="text-[8px] leading-tight"
          style={{ color: COLORS.textLight, ...TEXT_STYLES }}
        >
          {item.description}
        </p>
      )}
    </div>
  );
}

// Best-seller card - Ultra compact version
function BestSellerCard({ item }: { item: FlyerProduct }) {
  const isDualBase = item.hasDualBase || DUAL_BASE_PIZZAS.includes(item.name);

  return (
    <div
      className="p-1.5 rounded-lg relative overflow-hidden"
      style={{
        backgroundColor: hexToRgba(COLORS.gold, 0.12),
        border: `1px solid ${COLORS.gold}`,
      }}
    >
      {/* Star badge */}
      <div
        className="absolute -top-0.5 -right-0.5 w-3 h-3 flex items-center justify-center rounded-full"
        style={{
          background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
        }}
      >
        <span className="text-[7px]" style={{ color: COLORS.white }}>★</span>
      </div>

      <div className="flex items-start justify-between pr-2">
        <div className="flex-1">
          <div className="flex items-center gap-0.5">
            <span
              className="font-black text-[10px]"
              style={{ color: COLORS.text, ...TEXT_STYLES }}
            >
              {item.name}
            </span>
            {isDualBase && (
              <span
                className="text-[6px] font-bold px-0.5 rounded"
                style={{
                  backgroundColor: hexToRgba(COLORS.gold, 0.30),
                  color: COLORS.text,
                }}
              >
                T/C
              </span>
            )}
            {item.isVegetarian && (
              <span className="text-[7px] font-bold" style={{ color: COLORS.green }}>V</span>
            )}
          </div>
          {item.description && (
            <p
              className="text-[8px] leading-tight"
              style={{ color: COLORS.textLight, ...TEXT_STYLES }}
            >
              {item.description}
            </p>
          )}
        </div>
        <span
          className="font-black text-[11px] ml-1"
          style={{ color: COLORS.primary, ...TEXT_STYLES }}
        >
          {item.price.toFixed(2)}€
        </span>
      </div>
    </div>
  );
}

// Section header - compact typography
function SectionHeader({ title, subtitle, accent = false }: { title: string; subtitle?: string; accent?: boolean }) {
  return (
    <div className="mb-1">
      <h3
        className="text-[11px] font-black tracking-wider uppercase"
        style={{ color: accent ? COLORS.gold : COLORS.primary, ...TEXT_STYLES, letterSpacing: '0.06em' }}
      >
        {title}
      </h3>
      {subtitle && (
        <p
          className="text-[8px] italic"
          style={{ color: COLORS.textLight, ...TEXT_STYLES }}
        >
          {subtitle}
        </p>
      )}
      <div
        className="h-[1px] mt-0.5 rounded-full"
        style={{
          background: accent
            ? `linear-gradient(to right, ${COLORS.gold}, ${COLORS.goldLight}, transparent)`
            : `linear-gradient(to right, ${COLORS.primary}, ${COLORS.primaryLight}, transparent)`,
          width: '60%',
        }}
      />
    </div>
  );
}

export default function FlyerLeftPanel() {
  const { bestSellers, classiques, cremes, specialites, boissons } = flyerMenuData;

  return (
    <section
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: COLORS.cream }}
      aria-label="Menu complet Pizza Falchi"
    >
      {/* Background Image */}
      <FlyerBackgroundLayer
        src="/images/restaurant/wood-fired-oven.jpg"
        opacity={0.08}
        grayscale
        gradientOverlay={`linear-gradient(180deg, ${COLORS.cream}95 0%, ${COLORS.cream}80 50%, ${COLORS.cream}95 100%)`}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-1.5">
        {/* Header */}
        <div className="flex items-center justify-between mb-1 pb-0.5 border-b" style={{ borderColor: hexToRgba(COLORS.gold, 0.25) }}>
          <div className="flex items-center gap-1.5">
            <img
              src="/images/branding/logo-badge.png"
              alt="Logo Pizza Falchi - Pizzeria artisanale au feu de bois"
              className="w-7 h-7 object-contain"
            />
            <div>
              <h1
                className="text-[11px] font-black tracking-wider"
                style={{ color: COLORS.primary }}
              >
                PIZZA FALCHI
              </h1>
              <p className="text-[6px] font-medium" style={{ color: COLORS.textLight }}>
                {flyerHeritage.cooking} &bull; Depuis {flyerHeritage.since}
              </p>
            </div>
          </div>

          {/* Quality badge */}
          <div
            className="px-2 py-0.5 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 50%, ${COLORS.gold} 100%)`,
              boxShadow: '0 2px 6px rgba(212, 168, 75, 0.4)',
            }}
          >
            <span
              className="text-[6px] font-black tracking-wide uppercase flex items-center gap-0.5"
              style={{ color: COLORS.text }}
            >
              <svg className="w-2 h-2" viewBox="0 0 24 24" fill={COLORS.green}>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              Fait Maison
            </span>
          </div>
        </div>

        {/* Best Sellers */}
        <div className="mb-0.5">
          <SectionHeader
            title="Nos Best-Sellers"
            subtitle="Les pizzas préférées"
            accent
          />
          <div className="grid grid-cols-2 gap-0.5">
            {bestSellers.map((item) => (
              <BestSellerCard key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* Main Menu Grid - 2 Columns: Classiques | Crèmes+Spécialités */}
        <div className="grid grid-cols-2 gap-1">
          {/* Column 1: Les Classiques */}
          <div>
            <SectionHeader title="Les Classiques" subtitle="Base tomate" />
            <div className="space-y-0">
              {classiques.map((item) => (
                <MenuItem key={item.name} item={item} showDualBase={true} />
              ))}
            </div>
          </div>

          {/* Column 2: Crèmes + Spécialités */}
          <div className="flex flex-col">
            {/* Crèmes Fraîches */}
            <div className="mb-0.5">
              <SectionHeader title="Les Crèmes Fraîches" subtitle="Base crème" />
              <div className="space-y-0">
                {cremes.map((item) => (
                  <MenuItem key={item.name} item={item} showDualBase={true} />
                ))}
              </div>
            </div>

            {/* Spécialités */}
            <div>
              <SectionHeader title="Les Spécialités" subtitle="Créations maison" />
              <div className="space-y-0">
                {specialites.map((item) => (
                  <MenuItem key={item.name} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Sizes + Boissons + Légende */}
        <div className="mt-auto pt-0.5 border-t" style={{ borderColor: hexToRgba(COLORS.gold, 0.20) }}>
          {/* Pizza Sizes */}
          <div className="flex items-center justify-center gap-3 mb-0.5">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full border-[1.5px]" style={{ borderColor: COLORS.primary }} />
              <span className="text-[8px] font-semibold" style={{ color: COLORS.text, ...TEXT_STYLES }}>Moyenne 30cm</span>
            </div>
            <div className="w-px h-3" style={{ backgroundColor: hexToRgba(COLORS.gold, 0.25) }} />
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full border-[1.5px]" style={{ borderColor: COLORS.gold }} />
              <span className="text-[8px] font-semibold" style={{ color: COLORS.text, ...TEXT_STYLES }}>Grande 34.5cm <span style={{ color: COLORS.gold }}>(+1.50€)</span></span>
            </div>
          </div>

          {/* Boissons + Légende Row */}
          <div className="grid grid-cols-2 gap-1">
            {/* Boissons */}
            <div>
              <h3
                className="text-[9px] font-black tracking-wider uppercase mb-0.5"
                style={{ color: COLORS.gold, ...TEXT_STYLES, letterSpacing: '0.06em' }}
              >
                Boissons
              </h3>
              <div className="grid grid-cols-3 gap-x-1.5 gap-y-0">
                <div>
                  <p className="text-[7px] font-bold" style={{ color: COLORS.text, ...TEXT_STYLES }}>Vins 75cl</p>
                  {boissons.vins.map((item) => (
                    <div key={item.name} className="text-[7px] flex justify-between" style={{ color: COLORS.text, ...TEXT_STYLES }}>
                      <span>{item.name.replace('Vin ', '')}</span>
                      <span className="font-semibold">{item.price.toFixed(2)}€</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[7px] font-bold" style={{ color: COLORS.text, ...TEXT_STYLES }}>Bières</p>
                  {boissons.bieres.slice(0, 3).map((item) => (
                    <div key={item.name} className="text-[7px] flex justify-between" style={{ color: COLORS.text, ...TEXT_STYLES }}>
                      <span>{item.name.split(' ')[0]}</span>
                      <span className="font-semibold">{item.price.toFixed(2)}€</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[7px] font-bold" style={{ color: COLORS.text, ...TEXT_STYLES }}>Softs</p>
                  {boissons.softs.slice(0, 3).map((item) => (
                    <div key={item.name} className="text-[7px] flex justify-between" style={{ color: COLORS.text, ...TEXT_STYLES }}>
                      <span>{item.name.split(' ')[0]}</span>
                      <span className="font-semibold">{item.price.toFixed(2)}€</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Légende - centrée */}
            <div
              className="p-1.5 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: COLORS.cream,
                border: `1px solid ${hexToRgba(COLORS.gold, 0.25)}`,
              }}
            >
              <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5">
                <span className="text-[7px] flex items-center gap-0.5" style={TEXT_STYLES}>
                  <span className="font-bold text-[8px]" style={{ color: COLORS.green }}>V</span>
                  <span style={{ color: COLORS.textLight }}>Végétarien</span>
                </span>
                <span className="text-[7px] flex items-center gap-0.5" style={TEXT_STYLES}>
                  <span className="font-bold text-[8px]" style={{ color: COLORS.primary }}>*</span>
                  <span style={{ color: COLORS.textLight }}>Épicé</span>
                </span>
                <span className="text-[7px] flex items-center gap-0.5" style={TEXT_STYLES}>
                  <span
                    className="text-[5px] font-bold px-0.5 rounded"
                    style={{ backgroundColor: hexToRgba(COLORS.gold, 0.25), color: COLORS.text }}
                  >
                    T/C
                  </span>
                  <span style={{ color: COLORS.textLight }}>Tomate ou Crème</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
