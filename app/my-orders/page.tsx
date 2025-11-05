'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Clock, CheckCircle, XCircle, ChefHat, Loader2, ArrowLeft, Calendar, MapPin, CreditCard, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { SPACING, ROUNDED, SHADOWS, TRANSITIONS } from '@/lib/design-constants';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
  customizations?: {
    size?: string;
    toppings?: string[];
    notes?: string;
  };
}

interface Order {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: {
    street: string;
    city: string;
    postalCode: string;
  };
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  pickupTimeRange?: string;
  createdAt: string;
  estimatedDelivery?: string;
}

const statusConfig = {
  pending: {
    label: 'En attente',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: Clock,
    iconColor: 'text-gray-500',
  },
  confirmed: {
    label: 'Confirmée',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: CheckCircle,
    iconColor: 'text-blue-500',
  },
  preparing: {
    label: 'En préparation',
    color: 'bg-primary-yellow/20 text-primary-yellow border-primary-yellow/30',
    icon: ChefHat,
    iconColor: 'text-primary-yellow',
  },
  ready: {
    label: 'Prête',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: Package,
    iconColor: 'text-green-500',
  },
  completed: {
    label: 'Terminée',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-500',
  },
  cancelled: {
    label: 'Annulée',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
    iconColor: 'text-red-500',
  },
};

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Vous devez être connecté pour voir vos commandes');
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/my-orders');

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Impossible de charger vos commandes');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status);
    if (filter === 'completed') return ['completed', 'cancelled'].includes(order.status);
    return true;
  });

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-red mx-auto mb-4" />
          <p className="text-gray-600">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-red hover:text-primary-red-dark transition font-semibold mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            Retour à l'accueil
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
            Mes <span className="bg-gradient-to-r from-primary-red to-soft-red bg-clip-text text-transparent">Commandes</span>
          </h1>
          <p className="text-xl text-gray-600">
            Suivez l'état de vos commandes et consultez votre historique
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-primary-red text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Toutes ({orders.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              filter === 'active'
                ? 'bg-primary-red text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            En cours ({orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              filter === 'completed'
                ? 'bg-primary-red text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Terminées ({orders.filter(o => ['completed', 'cancelled'].includes(o.status)).length})
          </button>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className={`bg-white ${ROUNDED.xl} ${SPACING.cardPaddingLg} text-center ${SHADOWS.md}`}>
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {filter === 'all' ? 'Aucune commande' : filter === 'active' ? 'Aucune commande en cours' : 'Aucune commande terminée'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? 'Vous n\'avez pas encore passé de commande.'
                : filter === 'active'
                ? 'Toutes vos commandes sont terminées.'
                : 'Vous n\'avez pas encore de commandes terminées.'}
            </p>
            {filter === 'all' && (
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-red to-soft-red text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition"
              >
                <Package className="w-5 h-5" />
                Commander maintenant
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order._id}
                  className={`bg-white ${ROUNDED.xl} ${SPACING.cardPaddingLg} ${SHADOWS.md} hover:${SHADOWS.lg} ${TRANSITIONS.base} border border-gray-100`}
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          Commande #{order._id.slice(-6).toUpperCase()}
                        </h3>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${statusInfo.color}`}>
                          <StatusIcon className={`w-4 h-4 ${statusInfo.iconColor}`} />
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {order.pickupTimeRange && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {order.pickupTimeRange}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black bg-gradient-to-r from-primary-red to-soft-red bg-clip-text text-transparent">
                        {order.total.toFixed(2)}€
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {order.deliveryType === 'pickup' ? 'À emporter' : 'Livraison'}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{item.product.name}</p>
                          <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                          {item.customizations?.size && (
                            <p className="text-xs text-gray-500 mt-1">Taille: {item.customizations.size}</p>
                          )}
                          {item.customizations?.toppings && item.customizations.toppings.length > 0 && (
                            <p className="text-xs text-gray-500">+ {item.customizations.toppings.join(', ')}</p>
                          )}
                        </div>
                        <div className="font-bold text-gray-900">
                          {(item.price * item.quantity).toFixed(2)}€
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Info */}
                  <div className="grid md:grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {order.phone}
                      </div>
                      {order.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {order.email}
                        </div>
                      )}
                      {order.deliveryAddress && (
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>
                            {order.deliveryAddress.street}, {order.deliveryAddress.postalCode} {order.deliveryAddress.city}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CreditCard className="w-4 h-4" />
                        Paiement: {order.paymentMethod === 'cash' ? 'Espèces' : order.paymentMethod === 'card' ? 'Carte' : 'En ligne'}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-500' : order.paymentStatus === 'failed' ? 'bg-red-500' : 'bg-gray-400'}`} />
                        <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-700' : order.paymentStatus === 'failed' ? 'text-red-700' : 'text-gray-600'}`}>
                          {order.paymentStatus === 'paid' ? 'Payé' : order.paymentStatus === 'failed' ? 'Échec du paiement' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <Link
                      href={`/order-confirmation/${order._id}`}
                      className="inline-flex items-center gap-2 text-primary-red hover:text-primary-red-dark font-semibold transition"
                    >
                      Voir les détails
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
