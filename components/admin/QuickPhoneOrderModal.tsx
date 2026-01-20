'use client';

import { useState, useEffect } from 'react';
import { X, Phone, Pizza, CupSoda, User, ShoppingBag, CheckCircle, ChevronRight, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import type { TimeSlot, Product } from '@/types';
import { usePhoneOrder } from '@/hooks/usePhoneOrder';
import CustomerInfoStep from './phone-orders/CustomerInfoStep';
import ProductSelectionStep from './phone-orders/ProductSelectionStep';
import OrderConfirmationStep from './phone-orders/OrderConfirmationStep';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickPhoneOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: TimeSlot;
  onOrderCreated: () => void;
}

export default function QuickPhoneOrderModal({
  isOpen,
  onClose,
  slot,
  onOrderCreated,
}: QuickPhoneOrderModalProps) {
  // Products state
  const [pizzas, setPizzas] = useState<Product[]>([]);
  const [drinks, setDrinks] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Phone order hook
  const {
    step,
    customerInfo,
    cart,
    loading,
    updateCustomerInfo,
    setDeliveryType,
    addToCart,
    removeFromCart,
    getPizzaCount,
    getTotal,
    canProceed,
    handleNext,
    handleBack,
    handleSubmit,
    resetForm,
  } = usePhoneOrder({ slot, onOrderCreated: () => {
    onOrderCreated();
    onClose();
  }});

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      resetForm();
    }
  }, [isOpen, resetForm]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');

      const products: Product[] = await response.json();

      setPizzas(products.filter((p) => p.category === 'pizza' && p.available));
      setDrinks(products.filter((p) => p.category === 'boisson' && p.available));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoadingProducts(false);
    }
  };

  if (!isOpen) return null;

  const pizzaCount = getPizzaCount();
  const remainingCapacity = slot.capacity - (slot.pizzaCount || 0);

  const steps = [
    { key: 'customer', label: 'Client', icon: User },
    { key: 'pizzas', label: 'Pizzas', icon: Pizza },
    { key: 'drinks', label: 'Boissons', icon: CupSoda },
    { key: 'confirm', label: 'Confirmation', icon: CheckCircle },
  ] as const;

  const currentStepIndex = steps.findIndex(s => s.key === step);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col pointer-events-auto"
            >
              {/* Modern Header */}
              <div className="relative bg-gradient-to-br from-primary-red via-primary-red-dark to-primary-yellow px-8 py-6 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                  }} />
                </div>

                <div className="relative z-10">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                        <Phone className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 id="modal-title" className="text-2xl font-black tracking-tight">
                          Commande Téléphonique
                        </h2>
                        <p className="text-white/80 text-sm font-medium mt-0.5">
                          Prise de commande rapide
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2.5 hover:bg-white/20 rounded-xl transition-all hover:scale-110 active:scale-95"
                      aria-label="Fermer"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Slot Info */}
                  <div className="flex items-center gap-6 mb-6 text-sm">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Créneau:</span>
                      <span className="font-bold">{slot.startTime} - {slot.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl">
                      <Pizza className="w-4 h-4" />
                      <span className="font-medium">Capacité:</span>
                      <span className="font-bold">{slot.pizzaCount || 0}/{slot.capacity}</span>
                      <span className={`ml-2 w-2 h-2 rounded-full ${
                        (slot.pizzaCount || 0) >= slot.capacity * 0.8
                          ? 'bg-red-400'
                          : (slot.pizzaCount || 0) >= slot.capacity * 0.5
                          ? 'bg-yellow-400'
                          : 'bg-green-400'
                      }`} />
                    </div>
                  </div>

                  {/* Modern Step Indicator */}
                  <div className="flex items-center justify-between gap-2">
                    {steps.map((s, index) => {
                      const isActive = step === s.key;
                      const isCompleted = index < currentStepIndex;
                      const Icon = s.icon;

                      return (
                        <div key={s.key} className="flex items-center flex-1">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`
                              relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300
                              ${isActive ? 'bg-white text-primary-red shadow-lg scale-110' : ''}
                              ${isCompleted ? 'bg-white/30 text-white' : ''}
                              ${!isActive && !isCompleted ? 'bg-white/10 text-white/60' : ''}
                            `}>
                              <Icon className="w-5 h-5" />
                              {isCompleted && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-3 h-3 text-white" fill="currentColor" />
                                </div>
                              )}
                            </div>
                            <div className="hidden sm:block">
                              <div className={`text-xs font-bold transition-all ${
                                isActive ? 'text-white' : 'text-white/70'
                              }`}>
                                {s.label}
                              </div>
                            </div>
                          </div>
                          {index < steps.length - 1 && (
                            <div className="flex-1 h-1 mx-2 rounded-full bg-white/20 overflow-hidden">
                              <motion.div
                                className="h-full bg-white"
                                initial={{ width: '0%' }}
                                animate={{ width: isCompleted ? '100%' : '0%' }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Content Area with Smooth Transitions */}
              <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-800/50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    {step === 'customer' && (
                      <CustomerInfoStep
                        customerInfo={customerInfo}
                        onChange={updateCustomerInfo}
                        onDeliveryTypeChange={setDeliveryType}
                      />
                    )}

                    {step === 'pizzas' && (
                      <ProductSelectionStep
                        title="Sélection des Pizzas"
                        icon={<Pizza className="w-5 h-5 text-primary-red" aria-hidden="true" />}
                        products={pizzas}
                        cart={cart}
                        loading={loadingProducts}
                        onAddToCart={addToCart}
                        onRemoveFromCart={removeFromCart}
                        keyboardHint={true}
                        warningMessage={
                          pizzaCount > remainingCapacity
                            ? `Vous avez sélectionné ${pizzaCount} pizza(s) mais le créneau ne peut accepter que ${remainingCapacity} pizza(s) supplémentaire(s)`
                            : undefined
                        }
                      />
                    )}

                    {step === 'drinks' && (
                      <ProductSelectionStep
                        title="Boissons et Accompagnements (optionnel)"
                        icon={<CupSoda className="w-5 h-5 text-blue-600" aria-hidden="true" />}
                        products={drinks}
                        cart={cart}
                        loading={loadingProducts}
                        onAddToCart={addToCart}
                        onRemoveFromCart={removeFromCart}
                        keyboardHint={true}
                      />
                    )}

                    {step === 'confirm' && (
                      <OrderConfirmationStep
                        customerInfo={customerInfo}
                        cart={cart}
                        slot={slot}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Modern Footer */}
              <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-8 py-6">
                <div className="flex items-center justify-between gap-6">
                  {/* Cart Summary */}
                  <div className="flex items-center gap-4">
                    {cart.length > 0 && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-6"
                      >
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2.5 rounded-xl">
                          <ShoppingBag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{cart.length}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">article{cart.length > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-primary-red/10 px-4 py-2.5 rounded-xl">
                          <Pizza className="w-4 h-4 text-primary-red" />
                          <span className="text-sm font-bold text-primary-red">{pizzaCount}</span>
                          <span className="text-sm text-primary-red/80">pizza{pizzaCount > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2.5 rounded-xl">
                          <span className="text-sm text-green-700 dark:text-green-400 font-medium">Total:</span>
                          <span className="text-lg font-black text-green-700 dark:text-green-400">{getTotal().toFixed(2)}€</span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {step !== 'customer' && (
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={handleBack}
                        className="px-6 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
                      >
                        Retour
                      </motion.button>
                    )}

                    {step !== 'confirm' ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNext}
                        disabled={!canProceed() || (step === 'pizzas' && pizzaCount > remainingCapacity)}
                        className="relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-red to-primary-yellow text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Suivant
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-yellow to-primary-red opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmit}
                        disabled={loading || pizzaCount > remainingCapacity}
                        className="relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Création...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              Confirmer la commande
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
