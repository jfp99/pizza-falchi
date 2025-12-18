/**
 * Flyer Header - Pizza Falchi
 * Logo, brand name, and heritage elements
 */

import React from 'react';
import Image from 'next/image';
import { WoodFireIcon } from './FlyerIcons';
import { flyerHeritage } from '@/lib/flyer/menuData';
import { colors } from '@/lib/design-tokens';

interface FlyerHeaderProps {
  className?: string;
}

export default function FlyerHeader({ className = '' }: FlyerHeaderProps) {
  return (
    <header className={`text-center py-1 flex-shrink-0 ${className}`}>
      {/* Logo + Brand + Badge all in one row */}
      <div className="flex items-center justify-center gap-2">
        <div className="relative w-10 h-10 flex-shrink-0">
          <Image
            src="/images/branding/logo-badge.png"
            alt="Pizza Falchi - Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="text-left">
          <h1
            className="text-base font-extrabold tracking-tight leading-none"
            style={{ color: colors.primary.red }}
          >
            PIZZA FALCHI
          </h1>
          <p
            className="text-[8px] font-semibold"
            style={{ color: colors.accent.gold }}
          >
            {flyerHeritage.tagline} - Depuis {flyerHeritage.since}
          </p>
        </div>
        {/* Wood Fire Badge - inline */}
        <div
          className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[7px] font-medium flex-shrink-0"
          style={{ backgroundColor: colors.soft.yellow, color: colors.charcoal }}
        >
          <WoodFireIcon size={8} aria-hidden="true" />
          <span>{flyerHeritage.cooking}</span>
        </div>
      </div>
    </header>
  );
}
