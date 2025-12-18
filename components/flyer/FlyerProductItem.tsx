/**
 * Flyer Product Item - Pizza Falchi
 * Individual product row with menu engineering psychology
 */

import React from 'react';
import { LeafIcon, FlameIcon, StarIcon } from './FlyerIcons';
import type { FlyerProduct } from '@/lib/flyer/menuData';
import { colors } from '@/lib/design-tokens';

interface FlyerProductItemProps {
  product: FlyerProduct;
  variant?: 'default' | 'star' | 'compact';
  showDescription?: boolean;
}

/**
 * Format price without EUR symbol (menu engineering)
 */
function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',');
}

export default function FlyerProductItem({
  product,
  variant = 'default',
  showDescription = false,
}: FlyerProductItemProps) {
  const isStar = variant === 'star' || product.isBestSeller;
  const isCompact = variant === 'compact';

  // Build accessibility label for dietary info
  const dietaryLabel = [
    product.isVegetarian && 'vegetarien',
    product.isSpicy && 'epice',
  ].filter(Boolean).join(', ');

  // Star variant: highlighted box with golden border (ultra-compact for A5 2-column)
  if (isStar) {
    return (
      <div
        className="px-1 py-0.5 rounded"
        style={{
          backgroundColor: colors.soft.yellow,
          border: `1px solid ${colors.accent.gold}`,
        }}
        role="listitem"
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[7px]" style={{ color: colors.charcoal }}>
            <StarIcon size={6} className="inline mr-0.5" style={{ color: colors.accent.gold }} aria-hidden="true" />
            {product.name}
            {product.isVegetarian && <LeafIcon size={5} className="inline ml-0.5" style={{ color: colors.accent.basil }} aria-hidden="true" />}
            {product.isSpicy && <FlameIcon size={5} className="inline ml-0.5" style={{ color: colors.primary.red }} aria-hidden="true" />}
            {dietaryLabel && <span className="sr-only"> - {dietaryLabel}</span>}
          </span>
          <span className="font-bold text-[7px]" style={{ color: colors.charcoal }}>
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    );
  }

  // Compact variant: minimal inline display (for drinks - ultra-compact)
  if (isCompact) {
    return (
      <div className="flex items-center justify-between" style={{ lineHeight: 1 }} role="listitem">
        <span className="text-[5.5px]" style={{ color: colors.charcoal }}>
          {product.name}
          {dietaryLabel && <span className="sr-only"> - {dietaryLabel}</span>}
        </span>
        <span className="text-[5.5px]" style={{ color: colors.charcoal }}>
          {formatPrice(product.price)}
        </span>
      </div>
    );
  }

  // Default variant: standard row (ultra-compact for A5 - no dots)
  return (
    <div className="flex items-center justify-between" style={{ lineHeight: 1.1 }} role="listitem">
      <span className="text-[6.5px]" style={{ color: colors.charcoal }}>
        {product.name}
        {product.isVegetarian && <LeafIcon size={4} className="inline ml-0.5" style={{ color: colors.accent.basil }} aria-hidden="true" />}
        {product.isSpicy && <FlameIcon size={4} className="inline ml-0.5" style={{ color: colors.primary.red }} aria-hidden="true" />}
        {dietaryLabel && <span className="sr-only"> - {dietaryLabel}</span>}
      </span>
      <span className="text-[6.5px] font-medium" style={{ color: colors.charcoal }}>
        {formatPrice(product.price)}
      </span>
    </div>
  );
}
