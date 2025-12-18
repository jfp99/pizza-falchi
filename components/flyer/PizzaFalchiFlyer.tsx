/**
 * Pizza Falchi Flyer - S-Tier Professional Design
 * Tri-fold A5 format (148mm x 210mm) - Inspired by reference design
 * Exportable to PDF/PNG at 300 DPI
 */

'use client';

import React, { forwardRef } from 'react';
import { flyerMenuData, flyerContactInfo, flyerHeritage } from '@/lib/flyer/menuData';

interface PizzaFalchiFlyerProps {
  className?: string;
  showWatermark?: boolean;
}

// A5 dimensions at 96 DPI (screen) - scales to 300 DPI for print
const FLYER_WIDTH = 559;
const FLYER_HEIGHT = 794;

// Brand Colors - CMYK Safe
const COLORS = {
  primary: '#C41E1A',      // Pizza Falchi Red
  primaryDark: '#9A1815',  // Darker red for contrast
  gold: '#D4A84B',         // Elegant gold
  goldLight: '#E8C87A',    // Light gold accent
  cream: '#FDF8F0',        // Warm cream background
  creamDark: '#F5EDE0',    // Darker cream for sections
  text: '#2C1810',         // Rich dark brown
  textLight: '#5C4030',    // Lighter brown
  white: '#FFFFFF',
};

// Compact star icon
const StarIcon = () => (
  <svg width="8" height="8" viewBox="0 0 24 24" fill={COLORS.gold} style={{ flexShrink: 0 }}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

// Vegetarian leaf icon
const LeafIcon = () => (
  <svg width="7" height="7" viewBox="0 0 24 24" fill="#2D8B2D" style={{ flexShrink: 0 }}>
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
  </svg>
);

// Spicy flame icon
const FlameIcon = () => (
  <svg width="7" height="7" viewBox="0 0 24 24" fill="#E85D04" style={{ flexShrink: 0 }}>
    <path d="M12 23c-3.65 0-6.5-2.85-6.5-6.5 0-2.8 1.78-5.2 2.83-6.53.32-.41.93-.41 1.28-.03l.13.15c.76.93 1.76 2.15 1.76 3.41 0 .82-.42 1.56-1.08 2-.66.44-1.42.5-2.09.19-.11.46-.18.94-.18 1.43 0 2.76 2.24 5 5 5s5-2.24 5-5c0-2.09-.99-3.95-2.53-5.13-.44-.34-.97-.52-1.52-.52-.99 0-1.95.73-1.95 1.65 0 .36.14.7.37.95l.23.25c.38.4.6.94.6 1.5 0 1.24-1.01 2.25-2.25 2.25S9 14.74 9 13.5c0-.83.45-1.56 1.13-1.95-.1-.33-.13-.67-.13-1.05 0-1.27.6-2.4 1.5-3.16l.12-.1c.94-.79 2.17-1.24 3.38-1.24 1.38 0 2.71.56 3.68 1.53C19.83 8.72 21 10.98 21 13.5c0 5.24-4.26 9.5-9.5 9.5h.5z"/>
  </svg>
);

// Fire/Wood icon for header
const FireIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={COLORS.gold}>
    <path d="M12 23c-3.65 0-6.5-2.85-6.5-6.5 0-2.8 1.78-5.2 2.83-6.53.32-.41.93-.41 1.28-.03l.13.15c.76.93 1.76 2.15 1.76 3.41 0 .82-.42 1.56-1.08 2-.66.44-1.42.5-2.09.19-.11.46-.18.94-.18 1.43 0 2.76 2.24 5 5 5s5-2.24 5-5c0-2.09-.99-3.95-2.53-5.13-.44-.34-.97-.52-1.52-.52-.99 0-1.95.73-1.95 1.65 0 .36.14.7.37.95l.23.25c.38.4.6.94.6 1.5 0 1.24-1.01 2.25-2.25 2.25S9 14.74 9 13.5c0-.83.45-1.56 1.13-1.95-.1-.33-.13-.67-.13-1.05 0-1.27.6-2.4 1.5-3.16l.12-.1c.94-.79 2.17-1.24 3.38-1.24 1.38 0 2.71.56 3.68 1.53C19.83 8.72 21 10.98 21 13.5c0 5.24-4.26 9.5-9.5 9.5h.5z"/>
  </svg>
);

const PizzaFalchiFlyer = forwardRef<HTMLDivElement, PizzaFalchiFlyerProps>(
  function PizzaFalchiFlyer({ className = '', showWatermark = false }, ref) {
    // Render a menu item row
    const renderMenuItem = (item: { name: string; price: number; isVegetarian?: boolean; isSpicy?: boolean; isBestSeller?: boolean }, index: number, showIcons = true) => (
      <div
        key={`${item.name}-${index}`}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5px 0',
          borderBottom: `0.5px dotted ${COLORS.textLight}40`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
          {showIcons && item.isBestSeller && <StarIcon />}
          {showIcons && item.isVegetarian && <LeafIcon />}
          {showIcons && item.isSpicy && <FlameIcon />}
          <span style={{
            fontSize: 7.5,
            color: COLORS.text,
            fontWeight: item.isBestSeller ? 600 : 400,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {item.name}
          </span>
        </div>
        <span style={{
          fontSize: 7.5,
          fontWeight: 600,
          color: COLORS.primary,
          marginLeft: 4,
          flexShrink: 0,
        }}>
          {item.price.toFixed(2)}€
        </span>
      </div>
    );

    return (
      <div
        ref={ref}
        className={`relative ${className}`}
        style={{
          width: FLYER_WIDTH,
          height: FLYER_HEIGHT,
          backgroundColor: COLORS.cream,
          fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
          overflow: 'hidden',
        }}
        role="document"
        aria-label="Menu Pizza Falchi"
      >
        {/* Watermark */}
        {showWatermark && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              zIndex: 50,
              opacity: 0.08,
            }}
          >
            <span style={{ fontSize: 72, fontWeight: 900, color: COLORS.primary, transform: 'rotate(-25deg)' }}>
              APERCU
            </span>
          </div>
        )}

        {/* Decorative top border */}
        <div style={{ height: 6, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryDark}, ${COLORS.primary})` }} />

        {/* HEADER SECTION */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
          padding: '10px 12px 8px',
          position: 'relative',
        }}>
          {/* Decorative pattern overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.05,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            {/* Logo area */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Logo circle */}
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 50%, ${COLORS.gold} 100%)`,
                border: `2px solid ${COLORS.white}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 8, fontWeight: 800, color: COLORS.primary, lineHeight: 1 }}>PIZZA</div>
                  <div style={{ fontSize: 9, fontWeight: 900, color: COLORS.primary, lineHeight: 1, letterSpacing: -0.5 }}>FALCHI</div>
                </div>
              </div>

              {/* Brand text */}
              <div>
                <div style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: COLORS.white,
                  letterSpacing: 1,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  lineHeight: 1,
                }}>
                  PIZZA <span style={{ color: COLORS.gold }}>FALCHI</span>
                </div>
                <div style={{
                  fontSize: 8,
                  color: COLORS.goldLight,
                  fontWeight: 500,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginTop: 2,
                }}>
                  {flyerHeritage.tagline} • Depuis {flyerHeritage.since}
                </div>
              </div>
            </div>

            {/* Right side - Wood fired badge */}
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 8,
              padding: '6px 10px',
              border: '1px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(4px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <FireIcon />
                <span style={{ fontSize: 8, color: COLORS.white, fontWeight: 600 }}>Cuisson au</span>
              </div>
              <div style={{ fontSize: 10, color: COLORS.gold, fontWeight: 800, textAlign: 'center', letterSpacing: 0.5 }}>
                FEU DE BOIS
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ padding: '6px 10px', height: 'calc(100% - 130px)', display: 'flex', flexDirection: 'column' }}>

          {/* BEST-SELLERS SECTION */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.gold}15 0%, ${COLORS.goldLight}10 100%)`,
            borderRadius: 6,
            padding: '6px 8px',
            marginBottom: 6,
            border: `1px solid ${COLORS.gold}40`,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 4,
              borderBottom: `1px solid ${COLORS.gold}40`,
              paddingBottom: 3,
            }}>
              <StarIcon />
              <span style={{ fontSize: 10, fontWeight: 800, color: COLORS.primary, letterSpacing: 0.5 }}>
                NOS BEST-SELLERS
              </span>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${COLORS.gold}60, transparent)` }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 12px' }}>
              {flyerMenuData.bestSellers.map((item, idx) => (
                <div key={item.name} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '2px 0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <StarIcon />
                    {item.isVegetarian && <LeafIcon />}
                    {item.isSpicy && <FlameIcon />}
                    <span style={{ fontSize: 8, fontWeight: 600, color: COLORS.text }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: 8, fontWeight: 700, color: COLORS.primary }}>{item.price.toFixed(2)}€</span>
                </div>
              ))}
            </div>
          </div>

          {/* TWO COLUMN LAYOUT */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1, minHeight: 0 }}>

            {/* LEFT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0 }}>

              {/* LES CLASSIQUES */}
              <div style={{ flex: 1, minHeight: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginBottom: 3,
                  borderBottom: `2px solid ${COLORS.primary}`,
                  paddingBottom: 2,
                }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: COLORS.primary, letterSpacing: 0.5 }}>
                    LES CLASSIQUES
                  </span>
                  <span style={{ fontSize: 7, color: COLORS.textLight, fontStyle: 'italic' }}>(Base tomate)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {flyerMenuData.classiques.map((item, idx) => renderMenuItem(item, idx))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0 }}>

              {/* LES CREMES FRAICHES */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginBottom: 3,
                  borderBottom: `2px solid ${COLORS.primary}`,
                  paddingBottom: 2,
                }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: COLORS.primary, letterSpacing: 0.5 }}>
                    LES CRÈMES FRAÎCHES
                  </span>
                  <span style={{ fontSize: 7, color: COLORS.textLight, fontStyle: 'italic' }}>(Base crème)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {flyerMenuData.cremes.map((item, idx) => renderMenuItem(item, idx))}
                </div>
              </div>

              {/* LES SPECIALITES */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginBottom: 3,
                  borderBottom: `2px solid ${COLORS.primary}`,
                  paddingBottom: 2,
                }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: COLORS.primary, letterSpacing: 0.5 }}>
                    LES SPÉCIALITÉS
                  </span>
                  <span style={{ fontSize: 7, color: COLORS.textLight, fontStyle: 'italic' }}>(Créations maison)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {flyerMenuData.specialites.map((item, idx) => renderMenuItem(item, idx))}
                </div>
              </div>
            </div>
          </div>

          {/* BOISSONS SECTION - Horizontal at bottom */}
          <div style={{
            background: COLORS.creamDark,
            borderRadius: 6,
            padding: '5px 8px',
            marginTop: 6,
            border: `1px solid ${COLORS.textLight}20`,
          }}>
            <div style={{
              fontSize: 9,
              fontWeight: 800,
              color: COLORS.primary,
              marginBottom: 4,
              borderBottom: `1px solid ${COLORS.primary}30`,
              paddingBottom: 2,
            }}>
              BOISSONS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {/* Vins */}
              <div>
                <div style={{ fontSize: 7, fontWeight: 700, color: COLORS.textLight, marginBottom: 2 }}>Vins 75cl</div>
                {flyerMenuData.boissons.vins.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 6.5 }}>
                    <span style={{ color: COLORS.text }}>{item.name}</span>
                    <span style={{ color: COLORS.primary, fontWeight: 600 }}>{item.price.toFixed(2)}€</span>
                  </div>
                ))}
              </div>
              {/* Bieres */}
              <div>
                <div style={{ fontSize: 7, fontWeight: 700, color: COLORS.textLight, marginBottom: 2 }}>Bières</div>
                {flyerMenuData.boissons.bieres.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 6.5 }}>
                    <span style={{ color: COLORS.text }}>{item.name}</span>
                    <span style={{ color: COLORS.primary, fontWeight: 600 }}>{item.price.toFixed(2)}€</span>
                  </div>
                ))}
              </div>
              {/* Softs */}
              <div>
                <div style={{ fontSize: 7, fontWeight: 700, color: COLORS.textLight, marginBottom: 2 }}>Softs</div>
                {flyerMenuData.boissons.softs.slice(0, 4).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 6.5 }}>
                    <span style={{ color: COLORS.text }}>{item.name}</span>
                    <span style={{ color: COLORS.primary, fontWeight: 600 }}>{item.price.toFixed(2)}€</span>
                  </div>
                ))}
              </div>
              {/* Legend + Extra */}
              <div>
                <div style={{ fontSize: 7, fontWeight: 700, color: COLORS.textLight, marginBottom: 2 }}>Légende</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 6.5, color: COLORS.text }}>
                  <StarIcon /> Best-seller
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 6.5, color: COLORS.text }}>
                  <LeafIcon /> Végétarien
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 6.5, color: COLORS.text }}>
                  <FlameIcon /> Épicé
                </div>
                <div style={{ fontSize: 6, color: COLORS.textLight, marginTop: 2, fontStyle: 'italic' }}>
                  +1€ par ingrédient
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
          padding: '8px 12px',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}>
          {/* Promo banner */}
          <div style={{
            background: COLORS.gold,
            borderRadius: 4,
            padding: '4px 12px',
            textAlign: 'center',
            marginBottom: 6,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: COLORS.primary, letterSpacing: 0.5 }}>
              🎁 10 PIZZAS ACHETÉES = 1 OFFERTE !
            </span>
          </div>

          {/* Contact info */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: COLORS.white,
          }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.5 }}>
                📞 {flyerContactInfo.phone}
              </div>
              <div style={{ fontSize: 7, opacity: 0.9 }}>
                {flyerContactInfo.address}, {flyerContactInfo.city}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 8, fontWeight: 700 }}>
                {flyerContactInfo.hours}
              </div>
              <div style={{ fontSize: 7, color: COLORS.goldLight }}>
                {flyerContactInfo.closedDay}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 9, fontWeight: 700 }}>
                {flyerContactInfo.website}
              </div>
              <div style={{ fontSize: 7, opacity: 0.8 }}>
                Commandez en ligne
              </div>
            </div>
          </div>
        </div>

        {/* Decorative border */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: `3px solid ${COLORS.primary}`,
            borderRadius: 4,
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }
);

export default PizzaFalchiFlyer;
