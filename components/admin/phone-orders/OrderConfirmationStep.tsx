'use client';

import type { TimeSlot } from '@/types';
import type { CustomerInfo } from './CustomerInfoStep';
import type { CartItem } from './ProductSelectionStep';

interface OrderConfirmationStepProps {
  customerInfo: CustomerInfo;
  cart: CartItem[];
  slot: TimeSlot;
  deliveryFee?: number;
}

export default function OrderConfirmationStep({
  customerInfo,
  cart,
  slot,
  deliveryFee = 3.0,
}: OrderConfirmationStepProps) {
  const getSubtotal = (): number => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getTotal = (): number => {
    const subtotal = getSubtotal();
    const fee = customerInfo.deliveryType === 'delivery' ? deliveryFee : 0;
    return subtotal + fee;
  };

  const getPizzaCount = (): number => {
    return cart
      .filter((item) => item.product.category === 'pizza')
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const pizzaCount = getPizzaCount();
  const remainingCapacity = slot.capacity - (slot.pizzaCount || 0);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-charcoal">Récapitulatif</h3>

      {/* Customer Info */}
      <section
        className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200"
        aria-labelledby="customer-info-heading"
      >
        <h4 id="customer-info-heading" className="font-bold text-charcoal mb-2">
          Client
        </h4>
        <dl className="space-y-1">
          <div className="flex gap-2">
            <dt className="font-semibold text-sm">Nom:</dt>
            <dd className="text-sm">{customerInfo.customerName}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold text-sm">Téléphone:</dt>
            <dd className="text-sm">{customerInfo.phone}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold text-sm">Service:</dt>
            <dd className="text-sm">
              {customerInfo.deliveryType === 'pickup' ? 'À emporter' : 'Livraison'}
            </dd>
          </div>
          {customerInfo.deliveryType === 'delivery' && (
            <div className="flex gap-2">
              <dt className="font-semibold text-sm">Adresse:</dt>
              <dd className="text-sm">
                {customerInfo.address}, {customerInfo.city} {customerInfo.postalCode}
              </dd>
            </div>
          )}
        </dl>
      </section>

      {/* Cart Items */}
      <section
        className="bg-green-50 rounded-xl p-4 border-2 border-green-200"
        aria-labelledby="order-items-heading"
      >
        <h4 id="order-items-heading" className="font-bold text-charcoal mb-2">
          Articles
        </h4>
        <ul className="space-y-1" aria-label="Liste des articles commandés">
          {cart.map((item) => (
            <li
              key={item.product._id}
              className="flex justify-between text-sm"
              aria-label={`${item.quantity} ${item.product.name} à ${(item.product.price * item.quantity).toFixed(2)} euros`}
            >
              <span>
                {item.quantity}x {item.product.name}
              </span>
              <span className="font-bold">{(item.product.price * item.quantity).toFixed(2)}€</span>
            </li>
          ))}
        </ul>

        {customerInfo.deliveryType === 'delivery' && (
          <div className="flex justify-between text-sm mt-2 pt-2 border-t border-green-300 text-gray-600">
            <span>Frais de livraison</span>
            <span className="font-bold">{deliveryFee.toFixed(2)}€</span>
          </div>
        )}

        <div
          className="flex justify-between text-lg font-black mt-2 pt-2 border-t-2 border-green-300"
          aria-label={`Total: ${getTotal().toFixed(2)} euros`}
        >
          <span>Total</span>
          <span>{getTotal().toFixed(2)}€</span>
        </div>
      </section>

      {/* Time Slot Info */}
      <section
        className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200"
        aria-labelledby="timeslot-heading"
      >
        <h4 id="timeslot-heading" className="font-bold text-charcoal mb-2">
          Créneau
        </h4>
        <dl className="space-y-1">
          <div className="flex gap-2">
            <dt className="font-semibold text-sm">Heure:</dt>
            <dd className="text-sm">
              {slot.startTime} - {slot.endTime}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold text-sm">Pizzas dans ce créneau:</dt>
            <dd className="text-sm">
              {pizzaCount} ajoutées (capacité restante: {remainingCapacity - pizzaCount})
            </dd>
          </div>
        </dl>

        {pizzaCount > remainingCapacity && (
          <div
            className="mt-3 bg-red-100 border border-red-300 rounded-lg p-2 text-sm font-semibold text-red-700"
            role="alert"
          >
            ⚠️ Attention: vous dépassez la capacité du créneau
          </div>
        )}
      </section>

      {/* Accessibility summary for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        Commande pour {customerInfo.customerName}, {cart.length} article(s), total{' '}
        {getTotal().toFixed(2)} euros, créneau {slot.startTime} à {slot.endTime}
      </div>
    </div>
  );
}
