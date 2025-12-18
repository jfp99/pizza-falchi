/**
 * Flyer Footer - Pizza Falchi
 * Contact info, hours, and loyalty program
 */

import React from 'react';
import {
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  GlobeIcon,
  GiftIcon,
} from './FlyerIcons';
import { flyerContactInfo, flyerHeritage } from '@/lib/flyer/menuData';
import { colors } from '@/lib/design-tokens';

interface FlyerFooterProps {
  className?: string;
}

export default function FlyerFooter({ className = '' }: FlyerFooterProps) {
  return (
    <footer
      className={`flex-shrink-0 mt-auto p-1 ${className}`}
      style={{ backgroundColor: colors.primary.red }}
      role="contentinfo"
    >
      <div className="flex items-center justify-between text-[7px] text-white">
        <span className="font-bold flex items-center gap-1">
          <GiftIcon size={8} aria-hidden="true" />
          {flyerHeritage.loyalty}
        </span>
        <span className="flex items-center gap-1">
          <PhoneIcon size={7} aria-hidden="true" />
          {flyerContactInfo.phone}
        </span>
      </div>
      <div className="flex items-center justify-center gap-2 text-[6px] text-white/80 mt-0.5">
        <span>{flyerContactInfo.hours}</span>
        <span>•</span>
        <span>{flyerContactInfo.city}</span>
        <span>•</span>
        <span>{flyerContactInfo.website}</span>
      </div>
    </footer>
  );
}
