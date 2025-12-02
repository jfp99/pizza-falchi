'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '@/components/ui/Badge';

interface PizzaCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart: (product: Product, customizations: { size: 'medium' | 'large'; extras: string[]; cut: boolean }, calculatedPrice: number) => void;
}

export default function PizzaCustomizationModal({
  isOpen,
  onClose,
  product,
  onAddToCart,
}: PizzaCustomizationModalProps) {
  const [selectedSize, setSelectedSize] = useState<'medium' | 'large'>('medium');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [cutPizza, setCutPizza] = useState<boolean>(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const addToCartButtonRef = useRef<HTMLButtonElement>(null);

  // Handle Escape key to close modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    // Add escape key listener
    document.addEventListener('keydown', handleKeyDown);

    // Focus the close button when modal opens
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Focus trap - keep focus within modal
  const handleTabKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement?.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement?.focus();
    }
  }, []);

  const calculatedPrice = useMemo(() => {
    let price = product.price;

    // Add size modifier
    if (product.sizeOptions) {
      price += product.sizeOptions[selectedSize].priceModifier;
    }

    // Add extras
    if (product.availableExtras && selectedExtras.length > 0) {
      selectedExtras.forEach(extraName => {
        const extra = product.availableExtras?.find(e => e.name === extraName);
        if (extra) {
          price += extra.price;
        }
      });
    }

    return price;
  }, [product, selectedSize, selectedExtras]);

  const handleToggleExtra = (extraName: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraName)
        ? prev.filter(e => e !== extraName)
        : [...prev, extraName]
    );
  };

  const handleAddToCart = () => {
    onAddToCart(
      product,
      { size: selectedSize, extras: selectedExtras, cut: cutPizza },
      calculatedPrice
    );
    onClose();
    // Reset selections
    setSelectedSize('medium');
    setSelectedExtras([]);
    setCutPizza(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pizza-modal-title"
            onKeyDown={handleTabKey}
          >
            <div
              ref={modalRef}
              className="bg-surface dark:bg-surface rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-2 border-border dark:border-border"
            >
              {/* Header */}
              <div className="sticky top-0 bg-surface dark:bg-surface border-b border-border dark:border-border p-6 flex items-center justify-between z-10">
                <h2 id="pizza-modal-title" className="text-2xl font-bold text-text-primary dark:text-text-primary">
                  Personnaliser votre pizza
                </h2>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-background-secondary dark:hover:bg-background-tertiary rounded-xl transition-colors"
                  aria-label="Fermer la fenêtre de personnalisation"
                >
                  <X className="w-6 h-6 text-text-secondary" aria-hidden="true" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Product Info */}
                <div>
                  <h3 className="text-xl font-bold text-text-primary dark:text-text-primary mb-2">
                    {product.name}
                  </h3>
                  <p className="text-text-secondary dark:text-text-secondary text-sm">
                    {product.description}
                  </p>
                </div>

                {/* Size Selection */}
                {product.sizeOptions && (
                  <fieldset>
                    <legend className="block text-sm font-bold text-text-primary dark:text-text-primary mb-3">
                      Taille
                    </legend>
                    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Sélectionner la taille">
                      {/* Medium */}
                      {product.sizeOptions.medium.available && (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={selectedSize === 'medium'}
                          onClick={() => setSelectedSize('medium')}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedSize === 'medium'
                              ? 'border-brand-red bg-brand-red/10 shadow-md'
                              : 'border-border dark:border-border hover:border-brand-red/50'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <span className="font-bold text-text-primary dark:text-text-primary">
                              Medium
                            </span>
                            {product.sizeOptions.medium.priceModifier > 0 && (
                              <Badge variant="info" size="sm">
                                +{product.sizeOptions.medium.priceModifier}€
                              </Badge>
                            )}
                            {product.sizeOptions.medium.priceModifier === 0 && (
                              <Badge variant="success" size="sm">
                                Prix de base
                              </Badge>
                            )}
                          </div>
                        </button>
                      )}

                      {/* Large */}
                      {product.sizeOptions.large.available && (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={selectedSize === 'large'}
                          onClick={() => setSelectedSize('large')}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedSize === 'large'
                              ? 'border-brand-red bg-brand-red/10 shadow-md'
                              : 'border-border dark:border-border hover:border-brand-red/50'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <span className="font-bold text-text-primary dark:text-text-primary">
                              Large
                            </span>
                            {product.sizeOptions.large.priceModifier > 0 && (
                              <Badge variant="warning" size="sm">
                                +{product.sizeOptions.large.priceModifier}€
                              </Badge>
                            )}
                          </div>
                        </button>
                      )}
                    </div>
                  </fieldset>
                )}

                {/* Extras Selection */}
                {product.availableExtras && product.availableExtras.length > 0 && (
                  <fieldset>
                    <legend className="block text-sm font-bold text-text-primary dark:text-text-primary mb-3">
                      Ingrédients supplémentaires
                    </legend>
                    <div className="space-y-2" role="group" aria-label="Sélectionner les ingrédients supplémentaires">
                      {product.availableExtras.map(extra => {
                        const isSelected = selectedExtras.includes(extra.name);
                        return (
                          <button
                            key={extra.name}
                            type="button"
                            role="checkbox"
                            aria-checked={isSelected}
                            onClick={() => handleToggleExtra(extra.name)}
                            className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                              isSelected
                                ? 'border-brand-red bg-brand-red/10'
                                : 'border-border dark:border-border hover:border-brand-red/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? 'border-brand-red bg-brand-red'
                                    : 'border-gray-300'
                                }`}
                                aria-hidden="true"
                              >
                                {isSelected && (
                                  <Plus className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <span className="font-medium text-text-primary dark:text-text-primary capitalize">
                                {extra.name}
                              </span>
                            </div>
                            <Badge variant="info" size="sm">
                              +{extra.price}€
                            </Badge>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                {/* Cut Option */}
                <fieldset>
                  <legend className="block text-sm font-bold text-text-primary dark:text-text-primary mb-3">
                    Découpe
                  </legend>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={cutPizza}
                    aria-label={cutPizza ? 'Couper la pizza (activé)' : 'Couper la pizza (désactivé)'}
                    onClick={() => setCutPizza(!cutPizza)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                      cutPizza
                        ? 'border-brand-red bg-brand-red/10'
                        : 'border-border dark:border-border hover:border-brand-red/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                          cutPizza
                            ? 'border-brand-red bg-brand-red'
                            : 'border-gray-300'
                        }`}
                        aria-hidden="true"
                      >
                        {cutPizza && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="text-left">
                        <span className="font-medium text-text-primary dark:text-text-primary block">
                          Couper la pizza
                        </span>
                        <span className="text-xs text-text-secondary dark:text-text-secondary">
                          {cutPizza ? 'La pizza sera coupée' : 'La pizza sera servie entière'}
                        </span>
                      </div>
                    </div>
                  </button>
                </fieldset>

                {/* Summary */}
                <div className="bg-background-secondary dark:bg-background-tertiary rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary dark:text-text-secondary">
                      Prix de base
                    </span>
                    <span className="font-medium text-text-primary dark:text-text-primary">
                      {product.price}€
                    </span>
                  </div>

                  {product.sizeOptions && product.sizeOptions[selectedSize].priceModifier > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-secondary dark:text-text-secondary">
                        Taille {selectedSize}
                      </span>
                      <span className="font-medium text-brand-red">
                        +{product.sizeOptions[selectedSize].priceModifier}€
                      </span>
                    </div>
                  )}

                  {selectedExtras.length > 0 && (
                    <div className="space-y-1">
                      {selectedExtras.map(extraName => {
                        const extra = product.availableExtras?.find(e => e.name === extraName);
                        return (
                          <div key={extraName} className="flex justify-between items-center text-sm">
                            <span className="text-text-secondary dark:text-text-secondary capitalize">
                              {extraName}
                            </span>
                            <span className="font-medium text-brand-red">
                              +{extra?.price}€
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-2 border-t border-border dark:border-border">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-text-primary dark:text-text-primary">
                        Total
                      </span>
                      <span className="font-bold text-2xl text-brand-red">
                        {calculatedPrice.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-surface dark:bg-surface border-t border-border dark:border-border p-6">
                <button
                  ref={addToCartButtonRef}
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-brand-red hover:bg-brand-red-hover text-white py-4 rounded-xl font-bold text-lg shadow-soft-md hover:shadow-soft-lg active:scale-98 transition-all duration-200 flex items-center justify-center gap-2"
                  aria-label={`Ajouter ${product.name} au panier pour ${calculatedPrice.toFixed(2)} euros`}
                >
                  <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                  Ajouter au panier - {calculatedPrice.toFixed(2)}€
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
