import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { Product, TimeSlot } from '@/types';
import type { CustomerInfo } from '@/components/admin/phone-orders/CustomerInfoStep';
import type { CartItem } from '@/components/admin/phone-orders/ProductSelectionStep';

type Step = 'customer' | 'pizzas' | 'drinks' | 'confirm';

interface UsePhoneOrderOptions {
  slot: TimeSlot;
  onOrderCreated: () => void;
}

interface UsePhoneOrderReturn {
  // State
  step: Step;
  customerInfo: CustomerInfo;
  cart: CartItem[];
  loading: boolean;

  // Customer info handlers
  updateCustomerInfo: (field: keyof CustomerInfo, value: string) => void;
  setDeliveryType: (type: 'pickup' | 'delivery') => void;

  // Cart handlers
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  getPizzaCount: () => number;
  getTotal: () => number;

  // Navigation
  canProceed: () => boolean;
  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => Promise<void>;

  // Reset
  resetForm: () => void;
}

const DELIVERY_FEE = 3.0;

export function usePhoneOrder({
  slot,
  onOrderCreated,
}: UsePhoneOrderOptions): UsePhoneOrderReturn {
  const [step, setStep] = useState<Step>('customer');
  const [loading, setLoading] = useState(false);

  // Customer info state
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    customerName: '',
    phone: '',
    deliveryType: 'pickup',
    address: '',
    city: 'Puyricard',
    postalCode: '13540',
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Update customer info
  const updateCustomerInfo = useCallback((field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setDeliveryType = useCallback((type: 'pickup' | 'delivery') => {
    setCustomerInfo((prev) => ({ ...prev, deliveryType: type }));
  }, []);

  // Cart management
  const addToCart = useCallback((product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product._id === product._id);
      if (existing) {
        return prevCart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
    toast.success(`${product.name} ajouté`);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product._id === productId);
      if (!existing) return prevCart;

      if (existing.quantity > 1) {
        return prevCart.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter((item) => item.product._id !== productId);
      }
    });
  }, []);

  const getPizzaCount = useCallback((): number => {
    return cart
      .filter((item) => item.product.category === 'pizza')
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const getTotal = useCallback((): number => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const deliveryFee = customerInfo.deliveryType === 'delivery' ? DELIVERY_FEE : 0;
    return subtotal + deliveryFee;
  }, [cart, customerInfo.deliveryType]);

  // Validation
  const canProceed = useCallback((): boolean => {
    if (step === 'customer') {
      const hasRequiredFields =
        customerInfo.customerName.trim().length > 0 && customerInfo.phone.trim().length > 0;
      const hasAddress =
        customerInfo.deliveryType === 'pickup' || customerInfo.address.trim().length > 0;
      return hasRequiredFields && hasAddress;
    }
    if (step === 'pizzas' || step === 'drinks') {
      return cart.length > 0;
    }
    return true;
  }, [step, customerInfo, cart]);

  // Navigation
  const handleNext = useCallback(() => {
    if (step === 'customer') setStep('pizzas');
    else if (step === 'pizzas') setStep('drinks');
    else if (step === 'drinks') setStep('confirm');
  }, [step]);

  const handleBack = useCallback(() => {
    if (step === 'drinks') setStep('pizzas');
    else if (step === 'pizzas') setStep('customer');
    else if (step === 'confirm') setStep('drinks');
  }, [step]);

  // Submit order
  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      // Calculate pizza count
      const pizzaCount = getPizzaCount();

      // Check capacity
      const remainingCapacity = slot.capacity - (slot.pizzaCount || 0);
      if (pizzaCount > remainingCapacity) {
        toast.error(
          `Ce créneau ne peut accepter que ${remainingCapacity} pizza(s) supplémentaire(s)`
        );
        setLoading(false);
        return;
      }

      // Get CSRF token
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
        customerName: customerInfo.customerName,
        phone: customerInfo.phone,
        email: '',
        deliveryType: customerInfo.deliveryType,
        deliveryAddress:
          customerInfo.deliveryType === 'delivery'
            ? {
                street: customerInfo.address,
                city: customerInfo.city,
                postalCode: customerInfo.postalCode,
                country: 'France',
              }
            : undefined,
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity,
        })),
        subtotal: cart.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),
        tax: 0,
        deliveryFee: customerInfo.deliveryType === 'delivery' ? DELIVERY_FEE : 0,
        total: getTotal(),
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        notes: 'Commande téléphonique',
        timeSlot: slot._id,
        scheduledTime: new Date(`${slot.date.toString().split('T')[0]}T${slot.startTime}`),
        pickupTimeRange: `${slot.startTime} - ${slot.endTime}`,
        assignedBy: 'cashier',
        isManualAssignment: true,
      };

      // Create order
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

      await response.json();
      toast.success(`Commande créée pour ${customerInfo.customerName} !`);

      onOrderCreated();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  }, [cart, customerInfo, slot, getPizzaCount, getTotal, onOrderCreated]);

  // Reset form
  const resetForm = useCallback(() => {
    setStep('customer');
    setCustomerInfo({
      customerName: '',
      phone: '',
      deliveryType: 'pickup',
      address: '',
      city: 'Puyricard',
      postalCode: '13540',
    });
    setCart([]);
  }, []);

  return {
    // State
    step,
    customerInfo,
    cart,
    loading,

    // Handlers
    updateCustomerInfo,
    setDeliveryType,
    addToCart,
    removeFromCart,
    getPizzaCount,
    getTotal,

    // Navigation
    canProceed,
    handleNext,
    handleBack,
    handleSubmit,

    // Reset
    resetForm,
  };
}
