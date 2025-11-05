'use client';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast';
import { SPACING, ROUNDED, SHADOWS, TRANSITIONS } from '@/lib/design-constants';

export default function WishlistPage() {
  const { items, isLoading, removeFromWishlist, clearWishlist, getTotalItems } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (item: any) => {
    addItem(item.product);
    toast.success(`${item.product.name} ajouté au panier`);
  };

  const handleRemove = (item: any) => {
    removeFromWishlist(item.product._id, item.product.name);
  };

  const handleClearAll = () => {
    if (confirm('Êtes-vous sûr de vouloir vider votre liste de favoris ?')) {
      clearWishlist();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-red mx-auto mb-4" />
          <p className="text-xl text-gray-600">Chargement de vos favoris...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-primary-red hover:text-primary-red-dark transition font-semibold mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            Retour au menu
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                Mes <span className="bg-gradient-to-r from-primary-red to-soft-red bg-clip-text text-transparent">Favoris</span>
              </h1>
              <p className="text-xl text-gray-600">
                {getTotalItems()} {getTotalItems() > 1 ? 'produits sauvegardés' : 'produit sauvegardé'}
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition"
              >
                <Trash2 className="w-5 h-5" />
                Tout vider
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className={`bg-white ${ROUNDED.xl} ${SPACING.cardPaddingLg} ${SHADOWS.md} text-center`}>
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Votre liste de favoris est vide
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Ajoutez des produits à vos favoris pour les retrouver facilement plus tard
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-red to-soft-red text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition"
            >
              <ShoppingCart className="w-5 h-5" />
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.product._id}
                className={`bg-white ${ROUNDED.xl} ${SHADOWS.md} hover:${SHADOWS.lg} ${TRANSITIONS.base} border border-gray-100 overflow-hidden group`}
              >
                {/* Product Image */}
                <Link href={`/products/${item.product._id}`} className="relative block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={item.product.image || '/images/pizza-placeholder.jpg'}
                      alt={item.product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-xl border border-gray-200">
                    <span className="text-xl font-bold text-gray-900">
                      {item.product.price.toFixed(2)}€
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 border border-gray-200 capitalize">
                      {item.product.category}
                    </span>
                  </div>
                </Link>

                {/* Product Info */}
                <div className={`${SPACING.cardPadding} space-y-3`}>
                  <Link href={`/products/${item.product._id}`}>
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1 hover:text-gray-700 transition-colors">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                      {item.product.description}
                    </p>
                  </Link>

                  <div className="text-xs text-gray-500">
                    Ajouté le {new Date(item.addedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-gradient-to-r from-primary-red to-soft-red hover:from-primary-red-dark hover:to-primary-red text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition hover:shadow-lg"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Ajouter au panier
                    </button>

                    <button
                      onClick={() => handleRemove(item)}
                      className="p-3 border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl transition"
                      title="Retirer des favoris"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        {items.length > 0 && (
          <div className={`mt-8 bg-blue-50 border border-blue-200 ${ROUNDED.xl} ${SPACING.cardPadding}`}>
            <div className="flex items-start gap-3">
              <Heart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 mb-1">Vos favoris sont sauvegardés</h3>
                <p className="text-sm text-blue-800">
                  Vos produits favoris sont liés à votre email et seront toujours disponibles, même après déconnexion.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
