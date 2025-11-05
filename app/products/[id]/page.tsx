'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, Plus, Minus, ShoppingCart, Star, Flame, Leaf, Check } from 'lucide-react';
import Link from 'next/link';
import { IngredientIcon } from '@/components/icons/IngredientIcons';
import { PizzaSliceIcon, DrinkIcon, DessertIcon, CheckIcon } from '@/components/icons/CategoryIcons';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

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

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-warm-cream dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-red dark:border-primary-red-light border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400 transition-colors">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-warm-cream dark:bg-gray-900 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au menu
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
              <img
                src={product.image || '/images/pizza-placeholder.jpg'}
                alt={`${product.name} - ${product.description}`}
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.popular && (
                  <span className="bg-yellow-500 dark:bg-yellow-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg transition-colors">
                    <Star className="w-4 h-4 fill-current" />
                    Populaire
                  </span>
                )}
                {product.spicy && (
                  <span className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg transition-colors">
                    <Flame className="w-4 h-4" />
                    Épicé
                  </span>
                )}
                {product.vegetarian && (
                  <span className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg transition-colors">
                    <Leaf className="w-4 h-4" />
                    Végétarien
                  </span>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 transition-colors">
              <div className="text-gray-600 dark:text-gray-300 transition-colors">
                {product.category === 'pizza' && <PizzaSliceIcon size={24} />}
                {product.category === 'boisson' && <DrinkIcon size={24} />}
                {product.category === 'dessert' && <DessertIcon size={24} />}
                {product.category === 'accompagnement' && <PizzaSliceIcon size={24} />}
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider">
                {product.category}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-black text-gray-900 dark:text-gray-100 mb-4 transition-colors">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
              <p className="text-gray-600 dark:text-gray-400 mb-2 transition-colors">Prix</p>
              <p className="text-5xl font-black text-gray-900 dark:text-gray-100 transition-colors">
                {product.price.toFixed(2)}€
              </p>
            </div>

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors">Ingrédients</h2>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border border-gray-200 dark:border-gray-600 transition-colors"
                    >
                      <IngredientIcon
                        ingredient={ingredient}
                        size={18}
                        className="text-gray-600 dark:text-gray-400 transition-colors"
                      />
                      <span className="capitalize">{ingredient}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 space-y-6 transition-colors">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-3 transition-colors">Quantité</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 w-12 h-12 rounded-xl flex items-center justify-center transition-colors font-bold"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100 w-16 text-center transition-colors">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 w-12 h-12 rounded-xl flex items-center justify-center transition-colors font-bold"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.available}
                className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  added
                    ? 'bg-green-500 dark:bg-green-600 text-white'
                    : 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {added ? (
                  <>
                    <Check className="w-6 h-6" />
                    Ajouté au panier !
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    Ajouter au panier • {(product.price * quantity).toFixed(2)}€
                  </>
                )}
              </button>

              {!product.available && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center transition-colors">
                  <p className="text-red-600 dark:text-red-400 font-semibold transition-colors">Produit temporairement indisponible</p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 transition-colors">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 transition-colors">Informations</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 transition-colors">
                <li className="flex items-start gap-2">
                  <CheckIcon size={18} className="text-green-500 dark:text-green-400 mt-0.5 transition-colors" />
                  <span>Préparé avec des ingrédients frais</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon size={18} className="text-green-500 dark:text-green-400 mt-0.5 transition-colors" />
                  <span>Disponible en livraison et à emporter</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon size={18} className="text-green-500 dark:text-green-400 mt-0.5 transition-colors" />
                  <span>Cuisson au feu de bois</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
