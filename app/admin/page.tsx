'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart, Users, Pizza, DollarSign, Package,
  ShoppingCart, TrendingUp, Calendar
} from 'lucide-react';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  completedOrders: number;
}

interface RecentOrder {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  customerName: string;
  email?: string;
  phone: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/orders/recent')
      ]);
      
      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();
      
      setStats(statsData);
      setRecentOrders(ordersData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-red"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Revenue Total',
      value: `${stats.totalRevenue}€`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Commandes',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Produits',
      value: stats.totalProducts.toString(),
      icon: Pizza,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Clients',
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
            Vue d'ensemble de votre activité
          </p>
        </div>

        {/* Cartes de Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-300">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${card.bgColor} dark:bg-opacity-20 ${card.color} transition-all duration-300`}>
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Commandes Récentes */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Commandes Récentes</h2>
            </div>
            <div className="p-6">
              {recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Aucune commande récente</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map(order => (
                    <div
                      key={order._id}
                      className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{order.customerName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{order.email || order.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white mb-1">{order.total.toFixed(2)}€</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions Rapides */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Actions Rapides</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => router.push('/admin/products')}
                  className="group p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary-red hover:shadow-md transition-all duration-300 text-center"
                  aria-label="Gérer les produits"
                >
                  <Package className="w-8 h-8 text-gray-400 group-hover:text-primary-red mx-auto mb-2 transition-colors duration-300" />
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Produits</p>
                </button>

                <button
                  onClick={() => router.push('/admin/orders')}
                  className="group p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary-red hover:shadow-md transition-all duration-300 text-center"
                  aria-label="Voir les commandes"
                >
                  <ShoppingCart className="w-8 h-8 text-gray-400 group-hover:text-primary-red mx-auto mb-2 transition-colors duration-300" />
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Commandes</p>
                </button>

                <button
                  onClick={() => router.push('/admin/customers')}
                  className="group p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary-red hover:shadow-md transition-all duration-300 text-center"
                  aria-label="Gérer les clients"
                >
                  <Users className="w-8 h-8 text-gray-400 group-hover:text-primary-red mx-auto mb-2 transition-colors duration-300" />
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Clients</p>
                </button>

                <button
                  onClick={() => router.push('/admin/analytics')}
                  className="group p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary-red hover:shadow-md transition-all duration-300 text-center"
                  aria-label="Voir les analytiques"
                >
                  <TrendingUp className="w-8 h-8 text-gray-400 group-hover:text-primary-red mx-auto mb-2 transition-colors duration-300" />
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Analytics</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}