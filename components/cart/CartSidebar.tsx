'use client';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartItem from './CartItem';
import Link from 'next/link';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, getTotalPrice, clearCart } = useCart();

  const subtotal = getTotalPrice();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-40 transition-opacity"
          onClick={onClose}
          aria-label="Fermer le panier"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-full sm:w-96 bg-surface dark:bg-background-secondary shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="complementary"
        aria-label="Panier d'achat"
        aria-hidden={!isOpen}
      >
        <div className="p-6 h-full flex flex-col">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6">
            <h2 id="cart-sidebar-title" className="text-2xl font-bold text-text-primary dark:text-text-primary">Votre Panier</h2>
            <button
              onClick={onClose}
              className="text-text-tertiary dark:text-text-tertiary hover:text-text-secondary dark:hover:text-text-secondary transition-colors"
              aria-label="Fermer le panier"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-text-secondary dark:text-text-secondary text-lg mb-2">Votre panier est vide</p>
              <p className="text-text-tertiary dark:text-text-tertiary">Ajoutez des produits délicieux !</p>
            </div>
          ) : (
            <>
              {/* Liste des articles */}
              <div
                className="flex-1 overflow-y-auto space-y-4"
                role="list"
                aria-label={`Panier contenant ${items.length} article${items.length > 1 ? 's' : ''}`}
                aria-live="polite"
                aria-atomic="false"
              >
                {items.map((item, index) => (
                  <CartItem key={index} item={item} />
                ))}
              </div>

              {/* Résumé et actions */}
              <div
                className="border-t border-border dark:border-border pt-6 space-y-4"
                role="region"
                aria-label="Résumé du panier"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-text-primary dark:text-text-primary">Sous-total</span>
                    <span className="font-bold text-brand-red text-xl">{subtotal.toFixed(2)}€</span>
                  </div>
                  <p className="text-sm text-text-tertiary dark:text-text-tertiary">
                    Les frais de livraison seront calculés à l'étape suivante
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="w-full bg-brand-red hover:bg-brand-red-hover text-white py-4 rounded-2xl transition font-bold flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Passer commande
                  </Link>

                  <button
                    onClick={clearCart}
                    className="w-full border-2 border-border dark:border-border text-text-primary dark:text-text-primary py-3 rounded-2xl hover:bg-background-secondary dark:hover:bg-background-tertiary transition font-semibold"
                  >
                    Vider le panier
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}