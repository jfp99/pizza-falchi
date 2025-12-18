/**
 * Flyer Menu Section - Pizza Falchi
 * Reusable section component for menu categories
 */

import React from 'react';
import FlyerProductItem from './FlyerProductItem';
import {
  StarIcon,
  PizzaIcon,
  DropletIcon,
  ChefHatIcon,
  WineIcon,
} from './FlyerIcons';
import type { FlyerProduct } from '@/lib/flyer/menuData';
import { colors } from '@/lib/design-tokens';

type SectionType = 'best-sellers' | 'classiques' | 'cremes' | 'specialites' | 'boissons';

interface FlyerMenuSectionProps {
  type: SectionType;
  title: string;
  subtitle?: string;
  products: FlyerProduct[];
  className?: string;
  columns?: 1 | 2;
}

// Icons are decorative - text provides meaning (ultra-small for A5)
const sectionIcons: Record<SectionType, React.ReactNode> = {
  'best-sellers': <StarIcon size={10} aria-hidden="true" />,
  'classiques': <PizzaIcon size={8} aria-hidden="true" />,
  'cremes': <DropletIcon size={8} aria-hidden="true" />,
  'specialites': <ChefHatIcon size={8} aria-hidden="true" />,
  'boissons': <WineIcon size={8} aria-hidden="true" />,
};

export default function FlyerMenuSection({
  type,
  title,
  subtitle,
  products,
  className = '',
  columns = 2,
}: FlyerMenuSectionProps) {
  const isBestSellers = type === 'best-sellers';
  const isBoissons = type === 'boissons';

  // Best-sellers section: special styling (ultra-compact for A5)
  if (isBestSellers) {
    return (
      <section className={`mb-1 ${className}`} aria-labelledby={`section-${type}`}>
        <h2
          id={`section-${type}`}
          className="text-[8px] font-bold uppercase tracking-wide mb-0.5"
          style={{ color: colors.primary.red }}
        >
          <span className="inline-flex items-center justify-center w-3 h-3 rounded-full mr-1" style={{ backgroundColor: colors.accent.gold, color: '#FFFFFF' }}>
            {sectionIcons[type]}
          </span>
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-1">
          {products.map((product) => (
            <FlyerProductItem key={product.name} product={product} variant="star" />
          ))}
        </div>
      </section>
    );
  }

  // Boissons section: ultra-compact 3-column layout
  if (isBoissons) {
    const colSize = Math.ceil(products.length / 3);
    return (
      <section className={`mb-0.5 ${className}`} aria-labelledby={`section-${type}`}>
        <h2 id={`section-${type}`} className="text-[7px] font-bold uppercase mb-0.5" style={{ color: colors.primary.red }}>
          {title}
        </h2>
        <div className="grid grid-cols-3 gap-x-1">
          <div>{products.slice(0, colSize).map((p) => <FlyerProductItem key={p.name} product={p} variant="compact" />)}</div>
          <div>{products.slice(colSize, colSize * 2).map((p) => <FlyerProductItem key={p.name} product={p} variant="compact" />)}</div>
          <div>{products.slice(colSize * 2).map((p) => <FlyerProductItem key={p.name} product={p} variant="compact" />)}</div>
        </div>
      </section>
    );
  }

  // Default section layout (ultra-compact for A5)
  const half = Math.ceil(products.length / 2);
  return (
    <section className={`mb-0.5 ${className}`} aria-labelledby={`section-${type}`}>
      <h2 id={`section-${type}`} className="text-[7px] font-bold uppercase mb-0.5" style={{ color: colors.primary.red }}>
        {title} {subtitle && <span className="font-normal normal-case text-[6px]" style={{ color: colors.gray[500] }}>({subtitle})</span>}
      </h2>
      <div className="grid grid-cols-2 gap-x-2">
        <div>{products.slice(0, half).map((p) => <FlyerProductItem key={p.name} product={p} variant="default" />)}</div>
        <div>{products.slice(half).map((p) => <FlyerProductItem key={p.name} product={p} variant="default" />)}</div>
      </div>
    </section>
  );
}
