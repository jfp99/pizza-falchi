'use client';

import { memo } from 'react';
import { Plus, Minus, AlertCircle } from 'lucide-react';
import type { Product } from '@/types';

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-charcoal flex items-center gap-2">
          {icon}
          {title}
        </h3>
        {keyboardHint && (
          <div
            className="text-xs text-gray-500 font-semibold"
            aria-label="Raccourcis clavier disponibles"
          >
            💡 Raccourcis: 1-9 pour ajouter, Entrée pour continuer
          </div>
        )}
      </div>

      {warningMessage && (
        <div
          className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-center gap-3"
          role="alert"
        >
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm font-semibold text-red-700">{warningMessage}</p>
        </div>
      )}

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
        role="list"
        aria-label={`Liste des ${title.toLowerCase()}`}
      >
        {products.map((product, index) => {
          const quantity = getQuantityInCart(product._id!);
          const shortcutNumber = index + 1;

          return (
            <div
              key={product._id}
              className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary-red transition-colors relative"
              role="listitem"
            >
              {/* Keyboard Shortcut Badge */}
              {keyboardHint && shortcutNumber <= 9 && (
                <div
                  className="absolute top-2 left-2 w-6 h-6 bg-gray-200 text-gray-700 rounded-md flex items-center justify-center text-xs font-bold"
                  aria-label={`Raccourci clavier: ${shortcutNumber}`}
                >
                  {shortcutNumber}
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <div className={`flex-1 ${shortcutNumber <= 9 && keyboardHint ? 'ml-8' : ''}`}>
                  <h4 className="font-bold text-charcoal">{product.name}</h4>
                  <p className="text-sm text-gray-600 font-semibold">
                    {product.price.toFixed(2)}€
                  </p>
                  {product.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2" role="group" aria-label={`Quantité de ${product.name}`}>
                  {quantity > 0 && (
                    <>
                      <button
                        onClick={() => onRemoveFromCart(product._id!)}
                        className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        aria-label={`Retirer ${product.name}`}
                        type="button"
                      >
                        <Minus className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <span
                        className="w-8 text-center font-bold"
                        aria-live="polite"
                        aria-label={`${quantity} dans le panier`}
                      >
                        {quantity}
                      </span>
                    </>
                  )}
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-8 h-8 rounded-lg bg-primary-red text-white hover:bg-primary-red/90 flex items-center justify-center transition-colors"
                    aria-label={`Ajouter ${product.name}`}
                    type="button"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
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
