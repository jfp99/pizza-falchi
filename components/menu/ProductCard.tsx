import { Plus, Star, Flame, Leaf } from 'lucide-react';
import { Product } from '@/types';
import Link from 'next/link';
import { useState, memo } from 'react';
import { IngredientIcon } from '@/components/icons/IngredientIcons';
import { ProductImage } from '@/components/menu/ProductImage';
import { motion } from 'framer-motion';
import { hoverLift, staggerItem } from '@/lib/animations';
import Badge from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = memo(function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  // Get color for ingredient type (matching PizzaPlaceholder logic)
  const getIngredientColor = (ingredient: string): string => {
    const lower = ingredient.toLowerCase();
    // Vegetables = green
    if (lower.includes('tomate') || lower.includes('poivron') || lower.includes('oignon') ||
        lower.includes('champignon') || lower.includes('basilic') || lower.includes('olive')) {
      return '#16A34A';
    }
    // Cheese = yellow/orange
    if (lower.includes('fromage') || lower.includes('mozzarella') || lower.includes('emmental') ||
        lower.includes('chèvre') || lower.includes('parmesan') || lower.includes('raclette')) {
      return '#F59E0B';
    }
    // Meats = red/brown
    if (lower.includes('jambon') || lower.includes('poulet') || lower.includes('viande') ||
        lower.includes('merguez') || lower.includes('chorizo') || lower.includes('lardons')) {
      return '#DC2626';
    }
    // Seafood = blue
    if (lower.includes('anchois') || lower.includes('thon') || lower.includes('saumon') ||
        lower.includes('fruits de mer')) {
      return '#0EA5E9';
    }
    // Default = brand red
    return '#E30613';
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
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <ProductImage
            product={product}
            className="w-full h-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </motion.div>
        
        {/* Badges */}
        <motion.div
          className="absolute top-3 left-3 flex gap-1.5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {product.popular && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge variant="popular" size="md" icon={<Star className="w-3 h-3 fill-current" />}>
                Populaire
              </Badge>
            </motion.div>
          )}
          {product.spicy && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge variant="spicy" size="md" icon={<Flame className="w-3 h-3" />}>
                Épicé
              </Badge>
            </motion.div>
          )}
          {product.vegetarian && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge variant="vegetarian" size="md" icon={<Leaf className="w-3 h-3" />}>
                Végétarien
              </Badge>
            </motion.div>
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

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <Link href={`/products/${product._id}`} className="space-y-2 mb-4 cursor-pointer">
          <h3 className="text-lg sm:text-xl font-semibold capitalize tracking-tight text-text-primary dark:text-text-primary line-clamp-1 group-hover:text-brand-red dark:group-hover:text-brand-red transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Ingredients with SVG Icons */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4 max-h-16 overflow-hidden">
            {product.ingredients.map(ingredient => {
              const iconColor = getIngredientColor(ingredient);
              return (
                <span
                  key={ingredient}
                  className="bg-background-tertiary dark:bg-background-tertiary text-text-secondary dark:text-text-secondary px-1.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 border border-border dark:border-border transition-colors"
                >
                  <IngredientIcon
                    ingredient={ingredient}
                    size={14}
                    style={{ color: iconColor }}
                  />
                  <span className="capitalize text-xs line-clamp-1">{ingredient}</span>
                </span>
              );
            })}
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
            transition={
              isAdded
                ? { duration: 0.3, ease: "easeInOut" }
                : { type: "spring", stiffness: 400, damping: 17 }
            }
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
});

export default ProductCard;