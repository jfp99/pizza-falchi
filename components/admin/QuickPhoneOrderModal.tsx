'use client';

import { useState, useEffect } from 'react';
import { X, Phone, Pizza } from 'lucide-react';
import toast from 'react-hot-toast';
import type { TimeSlot, Product } from '@/types';
import { usePhoneOrder } from '@/hooks/usePhoneOrder';
import CustomerInfoStep from './phone-orders/CustomerInfoStep';
import ProductSelectionStep from './phone-orders/ProductSelectionStep';
import OrderConfirmationStep from './phone-orders/OrderConfirmationStep';

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

  const stepLabels: Record<typeof step, string> = {
    customer: 'Informations Client',
    pizzas: 'Sélection des Pizzas',
    drinks: 'Boissons et Accompagnements',
    confirm: 'Confirmation',
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-red to-primary-yellow p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 id="modal-title" className="text-2xl font-black flex items-center gap-2">
              <Phone className="w-6 h-6" aria-hidden="true" />
              Commande Téléphonique
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              Créneau: <strong>{slot.startTime} - {slot.endTime}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Pizza className="w-4 h-4" aria-hidden="true" />
              Capacité: <strong>{slot.pizzaCount || 0}/{slot.capacity}</strong>
            </span>
          </div>

          {/* Progress Steps */}
          <div className="mt-4 flex items-center gap-2" role="progressbar" aria-valuenow={['customer', 'pizzas', 'drinks', 'confirm'].indexOf(step)} aria-valuemin={0} aria-valuemax={3}>
            {(['customer', 'pizzas', 'drinks', 'confirm'] as const).map((s, index) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full ${
                  step === s
                    ? 'bg-white'
                    : index < ['customer', 'pizzas', 'drinks', 'confirm'].indexOf(step)
                    ? 'bg-white/60'
                    : 'bg-white/20'
                }`}
                aria-label={`Étape ${index + 1}: ${stepLabels[s]}`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
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
              icon={<span className="w-5 h-5 flex items-center justify-center" aria-hidden="true">🥤</span>}
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
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t-2 border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              {cart.length > 0 && (
                <div className="text-sm text-gray-600">
                  <strong>{cart.length}</strong> article(s) • <strong>{pizzaCount}</strong> pizza(s) •{' '}
                  <strong>{getTotal().toFixed(2)}€</strong>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {step !== 'customer' && (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 text-charcoal font-bold hover:bg-gray-100 transition-colors"
                >
                  Retour
                </button>
              )}

              {step !== 'confirm' ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed() || (step === 'pizzas' && pizzaCount > remainingCapacity)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-red to-primary-yellow text-white font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Suivant
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || pizzaCount > remainingCapacity}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-red to-primary-yellow text-white font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? 'Création...' : 'Confirmer la commande'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
