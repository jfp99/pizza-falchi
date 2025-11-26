'use client';
import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { Package, Truck, Clock, Phone, Mail, MapPin, CheckCircle, XCircle, ChefHat, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      const url = selectedStatus === 'all'
        ? '/api/orders'
        : `/api/orders?status=${selectedStatus}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const sendWhatsAppNotification = async (orderId: string) => {
    try {
      toast.loading('Envoi de la notification WhatsApp...', { id: 'whatsapp-notification' });

      const response = await fetch(`/api/orders/${orderId}/notify`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('✅ Message WhatsApp envoyé avec succès !', { id: 'whatsapp-notification' });
        fetchOrders(); // Refresh to show notification status
      } else {
        toast.error(`❌ Échec de l'envoi: ${data.error || 'Erreur inconnue'}`, { id: 'whatsapp-notification' });
      }
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error);
      toast.error('❌ Erreur lors de l\'envoi de la notification', { id: 'whatsapp-notification' });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-300 dark:border-yellow-600 transition-colors duration-300',
      confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-300 dark:border-blue-600 transition-colors duration-300',
      preparing: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 border-orange-300 dark:border-orange-600 transition-colors duration-300',
      ready: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-300 dark:border-green-600 transition-colors duration-300',
      completed: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-border-medium dark:border-border-medium transition-colors duration-300',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-300 dark:border-red-600 transition-colors duration-300'
    };
    return colors[status] || colors.pending;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      preparing: 'En préparation',
      ready: 'Prête',
      completed: 'Terminée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  };

  const statusOptions = [
    { value: 'all', label: 'Toutes' },
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmées' },
    { value: 'preparing', label: 'En préparation' },
    { value: 'ready', label: 'Prêtes' },
    { value: 'completed', label: 'Terminées' },
    { value: 'cancelled', label: 'Annulées' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-cream dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-red border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-text-secondary dark:text-text-secondary transition-colors duration-300">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream dark:bg-gray-900 p-4 sm:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-black text-charcoal dark:text-gray-100 mb-3 sm:mb-4 transition-colors duration-300">
            Gestion des <span className="text-primary-red">Commandes</span>
          </h1>
          <p className="text-base sm:text-xl text-text-secondary dark:text-text-secondary transition-colors duration-300">
            {orders.length} commande{orders.length !== 1 ? 's' : ''} {selectedStatus !== 'all' ? `(${getStatusLabel(selectedStatus)})` : ''}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-surface dark:bg-surface rounded-2xl p-4 sm:p-6 shadow-lg border border-border dark:border-border mb-6 sm:mb-8 transition-colors duration-300">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-colors duration-300 ${
                  selectedStatus === option.value
                    ? 'bg-primary-red text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-charcoal dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-surface dark:bg-surface rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-lg border border-border dark:border-border transition-colors duration-300">
            <div className="text-4xl sm:text-6xl mb-4">📦</div>
            <h3 className="text-xl sm:text-2xl font-bold text-charcoal dark:text-gray-100 mb-2 transition-colors duration-300">Aucune commande</h3>
            <p className="text-sm sm:text-base text-text-secondary dark:text-text-secondary transition-colors duration-300">Aucune commande ne correspond à vos critères</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-surface dark:bg-surface rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-lg border border-border dark:border-border transition-colors duration-300">
                {/* Order Header */}
                <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-charcoal dark:text-gray-100 transition-colors duration-300">
                        #{order._id?.slice(-8).toUpperCase()}
                      </h3>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-colors duration-300 ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-text-secondary dark:text-text-secondary transition-colors duration-300">
                      {new Date(order.createdAt!).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.deliveryType === 'delivery' ? (
                      <Truck className="w-6 h-6 text-primary-red" />
                    ) : (
                      <Package className="w-6 h-6 text-primary-red" />
                    )}
                    <span className="font-bold text-charcoal dark:text-gray-100 transition-colors duration-300">
                      {order.deliveryType === 'delivery' ? 'Livraison' : 'À emporter'}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-bold text-charcoal dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors duration-300">
                      <span className="text-primary-red">👤</span> Client
                    </h4>
                    <div className="space-y-2">
                      <p className="text-text-secondary dark:text-text-secondary transition-colors duration-300">
                        <span className="font-semibold">Nom:</span> {order.customerName}
                      </p>
                      <p className="text-text-secondary dark:text-text-secondary flex items-center gap-2 transition-colors duration-300">
                        <Phone className="w-4 h-4 text-primary-red" />
                        {order.phone}
                      </p>
                      {order.email && (
                        <p className="text-text-secondary dark:text-text-secondary flex items-center gap-2 transition-colors duration-300">
                          <Mail className="w-4 h-4 text-primary-red" />
                          {order.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {order.deliveryType === 'delivery' && order.deliveryAddress && (
                    <div>
                      <h4 className="font-bold text-charcoal dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors duration-300">
                        <MapPin className="w-5 h-5 text-primary-red" /> Adresse
                      </h4>
                      <p className="text-text-secondary dark:text-text-secondary transition-colors duration-300">
                        {order.deliveryAddress.street}<br />
                        {order.deliveryAddress.postalCode} {order.deliveryAddress.city}
                      </p>
                    </div>
                  )}

                  {/* Time Slot Info */}
                  {order.timeSlot && order.pickupTimeRange && (
                    <div>
                      <h4 className="font-bold text-charcoal dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors duration-300">
                        <Clock className="w-5 h-5 text-primary-red" /> Créneau de récupération
                      </h4>
                      <div className="space-y-2">
                        <p className="text-text-secondary dark:text-text-secondary font-semibold transition-colors duration-300">
                          {order.scheduledTime && new Date(order.scheduledTime).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </p>
                        <p className="text-2xl font-black text-primary-red">
                          {order.pickupTimeRange}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize transition-colors duration-300">
                          Assigné par: {order.assignedBy === 'customer' ? 'Client' : order.assignedBy === 'cashier' ? 'Caissier' : 'Système'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Estimated Time (fallback if no time slot) */}
                  {!order.timeSlot && order.estimatedDelivery && (
                    <div>
                      <h4 className="font-bold text-charcoal dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors duration-300">
                        <Clock className="w-5 h-5 text-primary-red" /> Heure estimée
                      </h4>
                      <p className="text-text-secondary dark:text-text-secondary transition-colors duration-300">
                        {new Date(order.estimatedDelivery).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="font-bold text-charcoal dark:text-gray-100 mb-4 transition-colors duration-300">Articles commandés</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-warm-cream dark:bg-gray-700 rounded-xl p-4 transition-colors duration-300">
                        <div className="flex-1">
                          <p className="font-semibold text-charcoal dark:text-gray-100 transition-colors duration-300">{item.product.name}</p>
                          <p className="text-sm text-text-secondary dark:text-text-secondary transition-colors duration-300">Quantité: {item.quantity}</p>
                          {item.customizations?.notes && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic transition-colors duration-300">Note: {item.customizations.notes}</p>
                          )}
                        </div>
                        <p className="font-bold text-charcoal dark:text-gray-100 transition-colors duration-300">{(item.total ?? 0).toFixed(2)}€</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="mb-6 bg-soft-yellow-lighter dark:bg-yellow-900/20 rounded-xl p-4 transition-colors duration-300">
                    <h4 className="font-bold text-charcoal dark:text-gray-100 mb-2 transition-colors duration-300">📝 Notes</h4>
                    <p className="text-text-secondary dark:text-text-secondary transition-colors duration-300">{order.notes}</p>
                  </div>
                )}

                {/* Pricing */}
                <div className="border-t border-border dark:border-border pt-4 mb-6 transition-colors duration-300">
                  <div className="flex justify-between text-text-secondary dark:text-text-secondary mb-2 transition-colors duration-300">
                    <span>Sous-total</span>
                    <span>{(order.subtotal ?? 0).toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-text-secondary dark:text-text-secondary mb-2 transition-colors duration-300">
                    <span>TVA</span>
                    <span>{(order.tax ?? 0).toFixed(2)}€</span>
                  </div>
                  {(order.deliveryFee ?? 0) > 0 && (
                    <div className="flex justify-between text-text-secondary dark:text-text-secondary mb-2 transition-colors duration-300">
                      <span>Livraison</span>
                      <span>{(order.deliveryFee ?? 0).toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xl font-bold text-charcoal dark:text-gray-100 border-t border-border dark:border-border pt-2 transition-colors duration-300">
                    <span>Total</span>
                    <span className="text-primary-red">{(order.total ?? 0).toFixed(2)}€</span>
                  </div>
                </div>

                {/* Status Update Buttons */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order._id!, 'confirmed')}
                        className="flex items-center gap-1 sm:gap-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold transition-colors duration-300"
                      >
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        Confirmer
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order._id!, 'cancelled')}
                        className="flex items-center gap-1 sm:gap-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold transition-colors duration-300"
                      >
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        Annuler
                      </button>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(order._id!, 'preparing')}
                      className="flex items-center gap-1 sm:gap-2 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold transition-colors duration-300"
                    >
                      <ChefHat className="w-4 h-4 sm:w-5 sm:h-5" />
                      En préparation
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order._id!, 'ready')}
                      className="flex items-center gap-1 sm:gap-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold transition-colors duration-300"
                    >
                      <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                      Prête
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <>
                      <button
                        onClick={() => sendWhatsAppNotification(order._id!)}
                        className="flex items-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold transition-colors duration-300"
                      >
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Notifier client</span>
                        <span className="sm:hidden">Notifier</span>
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order._id!, 'completed')}
                        className="flex items-center gap-1 sm:gap-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold transition-colors duration-300"
                      >
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        Terminée
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
