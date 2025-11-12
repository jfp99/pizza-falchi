'use client';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, Clock, Truck, Shield, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { SPACING, ROUNDED, SHADOWS, TRANSITIONS } from '@/lib/design-constants';
import { PizzaSliceIcon, StarFilledIcon } from '@/components/icons/CategoryIcons';
import { motion } from 'framer-motion';
import { fadeInUp, buttonPress } from '@/lib/animations';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart();

  const subtotal = getTotalPrice();
  const total = subtotal;

  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId);
    toast.success(`${productName} retiré du panier`);
  };

  const handleClearCart = () => {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      clearCart();
      toast.success('Panier vidé');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-cream to-primary-yellow/10 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-primary-red/10 to-primary-yellow/10 dark:from-primary-red/20 dark:to-primary-yellow/20 rounded-full mb-6 transition-colors duration-300">
              <ShoppingCart className="w-16 h-16 text-primary-red dark:text-primary-red-light transition-colors duration-300" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
              Votre panier est vide
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-300">
              Découvrez nos délicieuses pizzas artisanales !
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-red to-soft-red text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-lg"
            >
              Explorer le menu
              <PizzaSliceIcon size={24} className="text-white" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream via-white to-primary-yellow/5 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary-red dark:hover:text-primary-red-light transition-colors font-semibold mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            Continuer mes achats
          </Link>
          <div>
            <h1 className="text-5xl font-black text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
              Mon Panier
              <span className="ml-3 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary-red to-soft-red text-white text-lg rounded-full">
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Finalisez votre commande gourmande
            </p>
          </div>
        </div>

        <div className={`grid lg:grid-cols-3 ${SPACING.cardGap}`}>
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className={`group bg-white dark:bg-gray-800 ${ROUNDED.xl} ${SPACING.cardPadding} ${SHADOWS.md} hover:${SHADOWS.lg} ${TRANSITIONS.base} transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 transition-colors duration-300`}
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0 relative">
                    <img
                      src={item.product.image || '/images/pizza-placeholder.jpg'}
                      alt={`${item.product.name} - ${item.product.description}`}
                      className="w-28 h-28 object-cover rounded-2xl shadow-sm"
                    />
                    {item.product.popular && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-primary-yellow to-soft-yellow text-gray-800 dark:text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 transition-colors duration-300">
                        <Star size={12} className="fill-current" />
                        <span>Populaire</span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-primary-red dark:group-hover:text-primary-red-light transition-colors duration-300">
                          {item.product.name}
                        </h3>
                        <div className="flex items-center gap-3">
                          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                            {item.product.price.toFixed(2)}€ / unité
                          </p>
                          {item.product.category && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300 capitalize transition-colors duration-300">
                              {item.product.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.product._id, item.product.name)}
                        className="text-red-400 dark:text-red-300 hover:text-red-600 dark:hover:text-red-400 transition-all p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl group/btn"
                        aria-label={`Supprimer ${item.product.name} du panier`}
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5 transform group-hover/btn:scale-110 transition-transform" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Quantity Controls and Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-1 transition-colors duration-300">
                        <motion.button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="bg-white dark:bg-gray-600 hover:bg-primary-red hover:text-white text-gray-700 dark:text-gray-200 w-10 h-10 rounded-lg flex items-center justify-center shadow-sm transition-colors duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Diminuer la quantité"
                        >
                          <Minus className="w-4 h-4" aria-hidden="true" />
                        </motion.button>
                        <motion.span
                          className="text-lg font-bold text-gray-900 dark:text-gray-100 w-14 text-center transition-colors duration-300"
                          key={item.quantity}
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.quantity}
                        </motion.span>
                        <motion.button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="bg-white dark:bg-gray-600 hover:bg-primary-red hover:text-white text-gray-700 dark:text-gray-200 w-10 h-10 rounded-lg flex items-center justify-center shadow-sm transition-colors duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Augmenter la quantité"
                        >
                          <Plus className="w-4 h-4" aria-hidden="true" />
                        </motion.button>
                      </div>

                      <div className="text-right">
                        <p className="text-3xl font-black bg-gradient-to-r from-primary-red to-soft-red bg-clip-text text-transparent">
                          {(item.product.price * item.quantity).toFixed(2)}€
                        </p>
                      </div>
                    </div>

                    {/* Ingredients Preview with icons */}
                    {item.product.ingredients && item.product.ingredients.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <div className="flex flex-wrap gap-2">
                          {item.product.ingredients.slice(0, 4).map((ingredient, idx) => (
                            <span key={idx} className="text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full transition-colors duration-300">
                              {ingredient}
                            </span>
                          ))}
                          {item.product.ingredients.length > 4 && (
                            <span className="text-xs bg-primary-yellow/20 dark:bg-primary-yellow/30 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full font-semibold transition-colors duration-300">
                              +{item.product.ingredients.length - 4} autres
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleClearCart}
                className="group flex items-center gap-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-semibold py-3 px-6 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-2xl transition-all duration-200"
              >
                <Trash2 className="w-5 h-5 transform group-hover:rotate-12 transition-transform" />
                Vider le panier
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 sticky top-6 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  Récapitulatif
                </h2>
                <div className="bg-primary-red/10 dark:bg-primary-red/20 p-2 rounded-xl transition-colors duration-300">
                  <ShoppingCart className="w-6 h-6 text-primary-red dark:text-primary-red-light transition-colors duration-300" />
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  <span className="flex items-center gap-2">
                    <ShoppingCart size={18} className="text-gray-600 dark:text-gray-400 transition-colors duration-300" />
                    Sous-total TTC ({items.reduce((acc, item) => acc + item.quantity, 0)} articles)
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Total TTC</span>
                    <div className="text-right">
                      <p className="text-3xl font-black bg-gradient-to-r from-primary-red to-soft-red bg-clip-text text-transparent">
                        {total.toFixed(2)}€
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/checkout"
                  className="w-full bg-gradient-to-r from-primary-red to-soft-red hover:from-primary-red-dark hover:to-primary-red text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl text-lg mb-4 transition-all duration-300"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Commander maintenant
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/menu"
                  className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-4 rounded-2xl font-semibold text-center block transition-colors duration-300"
                >
                  Ajouter d'autres articles
                </Link>
              </motion.div>

              {/* Estimated Preparation */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20 rounded-2xl border border-green-200 dark:border-green-700 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green-600 dark:text-green-400 transition-colors duration-300" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">Préparation estimée</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">30-45 minutes après commande</p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full transition-colors duration-300">
                    <Shield className="w-4 h-4 text-green-600 dark:text-green-400 transition-colors duration-300" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary-yellow/20 dark:bg-primary-yellow/30 p-1.5 rounded-full transition-colors duration-300">
                    <Star size={14} className="text-primary-yellow transition-colors duration-300" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Qualité premium garantie</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
