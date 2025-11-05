/**
 * Ingredient Icons - Black & White SVG Icon System
 * S-Tier Professional Icons for Pizza Falchi
 *
 * All icons are minimal, clean, and professional 24x24 SVG icons
 * with consistent 2px stroke width for visual harmony.
 */

import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  'aria-label'?: string;
}

const defaultProps: Partial<IconProps> = {
  size: 24,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// ============================================================================
// CHEESE & DAIRY
// ============================================================================

export const CheeseIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M4 19h16a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" />
      <circle cx="8" cy="12" r="1" />
      <circle cx="12" cy="14" r="1" />
      <circle cx="16" cy="11" r="1" />
      <path d="M20 7L12 3L4 7" />
    </svg>
  );
};

export const GoatIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M12 3c-3 0-5 2-5 5v2c0 3 2 5 5 5s5-2 5-5V8c0-3-2-5-5-5z" />
      <path d="M7 10h10" />
      <circle cx="9.5" cy="9" r="0.5" fill="currentColor" />
      <circle cx="14.5" cy="9" r="0.5" fill="currentColor" />
      <path d="M5 7l-2-2M19 7l2-2" />
      <path d="M12 15v6M9 21h6" />
    </svg>
  );
};

export const MilkIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest} = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M8 2h8v3l2 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7l2-2V2z" />
      <path d="M8 2h8" />
      <path d="M6 7h12" />
    </svg>
  );
};

// ============================================================================
// VEGETABLES
// ============================================================================

export const TomatoIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <circle cx="12" cy="13" r="7" />
      <path d="M12 6c0-1.5-1-3-2-3s-1.5 1-1.5 2.5M12 6c0-1.5 1-3 2-3s1.5 1 1.5 2.5" />
      <path d="M10 6l2-1 2 1" />
    </svg>
  );
};

export const MushroomIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M5 12a7 7 0 0 1 14 0" />
      <path d="M10 12v7a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-7" />
      <circle cx="8" cy="10" r="0.5" fill="currentColor" />
      <circle cx="12" cy="9" r="0.5" fill="currentColor" />
      <circle cx="16" cy="10" r="0.5" fill="currentColor" />
    </svg>
  );
};

export const PepperIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M9 3c0 0-2 1-2 4v10a4 4 0 0 0 8 0V7c0-3-2-4-2-4" />
      <path d="M9 3c0-1 1-2 3-2s3 1 3 2" />
      <circle cx="11" cy="12" r="1" />
      <circle cx="11" cy="16" r="1" />
    </svg>
  );
};

export const OnionIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M12 2c-2 0-4 1-4 3v5c0 4 1.5 7 4 7s4-3 4-7V5c0-2-2-3-4-3z" />
      <path d="M10 2c0 0-2 1-2 3M14 2c0 0 2 1 2 3" />
      <path d="M12 17c-3 0-5 2-5 5h10c0-3-2-5-5-5z" />
      <path d="M10 10h4" />
      <path d="M11 13h2" />
    </svg>
  );
};

export const GarlicIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M12 3c-2 0-3.5 1-3.5 2.5V8c0 3 1.5 6 3.5 6s3.5-3 3.5-6V5.5C15.5 4 14 3 12 3z" />
      <path d="M9 3l3-1 3 1" />
      <path d="M10.5 14c-1.5 0-2.5 2-2.5 4v2h2" />
      <path d="M13.5 14c1.5 0 2.5 2 2.5 4v2h-2" />
      <path d="M10 20h4" />
      <path d="M12 7v4" />
    </svg>
  );
};

export const EggplantIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M8 8c0-4 2-6 4-6s4 2 4 6c0 2-1 4-2 6-1 2-1.5 4-1.5 6h-1c0-2-.5-4-1.5-6-1-2-2-4-2-6z" />
      <path d="M12 2c0 0 2 1 3 3" />
      <circle cx="10" cy="10" r="1" />
    </svg>
  );
};

export const OliveIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <ellipse cx="12" cy="14" rx="5" ry="6" />
      <path d="M12 8c0 0-3-3-3-5a3 3 0 0 1 6 0c0 2-3 5-3 5z" />
      <circle cx="10" cy="14" r="0.5" fill="currentColor" />
    </svg>
  );
};

export const AruglaIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M12 3v18" />
      <path d="M8 7c0 0-2-1-4 1 0 0 2 2 4 0" />
      <path d="M16 7c0 0 2-1 4 1 0 0-2 2-4 0" />
      <path d="M8 12c0 0-2-1-4 1 0 0 2 2 4 0" />
      <path d="M16 12c0 0 2-1 4 1 0 0-2 2-4 0" />
      <path d="M8 17c0 0-2-1-4 1 0 0 2 2 4 0" />
      <path d="M16 17c0 0 2-1 4 1 0 0-2 2-4 0" />
    </svg>
  );
};

export const BasilIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M12 3v18" />
      <path d="M9 6c0 0-3-1-5 1 2 1 3 1 5 0z" />
      <path d="M15 6c0 0 3-1 5 1-2 1-3 1-5 0z" />
      <path d="M9 11c0 0-3-1-5 1 2 1 3 1 5 0z" />
      <path d="M15 11c0 0 3-1 5 1-2 1-3 1-5 0z" />
      <path d="M9 16c0 0-3-1-5 1 2 1 3 1 5 0z" />
      <path d="M15 16c0 0 3-1 5 1-2 1-3 1-5 0z" />
    </svg>
  );
};

// ============================================================================
// MEATS
// ============================================================================

export const BaconIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M3 8c2-1 4 0 5 1 2 2 4 2 6 0 1-1 3-2 5-1" />
      <path d="M3 12c2-1 4 0 5 1 2 2 4 2 6 0 1-1 3-2 5-1" />
      <path d="M3 16c2-1 4 0 5 1 2 2 4 2 6 0 1-1 3-2 5-1" />
    </svg>
  );
};

export const SalamiIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="9" cy="10" r="1.5" />
      <circle cx="15" cy="11" r="1" />
      <circle cx="10" cy="14" r="1" />
      <circle cx="14" cy="15" r="1.5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
};

export const ProsciuttoIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M6 8c0-2 2-4 6-4s6 2 6 4v8c0 3-2 5-6 5s-6-2-6-5V8z" />
      <path d="M8 12c2 1 6 1 8 0" />
      <path d="M8 16c2 1 6 1 8 0" />
    </svg>
  );
};

export const ChickenIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M9 8c0-3 1-5 3-5s3 2 3 5v7c0 3-1 5-3 5s-3-2-3-5V8z" />
      <path d="M6 12h3M15 12h3" />
      <path d="M12 20c-2 0-4 1-4 2h8c0-1-2-2-4-2z" />
    </svg>
  );
};

export const MeatIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M6 6h12a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4z" />
      <path d="M8 10h8" />
      <path d="M8 14h8" />
    </svg>
  );
};

export const SausageIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M4 12a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
      <path d="M10 8v8M14 8v8" />
    </svg>
  );
};

// ============================================================================
// SEAFOOD
// ============================================================================

export const FishIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M6 12c0 0 2-4 6-4s6 4 6 4-2 4-6 4-6-4-6-4z" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
      <path d="M6 12l-4-2M6 12l-4 2" />
      <path d="M18 10l2-2M18 14l2 2" />
    </svg>
  );
};

export const ShrimpIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M8 8c0-2 2-4 4-4s4 2 4 4v4c0 3-2 6-4 6s-4-3-4-6V8z" />
      <path d="M12 4c0 0 3 1 4 3" />
      <path d="M8 10h8M8 13h8M8 16h6" />
      <circle cx="10" cy="7" r="0.5" fill="currentColor" />
    </svg>
  );
};

export const AnchovyIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M5 12c0 0 2-3 7-3s7 3 7 3-2 3-7 3-7-3-7-3z" />
      <circle cx="16" cy="12" r="0.5" fill="currentColor" />
      <path d="M5 12l-3-1M5 12l-3 1" />
      <path d="M12 9v6" />
    </svg>
  );
};

// ============================================================================
// OTHER INGREDIENTS
// ============================================================================

export const EggIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M12 3c-3 0-5 3-5 7s2 8 5 8 5-4 5-8-2-7-5-7z" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
};

export const HoneyIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M9 7l3-4 3 4v10a3 3 0 0 1-6 0V7z" />
      <path d="M6 3h12" />
      <path d="M12 3v4" />
      <path d="M9 13h6" />
    </svg>
  );
};

export const ChiliIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M12 3c0 0-2 1-2 3v10c0 2 1 4 2 4s2-2 2-4V6c0-2-2-3-2-3z" />
      <path d="M12 3c1-1 3-1 3 1" />
      <path d="M10 10l-2 1M14 10l2 1M10 14l-2 1M14 14l2 1" />
    </svg>
  );
};

export const SpiceIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M12 3l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5l2-5z" />
    </svg>
  );
};

export const NutIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M12 3l7 4v10l-7 4-7-4V7l7-4z" />
      <path d="M12 12l7-4M12 12v9M12 12L5 8" />
    </svg>
  );
};

// ============================================================================
// ICON MAPPING SYSTEM
// ============================================================================

/**
 * Map ingredient names to their corresponding icon components
 */
export const ingredientIconMap: Record<string, React.FC<IconProps>> = {
  // Cheese & Dairy
  cheese: CheeseIcon,
  fromage: CheeseIcon,
  mozzarella: CheeseIcon,
  goat: GoatIcon,
  chevre: GoatIcon,
  'goat cheese': GoatIcon,
  milk: MilkIcon,
  cream: MilkIcon,

  // Vegetables
  tomato: TomatoIcon,
  tomate: TomatoIcon,
  'cherry tomato': TomatoIcon,
  mushroom: MushroomIcon,
  champignon: MushroomIcon,
  pepper: PepperIcon,
  poivron: PepperIcon,
  'bell pepper': PepperIcon,
  onion: OnionIcon,
  oignon: OnionIcon,
  garlic: GarlicIcon,
  ail: GarlicIcon,
  eggplant: EggplantIcon,
  aubergine: EggplantIcon,
  olive: OliveIcon,
  arugula: AruglaIcon,
  roquette: AruglaIcon,
  rocket: AruglaIcon,
  basil: BasilIcon,
  basilic: BasilIcon,

  // Meats
  bacon: BaconIcon,
  lardons: BaconIcon,
  salami: SalamiIcon,
  prosciutto: ProsciuttoIcon,
  jambon: ProsciuttoIcon,
  ham: ProsciuttoIcon,
  chicken: ChickenIcon,
  poulet: ChickenIcon,
  meat: MeatIcon,
  viande: MeatIcon,
  beef: MeatIcon,
  sausage: SausageIcon,
  saucisse: SausageIcon,
  merguez: SausageIcon,

  // Seafood
  fish: FishIcon,
  poisson: FishIcon,
  salmon: FishIcon,
  tuna: FishIcon,
  shrimp: ShrimpIcon,
  crevette: ShrimpIcon,
  anchovy: AnchovyIcon,
  anchois: AnchovyIcon,

  // Other
  egg: EggIcon,
  oeuf: EggIcon,
  honey: HoneyIcon,
  miel: HoneyIcon,
  chili: ChiliIcon,
  piment: ChiliIcon,
  spice: SpiceIcon,
  epice: SpiceIcon,
  nut: NutIcon,
  noix: NutIcon,
  walnut: NutIcon,
  pine: NutIcon,
};

/**
 * Get icon component for an ingredient name
 * Falls back to a generic icon if not found
 */
export const getIngredientIcon = (ingredient: string): React.FC<IconProps> => {
  const normalized = ingredient.toLowerCase().trim();
  return ingredientIconMap[normalized] || SpiceIcon; // Default fallback
};

/**
 * Ingredient Icon Component - Automatically selects the right icon
 */
export interface IngredientIconProps extends IconProps {
  ingredient: string;
}

export const IngredientIcon: React.FC<IngredientIconProps> = ({
  ingredient,
  ...props
}) => {
  const Icon = getIngredientIcon(ingredient);
  return <Icon {...props} aria-label={ingredient} />;
};
