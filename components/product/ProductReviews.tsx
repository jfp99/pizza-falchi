'use client';
import { useState, useEffect } from 'react';
import { Star, ThumbsUp, CheckCircle, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { SPACING, ROUNDED, SHADOWS } from '@/lib/design-constants';

interface Review {
  _id: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
  createdAt: string;
  adminResponse?: {
    message: string;
    respondedAt: string;
  };
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    rating: 0,
    title: '',
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `/api/reviews?productId=${productId}&status=approved&sortBy=${sortBy}`
      );
      const data = await response.json();
      setReviews(data.reviews || []);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error('Veuillez sélectionner une note');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi de l\'avis');
      }

      toast.success(data.message);
      setShowReviewForm(false);
      setFormData({
        customerName: '',
        customerEmail: '',
        rating: 0,
        title: '',
        comment: '',
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
      });

      if (response.ok) {
        // Update local state
        setReviews(reviews.map(review =>
          review._id === reviewId
            ? { ...review, helpfulCount: review.helpfulCount + 1 }
            : review
        ));
        toast.success('Merci pour votre retour !');
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'fill-primary-yellow text-primary-yellow'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingSelector = () => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, rating: star })}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hoveredRating || formData.rating)
                  ? 'fill-primary-yellow text-primary-yellow'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-red" />
      </div>
    );
  }

  return (
    <div className={`bg-white ${ROUNDED.xl} ${SPACING.cardPaddingLg} ${SHADOWS.md} border border-gray-100`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            Avis clients
          </h2>
          {stats && stats.totalReviews > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {renderStars(Math.round(stats.averageRating), 'lg')}
                <span className="text-3xl font-black text-gray-900">
                  {stats.averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-600">
                ({stats.totalReviews} avis)
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="bg-gradient-to-r from-primary-red to-soft-red text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          Laisser un avis
        </button>
      </div>

      {/* Rating Distribution */}
      {stats && stats.totalReviews > 0 && (
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">Répartition des notes</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.distribution[rating as keyof typeof stats.distribution];
              const percentage = (count / stats.totalReviews) * 100;

              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-12">
                    {rating} {renderStars(rating, 'sm')}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-yellow rounded-full h-3 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 pb-8 border-b border-gray-200">
          <div className="bg-warm-cream rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Partagez votre expérience
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nom <span className="text-primary-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email <span className="text-primary-red">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Note <span className="text-primary-red">*</span>
                </label>
                {renderRatingSelector()}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Titre <span className="text-primary-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none"
                  placeholder="Résumez votre expérience"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Commentaire <span className="text-primary-red">*</span>
                </label>
                <textarea
                  required
                  maxLength={1000}
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none resize-none"
                  placeholder="Partagez votre avis sur ce produit..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.comment.length}/1000 caractères
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  Votre avis sera publié après modération. Les avis vérifiés proviennent de clients ayant commandé ce produit.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
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
                      Envoi...
                    </>
                  ) : (
                    'Publier l\'avis'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sort Options */}
      {reviews.length > 0 && (
        <div className="mb-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-red focus:outline-none bg-white"
          >
            <option value="recent">Plus récents</option>
            <option value="rating">Meilleure note</option>
            <option value="helpful">Plus utiles</option>
          </select>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-600 mb-2">
              Aucun avis pour le moment
            </p>
            <p className="text-gray-500">
              Soyez le premier à donner votre avis sur {productName} !
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-gray-900">
                      {review.customerName}
                    </span>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle className="w-3 h-3" />
                        Achat vérifié
                      </span>
                    )}
                  </div>
                  {renderStars(review.rating, 'sm')}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>
              <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>

              {/* Admin Response */}
              {review.adminResponse && (
                <div className="bg-gray-50 border-l-4 border-primary-red rounded-r-xl p-4 mb-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Réponse de l'équipe Pizza Falchi
                  </p>
                  <p className="text-sm text-gray-700">{review.adminResponse.message}</p>
                </div>
              )}

              {/* Helpful Button */}
              <button
                onClick={() => handleMarkHelpful(review._id)}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-red transition"
              >
                <ThumbsUp className="w-4 h-4" />
                Utile ({review.helpfulCount})
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
