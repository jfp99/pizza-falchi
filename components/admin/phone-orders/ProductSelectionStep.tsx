'use client';

import { memo } from 'react';
import { Plus, Minus, AlertCircle } from 'lucide-react';
import type { Product } from '@/types';
import Badge from '@/components/ui/Badge';

/**
 * Cart item structure representing a product with quantity
 *
 * @property product - The product object with all product details (name, price, category, etc.)
 * @property quantity - Number of items in cart (positive integer)
 *
 * @example
 * ```tsx
 * const cartItem: CartItem = {
 *   product: {
 *     _id: 'p1',
 *     name: 'Margherita',
 *     price: 10.5,
 *     category: 'pizza',
 *     available: true
 *   },
 *   quantity: 2
 * };
 * ```
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Props for the ProductSelectionStep component
 *
 * This is a reusable component for product selection in the phone order workflow.
 * Can be used for pizzas, drinks, or any other product category.
 *
 * @property title - Display title for the step (e.g., "Sélection des Pizzas")
 * @property icon - React icon component to display next to title
 * @property products - Array of available products to display
 * @property cart - Current cart state with selected items
 * @property loading - Optional loading state while fetching products
 * @property onAddToCart - Callback fired when adding a product (increments quantity)
 * @property onRemoveFromCart - Callback fired when removing a product (decrements quantity)
 * @property keyboardHint - Optional flag to show keyboard shortcut hints (1-9)
 * @property warningMessage - Optional warning message (e.g., capacity exceeded)
 *
 * @example
 * ```tsx
 * <ProductSelectionStep
 *   title="Sélection des Pizzas"
 *   icon={<Pizza className="w-5 h-5" />}
 *   products={pizzas}
 *   cart={cart}
 *   onAddToCart={addToCart}
 *   onRemoveFromCart={removeFromCart}
 *   keyboardHint={true}
 * />
 * ```
 */
interface ProductSelectionStepProps {
  title: string;
  icon: React.ReactNode;
  products: Product[];
  cart: CartItem[];
  loading?: boolean;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  keyboardHint?: boolean;
  warningMessage?: string;
}

/**
 * Reusable product selection step for phone orders
 *
 * Displays a grid of products with add/remove controls. Features keyboard
 * shortcuts (1-9) for rapid product entry during phone calls. Shows current
 * cart quantities and supports loading states.
 *
 * This component is reused for both pizza and drink selection steps,
 * making it highly flexible and maintainable.
 *
 * Features:
 * - Keyboard shortcuts (1-9) for first 9 products
 * - Visual quantity indicators in cart
 * - Loading skeleton for async product fetching
 * - Empty state when no products available
 * - Warning message support for capacity alerts
 * - WCAG AA compliant with ARIA live regions
 *
 * @component
 * @example
 * ```tsx
 * // For pizzas
 * <ProductSelectionStep
 *   title="Sélection des Pizzas"
 *   icon={<Pizza />}
 *   products={pizzas}
 *   cart={cart}
 *   onAddToCart={addToCart}
 *   onRemoveFromCart={removeFromCart}
 *   keyboardHint={true}
 * />
 *
 * // For drinks
 * <ProductSelectionStep
 *   title="Boissons"
 *   icon={<CupSoda />}
 *   products={drinks}
 *   cart={cart}
 *   onAddToCart={addToCart}
 *   onRemoveFromCart={removeFromCart}
 * />
 * ```
 */
function ProductSelectionStep({
  title,
  icon,
  products,
  cart,
  loading = false,
  onAddToCart,
  onRemoveFromCart,
  keyboardHint = true,
  warningMessage,
}: ProductSelectionStepProps) {
  const getQuantityInCart = (productId: string): number => {
    const item = cart.find((item) => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  if (loading) {
    return (
      <div className="text-center py-8" role="status" aria-live="polite">
        <div
          className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-red border-t-transparent"
          aria-hidden="true"
        ></div>
        <p className="text-gray-600 mt-4 sr-only">Chargement des produits...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 font-semibold">Aucun produit disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-black text-charcoal dark:text-white flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-primary-red/10 to-primary-yellow/10 rounded-xl">
            {icon}
          </div>
          {title}
        </h3>
        {keyboardHint && (
          <div
            className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-700"
            aria-label="Raccourcis clavier disponibles"
          >
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth="2"/>
              <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M6 16h8" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div className="text-xs text-blue-700 dark:text-blue-300 font-bold">
              <div>Touches 1-9 : Ajouter</div>
              <div>Entrée : Continuer</div>
            </div>
          </div>
        )}
      </div>

      {warningMessage && (
        <div
          className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-300 dark:border-red-600 rounded-2xl p-5 flex items-start gap-4 shadow-lg"
          role="alert"
        >
          <div className="p-2 bg-red-100 dark:bg-red-800 rounded-xl">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-red-900 dark:text-red-200 mb-1">Attention - Capacité dépassée</p>
            <p className="text-sm font-medium text-red-700 dark:text-red-300">{warningMessage}</p>
          </div>
        </div>
      )}

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        role="list"
        aria-label={`Liste des ${title.toLowerCase()}`}
      >
        {products.map((product, index) => {
          const quantity = getQuantityInCart(product._id!);
          const shortcutNumber = index + 1;

          return (
            <div
              key={product._id}
              className={`
                group relative bg-white dark:bg-gray-800 rounded-2xl p-5
                transition-all duration-300 hover:shadow-xl
                ${quantity > 0
                  ? 'border-2 border-primary-red shadow-lg shadow-primary-red/20'
                  : 'border-2 border-gray-200 dark:border-gray-700 hover:border-primary-red/50'
                }
              `}
              role="listitem"
            >
              {/* Keyboard Shortcut Badge - Redesigned */}
              {keyboardHint && shortcutNumber <= 9 && (
                <div
                  className="absolute -top-2 -left-2 w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-black shadow-lg z-10"
                  aria-label={`Raccourci clavier: ${shortcutNumber}`}
                >
                  {shortcutNumber}
                </div>
              )}

              {/* Quantity Badge */}
              {quantity > 0 && (
                <div className="absolute -top-2 -right-2 min-w-7 h-7 bg-gradient-to-br from-primary-red to-primary-yellow text-white rounded-lg flex items-center justify-center px-2 text-sm font-black shadow-lg z-10 animate-pulse">
                  ×{quantity}
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-charcoal dark:text-white text-lg mb-1 truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-black text-primary-red">
                      {product.price.toFixed(2)}€
                    </span>
                  </div>
                  {product.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}

                  {/* Size and Extras Badges for Pizzas - Enhanced */}
                  {product.category === 'pizza' && (product.sizeOptions || (product.availableExtras && product.availableExtras.length > 0)) && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {product.sizeOptions && (
                        <>
                          {product.sizeOptions.medium.available && (
                            <Badge variant="info" size="sm">Medium</Badge>
                          )}
                          {product.sizeOptions.large.available && (
                            <Badge variant="warning" size="sm">Large +{product.sizeOptions.large.priceModifier}€</Badge>
                          )}
                        </>
                      )}
                      {product.availableExtras && product.availableExtras.length > 0 && (
                        <Badge variant="success" size="sm" icon={<Plus className="w-3 h-3" />}>
                          {product.availableExtras.length} extras
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Enhanced Quantity Controls */}
                <div className="flex flex-col items-center gap-2" role="group" aria-label={`Quantité de ${product.name}`}>
                  {quantity > 0 && (
                    <button
                      onClick={() => onRemoveFromCart(product._id!)}
                      className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm"
                      aria-label={`Retirer ${product.name}`}
                      type="button"
                    >
                      <Minus className="w-5 h-5" aria-hidden="true" />
                    </button>
                  )}
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-red to-primary-yellow text-white hover:from-primary-yellow hover:to-primary-red flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
                    aria-label={`Ajouter ${product.name}`}
                    type="button"
                  >
                    <Plus className="w-5 h-5 font-bold" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(ProductSelectionStep);
