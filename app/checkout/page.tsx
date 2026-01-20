'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { Package, Truck, User, Phone, Mail, MapPin, CreditCard, FileText, ShoppingBag, ArrowLeft, Check, Loader2, Banknote, Globe, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePaymentForm from '@/components/checkout/StripePaymentForm';
import TimeSlotSelector from '@/components/checkout/TimeSlotSelector';
import toast from 'react-hot-toast';
import { SPACING, ROUNDED, SHADOWS, TRANSITIONS } from '@/lib/design-constants';
import { checkoutAnalytics } from '@/lib/analytics';
import { useCSRF } from '@/hooks/useCSRF';
import type { TimeSlot } from '@/types';

// Only load Stripe if a valid publishable key is configured
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const isStripeConfigured = stripeKey && !stripeKey.includes('your_stripe') && stripeKey.startsWith('pk_');
const stripePromise = isStripeConfigured ? loadStripe(stripeKey) : null;

export default function Checkout() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { token: csrfToken, getHeaders: getCSRFHeaders } = useCSRF();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  // Form state
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
    paymentMethod: 'cash' as 'cash' | 'card' | 'online',
    notes: ''
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (items.length === 0) {
      router.push('/menu');
    } else {
      // Track begin checkout
      checkoutAnalytics.beginCheckout(getTotal(), items.length);
    }
  }, [items, router]);

  // Calculate total number of pizzas in the cart
  const totalPizzas = items.reduce((total, item) => {
    if (item.product.category === 'pizza') {
      return total + item.quantity;
    }
    return total;
  }, 0);

  const subtotal = getTotal();
  const total = subtotal;

  // Create payment intent when online payment is selected
  useEffect(() => {
    if (formData.paymentMethod === 'online' && !clientSecret && total > 0) {
      createPaymentIntent();
    }
  }, [formData.paymentMethod, total]);

  const createPaymentIntent = async () => {
    setIsLoadingPayment(true);
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getCSRFHeaders(),
        },
        body: JSON.stringify({ amount: total }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast.error('Erreur lors de l\'initialisation du paiement');
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Le nom est requis';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    // Time slot required for pickup orders
    if (deliveryType === 'pickup' && !selectedSlot) {
      newErrors.timeSlot = 'Veuillez sélectionner un créneau horaire';
      toast.error('Veuillez sélectionner un créneau horaire');
    }

    if (deliveryType === 'delivery') {
      if (!formData.street.trim()) newErrors.street = 'Adresse requise';
      if (!formData.city.trim()) newErrors.city = 'Ville requise';
      if (!formData.postalCode.trim()) newErrors.postalCode = 'Code postal requis';
    }

    // CGV acceptance validation
    if (!acceptedTerms) {
      newErrors.terms = 'Vous devez accepter les CGV pour continuer';
      toast.error('Veuillez accepter les Conditions Générales de Vente');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    // For online payment, the form submission is handled by Stripe
    if (formData.paymentMethod === 'online') {
      return;
    }

    await submitOrder();
  };

  const submitOrder = async (paymentIntentId?: string) => {
    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        } : undefined,
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          customizations: item.customizations,
          total: item.product.price * item.quantity
        })),
        subtotal,
        tax: 0,
        deliveryFee: 0,
        total,
        paymentMethod: formData.paymentMethod,
        paymentIntentId,
        notes: formData.notes,
        // Time slot information
        timeSlot: selectedSlot?._id,
        scheduledTime: selectedSlot ? new Date(selectedSlot.date) : undefined,
        pickupTimeRange: selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : undefined,
        assignedBy: 'customer' as const,
        isManualAssignment: false
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getCSRFHeaders(),
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Order creation failed:', { status: response.status, errorData });
        throw new Error(errorData.message || errorData.error || 'Erreur lors de la création de la commande');
      }

      const order = await response.json();

      // Track purchase completion
      checkoutAnalytics.purchase(order._id, total, items.length);

      // Clear cart
      clearCart();

      // Redirect to confirmation page
      toast.success('Commande créée avec succès !');
      router.push(`/order-confirmation/${order._id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStripeSuccess = async () => {
    await submitOrder();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentMethodChange = (method: 'cash' | 'card' | 'online') => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
    if (method !== 'online') {
      setClientSecret(null);
    }
    // Track payment method selection
    checkoutAnalytics.addPaymentInfo(method);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-primary-red dark:text-primary-red-light hover:text-primary-red-dark dark:hover:text-primary-red transition font-semibold mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            Retour au panier
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-text-primary dark:text-text-primary mb-2 transition-colors duration-200">
            Finaliser la <span className="text-brand-red">Commande</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Plus qu'une étape avant de déguster vos délicieuses pizzas !
          </p>
        </div>

        <form onSubmit={handleSubmit} className={`grid lg:grid-cols-3 ${SPACING.cardGap}`}>
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Type Selection */}
            <div className={`bg-white dark:bg-gray-800 ${ROUNDED.xl} ${SPACING.cardPaddingLg} ${SHADOWS.md} border border-gray-100 dark:border-gray-700 transition-colors duration-300`}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3 transition-colors duration-300">
                <div className="bg-primary-red/10 dark:bg-primary-red/20 p-2 rounded-xl transition-colors duration-300">
                  <ShoppingBag className="w-6 h-6 text-primary-red dark:text-primary-red-light transition-colors duration-300" />
                </div>
                Mode de récupération
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-200 ${
                    deliveryType === 'pickup'
                      ? 'border-brand-red bg-brand-red/10 shadow-soft-md'
                      : 'border-border dark:border-border hover:border-brand-red/50 hover:shadow-soft-sm'
                  }`}
                >
                  {deliveryType === 'pickup' && (
                    <div className="absolute top-3 right-3 bg-primary-red text-white rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  <Package className={`w-10 h-10 mb-3 transition-colors duration-300 ${deliveryType === 'pickup' ? 'text-primary-red dark:text-primary-red-light' : 'text-gray-400 dark:text-gray-500'}`} />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 transition-colors duration-300">À Emporter</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-300">Retrait sur place</p>
                  <p className="text-primary-red dark:text-primary-red-light font-bold text-lg transition-colors duration-300">Gratuit</p>
                </button>

                <button
                  type="button"
                  disabled
                  className="relative p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60 cursor-not-allowed transition-colors duration-300"
                >
                  <div className="absolute top-3 right-3 bg-gray-400 dark:bg-gray-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Bientôt
                  </div>
                  <Truck className="w-10 h-10 mb-3 text-gray-400 dark:text-gray-500" />
                  <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-1">Livraison</h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">Temporairement indisponible</p>
                  <p className="font-bold text-lg text-gray-400 dark:text-gray-500">
                    {subtotal >= 30 ? 'Gratuit !' : '5,00€'}
                  </p>
                </button>
              </div>
            </div>

            {/* Time Slot Selection (only for pickup) */}
            {deliveryType === 'pickup' && (
              <TimeSlotSelector
                onSlotSelect={setSelectedSlot}
                selectedSlot={selectedSlot}
                pizzaCount={totalPizzas}
              />
            )}

            {/* Customer Information */}
            <div className={`bg-white dark:bg-gray-800 ${ROUNDED.xl} ${SPACING.cardPaddingLg} ${SHADOWS.md} border border-gray-100 dark:border-gray-700 transition-colors duration-300`}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3 transition-colors duration-300">
                <div className="bg-primary-red/10 dark:bg-primary-red/20 p-2 rounded-xl transition-colors duration-300">
                  <User className="w-6 h-6 text-primary-red dark:text-primary-red-light transition-colors duration-300" />
                </div>
                Vos informations
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
                    Nom complet <span className="text-primary-red dark:text-primary-red-light">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.customerName ? 'border-red-500 bg-red-50 dark:bg-red-900/30 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } focus:ring-2 focus:ring-primary-red focus:border-primary-red transition-colors duration-300 text-gray-900 dark:text-gray-100`}
                    placeholder="Jean Dupont"
                    aria-invalid={!!errors.customerName}
                    aria-describedby={errors.customerName ? 'customerName-error' : undefined}
                  />
                  {errors.customerName && (
                    <p id="customerName-error" className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2 bg-red-50 dark:bg-red-900/30 p-2 rounded-lg border border-red-200 dark:border-red-700 transition-colors duration-300">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <span>{errors.customerName}</span>
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
                      Téléphone <span className="text-primary-red dark:text-primary-red-light">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        errors.phone ? 'border-red-500 bg-red-50 dark:bg-red-900/30 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                      } focus:ring-2 focus:ring-primary-red focus:border-primary-red transition-colors duration-300 text-gray-900 dark:text-gray-100`}
                      placeholder="06 12 34 56 78"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && (
                      <p id="phone-error" className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2 bg-red-50 dark:bg-red-900/30 p-2 rounded-lg border border-red-200 dark:border-red-700 transition-colors duration-300">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
                      Email <span className="text-gray-400 dark:text-gray-500 text-xs">(optionnel)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/30 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                      } focus:ring-2 focus:ring-primary-red focus:border-primary-red transition-colors duration-300 text-gray-900 dark:text-gray-100`}
                      placeholder="jean.dupont@email.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2 bg-red-50 dark:bg-red-900/30 p-2 rounded-lg border border-red-200 dark:border-red-700 transition-colors duration-300">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address (conditional) */}
            {deliveryType === 'delivery' && (
              <div className={`bg-white dark:bg-gray-800 ${ROUNDED.xl} ${SPACING.cardPaddingLg} ${SHADOWS.md} border border-gray-100 dark:border-gray-700 transition-colors duration-300`}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3 transition-colors duration-300">
                  <div className="bg-primary-red/10 dark:bg-primary-red/20 p-2 rounded-xl transition-colors duration-300">
                    <MapPin className="w-6 h-6 text-primary-red dark:text-primary-red-light transition-colors duration-300" />
                  </div>
                  Adresse de livraison
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Rue et numéro <span className="text-primary-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        errors.street ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-200'
                      } focus:ring-2 focus:ring-primary-red focus:border-primary-red transition`}
                      placeholder="123 Rue de la Pizza"
                      aria-invalid={!!errors.street}
                      aria-describedby={errors.street ? 'street-error' : undefined}
                    />
                    {errors.street && (
                      <p id="street-error" className="mt-2 text-sm text-red-600 flex items-center gap-2 bg-red-50 p-2 rounded-lg border border-red-200">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                        <span>{errors.street}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Code postal <span className="text-primary-red">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          errors.postalCode ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-200'
                        } focus:ring-2 focus:ring-primary-red focus:border-primary-red transition`}
                        placeholder="13000"
                        aria-invalid={!!errors.postalCode}
                        aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
                      />
                      {errors.postalCode && (
                        <p id="postalCode-error" className="mt-2 text-sm text-red-600 flex items-center gap-2 bg-red-50 p-2 rounded-lg border border-red-200">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                          <span>{errors.postalCode}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Ville <span className="text-primary-red">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          errors.city ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-200'
                        } focus:ring-2 focus:ring-primary-red focus:border-primary-red transition`}
                        placeholder="Aix-en-Provence"
                        aria-invalid={!!errors.city}
                        aria-describedby={errors.city ? 'city-error' : undefined}
                      />
                      {errors.city && (
                        <p id="city-error" className="mt-2 text-sm text-red-600 flex items-center gap-2 bg-red-50 p-2 rounded-lg border border-red-200">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                          <span>{errors.city}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className={`bg-white dark:bg-gray-800 ${ROUNDED.xl} ${SPACING.cardPaddingLg} ${SHADOWS.md} border border-gray-100 dark:border-gray-700 transition-colors duration-300`}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3 transition-colors duration-300">
                <div className="bg-primary-red/10 dark:bg-primary-red/20 p-2 rounded-xl transition-colors duration-300">
                  <CreditCard className="w-6 h-6 text-primary-red dark:text-primary-red-light transition-colors duration-300" />
                </div>
                Mode de paiement
              </h2>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('cash')}
                  className={`relative p-5 rounded-2xl border-2 transition-all duration-200 ${
                    formData.paymentMethod === 'cash'
                      ? 'border-brand-red bg-brand-red/10 shadow-soft-md'
                      : 'border-border dark:border-border hover:border-brand-red/50 hover:shadow-soft-sm'
                  }`}
                >
                  {formData.paymentMethod === 'cash' && (
                    <div className="absolute top-2 right-2 bg-primary-red text-white rounded-full p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                  <div className="flex items-center justify-center mb-2">
                    <Banknote className="w-8 h-8 text-primary-red dark:text-primary-red-light transition-colors duration-300" />
                  </div>
                  <p className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Espèces</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">À la livraison</p>
                </button>

                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('card')}
                  className={`relative p-5 rounded-2xl border-2 transition-all duration-200 ${
                    formData.paymentMethod === 'card'
                      ? 'border-brand-red bg-brand-red/10 shadow-soft-md'
                      : 'border-border dark:border-border hover:border-brand-red/50 hover:shadow-soft-sm'
                  }`}
                >
                  {formData.paymentMethod === 'card' && (
                    <div className="absolute top-2 right-2 bg-primary-red text-white rounded-full p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                  <div className="flex items-center justify-center mb-2">
                    <CreditCard className="w-8 h-8 text-primary-red dark:text-primary-red-light transition-colors duration-300" />
                  </div>
                  <p className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Carte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">À la livraison</p>
                </button>

                <button
                  type="button"
                  disabled
                  className="relative p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60 cursor-not-allowed transition-colors duration-300"
                >
                  <div className="absolute top-2 right-2 bg-gray-400 dark:bg-gray-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                    Bientôt
                  </div>
                  <div className="flex items-center justify-center mb-2 opacity-50">
                    <Globe className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="font-bold text-gray-500 dark:text-gray-400">En ligne</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Temporairement indisponible</p>
                </button>
              </div>

              {/* Stripe Payment Form - Only shown if Stripe is properly configured */}
              {formData.paymentMethod === 'online' && isStripeConfigured && (
                <div>
                  {isLoadingPayment ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary-red" />
                    </div>
                  ) : clientSecret && stripePromise ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <StripePaymentForm onSuccess={handleStripeSuccess} total={total} />
                    </Elements>
                  ) : null}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className={`bg-white dark:bg-gray-800 ${ROUNDED.xl} ${SPACING.cardPaddingLg} ${SHADOWS.md} border border-gray-100 dark:border-gray-700 transition-colors duration-300`}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3 transition-colors duration-300">
                <div className="bg-primary-red/10 dark:bg-primary-red/20 p-2 rounded-xl transition-colors duration-300">
                  <FileText className="w-6 h-6 text-primary-red dark:text-primary-red-light transition-colors duration-300" />
                </div>
                Notes <span className="text-gray-400 dark:text-gray-500 text-base font-normal">(optionnel)</span>
              </h2>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-red focus:border-primary-red transition-colors duration-300 resize-none"
                placeholder="Instructions spéciales, allergies, préférences de cuisson..."
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-6 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center justify-between transition-colors duration-300">
                <span>Récapitulatif</span>
                <div className="bg-primary-red/10 dark:bg-primary-red/20 p-2 rounded-xl transition-colors duration-300">
                  <ShoppingBag className="w-5 h-5 text-primary-red dark:text-primary-red-light transition-colors duration-300" />
                </div>
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-2">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-300">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm transition-colors duration-300">{item.product.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Qté: {item.quantity} × {item.product.price.toFixed(2)}€</p>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {(item.product.price * item.quantity).toFixed(2)}€
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3 mb-6 transition-colors duration-300">
                <div className="flex justify-between text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  <span>Sous-total (TTC)</span>
                  <span className="font-semibold">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="border-t border-border dark:border-border pt-3 flex justify-between items-center transition-colors duration-200">
                  <span className="text-xl font-black text-text-primary dark:text-text-primary transition-colors duration-200">Total TTC</span>
                  <span className="text-3xl font-black text-brand-red">
                    {total.toFixed(2)}€
                  </span>
                </div>
              </div>

              {/* CGV Acceptance Checkbox */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-primary-red focus:ring-2 focus:ring-primary-red focus:ring-offset-2 cursor-pointer transition-all"
                    />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 leading-tight">
                    J'ai lu et j'accepte les{' '}
                    <Link href="/conditions-generales-vente" target="_blank" className="text-primary-red font-semibold hover:underline">
                      Conditions Générales de Vente
                    </Link>{' '}
                    et la{' '}
                    <Link href="/politique-confidentialite" target="_blank" className="text-primary-red font-semibold hover:underline">
                      Politique de Confidentialité
                    </Link>
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Submit Button - Only for cash/card payments */}
              {formData.paymentMethod !== 'online' && (
                <button
                  type="submit"
                  disabled={isSubmitting || !acceptedTerms}
                  className="w-full bg-brand-red hover:bg-brand-red-hover text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-200 shadow-soft-md hover:shadow-soft-lg active:scale-98 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Traitement...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-6 h-6" />
                      <span>Confirmer la commande</span>
                    </>
                  )}
                </button>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 transition-colors duration-300">
                En confirmant votre commande, vos données seront traitées conformément à notre politique de confidentialité
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
