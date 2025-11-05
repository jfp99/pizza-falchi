'use client';
import { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, ShoppingCart, DollarSign,
  Clock, CreditCard, Truck, Pizza, Users, Package
} from 'lucide-react';

interface AnalyticsData {
  revenueOverTime: Array<{ _id: string; revenue: number; orders: number }>;
  ordersByStatus: Array<{ _id: string; count: number }>;
  ordersByDeliveryType: Array<{ _id: string; count: number; revenue: number }>;
  ordersByPaymentMethod: Array<{ _id: string; count: number; revenue: number }>;
  topProducts: Array<{
    _id: string;
    name: string;
    category: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
  averageOrderValue: number;
  ordersByHour: Array<{ _id: number; count: number }>;
  revenueByCategory: Array<{ _id: string; revenue: number; quantity: number }>;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?period=${period}`);
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <p className="text-gray-600 dark:text-gray-400">Erreur lors du chargement des données</p>
      </div>
    );
  }

  const totalRevenue = analyticsData.revenueOverTime.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = analyticsData.revenueOverTime.reduce((sum, day) => sum + day.orders, 0);

  // Calculate max values for scaling
  const maxRevenue = Math.max(...analyticsData.revenueOverTime.map(d => d.revenue));
  const maxOrders = Math.max(...analyticsData.revenueOverTime.map(d => d.orders));
  const maxHourOrders = Math.max(...analyticsData.ordersByHour.map(h => h.count));

  // Status colors
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    preparing: 'bg-purple-500',
    ready: 'bg-green-500',
    completed: 'bg-green-600',
    cancelled: 'bg-red-500'
  };

  // Category colors
  const categoryColors: Record<string, string> = {
    pizza: 'bg-primary-red',
    boisson: 'bg-blue-500',
    dessert: 'bg-pink-500',
    accompagnement: 'bg-primary-yellow'
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
              Analytiques
            </h1>
            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Analyse détaillée des performances
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            {['7', '30', '90', '365'].map(days => (
              <button
                key={days}
                onClick={() => setPeriod(days)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                  period === days
                    ? 'bg-primary-red text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-label={`Voir les ${days} derniers jours`}
              >
                {days === '365' ? '1 an' : `${days}j`}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Revenu Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {totalRevenue.toFixed(2)}€
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Commandes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {totalOrders}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Panier Moyen</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analyticsData.averageOrderValue.toFixed(2)}€
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Produits Vendus</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analyticsData.topProducts.reduce((sum, p) => sum + p.totalQuantity, 0)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <Pizza className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Over Time */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Évolution du Chiffre d'Affaires
            </h2>
            <div className="space-y-2">
              {analyticsData.revenueOverTime.map((day, index) => (
                <div key={day._id} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-24 transition-colors duration-300">
                    {new Date(day._id).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden transition-colors duration-300">
                    <div
                      className="h-full bg-gradient-to-r from-primary-red to-soft-red flex items-center justify-end px-2"
                      style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                    >
                      <span className="text-xs font-medium text-white">
                        {day.revenue.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-16 text-right transition-colors duration-300">
                    {day.orders} cmd
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Orders by Hour */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Commandes par Heure
            </h2>
            <div className="flex items-end justify-between h-64 gap-1">
              {Array.from({ length: 24 }, (_, i) => {
                const hourData = analyticsData.ordersByHour.find(h => h._id === i);
                const count = hourData?.count || 0;
                const height = maxHourOrders > 0 ? (count / maxHourOrders) * 100 : 0;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t transition-colors duration-300" style={{ height: `${height}%` }}>
                      <div className="w-full h-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" />
                    </div>
                    {count > 0 && (
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        {count}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      {i}h
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Orders by Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Par Statut
            </h2>
            <div className="space-y-3">
              {analyticsData.ordersByStatus.map(status => (
                <div key={status._id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize transition-colors duration-300">
                      {status._id}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {status.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 transition-colors duration-300">
                    <div
                      className={`h-2 rounded-full ${statusColors[status._id] || 'bg-gray-500'}`}
                      style={{
                        width: `${(status.count / totalOrders) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orders by Delivery Type */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Type de Livraison
            </h2>
            <div className="space-y-4">
              {analyticsData.ordersByDeliveryType.map(type => (
                <div key={type._id} className="border-b border-gray-200 dark:border-gray-700 pb-3 transition-colors duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100 capitalize transition-colors duration-300">
                      {type._id === 'delivery' ? 'Livraison' : 'À emporter'}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      {type.count} commandes
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {type.revenue.toFixed(2)}€
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Orders by Payment Method */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Méthode de Paiement
            </h2>
            <div className="space-y-4">
              {analyticsData.ordersByPaymentMethod.map(method => (
                <div key={method._id} className="border-b border-gray-200 dark:border-gray-700 pb-3 transition-colors duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100 capitalize transition-colors duration-300">
                      {method._id === 'card' ? 'Carte' : method._id === 'cash' ? 'Espèces' : 'En ligne'}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      {method.count} commandes
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {method.revenue.toFixed(2)}€
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Produits les Plus Vendus
            </h2>
            <div className="space-y-3">
              {analyticsData.topProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-red rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      {product.totalQuantity} vendus
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {product.totalRevenue.toFixed(2)}€
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Category */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Pizza className="w-5 h-5" />
              Revenu par Catégorie
            </h2>
            <div className="space-y-4">
              {analyticsData.revenueByCategory.map(category => {
                const totalCategoryRevenue = analyticsData.revenueByCategory.reduce(
                  (sum, c) => sum + c.revenue, 0
                );
                const percentage = (category.revenue / totalCategoryRevenue) * 100;

                return (
                  <div key={category._id}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100 capitalize transition-colors duration-300">
                        {category._id}
                      </span>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                          {category.revenue.toFixed(2)}€
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                          {category.quantity} vendus
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 transition-colors duration-300">
                      <div
                        className={`h-3 rounded-full ${categoryColors[category._id] || 'bg-gray-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
