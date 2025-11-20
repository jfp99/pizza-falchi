'use client';

import { useState, useEffect } from 'react';
import { X, Phone, User, MapPin, Plus, Minus, ShoppingCart, Pizza, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import type { TimeSlot, Product } from '@/types';

interface QuickPhoneOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: TimeSlot;
  onOrderCreated: () => void;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

export default function QuickPhoneOrderModal({
  isOpen,
  onClose,
  slot,
  onOrderCreated,
}: QuickPhoneOrderModalProps) {
  const [step, setStep] = useState<'customer' | 'pizzas' | 'drinks' | 'confirm'>('customer');
  const [loading, setLoading] = useState(false);

  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Puyricard');
  const [postalCode, setPostalCode] = useState('13540');

  // Products
  const [pizzas, setPizzas] = useState<Product[]>([]);
  const [drinks, setDrinks] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Cart
  const [cart, setCart] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      resetForm();
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Don't interfere with input fields
      if ((e.target as HTMLElement).tagName === 'INPUT') {
        return;
      }

      // Enter to proceed to next step or submit
      if (e.key === 'Enter') {
        if (step === 'confirm') {
          handleSubmit();
        } else {
          // Check if can proceed inline to avoid dependency issue
          const canProceedNow =
            (step === 'customer' && customerName.trim() && phone.trim() && (deliveryType === 'pickup' || address.trim())) ||
            (step === 'pizzas' && cart.length > 0) ||
            (step === 'drinks' && cart.length > 0);

          if (canProceedNow) {
            handleNext();
          }
        }
        return;
      }

      // Number keys (1-9) to add pizzas on pizza step
      if (step === 'pizzas' && /^[1-9]$/.test(e.key)) {
        const index = parseInt(e.key) - 1;
        if (index < pizzas.length) {
          addToCart(pizzas[index]);
        }
        return;
      }

      // Number keys (1-9) to add drinks on drinks step
      if (step === 'drinks' && /^[1-9]$/.test(e.key)) {
        const index = parseInt(e.key) - 1;
        if (index < drinks.length) {
          addToCart(drinks[index]);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, step, pizzas, drinks, cart, customerName, phone, deliveryType, address]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');

      const products: Product[] = await response.json();

      setPizzas(products.filter(p => p.category === 'pizza' && p.available));
      setDrinks(products.filter(p => p.category === 'boisson' && p.available));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoadingProducts(false);
    }
  };

  const resetForm = () => {
    setStep('customer');
    setCustomerName('');
    setPhone('');
    setDeliveryType('pickup');
    setAddress('');
    setCart([]);
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product._id === product._id);
    if (existing) {
      setCart(cart.map(item =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    toast.success(`${product.name} ajouté`);
  };

  const removeFromCart = (productId: string) => {
    const existing = cart.find(item => item.product._id === productId);
    if (!existing) return;

    if (existing.quantity > 1) {
      setCart(cart.map(item =>
        item.product._id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.product._id !== productId));
    }
  };

  const getPizzaCount = () => {
    return cart
      .filter(item => item.product.category === 'pizza')
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const deliveryFee = deliveryType === 'delivery' ? 3.00 : 0;
    return subtotal + deliveryFee;
  };

  const canProceed = () => {
    if (step === 'customer') {
      return customerName.trim() && phone.trim() && (deliveryType === 'pickup' || address.trim());
    }
    if (step === 'pizzas' || step === 'drinks') {
      return cart.length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 'customer') setStep('pizzas');
    else if (step === 'pizzas') setStep('drinks');
    else if (step === 'drinks') setStep('confirm');
  };

  const handleBack = () => {
    if (step === 'drinks') setStep('pizzas');
    else if (step === 'pizzas') setStep('customer');
    else if (step === 'confirm') setStep('drinks');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Calculate pizza count
      const pizzaCount = getPizzaCount();

      // Check if slot can accept this order
      const remainingCapacity = slot.capacity - (slot.pizzaCount || 0);
      if (pizzaCount > remainingCapacity) {
        toast.error(`Ce créneau ne peut accepter que ${remainingCapacity} pizza(s) supplémentaire(s)`);
        setLoading(false);
        return;
      }

      // Get fresh CSRF token
      let csrfToken = '';
      try {
        const csrfResponse = await fetch('/api/csrf');
        if (!csrfResponse.ok) {
          throw new Error('Failed to get CSRF token');
        }
        const csrfData = await csrfResponse.json();
        csrfToken = csrfData.token;
      } catch (csrfError) {
        console.error('CSRF token error:', csrfError);
        toast.error('Erreur de sécurité. Veuillez recharger la page.');
        setLoading(false);
        return;
      }

      // Prepare order data
      const orderData = {
        customerName,
        phone,
        email: '', // Phone orders may not have email
        deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? {
          street: address,
          city,
          postalCode,
          country: 'France'
        } : undefined,
        items: cart.map(item => ({
          product: item.product._id, // Field name must match validation schema
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity, // Required by Mongoose OrderItemSchema
        })),
        subtotal: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        tax: 0,
        deliveryFee: deliveryType === 'delivery' ? 3.00 : 0,
        total: getTotal(),
        paymentMethod: 'cash', // Phone orders are typically cash
        paymentStatus: 'pending',
        notes: 'Commande téléphonique',
        timeSlot: slot._id,
        scheduledTime: new Date(`${slot.date.toString().split('T')[0]}T${slot.startTime}`),
        pickupTimeRange: `${slot.startTime} - ${slot.endTime}`,
        assignedBy: 'cashier',
        isManualAssignment: true,
      };

      // Create order with CSRF token
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }

      const order = await response.json();
      toast.success(`Commande créée pour ${customerName} !`);

      onOrderCreated();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const pizzaCount = getPizzaCount();
  const remainingCapacity = slot.capacity - (slot.pizzaCount || 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-red to-primary-yellow p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <Phone className="w-6 h-6" />
              Commande Téléphonique
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              Créneau: <strong>{slot.startTime} - {slot.endTime}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Pizza className="w-4 h-4" />
              Capacité: <strong>{slot.pizzaCount || 0}/{slot.capacity}</strong>
            </span>
          </div>

          {/* Warning if low capacity */}
          {remainingCapacity <= 2 && (
            <div className="mt-3 bg-orange-500/20 backdrop-blur rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">
                Attention: seulement {remainingCapacity} pizza(s) disponible(s) dans ce créneau
              </span>
            </div>
          )}

          {/* Progress Steps */}
          <div className="mt-4 flex items-center gap-2">
            {['customer', 'pizzas', 'drinks', 'confirm'].map((s, index) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full ${
                  step === s ? 'bg-white' : index < ['customer', 'pizzas', 'drinks', 'confirm'].indexOf(step) ? 'bg-white/60' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Customer Info */}
          {step === 'customer' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-charcoal flex items-center gap-2">
                <User className="w-5 h-5 text-primary-red" />
                Informations Client
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom du client *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-primary-red focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-primary-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type de service *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-4 rounded-xl border-2 font-bold transition-all ${
                      deliveryType === 'pickup'
                        ? 'bg-primary-red text-white border-primary-red'
                        : 'bg-white text-charcoal border-gray-300 hover:border-primary-red'
                    }`}
                  >
                    À Emporter
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-4 rounded-xl border-2 font-bold transition-all ${
                      deliveryType === 'delivery'
                        ? 'bg-primary-red text-white border-primary-red'
                        : 'bg-white text-charcoal border-gray-300 hover:border-primary-red'
                    }`}
                  >
                    Livraison
                  </button>
                </div>
              </div>

              {deliveryType === 'delivery' && (
                <div className="space-y-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <h4 className="font-bold text-charcoal flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Adresse de livraison
                  </h4>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Rue de la Pizza"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-primary-red focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ville"
                      className="px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-primary-red focus:outline-none"
                    />
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Code postal"
                      className="px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-primary-red focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Pizzas */}
          {step === 'pizzas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-charcoal flex items-center gap-2">
                  <Pizza className="w-5 h-5 text-primary-red" />
                  Sélection des Pizzas
                </h3>
                <div className="text-xs text-gray-500 font-semibold">
                  💡 Raccourcis: 1-9 pour ajouter, Entrée pour continuer
                </div>
              </div>

              {pizzaCount > remainingCapacity && (
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <p className="text-sm font-semibold text-red-700">
                    Vous avez sélectionné {pizzaCount} pizza(s) mais le créneau ne peut accepter que {remainingCapacity} pizza(s) supplémentaire(s)
                  </p>
                </div>
              )}

              {loadingProducts ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-red border-t-transparent"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pizzas.map((pizza, index) => {
                    const inCart = cart.find(item => item.product._id === pizza._id);
                    const shortcutNumber = index + 1;
                    return (
                      <div
                        key={pizza._id}
                        className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary-red transition-colors relative"
                      >
                        {shortcutNumber <= 9 && (
                          <div className="absolute top-2 left-2 w-6 h-6 bg-gray-200 text-gray-700 rounded-md flex items-center justify-center text-xs font-bold">
                            {shortcutNumber}
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1 ml-8">
                            <h4 className="font-bold text-charcoal">{pizza.name}</h4>
                            <p className="text-sm text-gray-600 font-semibold">{pizza.price.toFixed(2)}€</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {inCart && (
                              <>
                                <button
                                  onClick={() => removeFromCart(pizza._id!)}
                                  className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-bold">{inCart.quantity}</span>
                              </>
                            )}
                            <button
                              onClick={() => addToCart(pizza)}
                              className="w-8 h-8 rounded-lg bg-primary-red text-white hover:bg-primary-red/90 flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Drinks */}
          {step === 'drinks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-charcoal flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary-red" />
                  Boissons et Accompagnements (optionnel)
                </h3>
                <div className="text-xs text-gray-500 font-semibold">
                  💡 Raccourcis: 1-9 pour ajouter, Entrée pour continuer
                </div>
              </div>

              {loadingProducts ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-red border-t-transparent"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {drinks.map((drink, index) => {
                    const inCart = cart.find(item => item.product._id === drink._id);
                    const shortcutNumber = index + 1;
                    return (
                      <div
                        key={drink._id}
                        className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary-red transition-colors relative"
                      >
                        {shortcutNumber <= 9 && (
                          <div className="absolute top-2 left-2 w-6 h-6 bg-gray-200 text-gray-700 rounded-md flex items-center justify-center text-xs font-bold">
                            {shortcutNumber}
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1 ml-8">
                            <h4 className="font-bold text-charcoal">{drink.name}</h4>
                            <p className="text-sm text-gray-600 font-semibold">{drink.price.toFixed(2)}€</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {inCart && (
                              <>
                                <button
                                  onClick={() => removeFromCart(drink._id!)}
                                  className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-bold">{inCart.quantity}</span>
                              </>
                            )}
                            <button
                              onClick={() => addToCart(drink)}
                              className="w-8 h-8 rounded-lg bg-primary-red text-white hover:bg-primary-red/90 flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-charcoal">Récapitulatif</h3>

              {/* Customer Info */}
              <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                <h4 className="font-bold text-charcoal mb-2">Client</h4>
                <p className="text-sm"><strong>Nom:</strong> {customerName}</p>
                <p className="text-sm"><strong>Téléphone:</strong> {phone}</p>
                <p className="text-sm"><strong>Service:</strong> {deliveryType === 'pickup' ? 'À emporter' : 'Livraison'}</p>
                {deliveryType === 'delivery' && (
                  <p className="text-sm"><strong>Adresse:</strong> {address}, {city} {postalCode}</p>
                )}
              </div>

              {/* Cart Items */}
              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                <h4 className="font-bold text-charcoal mb-2">Articles</h4>
                {cart.map(item => (
                  <div key={item.product._id} className="flex justify-between text-sm mb-1">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span className="font-bold">{(item.product.price * item.quantity).toFixed(2)}€</span>
                  </div>
                ))}
                {deliveryType === 'delivery' && (
                  <div className="flex justify-between text-sm mb-1 text-gray-600">
                    <span>Frais de livraison</span>
                    <span className="font-bold">3.00€</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-black mt-2 pt-2 border-t-2 border-green-300">
                  <span>Total</span>
                  <span>{getTotal().toFixed(2)}€</span>
                </div>
              </div>

              {/* Time Slot Info */}
              <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                <h4 className="font-bold text-charcoal mb-2">Créneau</h4>
                <p className="text-sm"><strong>Heure:</strong> {slot.startTime} - {slot.endTime}</p>
                <p className="text-sm"><strong>Pizzas dans ce créneau:</strong> {pizzaCount} ajoutées (capacité restante: {remainingCapacity - pizzaCount})</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t-2 border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              {cart.length > 0 && (
                <div className="text-sm text-gray-600">
                  <strong>{cart.length}</strong> article(s) • <strong>{pizzaCount}</strong> pizza(s) • <strong>{getTotal().toFixed(2)}€</strong>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {step !== 'customer' && (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 text-charcoal font-bold hover:bg-gray-100 transition-colors"
                >
                  Retour
                </button>
              )}

              {step !== 'confirm' ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed() || (step === 'pizzas' && pizzaCount > remainingCapacity)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-red to-primary-yellow text-white font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Suivant
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || pizzaCount > remainingCapacity}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-red to-primary-yellow text-white font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? 'Création...' : 'Confirmer la commande'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
