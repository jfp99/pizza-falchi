/**
 * Featured Product Card - Pizza Falchi
 * Special card for Stars/Best-Sellers with golden highlights
 * Uses menu engineering psychology for premium presentation
 */

'use client';

import { Plus, Star, Flame, Leaf, Settings } from 'lucide-react';
import { Product } from '@/types';
import Link from 'next/link';
import { useState, memo, useEffect, useRef, useCallback } from 'react';
import { ProductImage } from '@/components/menu/ProductImage';
import { motion, useReducedMotion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import PizzaCustomizationModal from './PizzaCustomizationModal';
import { formatPrice } from '@/lib/menuHelpers';
import { colors } from '@/lib/design-tokens';

interface FeaturedProductCardProps {
  product: Product;
  onAddToCart: (
    product: Product,
    customizations?: { size: 'medium' | 'large'; extras: string[]; cut?: boolean },
    calculatedPrice?: number
  ) => void;
}

const FeaturedProductCard = memo(function FeaturedProductCard({
  product,
  onAddToCart,
}: FeaturedProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const isPizza = product.category === 'pizza';
  const hasCustomization =
    isPizza &&
    (product.sizeOptions ||
      (product.availableExtras && product.availableExtras.length > 0));

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const triggerAddedFeedback = useCallback(() => {
    setIsAdded(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setIsAdded(false), 1000);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (hasCustomization) {
      setIsCustomizationOpen(true);
    } else {
      onAddToCart(product);
      triggerAddedFeedback();
    }
  }, [hasCustomization, onAddToCart, product, triggerAddedFeedback]);

  const handleCustomizedAddToCart = useCallback((
    product: Product,
    customizations: { size: 'medium' | 'large'; extras: string[]; cut: boolean },
    calculatedPrice: number
  ) => {
    onAddToCart(product, customizations, calculatedPrice);
    triggerAddedFeedback();
  }, [onAddToCart, triggerAddedFeedback]);

  // Animation variants respecting reduced motion preference
  const cardVariants = {
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
  };

  return (
    <motion.article
      initial="initial"
      animate="animate"
      variants={cardVariants}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.3 }}
      className={`group relative rounded-2xl overflow-hidden h-full flex flex-col transition-all focus-within:ring-2 focus-within:ring-offset-2 ${
        shouldReduceMotion ? '' : 'hover:-translate-y-1'
      }`}
      style={{
        backgroundColor: colors.soft.yellowLighter,
        border: `2px solid ${colors.accent.gold}`,
        boxShadow: '0 0 20px rgba(212, 175, 55, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08)',
        transitionDuration: shouldReduceMotion ? '0ms' : '300ms',
      }}
    >
      {/* Golden Corner Accent */}
      <div
        className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 50%, rgba(212, 175, 55, 0.15) 50%)',
        }}
        aria-hidden="true"
      />

      {/* Image Section */}
      <Link
        href={`/products/${product._id}`}
        className="relative overflow-hidden aspect-[4/3] cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-gold"
        style={{ backgroundColor: colors.soft.yellow }}
      >
        <motion.div
          className="w-full h-full"
          whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' }}
        >
          <ProductImage
            product={product}
            className="w-full h-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </motion.div>

        {/* Star Badge (Top Left) */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="star"
            size="md"
            icon={<Star className="w-3.5 h-3.5 fill-current" />}
          >
            Best-Seller
          </Badge>
        </div>

        {/* Dietary Badges (Top Right) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {product.spicy && (
            <Badge variant="spicy" size="sm" icon={<Flame className="w-3 h-3" />}>
              Epice
            </Badge>
          )}
          {product.vegetarian && (
            <Badge variant="vegetarian" size="sm" icon={<Leaf className="w-3 h-3" />}>
              Vege
            </Badge>
          )}
        </div>

        {/* Price Badge (Bottom Right) - Menu Engineering: no EUR symbol */}
        <div
          className="absolute bottom-3 right-3 px-4 py-2 rounded-xl backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(254, 252, 248, 0.95)',
            border: `1.5px solid ${colors.accent.gold}`,
          }}
        >
          <span
            className="text-xl font-bold"
            style={{ color: colors.charcoal }}
          >
            {formatPrice(product.price)}
          </span>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <Link
          href={`/products/${product._id}`}
          className="mb-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 rounded"
        >
          <h3
            className="text-xl font-bold capitalize tracking-tight line-clamp-1 group-hover:text-brand-red transition-colors"
            style={{ color: colors.charcoal }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Description - longer for Stars (menu psychology) - improved contrast */}
        {product.description && (
          <p
            className="text-sm leading-relaxed mb-3 line-clamp-2"
            style={{ color: colors.gray[700] }}
          >
            {product.description}
          </p>
        )}

        {/* Ingredients List - improved contrast */}
        {product.ingredients && product.ingredients.length > 0 && (
          <p
            className="text-xs mb-4 line-clamp-2"
            style={{ color: colors.gray[600] }}
          >
            {product.ingredients.join(', ')}
          </p>
        )}

        {/* Add to Cart Button */}
        <div className="mt-auto">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={!product.available}
            aria-label={`Ajouter ${product.name} au panier`}
            className={`w-full min-h-[44px] py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              isAdded
                ? 'bg-basil-green text-white focus-visible:ring-basil-green'
                : 'bg-brand-red hover:bg-brand-red-dark text-white focus-visible:ring-brand-red'
            }`}
            style={{
              boxShadow: '0 2px 8px rgba(196, 30, 26, 0.2)',
              transitionDuration: shouldReduceMotion ? '0ms' : '200ms',
            }}
          >
            {hasCustomization ? (
              <Settings className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Plus className="w-4 h-4" aria-hidden="true" />
            )}
            <span>
              {isAdded
                ? 'Ajoute!'
                : hasCustomization
                ? 'Personnaliser'
                : 'Ajouter au panier'}
            </span>
          </button>

          {!product.available && (
            <div
              className="mt-2 rounded-xl p-3 text-center"
              style={{ backgroundColor: colors.soft.yellow, color: colors.gray[600] }}
            >
              <p className="font-medium text-sm">Indisponible</p>
            </div>
          )}
        </div>
      </div>

      {/* Customization Modal */}
      {hasCustomization && (
        <PizzaCustomizationModal
          isOpen={isCustomizationOpen}
          onClose={() => setIsCustomizationOpen(false)}
          product={product}
          onAddToCart={handleCustomizedAddToCart}
        />
      )}
    </motion.article>
  );
});

export default FeaturedProductCard;
