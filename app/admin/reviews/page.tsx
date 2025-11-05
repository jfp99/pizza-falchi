'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Search, Filter, MessageSquare, CheckCircle, XCircle, Clock,
  Star, ThumbsUp, Trash2, MessageCircle, Loader2, Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SPACING, ROUNDED, SHADOWS } from '@/lib/design-constants';
import Image from 'next/image';

interface Review {
  _id: string;
  product: {
    _id: string;
    name: string;
    image: string;
    category: string;
  };
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  helpfulCount: number;
  adminResponse?: {
    message: string;
    respondedAt: string;
  };
  createdAt: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }

    fetchReviews();
  }, [session, status, router]);

  useEffect(() => {
    filterReviews();
  }, [reviews, searchTerm, filterStatus]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/admin/reviews?status=${filterStatus !== 'all' ? filterStatus : ''}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des avis');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = reviews;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(review => review.status === filterStatus);
    }

    setFilteredReviews(filtered);
  };

  const updateReviewStatus = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update review');

      toast.success(status === 'approved' ? 'Avis approuvé' : 'Avis rejeté');
      fetchReviews();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const submitResponse = async (reviewId: string) => {
    if (!responseText.trim()) {
      toast.error('Veuillez entrer une réponse');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminResponse: responseText }),
      });

      if (!response.ok) throw new Error('Failed to submit response');

      toast.success('Réponse publiée');
      setRespondingTo(null);
      setResponseText('');
      fetchReviews();
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la réponse');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return;

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete review');

      toast.success('Avis supprimé');
      fetchReviews();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-primary-yellow text-primary-yellow'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: 'En attente',
        icon: Clock,
        className: 'bg-orange-100 text-orange-700 border-orange-200',
      },
      approved: {
        label: 'Approuvé',
        icon: CheckCircle,
        className: 'bg-green-100 text-green-700 border-green-200',
      },
      rejected: {
        label: 'Rejeté',
        icon: XCircle,
        className: 'bg-red-100 text-red-700 border-red-200',
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-red" />
      </div>
    );
  }

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    averageRating: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0,
  };

  return (
    <div className="min-h-screen bg-warm-cream py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Avis <span className="bg-gradient-to-r from-primary-red to-soft-red bg-clip-text text-transparent">Clients</span>
          </h1>
          <p className="text-gray-600">Gérez et modérez les avis clients</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className={`bg-white ${ROUNDED.xl} ${SPACING.cardPadding} ${SHADOWS.md} border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-black text-gray-900">{stats.total}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className={`bg-white ${ROUNDED.xl} ${SPACING.cardPadding} ${SHADOWS.md} border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En attente</p>
                <p className="text-2xl font-black text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </div>

          <div className={`bg-white ${ROUNDED.xl} ${SPACING.cardPadding} ${SHADOWS.md} border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approuvés</p>
                <p className="text-2xl font-black text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className={`bg-white ${ROUNDED.xl} ${SPACING.cardPadding} ${SHADOWS.md} border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejetés</p>
                <p className="text-2xl font-black text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className={`bg-white ${ROUNDED.xl} ${SPACING.cardPadding} ${SHADOWS.md} border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Note moy.</p>
                <p className="text-2xl font-black text-primary-yellow">{stats.averageRating}</p>
              </div>
              <Star className="w-8 h-8 text-primary-yellow fill-primary-yellow" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={`bg-white ${ROUNDED.xl} ${SPACING.cardPadding} ${SHADOWS.md} border border-gray-100 mb-6`}>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search */}
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as any);
                fetchReviews();
              }}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none bg-white"
            >
              <option value="all">Tous les avis</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvés</option>
              <option value="rejected">Rejetés</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className={`bg-white ${ROUNDED.xl} ${SPACING.cardPaddingLg} ${SHADOWS.md} text-center`}>
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-600">Aucun avis trouvé</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review._id}
                className={`bg-white ${ROUNDED.xl} ${SPACING.cardPaddingLg} ${SHADOWS.md} border border-gray-100`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={review.product.image || '/images/pizza-placeholder.jpg'}
                        alt={review.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product & Customer Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{review.product.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-700">{review.customerName}</span>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                            <CheckCircle className="w-3 h-3" />
                            Vérifié
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                          <ThumbsUp className="w-3 h-3" />
                          {review.helpfulCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {getStatusBadge(review.status)}
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>

                {/* Admin Response */}
                {review.adminResponse && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4 mb-4">
                    <p className="text-sm font-semibold text-blue-900 mb-1">Votre réponse :</p>
                    <p className="text-sm text-blue-800">{review.adminResponse.message}</p>
                  </div>
                )}

                {/* Response Form */}
                {respondingTo === review._id && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={3}
                      placeholder="Écrivez votre réponse..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none resize-none mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setRespondingTo(null);
                          setResponseText('');
                        }}
                        disabled={isSubmitting}
                        className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition disabled:opacity-50"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => submitResponse(review._id)}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-primary-red text-white rounded-xl font-semibold hover:bg-primary-red-dark transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Envoi...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Publier
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateReviewStatus(review._id, 'approved')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approuver
                      </button>
                      <button
                        onClick={() => updateReviewStatus(review._id, 'rejected')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeter
                      </button>
                    </>
                  )}

                  {review.status === 'approved' && !review.adminResponse && (
                    <button
                      onClick={() => setRespondingTo(review._id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Répondre
                    </button>
                  )}

                  <button
                    onClick={() => deleteReview(review._id)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
