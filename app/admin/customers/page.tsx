'use client';
import { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, ShoppingBag, Euro, Search, Calendar, Pizza, Gift, Star } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  totalOrders: number;
  totalSpent: number;
  totalPizzas: number;
  loyaltyPizzasRedeemed: number;
  lastOrderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Calculate loyalty status: every 10 pizzas = 1 free pizza (11th is free)
const getLoyaltyInfo = (totalPizzas: number, redeemed: number) => {
  const earnedFreePizzas = Math.floor(totalPizzas / 10);
  const availableFreePizzas = earnedFreePizzas - redeemed;
  const progressToNext = totalPizzas % 10;
  return { earnedFreePizzas, availableFreePizzas, progressToNext };
};

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('lastOrderDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // PERFORMANCE: Debounce search to prevent API call on every keystroke
  // Waits 500ms after user stops typing before making API request
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchCustomers();
  }, [debouncedSearchTerm, sortBy, sortOrder]);

  const fetchCustomers = async () => {
    try {
      const params = new URLSearchParams();
      // PERFORMANCE: Use debounced search term for API calls
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await fetch(`/api/admin/customers?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-cream dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-red border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">Chargement des clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream dark:bg-gray-900 p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-charcoal dark:text-gray-100 mb-4 transition-colors duration-300">
            Gestion des <span className="text-primary-red">Clients</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">
            {customers.length} client{customers.length !== 1 ? 's' : ''} enregistré{customers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8 transition-colors duration-300">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-primary-red focus:outline-none transition-colors duration-300"
            />
          </div>
        </div>

        {/* Sort Options */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8 transition-colors duration-300">
          <div className="flex flex-wrap gap-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center transition-colors duration-300">Trier par:</span>
            <button
              onClick={() => handleSort('lastOrderDate')}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors duration-300 ${
                sortBy === 'lastOrderDate'
                  ? 'bg-primary-red text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-charcoal dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Dernière commande {sortBy === 'lastOrderDate' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('totalOrders')}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors duration-300 ${
                sortBy === 'totalOrders'
                  ? 'bg-primary-red text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-charcoal dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Commandes {sortBy === 'totalOrders' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('totalSpent')}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors duration-300 ${
                sortBy === 'totalSpent'
                  ? 'bg-primary-red text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-charcoal dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Montant dépensé {sortBy === 'totalSpent' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('totalPizzas')}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors duration-300 ${
                sortBy === 'totalPizzas'
                  ? 'bg-primary-red text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-charcoal dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Pizzas {sortBy === 'totalPizzas' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('name')}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors duration-300 ${
                sortBy === 'name'
                  ? 'bg-primary-red text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-charcoal dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Nom {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        {/* Customers List */}
        {customers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-charcoal dark:text-gray-100 mb-2 transition-colors duration-300">Aucun client</h3>
            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
              {searchTerm ? 'Aucun client ne correspond à votre recherche' : 'Aucun client enregistré pour le moment'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {customers.map(customer => (
              <div key={customer._id} className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Customer Info */}
                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-gradient-to-br from-primary-red to-soft-red p-3 rounded-2xl">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-charcoal dark:text-gray-100 mb-2 transition-colors duration-300">
                          {customer.name}
                        </h3>
                        <div className="space-y-2">
                          <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors duration-300">
                            <Phone className="w-4 h-4 text-primary-red" />
                            {customer.phone}
                          </p>
                          {customer.email && (
                            <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors duration-300">
                              <Mail className="w-4 h-4 text-primary-red" />
                              {customer.email}
                            </p>
                          )}
                          {customer.address?.street && (
                            <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors duration-300">
                              <MapPin className="w-4 h-4 text-primary-red" />
                              {customer.address.street}, {customer.address.postalCode} {customer.address.city}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-primary-yellow/10 to-primary-yellow/5 dark:from-primary-yellow/20 dark:to-primary-yellow/10 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingBag className="w-5 h-5 text-primary-red" />
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Commandes</span>
                      </div>
                      <p className="text-3xl font-black text-charcoal dark:text-gray-100 transition-colors duration-300">{customer.totalOrders}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-900/10 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <Euro className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Total dépensé</span>
                      </div>
                      <p className="text-3xl font-black text-charcoal dark:text-gray-100 transition-colors duration-300">{customer.totalSpent.toFixed(2)}€</p>
                    </div>

                    {/* Pizza Count Card */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/30 dark:to-orange-900/10 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <Pizza className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Pizzas commandées</span>
                      </div>
                      <p className="text-3xl font-black text-charcoal dark:text-gray-100 transition-colors duration-300">{customer.totalPizzas || 0}</p>
                    </div>

                    {/* Loyalty Card */}
                    {(() => {
                      const loyalty = getLoyaltyInfo(customer.totalPizzas || 0, customer.loyaltyPizzasRedeemed || 0);
                      return (
                        <div className={`rounded-2xl p-4 border transition-colors duration-300 ${
                          loyalty.availableFreePizzas > 0
                            ? 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/30 border-amber-300 dark:border-amber-700 animate-pulse'
                            : 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-900/10 border-gray-100 dark:border-gray-700'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            {loyalty.availableFreePizzas > 0 ? (
                              <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            ) : (
                              <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            )}
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">
                              {loyalty.availableFreePizzas > 0 ? 'Pizza(s) offerte(s)!' : 'Fidélité'}
                            </span>
                          </div>
                          {loyalty.availableFreePizzas > 0 ? (
                            <div>
                              <p className="text-2xl font-black text-amber-700 dark:text-amber-300">
                                {loyalty.availableFreePizzas} pizza{loyalty.availableFreePizzas > 1 ? 's' : ''} gratuite{loyalty.availableFreePizzas > 1 ? 's' : ''}!
                              </p>
                              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                11e pizza offerte
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-lg font-bold text-charcoal dark:text-gray-100">
                                {loyalty.progressToNext}/10
                              </p>
                              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-primary-red rounded-full transition-all duration-500"
                                  style={{ width: `${(loyalty.progressToNext / 10) * 100}%` }}
                                />
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Encore {10 - loyalty.progressToNext} pizza{10 - loyalty.progressToNext > 1 ? 's' : ''} pour la gratuite
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    <div className="col-span-2 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-900/10 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Dernière commande</span>
                      </div>
                      <p className="text-lg font-bold text-charcoal dark:text-gray-100 transition-colors duration-300">{formatDate(customer.lastOrderDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  <div>
                    <span className="font-semibold">Client depuis:</span>{' '}
                    {new Date(customer.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                  <div>
                    <span className="font-semibold">Panier moyen:</span>{' '}
                    {customer.totalOrders > 0
                      ? (customer.totalSpent / customer.totalOrders).toFixed(2)
                      : '0.00'}€
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
