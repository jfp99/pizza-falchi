/**
 * Section Header - Pizza Falchi Menu Page
 * Reusable header for menu sections with icon and subtitle
 */

import React from 'react';
import { Star, Pizza, Droplets, ChefHat, Wine, LucideIcon } from 'lucide-react';
import type { MenuSectionId } from '@/lib/menuHelpers';

interface SectionHeaderProps {
  id: MenuSectionId;
  title: string;
  subtitle?: string;
  productCount?: number;
  className?: string;
}

// Map section IDs to icons
const sectionIcons: Record<MenuSectionId, LucideIcon> = {
  'best-sellers': Star,
  classiques: Pizza,
  cremes: Droplets,
  specialites: ChefHat,
  boissons: Wine,
};

// Section-specific accent colors using Tailwind classes for consistency
const sectionColors: Record<MenuSectionId, { bg: string; icon: string; border: string }> = {
  'best-sellers': {
    bg: 'bg-soft-yellow',
    icon: 'text-brand-gold',
    border: 'border-brand-gold',
  },
  classiques: {
    bg: 'bg-red-50',
    icon: 'text-brand-red',
    border: 'border-brand-red',
  },
  cremes: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    border: 'border-amber-400',
  },
  specialites: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    border: 'border-orange-400',
  },
  boissons: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    border: 'border-purple-400',
  },
};

export default function SectionHeader({
  id,
  title,
  subtitle,
  productCount,
  className = '',
}: SectionHeaderProps) {
  const Icon = sectionIcons[id];
  const colorClasses = sectionColors[id];
  const isBestSellers = id === 'best-sellers';

  return (
    <header
      id={id}
      className={`scroll-mt-24 ${className}`}
      role="region"
      aria-labelledby={`heading-${id}`}
    >
      <div className="flex items-center gap-3 mb-2">
        {/* Icon Badge */}
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full ${colorClasses.bg} ${isBestSellers ? 'ring-2 ring-brand-gold/30' : ''}`}
          aria-hidden="true"
        >
          <Icon
            className={`w-5 h-5 ${colorClasses.icon}`}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        {/* Title and Subtitle */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2
              id={`heading-${id}`}
              className={`text-xl font-bold uppercase tracking-wide ${isBestSellers ? 'text-brand-red' : 'text-text-primary'}`}
            >
              {title}
            </h2>
            {productCount !== undefined && productCount > 0 && (
              <span
                className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
              >
                <span className="sr-only">{productCount} produits dans cette section</span>
                <span aria-hidden="true">{productCount}</span>
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-text-secondary mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Decorative line */}
      <div
        className={`h-0.5 w-full rounded-full ${isBestSellers ? 'bg-gradient-to-r from-brand-gold via-brand-gold/50 to-transparent' : 'bg-gradient-to-r from-gray-200 to-transparent'}`}
        aria-hidden="true"
      />
    </header>
  );
}
