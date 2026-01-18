'use client';

import { BOOKLET_COLORS, BOOKLET_TYPOGRAPHY } from '@/lib/flyer/bookletDimensions';
import { flyerMenuData, DUAL_BASE_PIZZAS } from '@/lib/flyer/menuData';
import { Leaf, Flame, Wine, Beer, GlassWater, ChefHat, Sparkles } from 'lucide-react';

/**
 * MenuRightPage - Page 3 (Interior Right)
 * Specialites and Boissons
 * Completely redesigned to eliminate white space
 */
export default function MenuRightPage() {
  return (
    <div className="flex flex-col h-full justify-between">
      {/* Specialites Section - Takes most of the space */}
      <section className="flex-1 flex flex-col">
        <SectionHeader
          title="LES SPECIALITES"
          subtitle="Recettes Maison"
          color={BOOKLET_COLORS.primaryRed}
          icon={<ChefHat size={16} color={BOOKLET_COLORS.primaryRed} strokeWidth={2} />}
        />

        {/* Specialties grid with descriptions - fills available space */}
        <div className="grid grid-cols-1 gap-1 mt-2 flex-1">
          {flyerMenuData.specialites.map((pizza, index) => (
            <SpecialtyItem key={pizza.name} pizza={pizza} isAlternate={index % 2 === 1} />
          ))}
        </div>
      </section>

      {/* Boissons Section - Expanded to fill more space */}
      <section className="mt-3">
        <SectionHeader
          title="NOS BOISSONS"
          color={BOOKLET_COLORS.primaryRed}
          icon={<Sparkles size={14} color={BOOKLET_COLORS.primaryRed} strokeWidth={2} />}
        />
        <div className="grid grid-cols-3 gap-2 mt-2">
          {/* Vins */}
          <DrinkCategory
            title="Vins"
            subtitle="75cl"
            icon={<Wine size={16} />}
            items={flyerMenuData.boissons.vins}
            bgColor={`${BOOKLET_COLORS.softRed}15`}
            borderColor={`${BOOKLET_COLORS.softRed}40`}
          />

          {/* Bieres */}
          <DrinkCategory
            title="Bieres"
            icon={<Beer size={16} />}
            items={flyerMenuData.boissons.bieres}
            bgColor={`${BOOKLET_COLORS.primaryYellow}15`}
            borderColor={`${BOOKLET_COLORS.primaryYellow}40`}
          />

          {/* Softs */}
          <DrinkCategory
            title="Softs"
            icon={<GlassWater size={16} />}
            items={flyerMenuData.boissons.softs}
            bgColor={`${BOOKLET_COLORS.basilGreen}10`}
            borderColor={`${BOOKLET_COLORS.basilGreen}30`}
          />
        </div>
      </section>

      {/* Footer Notes - More prominent */}
      <div
        className="flex items-center justify-between pt-3 mt-3 border-t-2"
        style={{ borderColor: `${BOOKLET_COLORS.primaryYellow}60` }}
      >
        <div className="flex items-center gap-2">
          <span
            style={{
              fontSize: '11px',
              color: BOOKLET_COLORS.textMuted,
            }}
          >
            Supplement ingredient :
          </span>
          <span
            className="px-2 py-0.5 rounded-full"
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'white',
              backgroundColor: BOOKLET_COLORS.primaryRed,
            }}
          >
            +1.00
          </span>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{ backgroundColor: `${BOOKLET_COLORS.basilGreen}12` }}
        >
          <ChefHat size={12} color={BOOKLET_COLORS.basilGreen} strokeWidth={2} />
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: BOOKLET_COLORS.basilGreen,
            }}
          >
            FAIT MAISON
          </span>
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
    <div className="flex items-center gap-2 pb-1.5 border-b-2" style={{ borderColor: `${color}30` }}>
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
            fontSize: '11px',
            fontStyle: 'italic',
            color: BOOKLET_COLORS.textMuted,
          }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}

function SpecialtyItem({ pizza, isAlternate }: { pizza: typeof flyerMenuData.specialites[0]; isAlternate: boolean }) {
  const isDualBase = DUAL_BASE_PIZZAS.includes(pizza.name);

  return (
    <div
      className="flex items-start justify-between gap-2 py-1.5 px-2 rounded-lg"
      style={{
        backgroundColor: isAlternate ? `${BOOKLET_COLORS.softRed}08` : 'transparent',
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            style={{
              fontSize: `${BOOKLET_TYPOGRAPHY.pizzaName.size + 1}px`,
              fontWeight: BOOKLET_TYPOGRAPHY.pizzaName.weight,
              color: BOOKLET_COLORS.textDark,
            }}
          >
            {pizza.name}
          </span>
          {pizza.isVegetarian && (
            <Leaf size={11} color={BOOKLET_COLORS.basilGreen} strokeWidth={2.5} />
          )}
          {pizza.isSpicy && (
            <Flame size={11} color={BOOKLET_COLORS.spicyRed} strokeWidth={2.5} />
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
        {pizza.description && (
          <p
            style={{
              fontSize: `${BOOKLET_TYPOGRAPHY.pizzaDescription.size}px`,
              color: BOOKLET_COLORS.textMuted,
              lineHeight: BOOKLET_TYPOGRAPHY.pizzaDescription.lineHeight,
              marginTop: '2px',
            }}
          >
            {pizza.description}
          </p>
        )}
      </div>
      <span
        className="flex-shrink-0 px-2 py-0.5 rounded"
        style={{
          fontSize: `${BOOKLET_TYPOGRAPHY.price.size + 1}px`,
          fontWeight: BOOKLET_TYPOGRAPHY.price.weight,
          color: BOOKLET_COLORS.primaryRed,
          backgroundColor: `${BOOKLET_COLORS.primaryRed}08`,
        }}
      >
        {pizza.price.toFixed(2)}
      </span>
    </div>
  );
}

function DrinkCategory({
  title,
  subtitle,
  icon,
  items,
  bgColor,
  borderColor
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  items: { name: string; price: number }[];
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div
      className="p-2 rounded-lg h-full flex flex-col"
      style={{
        backgroundColor: bgColor,
        border: `1.5px solid ${borderColor}`,
      }}
    >
      {/* Category Header */}
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b" style={{ borderColor: borderColor }}>
        <span style={{ color: BOOKLET_COLORS.primaryRed }}>{icon}</span>
        <span
          style={{
            fontSize: `${BOOKLET_TYPOGRAPHY.subHeader.size}px`,
            fontWeight: BOOKLET_TYPOGRAPHY.subHeader.weight,
            color: BOOKLET_COLORS.textDark,
          }}
        >
          {title}
        </span>
        {subtitle && (
          <span style={{ fontSize: '8px', color: BOOKLET_COLORS.textMuted }}>
            {subtitle}
          </span>
        )}
      </div>

      {/* Items - flex-1 to fill space */}
      <div className="flex flex-col justify-between flex-1 gap-1">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-1">
            <span
              className="truncate"
              style={{
                fontSize: `${BOOKLET_TYPOGRAPHY.drinkItem.size}px`,
                fontWeight: BOOKLET_TYPOGRAPHY.drinkItem.weight,
                color: BOOKLET_COLORS.textBrown,
              }}
            >
              {item.name}
            </span>
            <span
              className="flex-shrink-0"
              style={{
                fontSize: `${BOOKLET_TYPOGRAPHY.drinkItem.size}px`,
                fontWeight: 700,
                color: BOOKLET_COLORS.primaryRed,
              }}
            >
              {item.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
