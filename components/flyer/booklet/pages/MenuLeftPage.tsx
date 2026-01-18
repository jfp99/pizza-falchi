'use client';

import { BOOKLET_COLORS, BOOKLET_TYPOGRAPHY } from '@/lib/flyer/bookletDimensions';
import { flyerMenuData, PIZZA_SIZES, DUAL_BASE_PIZZAS } from '@/lib/flyer/menuData';
import { Leaf, Flame, Star } from 'lucide-react';

/**
 * MenuLeftPage - Page 2 (Interior Left)
 * Best-sellers, Classiques, and Cremes Fraiches
 * Optimized layout to eliminate white space
 */
export default function MenuLeftPage() {
  return (
    <div className="flex flex-col h-full justify-between">
      {/* Best-Sellers Section - More prominent */}
      <section>
        <SectionHeader title="NOS BEST-SELLERS" color={BOOKLET_COLORS.primaryYellowDark} icon={<Star size={14} fill={BOOKLET_COLORS.primaryYellowDark} />} />
        <div className="grid grid-cols-2 gap-2 mt-1.5">
          {flyerMenuData.bestSellers.map((pizza) => (
            <BestSellerCard key={pizza.name} pizza={pizza} />
          ))}
        </div>
      </section>

      {/* Classiques Section - Use flex-1 to fill space */}
      <section className="flex-1 flex flex-col mt-3">
        <SectionHeader
          title="LES CLASSIQUES"
          subtitle="Base Tomate"
          color={BOOKLET_COLORS.primaryRed}
        />
        <div className="grid grid-cols-2 gap-x-4 mt-1.5 flex-1">
          <div className="flex flex-col justify-between">
            {flyerMenuData.classiques.slice(0, 7).map((pizza) => (
              <PizzaItem key={pizza.name} pizza={pizza} />
            ))}
          </div>
          <div className="flex flex-col justify-between">
            {flyerMenuData.classiques.slice(7).map((pizza) => (
              <PizzaItem key={pizza.name} pizza={pizza} />
            ))}
          </div>
        </div>
      </section>

      {/* Cremes Fraiches Section */}
      <section className="mt-3">
        <SectionHeader
          title="LES CREMES FRAICHES"
          subtitle="Base Creme"
          color={BOOKLET_COLORS.primaryRed}
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1.5">
          {flyerMenuData.cremes.map((pizza) => (
            <PizzaItemWithDescription key={pizza.name} pizza={pizza} />
          ))}
        </div>
      </section>

      {/* Legend - More prominent, fills bottom */}
      <div
        className="flex flex-col gap-2 pt-3 mt-3 border-t-2"
        style={{ borderColor: `${BOOKLET_COLORS.primaryYellow}60` }}
      >
        {/* Sizes Row */}
        <div className="flex items-center justify-center gap-6">
          <SizeBadge size={PIZZA_SIZES.moyenne.size} label="Moyenne" />
          <SizeBadge size={PIZZA_SIZES.grande.size} label="Grande" supplement="+1.50" />
        </div>

        {/* Indicators Row */}
        <div className="flex items-center justify-center gap-4">
          <LegendItem icon={<Leaf size={12} />} label="Vegetarien" color={BOOKLET_COLORS.basilGreen} />
          <LegendItem icon={<Flame size={12} />} label="Epice" color={BOOKLET_COLORS.spicyRed} />
          <div className="flex items-center gap-1">
            <span
              className="px-1.5 py-0.5 rounded text-white"
              style={{
                fontSize: '8px',
                fontWeight: 700,
                backgroundColor: BOOKLET_COLORS.primaryYellowDark,
              }}
            >
              T/C
            </span>
            <span style={{ fontSize: '9px', color: BOOKLET_COLORS.textMuted }}>
              = Tomate ou Creme
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components

function SectionHeader({
  title,
  subtitle,
  color,
  icon
}: {
  title: string;
  subtitle?: string;
  color: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 pb-1 border-b" style={{ borderColor: `${color}30` }}>
      {icon}
      <h2
        style={{
          fontSize: `${BOOKLET_TYPOGRAPHY.sectionHeader.size}px`,
          fontWeight: BOOKLET_TYPOGRAPHY.sectionHeader.weight,
          letterSpacing: BOOKLET_TYPOGRAPHY.sectionHeader.letterSpacing,
          color: color,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <span
          style={{
            fontSize: '10px',
            fontStyle: 'italic',
            color: BOOKLET_COLORS.textMuted,
          }}
        >
          ({subtitle})
        </span>
      )}
    </div>
  );
}

function BestSellerCard({ pizza }: { pizza: typeof flyerMenuData.bestSellers[0] }) {
  const isDualBase = DUAL_BASE_PIZZAS.includes(pizza.name);

  return (
    <div
      className="p-2 rounded-lg"
      style={{
        backgroundColor: `${BOOKLET_COLORS.primaryYellow}18`,
        border: `1.5px solid ${BOOKLET_COLORS.primaryYellow}50`,
      }}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-center gap-1 flex-wrap">
          <span
            style={{
              fontSize: `${BOOKLET_TYPOGRAPHY.pizzaName.size}px`,
              fontWeight: BOOKLET_TYPOGRAPHY.pizzaName.weight,
              color: BOOKLET_COLORS.textDark,
            }}
          >
            {pizza.name}
          </span>
          {pizza.isVegetarian && (
            <Leaf size={10} color={BOOKLET_COLORS.basilGreen} strokeWidth={2.5} />
          )}
          {isDualBase && (
            <span
              className="px-1 rounded text-white"
              style={{
                fontSize: '7px',
                fontWeight: 700,
                backgroundColor: BOOKLET_COLORS.primaryYellowDark,
              }}
            >
              T/C
            </span>
          )}
        </div>
        <span
          style={{
            fontSize: `${BOOKLET_TYPOGRAPHY.price.size}px`,
            fontWeight: BOOKLET_TYPOGRAPHY.price.weight,
            color: BOOKLET_COLORS.primaryRed,
          }}
        >
          {pizza.price.toFixed(2)}
        </span>
      </div>
      {pizza.description && (
        <p
          style={{
            fontSize: `${BOOKLET_TYPOGRAPHY.pizzaDescription.size}px`,
            color: BOOKLET_COLORS.textMuted,
            lineHeight: BOOKLET_TYPOGRAPHY.pizzaDescription.lineHeight,
            marginTop: '3px',
          }}
        >
          {pizza.description}
        </p>
      )}
    </div>
  );
}

function PizzaItem({ pizza }: { pizza: typeof flyerMenuData.classiques[0] }) {
  const isDualBase = DUAL_BASE_PIZZAS.includes(pizza.name);

  return (
    <div className="flex items-baseline justify-between gap-1 py-1">
      <div className="flex items-center gap-1 min-w-0">
        <span
          className="truncate"
          style={{
            fontSize: `${BOOKLET_TYPOGRAPHY.pizzaName.size}px`,
            fontWeight: BOOKLET_TYPOGRAPHY.pizzaName.weight,
            color: BOOKLET_COLORS.textDark,
          }}
        >
          {pizza.name}
        </span>
        {pizza.isVegetarian && (
          <Leaf size={10} color={BOOKLET_COLORS.basilGreen} strokeWidth={2.5} className="flex-shrink-0" />
        )}
        {pizza.isSpicy && (
          <Flame size={10} color={BOOKLET_COLORS.spicyRed} strokeWidth={2.5} className="flex-shrink-0" />
        )}
        {isDualBase && (
          <span
            className="px-0.5 rounded text-white flex-shrink-0"
            style={{
              fontSize: '6px',
              fontWeight: 700,
              backgroundColor: BOOKLET_COLORS.primaryYellowDark,
            }}
          >
            T/C
          </span>
        )}
      </div>
      <span
        className="flex-shrink-0"
        style={{
          fontSize: `${BOOKLET_TYPOGRAPHY.price.size}px`,
          fontWeight: BOOKLET_TYPOGRAPHY.price.weight,
          color: BOOKLET_COLORS.primaryRed,
        }}
      >
        {pizza.price.toFixed(2)}
      </span>
    </div>
  );
}

function PizzaItemWithDescription({ pizza }: { pizza: typeof flyerMenuData.cremes[0] }) {
  return (
    <div className="py-1">
      <div className="flex items-baseline justify-between gap-1">
        <span
          style={{
            fontSize: `${BOOKLET_TYPOGRAPHY.pizzaName.size}px`,
            fontWeight: BOOKLET_TYPOGRAPHY.pizzaName.weight,
            color: BOOKLET_COLORS.textDark,
          }}
        >
          {pizza.name}
        </span>
        <span
          style={{
            fontSize: `${BOOKLET_TYPOGRAPHY.price.size}px`,
            fontWeight: BOOKLET_TYPOGRAPHY.price.weight,
            color: BOOKLET_COLORS.primaryRed,
          }}
        >
          {pizza.price.toFixed(2)}
        </span>
      </div>
      {pizza.description && (
        <p
          style={{
            fontSize: `${BOOKLET_TYPOGRAPHY.pizzaDescription.size - 1}px`,
            color: BOOKLET_COLORS.textMuted,
            lineHeight: 1.3,
          }}
        >
          {pizza.description}
        </p>
      )}
    </div>
  );
}

function SizeBadge({
  size,
  label,
  supplement
}: {
  size: string;
  label: string;
  supplement?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: '26px',
          height: '26px',
          border: `2px solid ${BOOKLET_COLORS.primaryRed}`,
          backgroundColor: `${BOOKLET_COLORS.primaryRed}10`,
        }}
      >
        <span
          style={{
            fontSize: '8px',
            fontWeight: 700,
            color: BOOKLET_COLORS.primaryRed,
          }}
        >
          {size}
        </span>
      </div>
      <span style={{ fontSize: '10px', fontWeight: 500, color: BOOKLET_COLORS.textBrown }}>
        {label}
        {supplement && (
          <span style={{ color: BOOKLET_COLORS.primaryRed, fontWeight: 700 }}> +{supplement}</span>
        )}
      </span>
    </div>
  );
}

function LegendItem({
  icon,
  label,
  color
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <span style={{ color }}>{icon}</span>
      <span style={{ fontSize: '10px', color: BOOKLET_COLORS.textMuted }}>
        {label}
      </span>
    </div>
  );
}
