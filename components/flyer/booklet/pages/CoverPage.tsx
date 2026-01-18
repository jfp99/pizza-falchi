'use client';

import Image from 'next/image';
import { BOOKLET_COLORS, BOOKLET_TYPOGRAPHY } from '@/lib/flyer/bookletDimensions';
import { flyerHeritage } from '@/lib/flyer/menuData';
import { Star, Flame, Award, UtensilsCrossed } from 'lucide-react';

/**
 * CoverPage - Page 1 (Front Cover)
 * Brand hero, tagline, and social proof
 * Optimized to fill maximum space
 */
export default function CoverPage() {
  return (
    <div className="flex flex-col h-full items-center justify-between py-1">
      {/* Top Section - Logo & Brand */}
      <div className="flex flex-col items-center text-center">
        {/* Logo - Larger */}
        <div
          className="relative mb-2 rounded-full overflow-hidden shadow-lg"
          style={{
            width: '90px',
            height: '90px',
            border: `4px solid ${BOOKLET_COLORS.primaryYellow}`,
          }}
        >
          <Image
            src="/images/branding/logo-badge.png"
            alt="Pizza Falchi"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Brand Name - Larger */}
        <h1
          style={{
            fontSize: `${BOOKLET_TYPOGRAPHY.brandName.size + 6}px`,
            fontWeight: BOOKLET_TYPOGRAPHY.brandName.weight,
            lineHeight: BOOKLET_TYPOGRAPHY.brandName.lineHeight,
            color: BOOKLET_COLORS.primaryRed,
            letterSpacing: '0.03em',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          PIZZA FALCHI
        </h1>

        {/* Tagline - More prominent */}
        <div className="flex items-center gap-3 mt-2">
          <div
            className="h-px w-14"
            style={{ backgroundColor: BOOKLET_COLORS.primaryYellow }}
          />
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: BOOKLET_COLORS.textBrown,
              letterSpacing: '0.12em',
            }}
          >
            {flyerHeritage.tagline.toUpperCase()}
          </span>
          <div
            className="h-px w-14"
            style={{ backgroundColor: BOOKLET_COLORS.primaryYellow }}
          />
        </div>

        {/* Since Year - Larger */}
        <span
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: BOOKLET_COLORS.textMuted,
            marginTop: '4px',
          }}
        >
          Depuis {flyerHeritage.since}
        </span>
      </div>

      {/* Hero Image Section - Much Larger */}
      <div className="relative w-full flex-1 flex items-center justify-center my-3">
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: '380px',
            height: '280px',
            border: `3px solid ${BOOKLET_COLORS.softYellow}`,
          }}
        >
          <Image
            src="/images/hero/hero-main.avif"
            alt="Pizza artisanale au feu de bois"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)',
            }}
          />
          {/* Award badge on image */}
          <div
            className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <Award size={14} color={BOOKLET_COLORS.primaryYellowDark} strokeWidth={2.5} />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: BOOKLET_COLORS.textDark,
              }}
            >
              + de 20 ans d&apos;experience
            </span>
          </div>
        </div>
      </div>

      {/* Wood Fire Badge - Larger */}
      <div
        className="flex items-center gap-3 px-6 py-3 rounded-full shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${BOOKLET_COLORS.primaryYellow} 0%, ${BOOKLET_COLORS.primaryYellowDark} 100%)`,
        }}
      >
        <Flame size={22} color={BOOKLET_COLORS.primaryRed} strokeWidth={2.5} />
        <span
          style={{
            fontSize: '15px',
            fontWeight: 800,
            color: BOOKLET_COLORS.textDark,
            letterSpacing: '0.06em',
          }}
        >
          {flyerHeritage.cooking.toUpperCase()}
        </span>
      </div>

      {/* Social Proof Section - More prominent */}
      <div className="flex flex-col items-center mt-3 gap-2">
        {/* Google Rating */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={20}
              fill={star <= 4 ? BOOKLET_COLORS.primaryYellow : 'transparent'}
              color={BOOKLET_COLORS.primaryYellow}
              strokeWidth={1.5}
            />
          ))}
          <span
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: BOOKLET_COLORS.textBrown,
              marginLeft: '6px',
            }}
          >
            4.4/5
          </span>
          <span
            style={{
              fontSize: '12px',
              color: BOOKLET_COLORS.textMuted,
            }}
          >
            (161 avis Google)
          </span>
        </div>

        {/* Artisanal badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ backgroundColor: `${BOOKLET_COLORS.basilGreen}12` }}>
          <UtensilsCrossed size={14} color={BOOKLET_COLORS.basilGreen} strokeWidth={2} />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: BOOKLET_COLORS.basilGreen,
              letterSpacing: '0.04em',
            }}
          >
            PIZZA ARTISANALE
          </span>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div
        className="w-48 h-1.5 rounded-full mt-2"
        style={{
          background: `linear-gradient(90deg, transparent, ${BOOKLET_COLORS.primaryRed}, transparent)`,
        }}
      />
    </div>
  );
}
