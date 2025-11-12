'use client';
import { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { X, ShoppingCart, Sparkles, ChefHat } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import PizzaCanvas from './PizzaCanvas';
import ToppingSelector from './ToppingSelector';
import SizeSelector from './SizeSelector';
import CrustSelector from './CrustSelector';
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

interface PizzaBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PizzaBuilderModal({ isOpen, onClose }: PizzaBuilderModalProps) {
  const { addItem } = useCart();
  const { theme } = useTheme();
  const [selectedSize, setSelectedSize] = useState(SIZES[1]);
  const [selectedCrust, setSelectedCrust] = useState(CRUSTS[0]);
  const [selectedToppings, setSelectedToppings] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('bases');
  const [pizzaName, setPizzaName] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedToppings([]);
      setPizzaName('');
      setActiveCategory('bases');
    }
  }, [isOpen]);

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
      image: '/images/pizzas/custom-pizza.jpg',
      ingredients: selectedToppings.map(t => t.name),
      available: true,
    };

    addItem(customPizza);
    toast.success('Pizza ajoutée au panier!', {
      icon: '🍕',
      duration: 3000,
    });
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-warm-cream via-white to-primary-yellow/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-2xl transition-all">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-primary-red to-primary-yellow rounded-xl">
                          <ChefHat className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            Créez Votre Pizza
                            <Sparkles className="w-5 h-5 text-primary-yellow" />
                          </Dialog.Title>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Personnalisez chaque détail de votre pizza artisanale
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right bg-gradient-to-br from-primary-red/10 to-primary-yellow/10 dark:from-primary-red/20 dark:to-primary-yellow/20 px-4 py-2 rounded-xl border border-primary-red/20 dark:border-primary-red/30">
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-primary-red to-primary-yellow bg-clip-text text-transparent">
                            {calculateTotal().toFixed(2)}€
                          </p>
                        </div>
                        <button
                          onClick={onClose}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        >
                          <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[calc(100vh-180px)] overflow-y-auto">
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left: Pizza Preview & Selected Toppings */}
                    <div className="space-y-6">
                      {/* Pizza Canvas */}
                      <div className="h-full flex flex-col">
                        <PizzaCanvas
                          size={selectedSize}
                          crust={selectedCrust}
                          toppings={selectedToppings}
                          theme={theme}
                        />

                        {/* Selected Toppings List */}
                        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 flex-grow">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary-red rounded-full"></span>
                            Ingrédients Sélectionnés
                            <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">
                              {selectedToppings.length} / ∞
                            </span>
                          </h3>
                          {selectedToppings.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <ChefHat className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Commencez à composer votre pizza
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                              <AnimatePresence mode="popLayout">
                                {selectedToppings.map((topping) => (
                                  <motion.div
                                    key={topping.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-primary-red dark:hover:border-primary-red transition-all group"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-2xl">{topping.icon}</span>
                                      <div>
                                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block">
                                          {topping.name}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          +{topping.price.toFixed(2)}€
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => removeTopping(topping.id)}
                                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                      <X className="w-4 h-4 text-red-500" />
                                    </button>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Customization Options */}
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
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                        <label htmlFor="pizza-name" className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary-yellow rounded-full"></span>
                          Nommez Votre Création
                          <span className="ml-auto text-xs font-normal text-gray-400">(Optionnel)</span>
                        </label>
                        <input
                          id="pizza-name"
                          type="text"
                          value={pizzaName}
                          onChange={(e) => setPizzaName(e.target.value)}
                          placeholder="Ex: La Spéciale de Jean..."
                          maxLength={40}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all"
                        />
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
                          {pizzaName.length}/40 caractères
                        </p>
                      </div>

                      {/* Add to Cart Button */}
                      <motion.button
                        onClick={handleAddToCart}
                        disabled={selectedToppings.length === 0}
                        className="w-full bg-gradient-to-r from-primary-red via-primary-red to-primary-yellow text-white font-bold py-5 px-6 rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
                        whileHover={{ scale: selectedToppings.length > 0 ? 1.02 : 1 }}
                        whileTap={{ scale: selectedToppings.length > 0 ? 0.98 : 1 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-yellow to-primary-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <ShoppingCart className="w-6 h-6 relative z-10" />
                        <span className="text-lg relative z-10">
                          Ajouter au Panier • {calculateTotal().toFixed(2)}€
                        </span>
                        <Sparkles className="w-5 h-5 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>

                      {selectedToppings.length === 0 && (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                          Ajoutez au moins un ingrédient pour continuer
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
