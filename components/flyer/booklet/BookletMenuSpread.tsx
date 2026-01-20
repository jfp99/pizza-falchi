/**
 * BookletMenuSpread - Pages 2-3 (Interior spread)
 * Full menu displayed across two A5 pages
 * Format A4 Landscape when opened (297mm x 210mm)
 * Fold line in the middle
 */

'use client';

import React from 'react';
import { flyerMenuData, flyerHeritage, FlyerProduct, DUAL_BASE_PIZZAS, PIZZA_SIZES } from '@/lib/flyer/menuData';

// A4 Landscape dimensions at 96 DPI (two A5 pages side by side)
const A4_WIDTH = 1122; // 297mm
const A4_HEIGHT = 794; // 210mm

const COLORS = {
  primary: '#B91C1C',
  primaryLight: '#DC2626',
  gold: '#B8860B',
  goldLight: '#DAA520',
  cream: '#FFFBF5',
  creamDark: '#FDF6E9',
  text: '#1F1510',
  textMuted: '#5C4A3D',
  green: '#166534',
  white: '#FFFFFF',
};

const TEXT_BASE = {
  WebkitFontSmoothing: 'antialiased' as const,
  MozOsxFontSmoothing: 'grayscale' as const,
  textRendering: 'geometricPrecision' as const,
};

// Menu item component - Optimized for space
function MenuItem({ item, showDualBase = false }: { item: FlyerProduct; showDualBase?: boolean }) {
  const isDualBase = item.hasDualBase || DUAL_BASE_PIZZAS.includes(item.name);

  return (
    <div className="py-[3px] border-b border-dotted" style={{ borderColor: 'rgba(184, 134, 11, 0.15)' }}>
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-1">
          <span
            className="font-semibold text-[14px]"
            style={{ color: COLORS.text, ...TEXT_BASE }}
          >
            {item.name}
          </span>
          {showDualBase && isDualBase && (
            <span
              className="text-[8px] font-bold px-1 rounded"
              style={{ backgroundColor: 'rgba(184, 134, 11, 0.2)', color: COLORS.text, paddingTop: '2px', paddingBottom: '3px' }}
            >
              T/C
            </span>
          )}
          {item.isVegetarian && (
            <span className="text-[10px] font-bold" style={{ color: COLORS.green }}>V</span>
          )}
          {item.isSpicy && (
            <span className="text-[10px] font-bold" style={{ color: COLORS.primary }}>*</span>
          )}
        </div>
        <span
          className="font-bold text-[14px] tabular-nums ml-1"
          style={{ color: COLORS.primary, ...TEXT_BASE }}
        >
          {item.price.toFixed(2)}€
        </span>
      </div>
      {item.description && (
        <p
          className="text-[10px] leading-tight"
          style={{ color: COLORS.textMuted, ...TEXT_BASE }}
        >
          {item.description}
        </p>
      )}
    </div>
  );
}

// Drink item - Compact
function DrinkItem({ name, price }: { name: string; price: number }) {
  return (
    <div className="flex items-baseline justify-between py-[2px]">
      <span className="text-[12px] font-medium" style={{ color: COLORS.text }}>{name}</span>
      <span className="text-[12px] font-bold tabular-nums" style={{ color: COLORS.primary }}>{price.toFixed(2)}€</span>
    </div>
  );
}

// Best-seller card - Simplifié (sans étoile positionnée en absolute)
function BestSellerCard({ item }: { item: FlyerProduct }) {
  const isDualBase = item.hasDualBase || DUAL_BASE_PIZZAS.includes(item.name);

  return (
    <div
      className="p-2 rounded-lg"
      style={{
        background: `linear-gradient(135deg, rgba(184, 134, 11, 0.08) 0%, rgba(218, 165, 32, 0.12) 100%)`,
        border: `1px solid ${COLORS.gold}`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span
              className="font-bold text-[15px]"
              style={{ color: COLORS.text, ...TEXT_BASE }}
            >
              {item.name}
            </span>
            {isDualBase && (
              <span
                className="text-[8px] font-bold px-1 rounded"
                style={{ backgroundColor: 'rgba(184, 134, 11, 0.25)', color: COLORS.text, paddingTop: '2px', paddingBottom: '3px' }}
              >
                T/C
              </span>
            )}
            {item.isVegetarian && (
              <span className="text-[10px] font-bold" style={{ color: COLORS.green }}>V</span>
            )}
          </div>
          {item.description && (
            <p className="text-[11px]" style={{ color: COLORS.textMuted, ...TEXT_BASE }}>
              {item.description}
            </p>
          )}
        </div>
        <span
          className="font-black text-[16px]"
          style={{ color: COLORS.primary, ...TEXT_BASE }}
        >
          {item.price.toFixed(2)}€
        </span>
      </div>
    </div>
  );
}

// Section header - Compact
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        <h3
          className="text-[15px] font-black tracking-wide uppercase"
          style={{ color: COLORS.primary, ...TEXT_BASE, letterSpacing: '0.05em' }}
        >
          {title}
        </h3>
        {subtitle && (
          <span className="text-[11px] italic" style={{ color: COLORS.textMuted }}>
            {subtitle}
          </span>
        )}
      </div>
      <div
        className="h-[2px] mt-0.5 rounded-full"
        style={{
          background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.primaryLight}, transparent)`,
          width: '100%',
        }}
      />
    </div>
  );
}

interface BookletMenuSpreadProps {
  showFoldLine?: boolean;
}

export default function BookletMenuSpread({ showFoldLine = true }: BookletMenuSpreadProps) {
  const { bestSellers, classiques, cremes, specialites, boissons } = flyerMenuData;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${A4_WIDTH}px`,
        height: `${A4_HEIGHT}px`,
        backgroundColor: COLORS.cream,
      }}
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.gold} 1px, transparent 0)`,
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />

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

      {/* Content */}
      <div className="relative z-10 h-full flex">
        {/* ===== LEFT PAGE (Page 2) ===== */}
        <div className="flex-1 p-3 flex flex-col">
          {/* Header */}
          <header className="flex items-center gap-2 mb-10 pb-2 border-b-2" style={{ borderColor: COLORS.gold }}>
            <img
              src="/images/branding/logo-badge.png"
              alt="Logo Pizza Falchi"
              className="w-9 h-9 object-contain"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            />
            <div>
              <h1
                className="text-[20px] font-black tracking-wider"
                style={{ color: COLORS.primary, ...TEXT_BASE, letterSpacing: '0.08em' }}
              >
                PIZZA FALCHI
              </h1>
              <p className="text-[10px] font-medium tracking-wide" style={{ color: COLORS.textMuted }}>
                {flyerHeritage.cooking} &bull; Depuis {flyerHeritage.since}
              </p>
            </div>

            {/* Fait Maison badge */}
            <div
              className="ml-auto px-2 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
                boxShadow: '0 2px 6px rgba(184, 134, 11, 0.3)',
                paddingTop: '3px',
                paddingBottom: '5px',
              }}
            >
              <span className="text-[10px] font-black tracking-wide text-white uppercase">
                Fait Maison
              </span>
            </div>
          </header>

          {/* Best Sellers */}
          <div className="mb-9">
            <div className="flex items-center gap-1.5 mb-2">
              <div
                className="px-1.5 rounded"
                style={{ background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, paddingTop: '3px', paddingBottom: '5px' }}
              >
                <span className="text-[12px] font-black text-white tracking-wide">NOS BEST-SELLERS</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {bestSellers.map((item) => (
                <BestSellerCard key={item.name} item={item} />
              ))}
            </div>
          </div>

          {/* Les Classiques */}
          <div className="flex-1">
            <SectionHeader title="Les Classiques" subtitle="base tomate" />
            <div className="grid grid-cols-2 gap-x-3">
              {classiques.map((item) => (
                <MenuItem key={item.name} item={item} showDualBase />
              ))}
            </div>
          </div>

          {/* LEFT FOOTER - Legend (centered) */}
          <footer className="mt-auto pt-3 border-t-2" style={{ borderColor: 'rgba(184, 134, 11, 0.3)' }}>
            <div className="flex items-center justify-center h-[52px]">
              {/* Legend - Centered */}
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2">
                  <span className="font-bold text-[16px]" style={{ color: COLORS.green }}>V</span>
                  <span className="text-[14px] font-medium" style={{ color: COLORS.text }}>Végétarien</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-bold text-[16px]" style={{ color: COLORS.primary }}>*</span>
                  <span className="text-[14px] font-medium" style={{ color: COLORS.text }}>Épicé</span>
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold px-1.5 rounded"
                    style={{ backgroundColor: 'rgba(184, 134, 11, 0.25)', color: COLORS.text, paddingTop: '3px', paddingBottom: '5px' }}
                  >
                    T/C
                  </span>
                  <span className="text-[14px] font-medium" style={{ color: COLORS.text }}>Tomate ou Crème</span>
                </span>
              </div>
            </div>
          </footer>
        </div>

        {/* ===== RIGHT PAGE (Page 3) ===== */}
        <div className="flex-1 p-3 flex flex-col">
          {/* Les Crèmes */}
          <div className="mb-9">
            <SectionHeader title="Les Crèmes" subtitle="base crème fraîche" />
            <div className="grid grid-cols-2 gap-x-3">
              {cremes.map((item) => (
                <MenuItem key={item.name} item={item} showDualBase />
              ))}
            </div>
          </div>

          {/* Les Spécialités */}
          <div className="mb-9">
            <SectionHeader title="Les Spécialités" subtitle="créations maison" />
            <div className="grid grid-cols-2 gap-x-3">
              {specialites.map((item) => (
                <MenuItem key={item.name} item={item} />
              ))}
            </div>
          </div>

          {/* Boissons Section */}
          <div className="mb-9">
            <SectionHeader title="Nos Boissons" />
            <div className="grid grid-cols-3 gap-x-4 gap-y-1">
              {/* Vins */}
              <div>
                <p className="text-[11px] font-bold uppercase mb-1" style={{ color: COLORS.gold }}>Vins (75cl)</p>
                {boissons.vins.map((drink) => (
                  <DrinkItem key={drink.name} name={drink.name} price={drink.price} />
                ))}
              </div>
              {/* Bières */}
              <div>
                <p className="text-[11px] font-bold uppercase mb-1" style={{ color: COLORS.gold }}>Bières</p>
                {boissons.bieres.map((drink) => (
                  <DrinkItem key={drink.name} name={drink.name} price={drink.price} />
                ))}
              </div>
              {/* Softs */}
              <div>
                <p className="text-[11px] font-bold uppercase mb-1" style={{ color: COLORS.gold }}>Softs</p>
                {boissons.softs.map((drink) => (
                  <DrinkItem key={drink.name} name={drink.name} price={drink.price} />
                ))}
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* RIGHT FOOTER - Pizza Sizes + Supplement */}
          <footer className="mt-auto pt-3 border-t-2" style={{ borderColor: 'rgba(184, 134, 11, 0.3)' }}>
            <div className="flex items-center justify-between h-[52px] px-16">
              {/* Supplement */}
              <div
                className="px-2 py-1 rounded-lg whitespace-nowrap"
                style={{ backgroundColor: 'rgba(185, 28, 28, 0.08)', border: `1px solid ${COLORS.primary}` }}
              >
                <span className="text-[11px] font-bold" style={{ color: COLORS.primary }}>
                  Ingrédient suppl. +1€
                </span>
              </div>

              {/* Pizza Sizes Group - Closer together */}
              <div className="flex items-center gap-4">
                {/* Moyenne */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full"
                    style={{
                      borderColor: COLORS.primary,
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: COLORS.primary,
                      lineHeight: 1,
                    }}>M</span>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold leading-tight" style={{ color: COLORS.text }}>
                      {PIZZA_SIZES.moyenne.label}
                    </p>
                    <p className="text-[10px] font-medium" style={{ color: COLORS.textMuted }}>
                      {PIZZA_SIZES.moyenne.size}
                    </p>
                  </div>
                </div>

                {/* Grande */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-full"
                    style={{
                      borderColor: COLORS.gold,
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: COLORS.gold,
                      lineHeight: 1,
                    }}>G</span>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold leading-tight" style={{ color: COLORS.text }}>
                      {PIZZA_SIZES.grande.label}
                    </p>
                    <p className="text-[10px] font-medium" style={{ color: COLORS.textMuted }}>
                      {PIZZA_SIZES.grande.size}
                    </p>
                    <p className="text-[11px] font-bold" style={{ color: COLORS.gold }}>
                      +{PIZZA_SIZES.grande.supplement.toFixed(2)}€
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export const BOOKLET_MENU_SPREAD_DIMENSIONS = {
  width: A4_WIDTH,
  height: A4_HEIGHT,
};
