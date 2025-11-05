'use client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SizeSelectorProps {
  sizes: any[];
  selected: any;
  onSelect: (size: any) => void;
}

export default function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Choisissez la Taille
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {sizes.map((size) => (
          <motion.button
            key={size.id}
            onClick={() => onSelect(size)}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              selected.id === size.id
                ? 'border-primary-red bg-primary-red/10 dark:bg-primary-red/20'
                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-primary-yellow'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Size Icon */}
            <div className={`text-3xl font-bold mb-2 ${
              selected.id === size.id
                ? 'text-primary-red'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {size.icon}
            </div>

            {/* Size Name */}
            <p className={`text-sm font-medium mb-1 ${
              selected.id === size.id
                ? 'text-primary-red'
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              {size.name}
            </p>

            {/* Size Details */}
            <p className={`text-xs ${
              selected.id === size.id
                ? 'text-primary-red/70'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {size.size}cm
            </p>

            {/* Price */}
            <p className={`text-lg font-bold mt-2 ${
              selected.id === size.id
                ? 'text-primary-red'
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              {size.price}€
            </p>

            {/* Selected Indicator */}
            {selected.id === size.id && (
              <motion.div
                className="absolute top-2 right-2 bg-primary-red text-white rounded-full p-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Check className="w-3 h-3" />
              </motion.div>
            )}

            {/* Visual Size Indicator */}
            <motion.div
              className="absolute bottom-2 left-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 * sizes.indexOf(size) }}
            >
              <div
                className={`rounded-full ${
                  selected.id === size.id
                    ? 'bg-primary-red/30'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                style={{
                  width: `${8 + sizes.indexOf(size) * 4}px`,
                  height: `${8 + sizes.indexOf(size) * 4}px`,
                }}
              />
            </motion.div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}