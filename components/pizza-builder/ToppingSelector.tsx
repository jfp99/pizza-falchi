'use client';
import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';

interface ToppingSelectorProps {
  categories: any;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onAddTopping: (topping: any) => void;
  selectedToppings: any[];
}

export default function ToppingSelector({
  categories,
  activeCategory,
  onCategoryChange,
  onAddTopping,
  selectedToppings,
}: ToppingSelectorProps) {
  const categoryLabels = {
    bases: 'Bases',
    fromages: 'Fromages',
    viandes: 'Viandes',
    legumes: 'Légumes',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Choisissez vos Ingrédients
      </h3>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Object.keys(categories).map((category) => (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeCategory === category
                ? 'bg-gradient-to-r from-primary-red to-primary-yellow text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {categoryLabels[category as keyof typeof categoryLabels]}
          </motion.button>
        ))}
      </div>

      {/* Toppings Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {categories[activeCategory].map((topping: any) => {
          const isSelected = selectedToppings.find(t => t.id === topping.id);

          return (
            <motion.button
              key={topping.id}
              onClick={() => !isSelected && onAddTopping(topping)}
              disabled={isSelected}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 cursor-default'
                  : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-primary-red hover:shadow-md cursor-pointer'
              }`}
              whileHover={!isSelected ? { scale: 1.05 } : {}}
              whileTap={!isSelected ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Topping Icon */}
              <div className="text-3xl mb-2">{topping.icon}</div>

              {/* Topping Name */}
              <p className={`text-sm font-medium mb-1 ${
                isSelected
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-gray-900 dark:text-gray-100'
              }`}>
                {topping.name}
              </p>

              {/* Price */}
              <p className={`text-xs ${
                isSelected
                  ? 'text-green-600 dark:text-green-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                +{topping.price}€
              </p>

              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Check className="w-3 h-3" />
                </motion.div>
              )}

              {/* Add Button Overlay */}
              {!isSelected && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-red/0 to-primary-yellow/0 hover:from-primary-red/10 hover:to-primary-yellow/10 rounded-xl transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100"
                  initial={false}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                    <Plus className="w-4 h-4 text-primary-red" />
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}