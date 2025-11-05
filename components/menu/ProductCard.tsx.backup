import { Plus, Star, Flame, Leaf } from 'lucide-react';
import { Product } from '@/types';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="45%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" fill="%23d1d5db"%3E🍕%3C/text%3E%3Ctext x="50%25" y="65%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="%239ca3af" font-weight="600"%3E' + encodeURIComponent(product.category === 'boisson' ? '🥤' : product.category === 'dessert' ? '🍰' : '🍕') + '%3C/text%3E%3C/svg%3E';

  const [imageSrc, setImageSrc] = useState(product.image || placeholderImage);

  const getIngredientIcon = (ingredient: string) => {
    const lowerIngredient = ingredient.toLowerCase();
    const icons: { [key: string]: string } = {
      // Fromages
      'mozzarella': '🧀', 'emmental': '🧀', 'chèvre': '🐐', 'roquefort': '🧀',
      'parmesan': '🧀', 'raclette': '🧀', 'brousse': '🧀',

      // Légumes
      'tomate': '🍅', 'tomates fraîches': '🍅', 'tomates cerise': '🍅',
      'tomate fraîche': '🍅', 'champignons': '🍄', 'champignons de paris': '🍄',
      'poivron': '🫑', 'poivrons': '🫑', 'oignons': '🧅', 'ail': '🧄',
      'aubergines grillées': '🍆', 'artichauts': '🥬', 'olives': '🫒',

      // Herbes et Épices
      'basilic': '🌿', 'persil': '🌿', 'herbes de provence': '🌿', 'câpres': '🌿',

      // Viandes
      'jambon': '🥓', 'jambon cru': '🥓', 'lardons': '🥓', 'chorizo': '🌶️',
      'merguez': '🌶️', 'viande hachée': '🥩', 'viande kebab': '🥙',
      'poulet': '🍗', 'figatelli': '🥩',

      // Poissons
      'anchois': '🐟', 'thon': '🐟', 'saumon': '🐟', 'fruits de mer': '🦐',

      // Autres
      'oeuf': '🥚', 'miel': '🍯', 'crème fraîche': '🥛', 'sauce curry': '🍛',
      "huile d'olive": '🫒', 'amandes': '🌰',
    };
    return icons[lowerIngredient] || '✨';
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
      <Link href={`/products/${product._id}`} className="relative overflow-hidden aspect-[4/3] cursor-pointer bg-gray-100">
        <img
          src={imageSrc}
          alt={`${product.name} - ${product.description}`}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
          onError={() => {
            if (!imageError) {
              setImageError(true);
              setImageSrc(placeholderImage);
            }
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {product.popular && (
            <span className="bg-primary-yellow text-charcoal px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <Star className="w-3 h-3 fill-current" />
              <span>Populaire</span>
            </span>
          )}
          {product.spicy && (
            <span className="bg-primary-red text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <Flame className="w-3 h-3" />
              <span>Épicé</span>
            </span>
          )}
          {product.vegetarian && (
            <span className="bg-basil-light text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <Leaf className="w-3 h-3" />
              <span>Végétarien</span>
            </span>
          )}
        </div>

        {/* Price */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-xl border border-gray-200">
          <span className="text-xl font-bold text-gray-900">
            {product.price}€
          </span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link href={`/products/${product._id}`} className="space-y-2 mb-4 cursor-pointer">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-gray-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </Link>

        {/* Ingredients */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {product.ingredients.map(ingredient => (
              <span
                key={ingredient}
                className="bg-gray-50 text-gray-700 px-1.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 border border-gray-200"
              >
                <span className="text-xs">{getIngredientIcon(ingredient)}</span>
                <span className="capitalize text-xs">{ingredient}</span>
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto space-y-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={!product.available}
            suppressHydrationWarning
            aria-label={`Ajouter ${product.name} au panier`}
            className="w-full lg:w-auto lg:px-6 bg-gradient-to-r from-charcoal to-gray-800 hover:from-primary-red hover:to-primary-yellow text-white hover:text-charcoal py-3 rounded-xl font-bold flex items-center justify-center lg:justify-start gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm shadow-lg hover:shadow-2xl hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter au panier</span>
          </button>

          {!product.available && (
            <div className="bg-gray-100 border border-gray-300 rounded-xl p-3 text-center">
              <p className="text-gray-600 font-medium text-sm">Indisponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}