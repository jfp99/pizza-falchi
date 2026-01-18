/**
 * Booklet Types - Pizza Falchi
 */

export type PageNumber = 1 | 2 | 3 | 4;

export interface BookletPageProps {
  pageNumber: PageNumber;
  className?: string;
  children: React.ReactNode;
}

export interface BookletSheetProps {
  side: 'outside' | 'inside';
  className?: string;
  showFoldLine?: boolean;
}

export interface BookletContainerProps {
  className?: string;
  showFoldLine?: boolean;
  viewMode?: 'pages' | 'sheets' | 'spread';
  currentPage?: PageNumber;
}

export interface BookletExportOptions {
  quality: 'print' | 'web' | 'preview';
  includeBleed?: boolean;
  filename?: string;
}

export interface BookletExportResult {
  success: boolean;
  filename?: string;
  error?: string;
  blob?: Blob;
}

// Menu section types for pages
export interface PizzaCategorySection {
  title: string;
  subtitle?: string;
  items: PizzaItem[];
  baseType?: 'tomate' | 'creme';
}

export interface PizzaItem {
  name: string;
  price: number;
  priceGrande?: number;
  description?: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isBestSeller?: boolean;
  hasDualBase?: boolean;
}

export interface DrinkCategory {
  title: string;
  items: DrinkItem[];
}

export interface DrinkItem {
  name: string;
  price: number;
}
