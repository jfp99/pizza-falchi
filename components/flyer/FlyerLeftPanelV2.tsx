/**
 * FlyerLeftPanelV2 - Redesigned menu panel (65% width)
 * Authentic Italian + Premium design
 * Improved readability with larger fonts and better hierarchy
 */

'use client';

import React from 'react';
import { flyerMenuData, flyerHeritage, FlyerProduct, DUAL_BASE_PIZZAS } from '@/lib/flyer/menuData';

// Brand colors - Authentic Italian palette
const COLORS = {
  primary: '#B91C1C', // Deep Italian red
  primaryLight: '#DC2626',
  gold: '#B8860B', // Darker gold for better contrast
  goldLight: '#DAA520',
  cream: '#FFFBF5',
  creamDark: '#FDF6E9',
  text: '#1F1510',
  textMuted: '#5C4A3D',
  green: '#166534',
  white: '#FFFFFF',
};

// Text styles for crisp export
const TEXT_BASE = {
  WebkitFontSmoothing: 'antialiased' as const,
  MozOsxFontSmoothing: 'grayscale' as const,
  textRendering: 'geometricPrecision' as const,
};

// Menu item component - With description
function MenuItem({ item, showDualBase = false }: { item: FlyerProduct; showDualBase?: boolean }) {
  const isDualBase = item.hasDualBase || DUAL_BASE_PIZZAS.includes(item.name);

  return (
    <div className="py-[3px] border-b border-dotted" style={{ borderColor: 'rgba(184, 134, 11, 0.15)' }}>
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-1">
          <span
            className="font-semibold text-[10px]"
            style={{ color: COLORS.text, ...TEXT_BASE }}
          >
            {item.name}
          </span>
          {showDualBase && isDualBase && (
            <span
              className="text-[6px] font-bold px-0.5 py-[1px] rounded"
              style={{ backgroundColor: 'rgba(184, 134, 11, 0.2)', color: COLORS.text }}
            >
              T/C
            </span>
          )}
          {item.isVegetarian && (
            <span className="text-[7px] font-bold" style={{ color: COLORS.green }}>V</span>
          )}
          {item.isSpicy && (
            <span className="text-[7px] font-bold" style={{ color: COLORS.primary }}>*</span>
          )}
        </div>
        <span
          className="font-bold text-[10px] tabular-nums ml-1"
          style={{ color: COLORS.primary, ...TEXT_BASE }}
        >
          {item.price.toFixed(2)}€
        </span>
      </div>
      {item.description && (
        <p
          className="text-[7px] leading-tight -mt-[1px]"
          style={{ color: COLORS.textMuted, ...TEXT_BASE }}
        >
          {item.description}
        </p>
      )}
    </div>
  );
}

// Best-seller card - Premium highlight
function BestSellerCard({ item }: { item: FlyerProduct }) {
  const isDualBase = item.hasDualBase || DUAL_BASE_PIZZAS.includes(item.name);

  return (
    <div
      className="p-2 rounded-lg relative"
      style={{
        background: `linear-gradient(135deg, rgba(184, 134, 11, 0.08) 0%, rgba(218, 165, 32, 0.12) 100%)`,
        border: `1.5px solid ${COLORS.gold}`,
      }}
    >
      {/* Star icon */}
      <div
        className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full"
        style={{ background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})` }}
      >
        <span className="text-[9px] text-white">★</span>
      </div>

      <div className="flex items-start justify-between pr-3">
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span
              className="font-bold text-[12px]"
              style={{ color: COLORS.text, ...TEXT_BASE }}
            >
              {item.name}
            </span>
            {isDualBase && (
              <span
                className="text-[7px] font-bold px-1 py-[1px] rounded"
                style={{ backgroundColor: 'rgba(184, 134, 11, 0.25)', color: COLORS.text }}
              >
                T/C
              </span>
            )}
            {item.isVegetarian && (
              <span className="text-[8px] font-bold" style={{ color: COLORS.green }}>V</span>
            )}
          </div>
          {item.description && (
            <p className="text-[9px] mt-0.5" style={{ color: COLORS.textMuted, ...TEXT_BASE }}>
              {item.description}
            </p>
          )}
        </div>
        <span
          className="font-black text-[13px]"
          style={{ color: COLORS.primary, ...TEXT_BASE }}
        >
          {item.price.toFixed(2)}€
        </span>
      </div>
    </div>
  );
}

// Section header - Clean and elegant
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-1.5">
      <div className="flex items-center gap-2">
        <h3
          className="text-[12px] font-black tracking-wide uppercase"
          style={{ color: COLORS.primary, ...TEXT_BASE, letterSpacing: '0.05em' }}
        >
          {title}
        </h3>
        {subtitle && (
          <span className="text-[9px] italic" style={{ color: COLORS.textMuted }}>
            {subtitle}
          </span>
        )}
      </div>
      <div
        className="h-[2px] mt-1 rounded-full"
        style={{
          background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.primaryLight}, transparent)`,
          width: '100%',
        }}
      />
    </div>
  );
}

export default function FlyerLeftPanelV2() {
  const { bestSellers, classiques, cremes, specialites } = flyerMenuData;

  return (
    <section
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: COLORS.cream }}
      aria-label="Menu complet Pizza Falchi"
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
      <div className="relative z-10 h-full flex flex-col p-3">

        {/* Header - Logo + Brand */}
        <header className="flex items-center gap-3 mb-2 pb-2 border-b-2" style={{ borderColor: COLORS.gold }}>
          <img
            src="/images/branding/logo-badge.png"
            alt="Logo Pizza Falchi"
            className="w-12 h-12 object-contain"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
          />
          <div>
            <h1
              className="text-[20px] font-black tracking-wider"
              style={{ color: COLORS.primary, ...TEXT_BASE, letterSpacing: '0.08em' }}
            >
              PIZZA FALCHI
            </h1>
            <p className="text-[9px] font-medium tracking-wide" style={{ color: COLORS.textMuted }}>
              {flyerHeritage.cooking} &bull; Depuis {flyerHeritage.since}
            </p>
          </div>

          {/* Fait Maison badge */}
          <div
            className="ml-auto px-3 py-1 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
              boxShadow: '0 2px 8px rgba(184, 134, 11, 0.3)',
            }}
          >
            <span className="text-[8px] font-black tracking-wide text-white uppercase">
              Fait Maison
            </span>
          </div>
        </header>

        {/* Best Sellers Section */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className="px-2 py-0.5 rounded"
              style={{ background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})` }}
            >
              <span className="text-[10px] font-black text-white tracking-wide">★ NOS BEST-SELLERS</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {bestSellers.map((item) => (
              <BestSellerCard key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* Main Menu - 2 Columns */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {/* Column 1: Les Classiques */}
          <div>
            <SectionHeader title="Les Classiques" subtitle="base tomate" />
            <div>
              {classiques.map((item) => (
                <MenuItem key={item.name} item={item} showDualBase />
              ))}
            </div>
          </div>

          {/* Column 2: Crèmes + Spécialités */}
          <div className="flex flex-col">
            {/* Crèmes */}
            <div className="mb-2">
              <SectionHeader title="Les Crèmes" subtitle="base crème" />
              <div>
                {cremes.map((item) => (
                  <MenuItem key={item.name} item={item} showDualBase />
                ))}
              </div>
            </div>

            {/* Spécialités */}
            <div>
              <SectionHeader title="Les Spécialités" subtitle="créations maison" />
              <div>
                {specialites.map((item) => (
                  <MenuItem key={item.name} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Sizes + Boissons + Legend */}
        <footer className="mt-auto pt-2 border-t-2" style={{ borderColor: 'rgba(184, 134, 11, 0.3)' }}>
          <div className="flex items-center justify-between">
            {/* Pizza Sizes */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: COLORS.primary }} />
                <span className="text-[10px] font-semibold" style={{ color: COLORS.text }}>
                  Moyenne 30cm
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: COLORS.gold }} />
                <span className="text-[10px] font-semibold" style={{ color: COLORS.text }}>
                  Grande 34.5cm <span style={{ color: COLORS.gold }}>(+1.50€)</span>
                </span>
              </div>
            </div>

            {/* Boissons mention */}
            <div
              className="px-2 py-1 rounded"
              style={{ backgroundColor: 'rgba(184, 134, 11, 0.1)', border: `1px solid ${COLORS.gold}` }}
            >
              <span className="text-[9px] font-semibold" style={{ color: COLORS.text }}>
                Vins, Bières &amp; Softs disponibles
              </span>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3">
              <span className="text-[9px] flex items-center gap-1">
                <span className="font-bold text-[10px]" style={{ color: COLORS.green }}>V</span>
                <span style={{ color: COLORS.textMuted }}>Végé</span>
              </span>
              <span className="text-[9px] flex items-center gap-1">
                <span className="font-bold text-[10px]" style={{ color: COLORS.primary }}>*</span>
                <span style={{ color: COLORS.textMuted }}>Épicé</span>
              </span>
              <span className="text-[9px] flex items-center gap-1">
                <span
                  className="text-[7px] font-bold px-1 rounded"
                  style={{ backgroundColor: 'rgba(184, 134, 11, 0.2)', color: COLORS.text }}
                >
                  T/C
                </span>
                <span style={{ color: COLORS.textMuted }}>Tomate/Crème</span>
              </span>
            </div>
          </div>

          {/* Supplement note */}
          <p className="text-[8px] text-center mt-1" style={{ color: COLORS.textMuted }}>
            Ingrédient supplémentaire +1€
          </p>
        </footer>
      </div>
    </section>
  );
}
