'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, Plus, Minus, ShoppingCart, Star, Flame, Leaf, Check, Settings, ChefHat, Clock, Truck, Package } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { IngredientIcon } from '@/components/icons/IngredientIcons';
import { ProductImage } from '@/components/menu/ProductImage';
import Badge from '@/components/ui/Badge';
import PizzaCustomizationModal from '@/components/menu/PizzaCustomizationModal';
import { SPACING, TYPOGRAPHY, ROUNDED, SHADOWS, TRANSITIONS } from '@/lib/design-constants';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          router.push('/menu');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        router.push('/menu');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const isPizza = product?.category === 'pizza';
  const hasCustomization = isPizza && (product?.sizeOptions || (product?.availableExtras && product.availableExtras.length > 0));

  const handleAddToCart = () => {
    if (hasCustomization) {
      setIsCustomizationOpen(true);
    } else if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleCustomizedAddToCart = (
    prod: Product,
    customizations: { size: 'medium' | 'large'; extras: string[]; cut: boolean },
    calculatedPrice: number
  ) => {
    for (let i = 0; i < quantity; i++) {
      addItem(prod, customizations, calculatedPrice);
    }
    setAdded(true);
    setIsCustomizationOpen(false);
    setTimeout(() => setAdded(false), 2000);
  };

  // Get color for ingredient type
  const getIngredientColor = (ingredient: string): string => {
    const lower = ingredient.toLowerCase();
    if (lower.includes('tomate') || lower.includes('poivron') || lower.includes('oignon') ||
        lower.includes('champignon') || lower.includes('basilic') || lower.includes('olive')) {
      return '#16A34A';
    }
    if (lower.includes('fromage') || lower.includes('mozzarella') || lower.includes('emmental') ||
        lower.includes('chèvre') || lower.includes('parmesan') || lower.includes('raclette')) {
      return '#F59E0B';
    }
    if (lower.includes('jambon') || lower.includes('poulet') || lower.includes('viande') ||
        lower.includes('merguez') || lower.includes('chorizo') || lower.includes('lardons')) {
      return '#DC2626';
    }
    if (lower.includes('anchois') || lower.includes('thon') || lower.includes('saumon') ||
        lower.includes('fruits de mer')) {
      return '#0EA5E9';
    }
    return '#E30613';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-red dark:border-brand-red-light border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-text-secondary dark:text-text-secondary transition-colors">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background py-8 md:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-brand-red dark:text-brand-red-light hover:text-brand-red-hover dark:hover:text-brand-red transition-colors mb-6 md:mb-8 font-semibold group"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            Retour au menu
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-surface dark:bg-surface rounded-3xl p-4 md:p-6 shadow-soft-lg border border-border dark:border-border transition-colors"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-background-secondary dark:bg-background-tertiary">
              <ProductImage
                product={product}
                className="w-full h-full"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.popular && (
                  <Badge variant="popular" size="lg" icon={<Star className="w-4 h-4 fill-current" />}>
                    Populaire
                  </Badge>
                )}
                {product.spicy && (
                  <Badge variant="spicy" size="lg" icon={<Flame className="w-4 h-4" />}>
                    Épicé
                  </Badge>
                )}
                {product.vegetarian && (
                  <Badge variant="vegetarian" size="lg" icon={<Leaf className="w-4 h-4" />}>
                    Végétarien
                  </Badge>
                )}
              </div>

              {/* Price Badge */}
              <div className="absolute top-4 right-4 bg-surface/95 dark:bg-surface/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-soft-md border border-border dark:border-border transition-colors">
                <span className="text-2xl font-bold text-text-primary dark:text-text-primary transition-colors">
                  {product.price.toFixed(2)}€
                </span>
              </div>
            </div>

            {/* Category Tag */}
            <div className="flex items-center gap-2 text-text-secondary dark:text-text-secondary">
              <span className="px-3 py-1 bg-background-tertiary dark:bg-background-tertiary rounded-lg text-sm font-semibold uppercase tracking-wider border border-border dark:border-border transition-colors">
                {product.category}
              </span>
              {hasCustomization && (
                <span className="px-3 py-1 bg-brand-red/10 dark:bg-brand-red/20 text-brand-red dark:text-brand-red-light rounded-lg text-sm font-semibold flex items-center gap-1 transition-colors">
                  <Settings className="w-3.5 h-3.5" />
                  Personnalisable
                </span>
              )}
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            {/* Title & Description */}
            <motion.div variants={fadeInUp}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary dark:text-text-primary mb-3 transition-colors">
                {product.name}
              </h1>
              <p className="text-lg text-text-secondary dark:text-text-secondary leading-relaxed transition-colors">
                {product.description}
              </p>
            </motion.div>

            {/* Price Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-surface dark:bg-surface rounded-2xl p-5 shadow-soft-md border border-border dark:border-border transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary dark:text-text-secondary mb-1 transition-colors">Prix unitaire</p>
                  <p className="text-4xl font-black text-brand-red dark:text-brand-red-light transition-colors">
                    {product.price.toFixed(2)}€
                  </p>
                </div>
                {hasCustomization && (
                  <div className="text-right">
                    <p className="text-sm text-text-secondary dark:text-text-secondary mb-1">Options</p>
                    <p className="text-sm font-medium text-text-primary dark:text-text-primary">
                      Tailles & Extras disponibles
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <motion.div
                variants={fadeInUp}
                className="bg-surface dark:bg-surface rounded-2xl p-5 shadow-soft-md border border-border dark:border-border transition-colors"
              >
                <h2 className="text-lg font-bold text-text-primary dark:text-text-primary mb-4 flex items-center gap-2 transition-colors">
                  <ChefHat className="w-5 h-5 text-brand-red" />
                  Ingrédients
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => {
                    const iconColor = getIngredientColor(ingredient);
                    return (
                      <span
                        key={index}
                        className="bg-background-tertiary dark:bg-background-tertiary text-text-secondary dark:text-text-secondary px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border border-border dark:border-border transition-colors"
                      >
                        <IngredientIcon
                          ingredient={ingredient}
                          size={18}
                          style={{ color: iconColor }}
                        />
                        <span className="capitalize">{ingredient}</span>
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Quantity & Add to Cart */}
            <motion.div
              variants={fadeInUp}
              className="bg-surface dark:bg-surface rounded-2xl p-5 shadow-soft-md border border-border dark:border-border space-y-5 transition-colors"
            >
              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-semibold text-text-primary dark:text-text-primary mb-3 transition-colors">
                  Quantité
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-background-tertiary dark:bg-background-tertiary hover:bg-border dark:hover:bg-border text-text-primary dark:text-text-primary w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 border border-border dark:border-border"
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-3xl font-bold text-text-primary dark:text-text-primary w-16 text-center transition-colors">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-background-tertiary dark:bg-background-tertiary hover:bg-border dark:hover:bg-border text-text-primary dark:text-text-primary w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 border border-border dark:border-border"
                    aria-label="Augmenter la quantité"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.available}
                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-soft-md hover:shadow-soft-lg active:scale-98 ${
                  added
                    ? 'bg-brand-green text-white'
                    : 'bg-brand-red hover:bg-brand-red-hover text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {added ? (
                  <>
                    <Check className="w-6 h-6" />
                    Ajouté au panier !
                  </>
                ) : (
                  <>
                    {hasCustomization ? (
                      <>
                        <Settings className="w-6 h-6" />
                        Personnaliser • {(product.price * quantity).toFixed(2)}€
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-6 h-6" />
                        Ajouter au panier • {(product.price * quantity).toFixed(2)}€
                      </>
                    )}
                  </>
                )}
              </button>

              {!product.available && (
                <div className="bg-brand-red-lighter dark:bg-brand-red/20 border border-brand-red/30 dark:border-brand-red/40 rounded-xl p-4 text-center transition-colors">
                  <p className="text-brand-red dark:text-brand-red-light font-semibold transition-colors">
                    Produit temporairement indisponible
                  </p>
                </div>
              )}
            </motion.div>

            {/* Info Cards */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <div className="bg-background-tertiary dark:bg-background-tertiary rounded-xl p-4 border border-border dark:border-border text-center transition-colors">
                <ChefHat className="w-6 h-6 text-brand-red mx-auto mb-2" />
                <p className="text-sm font-medium text-text-primary dark:text-text-primary">Fait maison</p>
                <p className="text-xs text-text-secondary">Ingrédients frais</p>
              </div>
              <div className="bg-background-tertiary dark:bg-background-tertiary rounded-xl p-4 border border-border dark:border-border text-center transition-colors">
                <Clock className="w-6 h-6 text-brand-red mx-auto mb-2" />
                <p className="text-sm font-medium text-text-primary dark:text-text-primary">Préparation</p>
                <p className="text-xs text-text-secondary">15-20 min</p>
              </div>
              <div className="bg-background-tertiary dark:bg-background-tertiary rounded-xl p-4 border border-border dark:border-border text-center transition-colors">
                <Package className="w-6 h-6 text-brand-red mx-auto mb-2" />
                <p className="text-sm font-medium text-text-primary dark:text-text-primary">À emporter</p>
                <p className="text-xs text-text-secondary">Emballage éco</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Customization Modal */}
      {hasCustomization && product && (
        <PizzaCustomizationModal
          isOpen={isCustomizationOpen}
          onClose={() => setIsCustomizationOpen(false)}
          product={product}
          onAddToCart={handleCustomizedAddToCart}
        />
      )}
    </div>
  );
}
