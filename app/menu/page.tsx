'use client';
import { useState, useEffect, Suspense, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Star, Flame, Leaf, Gift, Pizza, ShoppingCart, Sparkles, ChefHat, Eye, Calculator, CheckCircle, X, AlertCircle } from 'lucide-react';
import { Product, Category } from '@/types';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/menu/ProductCard';
import ProductCardSkeleton from '@/components/menu/ProductCardSkeleton';
import CategoryFilterWithIcons from '@/components/menu/CategoryFilterWithIcons';
import PackageCard from '@/components/packages/PackageCard';
import toast from 'react-hot-toast';
import { SPACING, TYPOGRAPHY, ROUNDED, SHADOWS, TRANSITIONS } from '@/lib/design-constants';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeInUp, scaleIn } from '@/lib/animations';
import Link from 'next/link';

// Dynamically import heavy components for better performance
const CartSidebar = dynamic(() => import('@/components/cart/CartSidebar'), {
  loading: () => <div className="fixed right-0 top-0 h-full w-96 bg-surface dark:bg-surface animate-pulse" />,
});

const ComboSelectionModal = dynamic(() => import('@/components/packages/ComboSelectionModal'), {
  loading: () => <div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="bg-surface dark:bg-surface p-8 rounded-3xl animate-pulse w-96 h-96" /></div>,
});

const PizzaBuilderModal = dynamic(() => import('@/components/pizza-builder/PizzaBuilderModal'), {
  loading: () => <div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="bg-surface dark:bg-surface p-8 rounded-3xl animate-pulse w-96 h-96" /></div>,
});

// Categories now use React components instead of emoji strings
const categories: Category[] = [
  { id: 'all', name: 'Tout le Menu', icon: 'PizzaSliceIcon' },
  { id: 'pizza', name: 'Pizzas', icon: 'PizzaSliceIcon' },
  { id: 'boisson', name: 'Boissons', icon: 'DrinkIcon' },
  { id: 'combo', name: 'Combos', icon: 'GiftBoxIcon' },
];

interface PackageType {
  _id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  items: Array<{
    type: string;
    quantity: number;
    description: string;
  }>;
  icon: string;
  color: string;
  popular: boolean;
  badge?: string;
}

// Component to handle URL search params (needs to be wrapped in Suspense)
function OrderSuccessHandler({
  onShowSuccess
}: {
  onShowSuccess: (orderId: string) => void
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderSuccess = searchParams.get('orderSuccess');
    const orderId = searchParams.get('orderId');

    if (orderSuccess === 'true' && orderId) {
      onShowSuccess(orderId);

      // Show toast notification as well
      toast.success(`Commande #${orderId} confirmée ! Prête à commander à nouveau ?`, {
        duration: 5000,
        style: {
          background: '#FFF9F0',
          color: '#1a1a1a',
          fontWeight: '600',
          borderRadius: '16px',
          border: '2px solid #E30613',
        },
      });

      // Clean URL params after showing modal
      window.history.replaceState({}, '', '/menu');
    }
  }, [searchParams, onShowSuccess]);

  return null;
}

function MenuContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [isPizzaBuilderOpen, setIsPizzaBuilderOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [error, setError] = useState<{ type: 'products' | 'packages' | null; message: string }>({ type: null, message: '' });
  const { addItem, getTotalItems } = useCart();

  const handleShowSuccess = useCallback((orderId: string) => {
    setSuccessOrderId(orderId);
    setShowSuccessModal(true);
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError({ type: null, message: '' });
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: Impossible de charger les produits`);
      }
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError({
        type: 'products',
        message: err instanceof Error ? err.message : 'Erreur lors du chargement des produits'
      });
      toast.error('Impossible de charger le menu. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPackages = useCallback(async () => {
    try {
      const response = await fetch('/api/packages');
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: Impossible de charger les combos`);
      }
      const data = await response.json();
      setPackages(data);
    } catch (err) {
      console.error('Error fetching packages:', err);
      // Don't set error state for packages as they're secondary content
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
    fetchPackages();
  }, [fetchProducts, fetchPackages]);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchTerm]);

  const filterProducts = () => {
    let filtered = products;

    // Don't show products when 'combo' is selected
    if (selectedCategory === 'combo') {
      setFilteredProducts([]);
      return;
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: Product, customizations?: { size: 'medium' | 'large'; extras: string[]; cut?: boolean }, calculatedPrice?: number) => {
    addItem(product, customizations, calculatedPrice);

    let message = `${product.name} ajouté au panier !`;
    if (customizations) {
      const details = [];
      if (customizations.size) {
        details.push(`Taille: ${customizations.size}`);
      }
      if (customizations.extras && customizations.extras.length > 0) {
        details.push(`+${customizations.extras.length} extra(s)`);
      }
      if (customizations.cut !== undefined) {
        details.push(customizations.cut ? 'À couper' : 'Entière');
      }
      if (details.length > 0) {
        message += ` (${details.join(', ')})`;
      }
    }

    toast.success(
      message,
      {
        duration: 2000,
        style: {
          background: '#FFF9F0',
          color: '#1a1a1a',
          fontWeight: '600',
          borderRadius: '16px',
          border: '1px solid #E30613',
        },
      }
    );
    setIsCartOpen(true);
  };

  const handleSelectPackage = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setIsComboModalOpen(true);
  };

  const handleComboConfirm = (selectedProducts: Product[], totalPrice: number) => {
    // Add each product to cart with combo pricing logic
    selectedProducts.forEach(product => {
      addItem(product);
    });

    toast.success(
      `${selectedPackage?.name} ajouté au panier pour ${totalPrice.toFixed(2)}€ !`,
      {
        duration: 3000,
        style: {
          background: '#FFF9F0',
          color: '#1a1a1a',
          fontWeight: '600',
          borderRadius: '16px',
          border: '1px solid #E30613',
        },
      }
    );
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-warm-cream dark:bg-gray-900 transition-colors duration-300">
      {/* Order Success Handler wrapped in Suspense */}
      <Suspense fallback={null}>
        <OrderSuccessHandler onShowSuccess={handleShowSuccess} />
      </Suspense>

      {/* Hero Section - Same presentation as homepage */}
      <section className="relative min-h-screen flex items-center justify-center bg-warm-cream dark:bg-gray-900 overflow-hidden transition-colors">
        {/* Large Hero Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-main.avif"
            alt="Pizza Falchi - Notre Menu"
            fill
            className="object-cover"
            priority
          />
          {/* Clean overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/50 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="max-w-3xl mx-auto text-center">
            {/* Info Badge - Main Focus */}
            <div className="inline-flex items-center gap-6 bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl mb-10 max-w-2xl">
              {/* Logo */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                <Image
                  src="/images/branding/logo-badge.png"
                  alt="Pizza Falchi Logo"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1">
                <div className="inline-block mb-2">
                  <span className="bg-primary-red text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                    Menu Complet
                  </span>
                </div>
                <p className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight" aria-label="Pizza Falchi">
                  PIZZA FALCHI
                </p>
                <p className="text-primary-yellow font-bold text-xl md:text-2xl">
                  depuis 2001
                </p>
                <p className="text-white/90 font-medium text-base md:text-lg">
                  Puyricard Aix-en-Provence
                </p>
              </div>
            </div>

            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed font-medium">
              Pizzas artisanales • Cuisson au feu de bois • Ingrédients italiens
            </p>

            {/* Main Page Title (H1) */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white/80 leading-relaxed mb-10">
              Découvrez nos
              <span className="text-primary-yellow"> créations artisanales </span>
              authentiques
            </h1>

            {/* CTA Button */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  const menuSection = document.getElementById('menu-section');
                  menuSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-brand-red hover:bg-brand-red-hover text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-200 shadow-soft-lg hover:shadow-soft-xl active:scale-98 text-center"
                suppressHydrationWarning
              >
                Voir le Menu
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      <div id="menu-section" className="max-w-7xl mx-auto px-4 pt-16 pb-20">
        {/* Filtres et Recherche - Enhanced Design */}
        <div className="mb-12 space-y-8">
          {/* Search Bar - Enhanced with ARIA */}
          <div role="search" aria-label="Rechercher des produits" className="relative max-w-3xl mx-auto group">
            <label htmlFor="product-search" className="sr-only">
              Rechercher une pizza, un ingrédient
            </label>
            <div className="absolute left-4 md:left-5 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none" aria-hidden="true">
              <div className="bg-brand-red p-2 rounded-xl shadow-soft-md group-focus-within:scale-105 transition-transform duration-200">
                <Search className="w-5 h-5 text-white" />
              </div>
            </div>
            <input
              id="product-search"
              suppressHydrationWarning
              type="search"
              placeholder="Rechercher une pizza, un ingrédient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-describedby="search-results-count"
              className="w-full pl-16 md:pl-20 pr-14 py-4 md:py-5 bg-surface dark:bg-surface border-2 border-border dark:border-border rounded-3xl focus:border-primary-red focus:shadow-xl hover:shadow-lg transition-all shadow-md text-base md:text-lg font-medium text-charcoal dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal"
            />
            {searchTerm && (
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-4 md:right-5 top-1/2 transform -translate-y-1/2 bg-gray-100 hover:bg-primary-red text-gray-600 hover:text-white p-2 rounded-xl transition-all duration-200 hover:scale-105"
                aria-label="Effacer la recherche"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <CategoryFilterWithIcons
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Product Count & Filters Summary - Enhanced with ARIA live region */}
        {selectedCategory !== 'combo' && (
          <div className={`flex flex-col sm:flex-row justify-between items-center mb-10 bg-surface dark:bg-surface ${ROUNDED.lg} ${SPACING.cardPadding} shadow-soft-md border border-border dark:border-border hover:shadow-soft-lg transition-all duration-200`}>
            <div className="flex items-center gap-4">
              <div className="bg-brand-red p-3 rounded-xl shadow-soft-sm" aria-hidden="true">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col" id="search-results-count" aria-live="polite" aria-atomic="true">
                <span className="text-2xl font-black text-charcoal dark:text-gray-100 transition-colors duration-300">
                  {filteredProducts.length}
                </span>
                <span className="text-sm text-text-secondary dark:text-text-secondary font-medium transition-colors duration-300">
                  produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                suppressHydrationWarning
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="mt-3 sm:mt-0 bg-background-secondary dark:bg-background-tertiary hover:bg-brand-red text-text-primary dark:text-text-primary hover:text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-98 shadow-soft-sm hover:shadow-soft-md"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}

        {/* Grille des produits */}
        {selectedCategory !== 'combo' && (
          <div id="products-section" className={`grid md:grid-cols-2 lg:grid-cols-3 ${SPACING.cardGap} mb-12`}>
            {isLoading ? (
              // Show skeleton loaders while loading
              Array.from({ length: 6 }).map((_, index) => (
                <ProductCardSkeleton key={`skeleton-${index}`} />
              ))
            ) : error.type === 'products' ? (
              // Error state with retry button
              <div className="col-span-full">
                <div
                  className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-3xl p-8 md:p-12 text-center max-w-lg mx-auto"
                  role="alert"
                  aria-live="assertive"
                >
                  <div className="inline-block bg-red-100 dark:bg-red-900/30 rounded-2xl p-4 mb-4" aria-hidden="true">
                    <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2">
                    Erreur de chargement
                  </h2>
                  <p className="text-red-600 dark:text-red-400 mb-6">
                    {error.message || 'Impossible de charger les produits. Veuillez vérifier votre connexion et réessayer.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      fetchProducts();
                      fetchPackages();
                    }}
                    className="bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 active:scale-98 shadow-soft-md hover:shadow-soft-lg inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Réessayer
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Animate only first 6 products for performance */}
                {filteredProducts.slice(0, 6).map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  </motion.div>
                ))}
                {/* Remaining products without animation for better performance */}
                {filteredProducts.slice(6).map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </>
            )}
          </div>
        )}

        {/* Packages Section - Now at bottom or prominent when combo selected */}
        {packages.length > 0 && (selectedCategory === 'combo' || selectedCategory === 'all') && (
          <div className={`${selectedCategory === 'combo' ? 'mb-12' : 'mb-16'}`} id="combos-section">
            {/* Header - More prominent for combo filter, discrete for all */}
            {selectedCategory === 'combo' ? (
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-brand-red p-3 rounded-2xl shadow-soft-md" aria-hidden="true">
                    <Gift className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-text-primary dark:text-text-primary">
                      Nos <span className="text-brand-red">Combos</span>
                    </h2>
                    <p className="text-text-secondary dark:text-text-secondary text-lg font-medium">
                      Des offres exceptionnelles pour régaler tout le monde !
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-brand-red p-2.5 rounded-xl shadow-soft-sm" aria-hidden="true">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-primary">
                  Nos <span className="text-brand-red">Combos</span>
                </h2>
              </div>
            )}

            {/* Packages Grid */}
            <div className={`grid md:grid-cols-2 lg:grid-cols-3 ${SPACING.cardGap}`}>
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg._id}
                  package={pkg}
                  onSelect={handleSelectPackage}
                />
              ))}
            </div>
          </div>
        )}

        {/* Message si aucun résultat - Enhanced */}
        {!isLoading && filteredProducts.length === 0 && selectedCategory !== 'combo' && (
          <div className="text-center py-20">
            <div className="bg-surface dark:bg-surface rounded-3xl p-12 max-w-lg mx-auto shadow-2xl border-2 border-border dark:border-border hover:shadow-3xl transition-all duration-300">
              <div className="inline-block bg-soft-red-lighter dark:bg-primary-red/20 rounded-3xl p-6 mb-6 transition-colors duration-300" aria-hidden="true">
                <Pizza className="w-16 h-16 text-primary-red dark:text-primary-red-light transition-colors duration-300" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-charcoal dark:text-gray-100 mb-4 transition-colors duration-300">Aucun résultat trouvé</h2>
              <p className="text-lg text-text-secondary dark:text-text-secondary mb-8 leading-relaxed transition-colors duration-300">
                Nous n'avons trouvé aucun produit correspondant à votre recherche.
                <br />
                <span className="text-sm">Essayez de modifier vos critères de recherche</span>
              </p>
              <button
                suppressHydrationWarning
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-brand-red hover:bg-brand-red-hover text-white px-10 py-4 rounded-2xl font-bold transition-all duration-200 active:scale-98 shadow-soft-md hover:shadow-soft-lg"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}

        {/* Pizza Builder Card - Elegant Design - At Bottom */}
        <section className="mt-16 mb-8" aria-labelledby="pizza-builder-title">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsPizzaBuilderOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsPizzaBuilderOpen(true);
              }
            }}
            className="bg-surface dark:bg-surface rounded-3xl p-6 md:p-8 shadow-soft-md hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 border border-border dark:border-border group cursor-pointer"
            aria-label="Ouvrir le créateur de pizza personnalisée"
          >
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="bg-brand-red p-4 rounded-2xl shadow-soft-md group-hover:scale-105 transition-transform duration-200">
                    <ChefHat className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-charcoal dark:text-gray-100 transition-colors" id="pizza-builder-title">
                      Créez Votre Pizza Parfaite
                    </h2>
                    <span className="bg-primary-red text-white px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider" aria-label="Nouvelle fonctionnalité">
                      Nouveau
                    </span>
                  </div>
                  <p className="text-text-secondary dark:text-text-secondary text-base md:text-lg mb-4 transition-colors">
                    Personnalisez chaque ingrédient avec notre créateur de pizza interactif
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-warm-cream dark:bg-gray-700 px-3 py-2 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-primary-red" />
                      <span className="text-sm font-medium text-text-secondary dark:text-text-secondary">Visualisation en temps réel</span>
                    </div>
                    <div className="flex items-center gap-2 bg-warm-cream dark:bg-gray-700 px-3 py-2 rounded-lg transition-colors">
                      <Calculator className="w-4 h-4 text-primary-yellow" />
                      <span className="text-sm font-medium text-text-secondary dark:text-text-secondary">Prix calculé automatiquement</span>
                    </div>
                    <div className="flex items-center gap-2 bg-warm-cream dark:bg-gray-700 px-3 py-2 rounded-lg transition-colors">
                      <Leaf className="w-4 h-4 text-basil-light" />
                      <span className="text-sm font-medium text-text-secondary dark:text-text-secondary">50+ ingrédients</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex-shrink-0 mt-4 md:mt-0">
                  <div className="bg-brand-red text-white px-6 py-3 rounded-xl font-bold text-base shadow-soft-md group-hover:shadow-soft-lg transition-all duration-200 group-hover:scale-103 flex items-center gap-2" aria-hidden="true">
                    Commencer
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
          </div>
        </section>

        {/* Sidebar Panier */}
        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />

        {/* Bouton Panier Mobile - Enhanced */}
        <button
          suppressHydrationWarning
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-brand-red hover:bg-brand-red-hover text-white p-4 md:p-5 rounded-full shadow-soft-lg md:hidden z-50 transition-all duration-200 active:scale-98"
          aria-label={`Ouvrir le panier ${getTotalItems() > 0 ? `(${getTotalItems()} article${getTotalItems() > 1 ? 's' : ''})` : '(vide)'}`}
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-gold text-gray-900 rounded-full w-6 h-6 text-xs flex items-center justify-center font-black shadow-soft-md ring-2 ring-white animate-badge-pulse">
                {getTotalItems()}
              </span>
            )}
          </div>
        </button>

        {/* Combo Selection Modal */}
        {selectedPackage && (
          <ComboSelectionModal
            isOpen={isComboModalOpen}
            onClose={() => setIsComboModalOpen(false)}
            package={selectedPackage}
            onConfirm={handleComboConfirm}
            allProducts={products}
          />
        )}

        {/* Pizza Builder Modal */}
        <PizzaBuilderModal
          isOpen={isPizzaBuilderOpen}
          onClose={() => setIsPizzaBuilderOpen(false)}
        />

        {/* Order Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowSuccessModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl border-2 border-green-100 dark:border-green-900 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                  className="flex justify-center mb-6"
                >
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-black text-center text-gray-900 dark:text-gray-100 mb-3"
                >
                  Commande <span className="text-green-500">Confirmée !</span>
                </motion.h2>

                {/* Order ID */}
                {successOrderId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mb-6"
                  >
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Numéro de commande</p>
                    <p className="text-2xl font-black text-primary-red">#{successOrderId}</p>
                  </motion.div>
                )}

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-gray-600 dark:text-gray-400 mb-8 text-lg"
                >
                  Votre commande a été enregistrée avec succès ! Prêt à commander à nouveau ?
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col gap-3"
                >
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      const menuSection = document.getElementById('menu-section');
                      menuSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-brand-red hover:bg-brand-red-hover text-white py-4 rounded-xl font-bold transition-all duration-200 active:scale-98 shadow-soft-md hover:shadow-soft-lg"
                  >
                    Parcourir le Menu
                  </button>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-bold transition-all duration-300"
                  >
                    Fermer
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Default export wrapper for the page
export default function Menu() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-warm-cream dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-red border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400">Chargement du menu...</p>
        </div>
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}