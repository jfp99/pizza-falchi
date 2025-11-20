import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrderConfirmationStep from '@/components/admin/phone-orders/OrderConfirmationStep';
import type { CustomerInfo } from '@/components/admin/phone-orders/CustomerInfoStep';
import type { CartItem } from '@/components/admin/phone-orders/ProductSelectionStep';
import type { TimeSlot } from '@/types';

describe('OrderConfirmationStep', () => {
  const mockCustomerInfo: CustomerInfo = {
    customerName: 'Jean Dupont',
    phone: '06 12 34 56 78',
    deliveryType: 'pickup',
    address: '',
    city: 'Puyricard',
    postalCode: '13540',
  };

  const mockCart: CartItem[] = [
    {
      product: {
        _id: '1',
        name: 'Margherita',
        price: 10.5,
        description: 'Tomate, mozzarella, basilic',
        category: 'pizza',
        available: true,
        image: '/images/margherita.jpg',
        vegetarian: true,
      },
      quantity: 2,
    },
    {
      product: {
        _id: '2',
        name: 'Coca-Cola',
        price: 2.5,
        description: 'Canette 33cl',
        category: 'boisson',
        available: true,
        image: '/images/coca.jpg',
        vegetarian: true,
      },
      quantity: 1,
    },
  ];

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

  it('should render order summary sections', () => {
    render(
      <OrderConfirmationStep
        customerInfo={mockCustomerInfo}
        cart={mockCart}
        slot={mockSlot}
      />
    );

    expect(screen.getByRole('heading', { name: /récapitulatif/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /client/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /articles/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /créneau/i })).toBeInTheDocument();
  });

  it('should display customer information', () => {
    render(
      <OrderConfirmationStep
        customerInfo={mockCustomerInfo}
        cart={mockCart}
        slot={mockSlot}
      />
    );

    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    expect(screen.getByText('06 12 34 56 78')).toBeInTheDocument();
    expect(screen.getByText('À emporter')).toBeInTheDocument();
  });

  it('should display delivery address for delivery orders', () => {
    const deliveryCustomerInfo: CustomerInfo = {
      ...mockCustomerInfo,
      deliveryType: 'delivery',
      address: '123 Rue de la Pizza',
    };

    render(
      <OrderConfirmationStep
        customerInfo={deliveryCustomerInfo}
        cart={mockCart}
        slot={mockSlot}
      />
    );

    expect(screen.getByText('Livraison')).toBeInTheDocument();
    expect(screen.getByText(/123 rue de la pizza/i)).toBeInTheDocument();
  });

  it('should display cart items with quantities and prices', () => {
    render(
      <OrderConfirmationStep
        customerInfo={mockCustomerInfo}
        cart={mockCart}
        slot={mockSlot}
      />
    );

    expect(screen.getByText(/2x margherita/i)).toBeInTheDocument();
    expect(screen.getByText(/21\.00€/)).toBeInTheDocument(); // 2 * 10.5
    expect(screen.getByText(/1x coca-cola/i)).toBeInTheDocument();
    expect(screen.getByText(/2\.50€/)).toBeInTheDocument();
  });

  it('should calculate total correctly for pickup', () => {
    render(
      <OrderConfirmationStep
        customerInfo={mockCustomerInfo}
        cart={mockCart}
        slot={mockSlot}
      />
    );

    // Total: (2 * 10.5) + (1 * 2.5) = 23.50
    expect(screen.getByText(/23\.50€/)).toBeInTheDocument();
  });

  it('should include delivery fee for delivery orders', () => {
    const deliveryCustomerInfo: CustomerInfo = {
      ...mockCustomerInfo,
      deliveryType: 'delivery',
      address: '123 Rue de la Pizza',
    };

    render(
      <OrderConfirmationStep
        customerInfo={deliveryCustomerInfo}
        cart={mockCart}
        slot={mockSlot}
        deliveryFee={3.0}
      />
    );

    expect(screen.getByText(/frais de livraison/i)).toBeInTheDocument();
    expect(screen.getByText(/3\.00€/)).toBeInTheDocument();
    // Total: 23.50 + 3.00 = 26.50
    expect(screen.getByText(/26\.50€/)).toBeInTheDocument();
  });

  it('should display time slot information', () => {
    render(
      <OrderConfirmationStep
        customerInfo={mockCustomerInfo}
        cart={mockCart}
        slot={mockSlot}
      />
    );

    expect(screen.getByText(/12:00 - 12:30/)).toBeInTheDocument();
    expect(screen.getByText(/2 ajoutées/i)).toBeInTheDocument(); // 2 pizzas in cart
  });

  it('should calculate remaining capacity correctly', () => {
    render(
      <OrderConfirmationStep
        customerInfo={mockCustomerInfo}
        cart={mockCart}
        slot={mockSlot}
      />
    );

    // Slot has capacity 10, pizzaCount 5, adding 2 pizzas = 3 remaining
    expect(screen.getByText(/capacité restante: 3/i)).toBeInTheDocument();
  });

  it('should show warning when exceeding capacity', () => {
    const fullSlot: TimeSlot = {
      ...mockSlot,
      capacity: 6,
      pizzaCount: 5,
    };

    render(
      <OrderConfirmationStep
        customerInfo={mockCustomerInfo}
        cart={mockCart}
        slot={fullSlot}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/vous dépassez la capacité/i)).toBeInTheDocument();
  });

  it('should not show warning when within capacity', () => {
    render(
      <OrderConfirmationStep
        customerInfo={mockCustomerInfo}
        cart={mockCart}
        slot={mockSlot}
      />
    );

    expect(screen.queryByText(/vous dépassez la capacité/i)).not.toBeInTheDocument();
  });

  it('should have proper semantic HTML structure', () => {
    render(
      <OrderConfirmationStep
        customerInfo={mockCustomerInfo}
        cart={mockCart}
        slot={mockSlot}
      />
    );

    const sections = screen.getAllByRole('region');
    expect(sections.length).toBeGreaterThan(0);

    // Check for definition lists
    const definitionLists = document.querySelectorAll('dl');
    expect(definitionLists.length).toBeGreaterThan(0);
  });

  it('should include screen reader friendly summary', () => {
    render(
      <OrderConfirmationStep
        customerInfo={mockCustomerInfo}
        cart={mockCart}
        slot={mockSlot}
      />
    );

    const srOnly = document.querySelector('.sr-only');
    expect(srOnly).toBeInTheDocument();
    expect(srOnly?.textContent).toContain('Jean Dupont');
    expect(srOnly?.textContent).toContain('2 article');
  });

  it('should handle empty pizzaCount in slot', () => {
    const slotWithoutPizzaCount: TimeSlot = {
      ...mockSlot,
      pizzaCount: undefined,
    };

    render(
      <OrderConfirmationStep
        customerInfo={mockCustomerInfo}
        cart={mockCart}
        slot={slotWithoutPizzaCount}
      />
    );

    // Should calculate remaining capacity as capacity - 0 - pizzasInCart
    expect(screen.getByText(/capacité restante: 8/i)).toBeInTheDocument();
  });

  it('should count only pizzas for capacity calculation', () => {
    const cartWithDrinks: CartItem[] = [
      ...mockCart,
      {
        product: {
          _id: '3',
          name: 'Tiramisu',
          price: 5.0,
          description: 'Dessert italien',
          category: 'dessert',
          available: true,
          image: '/images/tiramisu.jpg',
          vegetarian: true,
        },
        quantity: 3,
      },
    ];

    render(
      <OrderConfirmationStep
        customerInfo={mockCustomerInfo}
        cart={cartWithDrinks}
        slot={mockSlot}
      />
    );

    // Should only count 2 pizzas, not 3 desserts
    expect(screen.getByText(/2 ajoutées/i)).toBeInTheDocument();
  });

  it('should use custom delivery fee when provided', () => {
    const deliveryCustomerInfo: CustomerInfo = {
      ...mockCustomerInfo,
      deliveryType: 'delivery',
      address: '123 Rue de la Pizza',
    };

    render(
      <OrderConfirmationStep
        customerInfo={deliveryCustomerInfo}
        cart={mockCart}
        slot={mockSlot}
        deliveryFee={5.0}
      />
    );

    expect(screen.getByText(/5\.00€/)).toBeInTheDocument();
    // Total: 23.50 + 5.00 = 28.50
    expect(screen.getByText(/28\.50€/)).toBeInTheDocument();
  });
});
