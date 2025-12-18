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

// Text styles for better PDF rendering
const TEXT_STYLES = {
  letterSpacing: '0.02em',
  wordSpacing: '0.1em',
};

// Menu item row - Good font size for readability
function MenuItem({ item, showDualBase = false }: { item: FlyerProduct; showDualBase?: boolean }) {
  const isDualBase = item.hasDualBase || DUAL_BASE_PIZZAS.includes(item.name);

  return (
    <div className="py-[3px]">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-1">
          <span
            className="font-semibold text-[11px] leading-tight"
            style={{ color: COLORS.text, ...TEXT_STYLES }}
          >
            {item.name}
          </span>
          {showDualBase && isDualBase && (
            <span
              className="text-[6px] font-bold px-0.5 rounded"
              style={{
                backgroundColor: `${COLORS.gold}25`,
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
          className="font-bold text-[11px]"
          style={{ color: COLORS.primary, ...TEXT_STYLES }}
        >
          {item.price.toFixed(2)}€
        </span>
      </div>
      {item.description && (
        <p
          className="text-[8px] leading-tight -mt-0.5"
          style={{ color: COLORS.textLight, ...TEXT_STYLES }}
        >
          {item.description}
        </p>
      )}
    </div>
  );
}

// Best-seller card - Compact version
function BestSellerCard({ item }: { item: FlyerProduct }) {
  const isDualBase = item.hasDualBase || DUAL_BASE_PIZZAS.includes(item.name);

  return (
    <div
      className="p-2 rounded-lg relative overflow-hidden"
      style={{
        backgroundColor: `${COLORS.gold}15`,
        border: `1.5px solid ${COLORS.gold}`,
      }}
    >
      {/* Star badge */}
      <div
        className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full"
        style={{
          background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
        }}
      >
        <span className="text-[8px]" style={{ color: COLORS.white }}>★</span>
      </div>

      <div className="flex items-start justify-between pr-2">
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span
              className="font-black text-[11px]"
              style={{ color: COLORS.text, ...TEXT_STYLES }}
            >
              {item.name}
            </span>
            {isDualBase && (
              <span
                className="text-[6px] font-bold px-0.5 rounded"
                style={{
                  backgroundColor: `${COLORS.gold}30`,
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
          className="font-black text-[12px] ml-1"
          style={{ color: COLORS.primary, ...TEXT_STYLES }}
        >
          {item.price.toFixed(2)}€
        </span>
      </div>
    </div>
  );
}

// Section header
function SectionHeader({ title, subtitle, accent = false }: { title: string; subtitle?: string; accent?: boolean }) {
  return (
    <div className="mb-1">
      <h3
        className="text-[12px] font-black tracking-wider uppercase"
        style={{ color: accent ? COLORS.gold : COLORS.primary, letterSpacing: '0.08em' }}
      >
        {title}
      </h3>
      {subtitle && (
        <p
          className="text-[9px] italic -mt-0.5"
          style={{ color: COLORS.textLight, ...TEXT_STYLES }}
        >
          {subtitle}
        </p>
      )}
      <div
        className="h-[1.5px] mt-1 rounded-full"
        style={{
          background: accent
            ? `linear-gradient(to right, ${COLORS.gold}, ${COLORS.goldLight}, transparent)`
            : `linear-gradient(to right, ${COLORS.primary}, ${COLORS.primaryLight}, transparent)`,
          width: '70%',
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
      <div className="relative z-10 h-full flex flex-col p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-1.5 pb-1 border-b" style={{ borderColor: `${COLORS.gold}40` }}>
          <div className="flex items-center gap-2">
            <img
              src="/images/branding/logo-badge.png"
              alt="Logo Pizza Falchi - Pizzeria artisanale au feu de bois"
              className="w-9 h-9 object-contain"
            />
            <div>
              <h1
                className="text-[13px] font-black tracking-wider"
                style={{ color: COLORS.primary }}
              >
                PIZZA FALCHI
              </h1>
              <p className="text-[7px] font-medium" style={{ color: COLORS.textLight }}>
                {flyerHeritage.cooking} &bull; Depuis {flyerHeritage.since}
              </p>
            </div>
          </div>

          {/* Quality badge */}
          <div
            className="px-2.5 py-1 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 50%, ${COLORS.gold} 100%)`,
              boxShadow: '0 2px 8px rgba(212, 168, 75, 0.4)',
            }}
          >
            <span
              className="text-[7px] font-black tracking-wide uppercase flex items-center gap-1"
              style={{ color: COLORS.text }}
            >
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill={COLORS.green}>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              Fait Maison
            </span>
          </div>
        </div>

        {/* Best Sellers */}
        <div className="mb-1">
          <SectionHeader
            title="Nos Best-Sellers"
            subtitle="Les pizzas préférées"
            accent
          />
          <div className="grid grid-cols-2 gap-1">
            {bestSellers.map((item) => (
              <BestSellerCard key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* Main Menu Grid - 2 Columns: Classiques | Crèmes+Spécialités */}
        <div className="grid grid-cols-2 gap-2">
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
            <div className="mb-2">
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
        <div className="mt-auto pt-1 border-t" style={{ borderColor: `${COLORS.gold}30` }}>
          {/* Pizza Sizes */}
          <div className="flex items-center justify-center gap-4 mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: COLORS.primary }} />
              <span className="text-[8px] font-semibold" style={{ color: COLORS.text }}>Moyenne 30cm</span>
            </div>
            <div className="w-px h-4" style={{ backgroundColor: `${COLORS.gold}40` }} />
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: COLORS.gold }} />
              <span className="text-[8px] font-semibold" style={{ color: COLORS.text }}>Grande 34.5cm <span style={{ color: COLORS.gold }}>(+1.50€)</span></span>
            </div>
          </div>

          {/* Boissons + Légende Row */}
          <div className="grid grid-cols-2 gap-2">
            {/* Boissons */}
            <div>
              <h3
                className="text-[10px] font-black tracking-wider uppercase mb-1"
                style={{ color: COLORS.gold, letterSpacing: '0.08em' }}
              >
                Boissons
              </h3>
              <div className="grid grid-cols-3 gap-x-2 gap-y-[2px]">
                <div>
                  <p className="text-[7px] font-bold mb-0.5" style={{ color: COLORS.text }}>Vins 75cl</p>
                  {boissons.vins.map((item) => (
                    <div key={item.name} className="text-[7px] flex justify-between" style={{ color: COLORS.text }}>
                      <span>{item.name.replace('Vin ', '')}</span>
                      <span className="font-semibold">{item.price.toFixed(2)}€</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[7px] font-bold mb-0.5" style={{ color: COLORS.text }}>Bières</p>
                  {boissons.bieres.slice(0, 3).map((item) => (
                    <div key={item.name} className="text-[7px] flex justify-between" style={{ color: COLORS.text }}>
                      <span>{item.name.split(' ')[0]}</span>
                      <span className="font-semibold">{item.price.toFixed(2)}€</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[7px] font-bold mb-0.5" style={{ color: COLORS.text }}>Softs</p>
                  {boissons.softs.slice(0, 3).map((item) => (
                    <div key={item.name} className="text-[7px] flex justify-between" style={{ color: COLORS.text }}>
                      <span>{item.name.split(' ')[0]}</span>
                      <span className="font-semibold">{item.price.toFixed(2)}€</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Légende */}
            <div
              className="p-2 rounded-lg flex flex-col items-center justify-center"
              style={{
                backgroundColor: `${COLORS.cream}`,
                border: `1px solid ${COLORS.gold}40`,
              }}
            >
              <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
                <span className="text-[8px] flex items-center gap-1">
                  <span className="font-bold text-[9px]" style={{ color: COLORS.green }}>V</span>
                  <span style={{ color: COLORS.textLight }}>Végétarien</span>
                </span>
                <span className="text-[8px] flex items-center gap-1">
                  <span className="font-bold text-[9px]" style={{ color: COLORS.primary }}>*</span>
                  <span style={{ color: COLORS.textLight }}>Épicé</span>
                </span>
                <span className="text-[8px] flex items-center gap-1">
                  <span
                    className="text-[6px] font-bold px-0.5 rounded"
                    style={{ backgroundColor: `${COLORS.gold}25`, color: COLORS.text }}
                  >
                    T/C
                  </span>
                  <span style={{ color: COLORS.textLight }}>Tomate ou Crème</span>
                </span>
              </div>
              <div
                className="mt-1.5 px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${COLORS.primary}10`,
                  border: `1px solid ${COLORS.primary}30`,
                }}
              >
                <span className="text-[7px] font-bold" style={{ color: COLORS.primary }}>
                  Ingrédient supplémentaire +1€
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
