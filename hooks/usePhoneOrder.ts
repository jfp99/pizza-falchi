import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { Product, TimeSlot } from '@/types';
import type { CustomerInfo } from '@/components/admin/phone-orders/CustomerInfoStep';
import type { CartItem } from '@/components/admin/phone-orders/ProductSelectionStep';
import { DELIVERY_FEE, DEFAULT_CITY, DEFAULT_POSTAL_CODE } from '@/lib/constants';
import { capturePhoneOrderError, captureAPIError, addBreadcrumb } from '@/lib/monitoring';

/**
 * Step type for phone order workflow progression
 * - customer: Collect customer information and delivery type
 * - pizzas: Select pizzas to order
 * - drinks: Select drinks and accompaniments (optional)
 * - confirm: Review and submit order
 */
type Step = 'customer' | 'pizzas' | 'drinks' | 'confirm';

/**
 * Configuration options for usePhoneOrder hook
 *
 * @property slot - The time slot for this order (capacity and timing info)
 * @property onOrderCreated - Callback invoked after successful order creation
 *
 * @example
 * ```tsx
 * const options: UsePhoneOrderOptions = {
 *   slot: selectedTimeSlot,
 *   onOrderCreated: () => {
 *     refreshSlots();
 *     closeModal();
 *   }
 * };
 * ```
 */
interface UsePhoneOrderOptions {
  slot: TimeSlot;
  onOrderCreated: () => void;
}

/**
 * Return value of usePhoneOrder hook
 *
 * Provides complete state management and business logic for the phone
 * order workflow, including customer info, cart, navigation, and submission.
 *
 * @property step - Current step in the workflow
 * @property customerInfo - Customer contact and delivery information
 * @property cart - Array of selected products with quantities
 * @property loading - Loading state during order submission
 *
 * @property updateCustomerInfo - Update a single customer info field
 * @property setDeliveryType - Set pickup or delivery mode
 *
 * @property addToCart - Add product to cart (increments quantity if exists)
 * @property removeFromCart - Remove product from cart (decrements quantity)
 * @property getPizzaCount - Calculate total number of pizzas in cart
 * @property getTotal - Calculate order total including delivery fee
 *
 * @property canProceed - Validate if current step can proceed to next
 * @property handleNext - Navigate to next step
 * @property handleBack - Navigate to previous step
 * @property handleSubmit - Submit order to API with CSRF protection
 *
 * @property resetForm - Reset all state to initial values
 */
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

/**
 * Custom hook for phone order workflow management
 *
 * Centralizes all business logic for the phone order process including:
 * - Multi-step form navigation (customer → pizzas → drinks → confirm)
 * - Customer information management
 * - Shopping cart with add/remove/quantity controls
 * - Form validation at each step
 * - Order submission with CSRF protection
 * - Capacity validation against time slot limits
 *
 * This hook eliminates the need for complex state management in components,
 * making the UI layer purely presentational.
 *
 * Features:
 * - Step-by-step validation before proceeding
 * - Automatic total calculations with delivery fee
 * - Pizza count tracking for capacity validation
 * - CSRF token fetching and submission
 * - Toast notifications for user feedback
 * - Error handling with user-friendly messages
 * - Form reset for new orders
 *
 * @param options - Configuration with time slot and success callback
 * @returns Complete phone order state and handlers
 *
 * @example
 * ```tsx
 * function PhoneOrderModal({ slot, onClose }) {
 *   const {
 *     step,
 *     customerInfo,
 *     cart,
 *     loading,
 *     updateCustomerInfo,
 *     addToCart,
 *     removeFromCart,
 *     handleNext,
 *     handleSubmit,
 *   } = usePhoneOrder({
 *     slot,
 *     onOrderCreated: () => {
 *       refreshData();
 *       onClose();
 *     }
 *   });
 *
 *   // Use returned values in UI...
 * }
 * ```
 */
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
    city: DEFAULT_CITY,
    postalCode: DEFAULT_POSTAL_CODE,
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
        captureAPIError(csrfError, '/api/csrf', 'GET');
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
        const errorData = await response.json();
        captureAPIError(
          new Error(errorData.error || 'Failed to create order'),
          '/api/orders',
          'POST',
          response.status
        );
        throw new Error(errorData.error || 'Failed to create order');
      }

      await response.json();
      addBreadcrumb('Phone order created successfully', 'phone-order', {
        customerName: customerInfo.customerName,
        pizzaCount,
        slotId: slot._id,
      });
      toast.success(`Commande créée pour ${customerInfo.customerName} !`);

      onOrderCreated();
    } catch (error) {
      capturePhoneOrderError(error, {
        step: 'submit',
        slot,
        pizzaCount: getPizzaCount(),
        orderData: {
          customerName: customerInfo.customerName,
          deliveryType: customerInfo.deliveryType,
          cartItems: cart.length,
        },
      });
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
      city: DEFAULT_CITY,
      postalCode: DEFAULT_POSTAL_CODE,
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
