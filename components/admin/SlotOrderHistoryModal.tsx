'use client';

import { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, ShoppingCart, Pizza, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import type { TimeSlot, Order } from '@/types';

interface SlotOrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: TimeSlot | null;
}

export default function SlotOrderHistoryModal({
  isOpen,
  onClose,
  slot,
}: SlotOrderHistoryModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && slot) {
      fetchOrders();
    }
  }, [isOpen, slot]);

  const fetchOrders = async () => {
    if (!slot) return;

    setLoading(true);
    try {
      // Fetch orders for this time slot
      const response = await fetch(`/api/orders?timeSlot=${slot._id}`);
      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !slot) return null;

  const totalPizzas = orders.reduce((sum, order) => {
    return sum + (order.items?.filter(item => (item as any).product?.category === 'pizza')
      .reduce((orderSum, item) => orderSum + item.quantity, 0) || 0);
  }, 0);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-red to-primary-yellow p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Historique du Créneau
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <strong>{slot.startTime} - {slot.endTime}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Pizza className="w-4 h-4" />
              {totalPizzas} pizza(s)
            </span>
            <span className="flex items-center gap-1">
              <ShoppingCart className="w-4 h-4" />
              {orders.length} commande(s)
            </span>
            <span className="flex items-center gap-1">
              💰 {totalRevenue.toFixed(2)}€
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-red border-t-transparent"></div>
              <p className="text-gray-600 mt-4">Chargement...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold">Aucune commande dans ce créneau</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => {
                const pizzaCount = order.items?.filter(item => (item as any).product?.category === 'pizza')
                  .reduce((sum, item) => sum + item.quantity, 0) || 0;

                return (
                  <div
                    key={order._id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
                  >
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-3 pb-3 border-b-2 border-gray-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-primary-red text-white px-3 py-1 rounded-lg font-bold text-sm">
                            #{index + 1}
                          </span>
                          <span className="font-bold text-charcoal">{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {order.phone}
                          </span>
                          {order.deliveryType === 'delivery' && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              Livraison
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-primary-red">
                          {order.total.toFixed(2)}€
                        </div>
                        <div className="text-xs text-gray-600 font-semibold">
                          {pizzaCount} pizza(s)
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items?.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex justify-between text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-gray-500">{item.quantity}x</span>
                            <span className="font-semibold text-charcoal">
                              {(item as any).product?.name || 'Produit'}
                            </span>
                            {(item as any).product?.category === 'pizza' && (
                              <Pizza className="w-4 h-4 text-primary-red" />
                            )}
                          </span>
                          <span className="font-bold text-gray-700">
                            {((item as any).price * item.quantity).toFixed(2)}€
                          </span>
                        </div>
                      ))}

                      {/* Delivery Address */}
                      {order.deliveryType === 'delivery' && order.deliveryAddress && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                            <div className="text-gray-600">
                              <div>{order.deliveryAddress.street}</div>
                              <div>{order.deliveryAddress.postalCode} {order.deliveryAddress.city}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {order.notes && (
                        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 italic">
                          Note: {order.notes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t-2 border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 rounded-xl bg-gray-200 text-charcoal font-bold hover:bg-gray-300 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
