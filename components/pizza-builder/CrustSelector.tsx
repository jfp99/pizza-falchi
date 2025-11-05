'use client';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';

interface CrustSelectorProps {
  crusts: any[];
  selected: any;
  onSelect: (crust: any) => void;
}

export default function CrustSelector({ crusts, selected, onSelect }: CrustSelectorProps) {
  const crustIcons = {
    classic: '🍞',
    thin: '🥖',
    thick: '🥐',
    cheesy: '🧀',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Type de Pâte
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {crusts.map((crust) => (
          <motion.button
            key={crust.id}
            onClick={() => onSelect(crust)}
            className={`relative p-4 rounded-xl border-2 transition-all text-left ${
              selected.id === crust.id
                ? 'border-primary-red bg-primary-red/10 dark:bg-primary-red/20'
                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-primary-yellow'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-3">
              {/* Crust Icon */}
              <div className="text-2xl">
                {crustIcons[crust.id as keyof typeof crustIcons]}
              </div>

              <div className="flex-1">
                {/* Crust Name */}
                <p className={`font-medium mb-1 ${
                  selected.id === crust.id
                    ? 'text-primary-red'
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {crust.name}
                </p>

                {/* Description */}
                <p className={`text-xs mb-2 ${
                  selected.id === crust.id
                    ? 'text-primary-red/70'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {crust.description}
                </p>

                {/* Price */}
                {crust.price > 0 && (
                  <p className={`text-sm font-bold ${
                    selected.id === crust.id
                      ? 'text-primary-red'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    +{crust.price}€
                  </p>
                )}
              </div>
            </div>

            {/* Selected Indicator */}
            {selected.id === crust.id && (
              <motion.div
                className="absolute top-2 right-2 bg-primary-red text-white rounded-full p-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Check className="w-3 h-3" />
              </motion.div>
            )}

            {/* Popular Badge */}
            {crust.id === 'classic' && (
              <div className="absolute top-2 right-2 bg-primary-yellow text-charcoal px-2 py-1 rounded-full text-xs font-bold">
                Populaire
              </div>
            )}

            {/* New Badge */}
            {crust.id === 'cheesy' && (
              <div className="absolute top-2 right-2 bg-gradient-to-r from-primary-red to-primary-yellow text-white px-2 py-1 rounded-full text-xs font-bold">
                Nouveau
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            La pâte classique est notre recette traditionnelle, parfaite pour tous les goûts!
          </p>
        </div>
      </div>
    </div>
  );
}