import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePhoneOrder } from '@/hooks/usePhoneOrder';
import type { TimeSlot, Product } from '@/types';
import toast from 'react-hot-toast';

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock fetch
global.fetch = vi.fn();

describe('usePhoneOrder', () => {
  const mockSlot: TimeSlot = {
    _id: 'slot1',
    date: new Date('2024-01-15'),
    startTime: '12:00',
    endTime: '12:30',
    capacity: 10,
    currentOrders: 2,
    pizzaCount: 5,
    status: 'active',
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOnOrderCreated = vi.fn();

  const mockPizza: Product = {
    _id: '1',
    name: 'Margherita',
    price: 10.5,
    description: 'Tomate, mozzarella, basilic',
    category: 'pizza',
    available: true,
    image: '/images/margherita.jpg',
    vegetarian: true,
  };

  const mockDrink: Product = {
    _id: '2',
    name: 'Coca-Cola',
    price: 2.5,
    description: 'Canette 33cl',
    category: 'boisson',
    available: true,
    image: '/images/coca.jpg',
    vegetarian: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() =>
      usePhoneOrder({ slot: mockSlot, onOrderCreated: mockOnOrderCreated })
    );

    expect(result.current.step).toBe('customer');
    expect(result.current.customerInfo.customerName).toBe('');
    expect(result.current.customerInfo.deliveryType).toBe('pickup');
    expect(result.current.cart).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should update customer info', () => {
    const { result } = renderHook(() =>
      usePhoneOrder({ slot: mockSlot, onOrderCreated: mockOnOrderCreated })
    );

    act(() => {
      result.current.updateCustomerInfo('customerName', 'Jean Dupont');
      result.current.updateCustomerInfo('phone', '06 12 34 56 78');
    });

    expect(result.current.customerInfo.customerName).toBe('Jean Dupont');
    expect(result.current.customerInfo.phone).toBe('06 12 34 56 78');
  });

  it('should set delivery type', () => {
    const { result } = renderHook(() =>
      usePhoneOrder({ slot: mockSlot, onOrderCreated: mockOnOrderCreated })
    );

    act(() => {
      result.current.setDeliveryType('delivery');
    });

    expect(result.current.customerInfo.deliveryType).toBe('delivery');
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() =>
      usePhoneOrder({ slot: mockSlot, onOrderCreated: mockOnOrderCreated })
    );

    act(() => {
      result.current.addToCart(mockPizza);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].product).toEqual(mockPizza);
    expect(result.current.cart[0].quantity).toBe(1);
    expect(toast.success).toHaveBeenCalledWith('Margherita ajouté');
  });

  it('should increment quantity when adding same item', () => {
    const { result } = renderHook(() =>
      usePhoneOrder({ slot: mockSlot, onOrderCreated: mockOnOrderCreated })
    );

    act(() => {
      result.current.addToCart(mockPizza);
      result.current.addToCart(mockPizza);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() =>
      usePhoneOrder({ slot: mockSlot, onOrderCreated: mockOnOrderCreated })
    );

    act(() => {
      result.current.addToCart(mockPizza);
      result.current.addToCart(mockPizza);
      result.current.removeFromCart('1');
    });

    expect(result.current.cart[0].quantity).toBe(1);

    act(() => {
      result.current.removeFromCart('1');
    });

    expect(result.current.cart).toHaveLength(0);
  });

  it('should calculate pizza count correctly', () => {
    const { result } = renderHook(() =>
      usePhoneOrder({ slot: mockSlot, onOrderCreated: mockOnOrderCreated })
    );

    act(() => {
      result.current.addToCart(mockPizza);
      result.current.addToCart(mockPizza);
      result.current.addToCart(mockDrink);
    });

    expect(result.current.getPizzaCount()).toBe(2);
  });

  it('should calculate total correctly for pickup', () => {
    const { result } = renderHook(() =>
      usePhoneOrder({ slot: mockSlot, onOrderCreated: mockOnOrderCreated })
    );

    act(() => {
      result.current.addToCart(mockPizza);
      result.current.addToCart(mockDrink);
    });

    // Total: 10.5 + 2.5 = 13.0
    expect(result.current.getTotal()).toBe(13.0);
  });

  it('should include delivery fee for delivery orders', () => {
    const { result } = renderHook(() =>
      usePhoneOrder({ slot: mockSlot, onOrderCreated: mockOnOrderCreated })
    );

    act(() => {
      result.current.addToCart(mockPizza);
      result.current.setDeliveryType('delivery');
    });

    // Total: 10.5 + 3.0 (delivery fee) = 13.5
    expect(result.current.getTotal()).toBe(13.5);
  });

  it('should validate customer step correctly', () => {
    const { result } = renderHook(() =>
      usePhoneOrder({ slot: mockSlot, onOrderCreated: mockOnOrderCreated })
    );

    // Initially false
    expect(result.current.canProceed()).toBeFalsy();

    act(() => {
      result.current.updateCustomerInfo('customerName', 'Jean Dupont');
      result.current.updateCustomerInfo('phone', '06 12 34 56 78');
    });

    // Now true for pickup
    expect(result.current.canProceed()).toBe(true);

    // Should require address for delivery
    act(() => {
      result.current.setDeliveryType('delivery');
    });

    expect(result.current.canProceed()).toBeFalsy();

    act(() => {
      result.current.updateCustomerInfo('address', '123 Rue de la Pizza');
    });

    expect(result.current.canProceed()).toBeTruthy();
  });

  it('should navigate through steps', () => {
    const { result } = renderHook(() =>
      usePhoneOrder({ slot: mockSlot, onOrderCreated: mockOnOrderCreated })
    );

    expect(result.current.step).toBe('customer');

    act(() => {
      result.current.handleNext();
    });

    expect(result.current.step).toBe('pizzas');

    act(() => {
      result.current.handleNext();
    });

    expect(result.current.step).toBe('drinks');

    act(() => {
      result.current.handleNext();
    });

    expect(result.current.step).toBe('confirm');
  });

  it('should navigate backwards through steps', () => {
    const { result } = renderHook(() =>
      usePhoneOrder({ slot: mockSlot, onOrderCreated: mockOnOrderCreated })
    );

    // Setup: complete customer info and add items to cart
    act(() => {
      result.current.updateCustomerInfo('customerName', 'Jean Dupont');
      result.current.updateCustomerInfo('phone', '06 12 34 56 78');
      result.current.addToCart(mockPizza);
    });

    // Navigate forward through all steps
    act(() => {
      result.current.handleNext(); // customer -> pizzas
    });

    act(() => {
      result.current.handleNext(); // pizzas -> drinks
    });

    act(() => {
      result.current.handleNext(); // drinks -> confirm
    });

    expect(result.current.step).toBe('confirm');

    act(() => {
      result.current.handleBack();
    });

    expect(result.current.step).toBe('drinks');

    act(() => {
      result.current.handleBack();
    });

    expect(result.current.step).toBe('pizzas');

    act(() => {
      result.current.handleBack();
    });

    expect(result.current.step).toBe('customer');
  });

  it('should reset form to initial state', () => {
    const { result } = renderHook(() =>
      usePhoneOrder({ slot: mockSlot, onOrderCreated: mockOnOrderCreated })
    );

    act(() => {
      result.current.updateCustomerInfo('customerName', 'Jean Dupont');
      result.current.addToCart(mockPizza);
      result.current.handleNext();
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.step).toBe('pizzas');

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.step).toBe('customer');
    expect(result.current.customerInfo.customerName).toBe('');
    expect(result.current.cart).toEqual([]);
  });

  it('should handle successful order submission', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'mock-csrf-token' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      usePhoneOrder({ slot: mockSlot, onOrderCreated: mockOnOrderCreated })
    );

    act(() => {
      result.current.updateCustomerInfo('customerName', 'Jean Dupont');
      result.current.updateCustomerInfo('phone', '06 12 34 56 78');
      result.current.addToCart(mockPizza);
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Commande créée pour Jean Dupont !');
      expect(mockOnOrderCreated).toHaveBeenCalled();
    });
  });

  it('should handle capacity exceeded error', async () => {
    const fullSlot: TimeSlot = {
      ...mockSlot,
      capacity: 6,
      pizzaCount: 6,
    };

    const { result } = renderHook(() =>
      usePhoneOrder({ slot: fullSlot, onOrderCreated: mockOnOrderCreated })
    );

    act(() => {
      result.current.updateCustomerInfo('customerName', 'Jean Dupont');
      result.current.updateCustomerInfo('phone', '06 12 34 56 78');
      result.current.addToCart(mockPizza);
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining('ne peut accepter que 0 pizza')
    );
  });

  it('should handle CSRF token fetch error', async () => {
    const mockFetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      usePhoneOrder({ slot: mockSlot, onOrderCreated: mockOnOrderCreated })
    );

    act(() => {
      result.current.updateCustomerInfo('customerName', 'Jean Dupont');
      result.current.updateCustomerInfo('phone', '06 12 34 56 78');
      result.current.addToCart(mockPizza);
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Erreur de sécurité. Veuillez recharger la page.'
    );
  });

  it('should handle order creation error', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'mock-csrf-token' }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Order creation failed' }),
      });

    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      usePhoneOrder({ slot: mockSlot, onOrderCreated: mockOnOrderCreated })
    );

    act(() => {
      result.current.updateCustomerInfo('customerName', 'Jean Dupont');
      result.current.updateCustomerInfo('phone', '06 12 34 56 78');
      result.current.addToCart(mockPizza);
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(toast.error).toHaveBeenCalledWith('Order creation failed');
  });
});
