'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Clock, Phone, Mail, MapPin, ArrowRight, Home, Loader, Check, X, Truck, Calendar } from 'lucide-react';
import { ChefIcon, PizzaSliceIcon } from '@/components/icons/CategoryIcons';
import { Order } from '@/types';
import { motion } from 'framer-motion';

export default function OrderConfirmation() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Commande non trouvée');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-red border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Chargement de votre commande...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center">
        <div className="bg-white rounded-3xl p-12 max-w-md mx-4 shadow-xl text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-black text-charcoal mb-4">Commande introuvable</h1>
          <p className="text-gray-600 mb-8">{error || 'Cette commande n\'existe pas ou a été supprimée.'}</p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-primary-red hover:bg-primary-red-dark text-white px-8 py-4 rounded-2xl font-bold transition"
          >
            <Home className="w-5 h-5" />
            Retour au menu
          </Link>
        </div>
      </div>
    );
  }

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: React.ReactElement }> = {
      pending: { label: 'En attente', color: 'text-yellow-600', icon: <Clock className="w-5 h-5" /> },
      confirmed: { label: 'Confirmée', color: 'text-blue-600', icon: <Check className="w-5 h-5" /> },
      preparing: { label: 'En préparation', color: 'text-orange-600', icon: <ChefIcon size={20} /> },
      ready: { label: 'Prête', color: 'text-green-600', icon: <PizzaSliceIcon size={20} /> },
      completed: { label: 'Terminée', color: 'text-gray-600', icon: <CheckCircle className="w-5 h-5" /> },
      cancelled: { label: 'Annulée', color: 'text-red-600', icon: <X className="w-5 h-5" /> }
    };
    return statusMap[status] || statusMap.pending;
  };

  const statusDisplay = getStatusDisplay(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream via-white to-soft-yellow-lighter py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header with Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-3xl p-12 shadow-xl text-center mb-8 border-2 border-green-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl md:text-5xl font-black text-charcoal mb-4"
          >
            Commande <span className="text-primary-red">Confirmée !</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl text-gray-600 mb-6"
          >
            Merci {order.customerName} ! Votre commande a été enregistrée avec succès.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="inline-block bg-gradient-to-r from-soft-yellow-lighter to-soft-yellow rounded-2xl px-8 py-4 shadow-md"
          >
            <p className="text-sm text-gray-600 mb-1">Numéro de commande</p>
            <p className="text-2xl font-black text-charcoal">#{order._id?.slice(-8).toUpperCase()}</p>
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white rounded-3xl p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-charcoal mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary-red" />
              Statut de la commande
            </h2>
            <div className="space-y-4">
              <div className="bg-soft-yellow-lighter rounded-2xl p-6 text-center">
                <div className="text-5xl mb-3">{statusDisplay.icon}</div>
                <p className={`text-2xl font-bold ${statusDisplay.color}`}>
                  {statusDisplay.label}
                </p>
              </div>

              {/* Time Slot Information */}
              {order.pickupTimeRange && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <p className="font-bold text-green-900">Créneau de retrait</p>
                  </div>
                  <p className="text-lg font-black text-green-700">
                    {order.pickupTimeRange}
                  </p>
                  {order.scheduledTime && (
                    <p className="text-sm text-green-600 mt-1">
                      {new Date(order.scheduledTime).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  )}
                </div>
              )}

              {order.estimatedDelivery && (
                <div className="bg-warm-cream rounded-2xl p-4">
                  <p className="text-sm text-gray-600 mb-1">
                    {order.deliveryType === 'delivery' ? 'Livraison estimée' : 'Prêt vers'}
                  </p>
                  <p className="text-lg font-bold text-charcoal">
                    {new Date(order.estimatedDelivery).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Delivery Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-white rounded-3xl p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-charcoal mb-6 flex items-center gap-3">
              {order.deliveryType === 'delivery' ? (
                <Truck className="w-6 h-6 text-primary-red" />
              ) : (
                <Package className="w-6 h-6 text-primary-red" />
              )}
              {order.deliveryType === 'delivery' ? 'Livraison' : 'À emporter'}
            </h2>
            <div className="space-y-4">
              {order.deliveryType === 'delivery' && order.deliveryAddress ? (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-red mt-1" />
                  <div>
                    <p className="font-semibold text-charcoal">Adresse de livraison</p>
                    <p className="text-gray-600">
                      {order.deliveryAddress.street}<br />
                      {order.deliveryAddress.postalCode} {order.deliveryAddress.city}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-soft-yellow-lighter rounded-2xl p-4">
                  <p className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    Adresse du food truck
                  </p>
                  <p className="text-gray-700">
                    615, avenue de la Touloubre<br />
                    13540 Puyricard - Aix en Provence
                  </p>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-red mt-1" />
                <div>
                  <p className="font-semibold text-charcoal">Téléphone</p>
                  <p className="text-gray-600">{order.phone}</p>
                </div>
              </div>

              {order.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary-red mt-1" />
                  <div>
                    <p className="font-semibold text-charcoal">Email</p>
                    <p className="text-gray-600">{order.email}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-white rounded-3xl p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-charcoal mb-6">Détails de la commande</h2>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start py-4 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="font-bold text-charcoal text-lg">{item.product.name}</p>
                  <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>

                  {/* Pizza Customizations */}
                  {item.customizations && (
                    <div className="mt-2 space-y-1">
                      {item.customizations.size && (
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                            Taille: {item.customizations.size === 'medium' ? 'Medium' : 'Large'}
                          </span>
                        </div>
                      )}
                      {item.customizations.extras && item.customizations.extras.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-gray-500 font-medium">Extras:</span>
                          <div className="flex flex-wrap gap-1">
                            {item.customizations.extras.map((extra, idx) => (
                              <span key={idx} className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded capitalize">
                                {extra}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.customizations.cut !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                            item.customizations.cut
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {item.customizations.cut ? '✓ À couper' : '✗ Entière'}
                          </span>
                        </div>
                      )}
                      {item.customizations.notes && (
                        <p className="text-sm text-gray-500 italic mt-1">Note: {item.customizations.notes}</p>
                      )}
                    </div>
                  )}
                </div>
                <p className="font-bold text-charcoal text-lg">
                  {item.total.toFixed(2)}€
                </p>
              </div>
            ))}
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-soft-yellow-lighter rounded-2xl p-4 mb-6">
              <p className="font-semibold text-charcoal mb-2">📝 Notes</p>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}

          {/* Pricing Summary */}
          <div className="border-t border-gray-200 pt-6 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span>{order.subtotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>TVA (5.5%)</span>
              <span>{order.tax.toFixed(2)}€</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Frais de livraison</span>
                <span>{order.deliveryFee.toFixed(2)}€</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="text-2xl font-black text-charcoal">Total</span>
              <span className="text-3xl font-black text-primary-red">{order.total.toFixed(2)}€</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-6 bg-warm-cream rounded-2xl p-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Mode de paiement:</span>{' '}
              {order.paymentMethod === 'cash' && 'Espèces'}
              {order.paymentMethod === 'card' && 'Carte bancaire'}
              {order.paymentMethod === 'online' && 'Paiement en ligne'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">Statut du paiement:</span>{' '}
              {order.paymentStatus === 'pending' && 'En attente'}
              {order.paymentStatus === 'paid' && 'Payé'}
              {order.paymentStatus === 'failed' && 'Échoué'}
            </p>
          </div>
        </motion.div>

        {/* Contact & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="bg-primary-red rounded-3xl p-8 shadow-xl text-white text-center mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Une question ?</h2>
          <p className="mb-6">Contactez-nous au 04 42 92 03 08</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const orderId = order._id?.slice(-8).toUpperCase();
                window.location.href = `/menu?orderSuccess=true&orderId=${orderId}`;
              }}
              className="bg-white text-primary-red hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold transition inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              Commander à nouveau
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              href="/"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold transition inline-flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Retour à l'accueil
            </Link>
          </div>
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xl text-gray-600 mb-2 flex items-center justify-center gap-2">
            Merci d'avoir choisi Pizza Falchi !
            <PizzaSliceIcon size={24} className="text-primary-red" aria-hidden="true" />
          </p>
          <p className="text-gray-500">
            À très bientôt pour de nouvelles délices italiennes
          </p>
        </motion.div>
      </div>
    </div>
  );
}
