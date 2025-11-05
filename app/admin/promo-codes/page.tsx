'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Plus, Edit, Trash2, Search, Tag, Calendar, Users,
  TrendingUp, AlertCircle, CheckCircle, XCircle, Percent,
  DollarSign, Package, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SPACING, ROUNDED, SHADOWS, TRANSITIONS } from '@/lib/design-constants';

interface PromoCode {
  _id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  usagePerCustomer?: number;
  validFrom: Date | string;
  validUntil: Date | string;
  isActive: boolean;
  applicableCategories?: string[];
  excludedProducts?: string[];
  createdAt: Date | string;
}

export default function AdminPromoCodes() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [filteredCodes, setFilteredCodes] = useState<PromoCode[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed' | 'free_shipping',
    value: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    usageLimit: 0,
    usagePerCustomer: 1,
    validFrom: '',
    validUntil: '',
    isActive: true,
    applicableCategories: [] as string[],
  });

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }

    fetchPromoCodes();
  }, [session, status, router]);

  useEffect(() => {
    filterPromoCodes();
  }, [promoCodes, searchTerm, filterStatus]);

  const fetchPromoCodes = async () => {
    try {
      const res = await fetch('/api/admin/promo-codes');
      if (!res.ok) throw new Error('Failed to fetch promo codes');
      const data = await res.json();
      setPromoCodes(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des codes promo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterPromoCodes = () => {
    let filtered = promoCodes;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(code =>
        code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      const now = new Date();
      filtered = filtered.filter(code => {
        const validFrom = new Date(code.validFrom);
        const validUntil = new Date(code.validUntil);

        if (filterStatus === 'active') {
          return code.isActive && validFrom <= now && validUntil >= now;
        } else if (filterStatus === 'expired') {
          return validUntil < now;
        } else if (filterStatus === 'inactive') {
          return !code.isActive;
        }
        return true;
      });
    }

    setFilteredCodes(filtered);
  };

  const openModal = (code?: PromoCode) => {
    if (code) {
      setEditingCode(code);
      setFormData({
        code: code.code,
        description: code.description,
        type: code.type,
        value: code.value,
        minOrderAmount: code.minOrderAmount || 0,
        maxDiscount: code.maxDiscount || 0,
        usageLimit: code.usageLimit || 0,
        usagePerCustomer: code.usagePerCustomer || 1,
        validFrom: new Date(code.validFrom).toISOString().slice(0, 16),
        validUntil: new Date(code.validUntil).toISOString().slice(0, 16),
        isActive: code.isActive,
        applicableCategories: code.applicableCategories || [],
      });
    } else {
      setEditingCode(null);
      setFormData({
        code: '',
        description: '',
        type: 'percentage',
        value: 0,
        minOrderAmount: 0,
        maxDiscount: 0,
        usageLimit: 0,
        usagePerCustomer: 1,
        validFrom: '',
        validUntil: '',
        isActive: true,
        applicableCategories: [],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCode(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingCode
        ? `/api/admin/promo-codes/${editingCode._id}`
        : '/api/admin/promo-codes';

      const method = editingCode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          code: formData.code.toUpperCase().trim(),
          minOrderAmount: formData.minOrderAmount || undefined,
          maxDiscount: formData.maxDiscount || undefined,
          usageLimit: formData.usageLimit || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de l\'enregistrement');
      }

      toast.success(editingCode ? 'Code promo modifié' : 'Code promo créé');
      fetchPromoCodes();
      closeModal();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActive = async (code: PromoCode) => {
    try {
      const res = await fetch(`/api/admin/promo-codes/${code._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...code, isActive: !code.isActive }),
      });

      if (!res.ok) throw new Error('Failed to update');

      toast.success(code.isActive ? 'Code désactivé' : 'Code activé');
      fetchPromoCodes();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteCode = async (codeId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce code promo ?')) return;

    try {
      const res = await fetch(`/api/admin/promo-codes/${codeId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');

      toast.success('Code promo supprimé');
      fetchPromoCodes();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStatusBadge = (code: PromoCode) => {
    const now = new Date();
    const validFrom = new Date(code.validFrom);
    const validUntil = new Date(code.validUntil);

    if (!code.isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
          <XCircle className="w-3 h-3" />
          Inactif
        </span>
      );
    }

    if (validUntil < now) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
          <AlertCircle className="w-3 h-3" />
          Expiré
        </span>
      );
    }

    if (validFrom > now) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
          <Calendar className="w-3 h-3" />
          Programmé
        </span>
      );
    }

    if (code.usageLimit && code.usageCount >= code.usageLimit) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
          <AlertCircle className="w-3 h-3" />
          Limite atteinte
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
        <CheckCircle className="w-3 h-3" />
        Actif
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-5 h-5 text-primary-red" />;
      case 'fixed':
        return <DollarSign className="w-5 h-5 text-primary-red" />;
      case 'free_shipping':
        return <Package className="w-5 h-5 text-primary-red" />;
      default:
        return <Tag className="w-5 h-5 text-primary-red" />;
    }
  };

  const getTypeLabel = (type: string, value: number) => {
    switch (type) {
      case 'percentage':
        return `${value}%`;
      case 'fixed':
        return `${value}€`;
      case 'free_shipping':
        return 'Livraison gratuite';
      default:
        return value;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Codes <span className="bg-gradient-to-r from-primary-red to-soft-red bg-clip-text text-transparent">Promo</span>
          </h1>
          <p className="text-gray-600">Gérez les codes promotionnels et les offres spéciales</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`bg-white ${ROUNDED.xl} ${SPACING.cardPadding} ${SHADOWS.md} border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-black text-gray-900">{promoCodes.length}</p>
              </div>
              <Tag className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className={`bg-white ${ROUNDED.xl} ${SPACING.cardPadding} ${SHADOWS.md} border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Actifs</p>
                <p className="text-2xl font-black text-green-600">
                  {promoCodes.filter(c => {
                    const now = new Date();
                    return c.isActive && new Date(c.validFrom) <= now && new Date(c.validUntil) >= now;
                  }).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className={`bg-white ${ROUNDED.xl} ${SPACING.cardPadding} ${SHADOWS.md} border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Utilisations</p>
                <p className="text-2xl font-black text-primary-red">
                  {promoCodes.reduce((sum, code) => sum + code.usageCount, 0)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary-red" />
            </div>
          </div>

          <div className={`bg-white ${ROUNDED.xl} ${SPACING.cardPadding} ${SHADOWS.md} border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Expirés</p>
                <p className="text-2xl font-black text-orange-600">
                  {promoCodes.filter(c => new Date(c.validUntil) < new Date()).length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className={`bg-white ${ROUNDED.xl} ${SPACING.cardPadding} ${SHADOWS.md} border border-gray-100 mb-6`}>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none bg-white"
            >
              <option value="all">Tous les codes</option>
              <option value="active">Actifs</option>
              <option value="expired">Expirés</option>
              <option value="inactive">Inactifs</option>
            </select>

            {/* Add Button */}
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-primary-red to-soft-red text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Nouveau Code
            </button>
          </div>
        </div>

        {/* Promo Codes Table */}
        <div className={`bg-white ${ROUNDED.xl} ${SHADOWS.md} border border-gray-100 overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Valeur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Utilisations
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCodes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 font-semibold">Aucun code promo trouvé</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {searchTerm || filterStatus !== 'all'
                          ? 'Essayez de modifier vos filtres'
                          : 'Créez votre premier code promo'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredCodes.map((code) => (
                    <tr key={code._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-900">{code.code}</p>
                          <p className="text-sm text-gray-600">{code.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(code.type)}
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {code.type === 'percentage' ? 'Pourcentage' : code.type === 'fixed' ? 'Montant fixe' : 'Livraison gratuite'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-primary-red">
                          {getTypeLabel(code.type, code.value)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-600">
                            Du {new Date(code.validFrom).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-gray-600">
                            Au {new Date(code.validUntil).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">
                            {code.usageCount} {code.usageLimit && `/ ${code.usageLimit}`}
                          </p>
                          {code.usagePerCustomer && (
                            <p className="text-gray-500 text-xs">
                              Max {code.usagePerCustomer}/client
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(code)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleActive(code)}
                            className={`p-2 rounded-lg transition ${
                              code.isActive
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-gray-400 hover:bg-gray-50'
                            }`}
                            title={code.isActive ? 'Désactiver' : 'Activer'}
                          >
                            {code.isActive ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <XCircle className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => openModal(code)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Modifier"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteCode(code._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white ${ROUNDED.xl} max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCode ? 'Modifier le code promo' : 'Nouveau code promo'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Code & Description */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Code <span className="text-primary-red">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none"
                      placeholder="PROMO20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Type <span className="text-primary-red">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none"
                    >
                      <option value="percentage">Pourcentage</option>
                      <option value="fixed">Montant fixe</option>
                      <option value="free_shipping">Livraison gratuite</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description <span className="text-primary-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none"
                    placeholder="Réduction de 20% sur toutes les pizzas"
                  />
                </div>

                {/* Value & Limits */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Valeur <span className="text-primary-red">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none"
                      placeholder={formData.type === 'percentage' ? '20' : '5'}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.type === 'percentage' ? 'En pourcentage' : 'En euros'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Commande min.
                    </label>
                    <input
                      type="number"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none"
                      placeholder="0"
                    />
                  </div>

                  {formData.type === 'percentage' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Réduction max.
                      </label>
                      <input
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none"
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>

                {/* Usage Limits */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Limite d'utilisation
                    </label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                      min="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none"
                      placeholder="0 = illimité"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Max par client
                    </label>
                    <input
                      type="number"
                      value={formData.usagePerCustomer}
                      onChange={(e) => setFormData({ ...formData, usagePerCustomer: Number(e.target.value) })}
                      min="1"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none"
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* Validity Period */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Valide du <span className="text-primary-red">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Valide jusqu'au <span className="text-primary-red">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none"
                    />
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 text-primary-red border-gray-300 rounded focus:ring-primary-red"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold text-gray-900">
                    Code actif
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-red to-soft-red text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        {editingCode ? 'Modifier' : 'Créer'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
