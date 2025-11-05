import { Plus, Star, Flame, Leaf } from 'lucide-react';
import { Product } from '@/types';
import Link from 'next/link';
import { useState } from 'react';
import { IngredientIcon } from '@/components/icons/IngredientIcons';
import { motion } from 'framer-motion';
import { hoverLift, staggerItem } from '@/lib/animations';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Professional SVG placeholder without emojis
  const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Cpath d="M180 130 c0-16 8-28 20-28s20 12 20 28-8 28-20 28-20-12-20-28z" fill="%23d1d5db"/%3E%3Cpath d="M200 102 c0-8 0-12 0-12s8 4 12 12" stroke="%23d1d5db" stroke-width="2" fill="none"/%3E%3Cpath d="M200 102 c0-8 0-12 0-12s-8 4-12 12" stroke="%23d1d5db" stroke-width="2" fill="none"/%3E%3C/svg%3E';

  const [imageSrc, setImageSrc] = useState(product.image || placeholderImage);

  const handleAddToCart = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };


  return (
    <motion.div
      variants={staggerItem}
      whileHover="hover"
      whileTap="tap"
      initial="initial"
      animate="animate"
      exit="exit"
      className="group bg-surface dark:bg-surface rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-brand-red/10 border border-border dark:border-border overflow-hidden h-full flex flex-col transition-colors duration-300">
      <Link href={`/products/${product._id}`} className="relative overflow-hidden aspect-[4/3] cursor-pointer bg-background-secondary dark:bg-background-tertiary">
        <motion.img
          src={imageSrc}
          alt={`${product.name} - ${product.description}`}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          loading="lazy"
          onError={() => {
            if (!imageError) {
              setImageError(true);
              setImageSrc(placeholderImage);
            }
          }}
        />
        
        {/* Badges */}
        <motion.div
          className="absolute top-3 left-3 flex gap-1.5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {product.popular && (
            <motion.span
              className="bg-brand-gold text-text-on-dark px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star className="w-3 h-3 fill-current" />
              <span>Populaire</span>
            </motion.span>
          )}
          {product.spicy && (
            <motion.span
              className="bg-brand-red text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Flame className="w-3 h-3" />
              <span>Épicé</span>
            </motion.span>
          )}
          {product.vegetarian && (
            <motion.span
              className="bg-brand-green text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Leaf className="w-3 h-3" />
              <span>Végétarien</span>
            </motion.span>
          )}
        </motion.div>

        {/* Price */}
        <motion.div
          className="absolute top-3 right-3 bg-surface/95 dark:bg-surface/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-xl border border-border dark:border-border transition-colors"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-xl font-bold text-text-primary dark:text-text-primary transition-colors">
            {product.price}€
          </span>
        </motion.div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link href={`/products/${product._id}`} className="space-y-2 mb-4 cursor-pointer">
          <h3 className="text-xl font-bold text-text-primary dark:text-text-primary line-clamp-1 group-hover:text-brand-red dark:group-hover:text-brand-red transition-colors">
            {product.name}
          </h3>
          <p className="text-text-secondary dark:text-text-secondary text-sm leading-relaxed line-clamp-2 transition-colors">
            {product.description}
          </p>
        </Link>

        {/* Ingredients with SVG Icons */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {product.ingredients.map(ingredient => (
              <span
                key={ingredient}
                className="bg-background-tertiary dark:bg-background-tertiary text-text-secondary dark:text-text-secondary px-1.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 border border-border dark:border-border transition-colors"
              >
                <IngredientIcon
                  ingredient={ingredient}
                  size={14}
                  className="text-text-tertiary dark:text-text-tertiary transition-colors"
                />
                <span className="capitalize text-xs">{ingredient}</span>
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto space-y-3">
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={!product.available}
            suppressHydrationWarning
            aria-label={`Ajouter ${product.name} au panier`}
            className={`w-full lg:w-auto lg:px-6 py-3 rounded-xl font-bold flex items-center justify-center lg:justify-start gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm shadow-lg hover:shadow-2xl transition-colors ${
              isAdded
                ? 'bg-brand-green text-white'
                : 'bg-brand-red hover:bg-brand-red-hover text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isAdded ? { scale: [1, 1.2, 1] } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              animate={isAdded ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Plus className="w-4 h-4" />
            </motion.div>
            <span>{isAdded ? 'Ajouté!' : 'Ajouter au panier'}</span>
          </motion.button>

          {!product.available && (
            <div className="bg-background-secondary dark:bg-background-tertiary border border-border-medium dark:border-border-medium rounded-xl p-3 text-center transition-colors">
              <p className="text-text-secondary dark:text-text-secondary font-medium text-sm transition-colors">Indisponible</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}