'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShoppingCart, Info, Plus, Minus, Check, X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import PizzaCanvas from '@/components/pizza-builder/PizzaCanvas';
import ToppingSelector from '@/components/pizza-builder/ToppingSelector';
import SizeSelector from '@/components/pizza-builder/SizeSelector';
import CrustSelector from '@/components/pizza-builder/CrustSelector';
import toast from 'react-hot-toast';

// Topping categories with prices
const TOPPINGS = {
  bases: [
    { id: 'tomato', name: 'Sauce Tomate', price: 0, icon: '🍅', color: '#FF6B6B' },
    { id: 'cream', name: 'Crème Fraîche', price: 0.5, icon: '🥛', color: '#FFFFFF' },
    { id: 'bbq', name: 'Sauce BBQ', price: 1, icon: '🍖', color: '#8B4513' },
    { id: 'pesto', name: 'Pesto', price: 1.5, icon: '🌿', color: '#228B22' },
  ],
  fromages: [
    { id: 'mozzarella', name: 'Mozzarella', price: 2, icon: '🧀', color: '#FFF8DC' },
    { id: 'chevre', name: 'Chèvre', price: 2.5, icon: '🐐', color: '#FAFAD2' },
    { id: 'gorgonzola', name: 'Gorgonzola', price: 3, icon: '🧀', color: '#4169E1' },
    { id: 'parmesan', name: 'Parmesan', price: 2, icon: '🧀', color: '#FFD700' },
  ],
  viandes: [
    { id: 'pepperoni', name: 'Pepperoni', price: 3, icon: '🍕', color: '#DC143C' },
    { id: 'jambon', name: 'Jambon', price: 2.5, icon: '🍖', color: '#FFB6C1' },
    { id: 'chorizo', name: 'Chorizo', price: 3.5, icon: '🌶️', color: '#B22222' },
    { id: 'poulet', name: 'Poulet', price: 3, icon: '🍗', color: '#DEB887' },
    { id: 'bacon', name: 'Bacon', price: 3.5, icon: '🥓', color: '#A0522D' },
  ],
  legumes: [
    { id: 'champignons', name: 'Champignons', price: 1.5, icon: '🍄', color: '#D2691E' },
    { id: 'oignons', name: 'Oignons', price: 1, icon: '🧅', color: '#FFE4E1' },
    { id: 'poivrons', name: 'Poivrons', price: 1.5, icon: '🫑', color: '#FF0000' },
    { id: 'olives', name: 'Olives', price: 2, icon: '🫒', color: '#556B2F' },
    { id: 'tomates-cerises', name: 'Tomates Cerises', price: 2, icon: '🍅', color: '#FF6347' },
    { id: 'roquette', name: 'Roquette', price: 1.5, icon: '🥬', color: '#90EE90' },
  ],
};

const SIZES = [
  { id: 'small', name: 'Petite', size: 26, price: 8, icon: 'S' },
  { id: 'medium', name: 'Moyenne', size: 31, price: 12, icon: 'M' },
  { id: 'large', name: 'Grande', size: 36, price: 16, icon: 'L' },
  { id: 'xlarge', name: 'Familiale', size: 41, price: 22, icon: 'XL' },
];

const CRUSTS = [
  { id: 'classic', name: 'Classique', price: 0, description: 'Pâte traditionnelle' },
  { id: 'thin', name: 'Fine', price: 0, description: 'Pâte extra fine et croustillante' },
  { id: 'thick', name: 'Épaisse', price: 2, description: 'Pâte moelleuse et généreuse' },
  { id: 'cheesy', name: 'Fromage', price: 3, description: 'Croûte fourrée au fromage' },
];

export default function PizzaBuilderPage() {
  const { addItem } = useCart();
  const { theme } = useTheme();
  const [selectedSize, setSelectedSize] = useState(SIZES[1]);
  const [selectedCrust, setSelectedCrust] = useState(CRUSTS[0]);
  const [selectedToppings, setSelectedToppings] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('bases');
  const [pizzaName, setPizzaName] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);

  // Calculate total price
  const calculateTotal = () => {
    const toppingsPrice = selectedToppings.reduce((acc, topping) => acc + topping.price, 0);
    return selectedSize.price + selectedCrust.price + toppingsPrice;
  };

  // Add topping
  const addTopping = (topping: any) => {
    if (selectedToppings.find(t => t.id === topping.id)) {
      toast.error('Déjà ajouté!');
      return;
    }
    setSelectedToppings([...selectedToppings, topping]);
    toast.success(`${topping.name} ajouté!`);
  };

  // Remove topping
  const removeTopping = (toppingId: string) => {
    setSelectedToppings(selectedToppings.filter(t => t.id !== toppingId));
    toast.success('Ingrédient retiré!');
  };

  // Add to cart
  const handleAddToCart = () => {
    const customPizza = {
      _id: `custom-${Date.now()}`,
      name: pizzaName || `Pizza Personnalisée (${selectedSize.name})`,
      description: selectedToppings.map(t => t.name).join(', '),
      price: calculateTotal(),
      category: 'pizza' as const,
      image: '/images/pizzas/custom-pizza.jpg', // Default image for custom pizzas
      ingredients: selectedToppings.map(t => t.name),
      available: true,
    };

    addItem(customPizza);
    toast.success('Pizza ajoutée au panier!');

    // Reset builder
    setSelectedToppings([]);
    setPizzaName('');
    setIsBuilding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream via-white to-primary-yellow/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/menu"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Créez Votre Pizza
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Personnalisez chaque détail de votre pizza
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-primary-red">
                  {calculateTotal().toFixed(2)}€
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Pizza Canvas */}
          <div className="lg:sticky lg:top-24 h-fit">
            <PizzaCanvas
              size={selectedSize}
              crust={selectedCrust}
              toppings={selectedToppings}
              theme={theme}
            />

            {/* Selected Toppings List */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Ingrédients Sélectionnés
              </h3>
              {selectedToppings.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  Aucun ingrédient sélectionné
                </p>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {selectedToppings.map((topping) => (
                      <motion.div
                        key={topping.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{topping.icon}</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {topping.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            +{topping.price}€
                          </span>
                          <button
                            onClick={() => removeTopping(topping.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Right: Controls */}
          <div className="space-y-6">
            {/* Size Selector */}
            <SizeSelector
              sizes={SIZES}
              selected={selectedSize}
              onSelect={setSelectedSize}
            />

            {/* Crust Selector */}
            <CrustSelector
              crusts={CRUSTS}
              selected={selectedCrust}
              onSelect={setSelectedCrust}
            />

            {/* Toppings Selector */}
            <ToppingSelector
              categories={TOPPINGS}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onAddTopping={addTopping}
              selectedToppings={selectedToppings}
            />

            {/* Name Your Pizza */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Nommez Votre Création
              </h3>
              <input
                type="text"
                value={pizzaName}
                onChange={(e) => setPizzaName(e.target.value)}
                placeholder="Ex: La Spéciale de Jean..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-red transition-colors"
              />
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={selectedToppings.length === 0}
              className="w-full bg-gradient-to-r from-primary-red to-primary-yellow text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="text-lg">
                Ajouter au Panier • {calculateTotal().toFixed(2)}€
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}