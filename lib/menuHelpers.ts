/**
 * Menu Helpers - Pizza Falchi
 * Utility functions for menu page product grouping and organization
 * Organization: Option B - Par Popularite
 */

import { Product } from '@/types';

// Stars - user selected best-sellers for Golden Triangle
export const STAR_PIZZA_NAMES = [
  'chèvre miel',
  'regina',
  '4 fromages',
  'arménienne',
];

export type MenuSectionId =
  | 'best-sellers'
  | 'classiques'
  | 'cremes'
  | 'specialites'
  | 'boissons';

export interface GroupedProducts {
  bestSellers: Product[];
  classiques: Product[];
  cremes: Product[];
  specialites: Product[];
  boissons: Product[];
}

export interface MenuSectionConfig {
  id: MenuSectionId;
  title: string;
  subtitle?: string;
  iconName: string;
  layout: 'hero' | 'grid' | 'compact';
  featured?: boolean;
}

// Menu section configurations
export const menuSections: MenuSectionConfig[] = [
  {
    id: 'best-sellers',
    title: 'Nos Best-Sellers',
    subtitle: 'Les pizzas preferees de nos clients',
    iconName: 'Star',
    layout: 'hero',
    featured: true,
  },
  {
    id: 'classiques',
    title: 'Les Classiques',
    subtitle: 'Base tomate',
    iconName: 'Pizza',
    layout: 'grid',
  },
  {
    id: 'cremes',
    title: 'Les Cremes Fraiches',
    subtitle: 'Base creme fraiche',
    iconName: 'Droplets',
    layout: 'grid',
  },
  {
    id: 'specialites',
    title: 'Les Specialites Maison',
    subtitle: 'Creations originales',
    iconName: 'ChefHat',
    layout: 'grid',
  },
  {
    id: 'boissons',
    title: 'Boissons',
    subtitle: 'Vins, bieres et softs',
    iconName: 'Wine',
    layout: 'compact',
  },
];

/**
 * Check if a product is a Star (best-seller in Golden Triangle)
 */
export function isStarProduct(product: Product): boolean {
  return STAR_PIZZA_NAMES.includes(product.name.toLowerCase());
}

/**
 * Group products by menu section
 * Uses existing tags field from Product model (no schema changes)
 */
export function groupProductsBySection(products: Product[]): GroupedProducts {
  const pizzas = products.filter((p) => p.category === 'pizza' && p.available);
  const drinks = products.filter((p) => p.category === 'boisson' && p.available);

  // Best-sellers: Stars selected by user
  const bestSellers = pizzas.filter((p) => isStarProduct(p));

  // Classiques: pizzas with 'classique' tag (exclude stars to avoid duplication)
  const classiques = pizzas.filter(
    (p) => p.tags?.includes('classique') && !isStarProduct(p)
  );

  // Cremes: pizzas with 'creme' or 'crème' tag
  const cremes = pizzas.filter(
    (p) => p.tags?.includes('crème') || p.tags?.includes('creme')
  );

  // Specialites: pizzas with 'specialite' or 'spécialité' tag (exclude stars)
  const specialites = pizzas.filter(
    (p) =>
      (p.tags?.includes('spécialité') || p.tags?.includes('specialite')) &&
      !isStarProduct(p)
  );

  return {
    bestSellers,
    classiques: sortByPrice(classiques),
    cremes: sortByPrice(cremes),
    specialites: sortByName(specialites),
    boissons: sortByPrice(drinks),
  };
}

/**
 * Sort products by price (ascending)
 */
export function sortByPrice(products: Product[]): Product[] {
  return [...products].sort((a, b) => a.price - b.price);
}

/**
 * Sort products by name (alphabetical)
 */
export function sortByName(products: Product[]): Product[] {
  return [...products].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}

/**
 * Sort products by popularity (popular first, then by name)
 */
export function sortByPopularity(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return a.name.localeCompare(b.name, 'fr');
  });
}

/**
 * Get section config by ID
 */
export function getSectionConfig(id: MenuSectionId): MenuSectionConfig | undefined {
  return menuSections.find((section) => section.id === id);
}

/**
 * Map section ID to GroupedProducts key
 */
function sectionIdToKey(sectionId: MenuSectionId): keyof GroupedProducts {
  if (sectionId === 'best-sellers') return 'bestSellers';
  return sectionId;
}

/**
 * Get total product count for a section
 */
export function getSectionCount(
  groupedProducts: GroupedProducts,
  sectionId: MenuSectionId
): number {
  const key = sectionIdToKey(sectionId);
  return groupedProducts[key]?.length || 0;
}

/**
 * Get products for a specific section
 */
export function getSectionProducts(
  groupedProducts: GroupedProducts,
  sectionId: MenuSectionId
): Product[] {
  const key = sectionIdToKey(sectionId);
  return groupedProducts[key] || [];
}

/**
 * Check if product is vegetarian
 */
export function isVegetarian(product: Product): boolean {
  return product.vegetarian === true;
}

/**
 * Check if product is spicy
 */
export function isSpicy(product: Product): boolean {
  return product.spicy === true;
}

/**
 * Check if product contains fish
 */
export function containsFish(product: Product): boolean {
  return product.tags?.includes('poisson') || false;
}

/**
 * Format price for display (menu engineering: no EUR symbol)
 */
export function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',');
}

/**
 * Format price with EUR (for cart/checkout)
 */
export function formatPriceWithCurrency(price: number): string {
  return `${formatPrice(price)} EUR`;
}
