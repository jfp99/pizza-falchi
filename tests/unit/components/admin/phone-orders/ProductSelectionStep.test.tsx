import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductSelectionStep, {
  type CartItem,
} from '@/components/admin/phone-orders/ProductSelectionStep';
import type { Product } from '@/types';

describe('ProductSelectionStep', () => {
  const mockProducts: Product[] = [
    {
      _id: '1',
      name: 'Margherita',
      price: 10.5,
      description: 'Tomate, mozzarella, basilic',
      category: 'pizza',
      available: true,
      image: '/images/margherita.jpg',
      vegetarian: true,
    },
    {
      _id: '2',
      name: 'Pepperoni',
      price: 12.0,
      description: 'Tomate, mozzarella, pepperoni',
      category: 'pizza',
      available: true,
      image: '/images/pepperoni.jpg',
      vegetarian: false,
    },
  ];

  const mockCart: CartItem[] = [];
  const mockOnAddToCart = vi.fn();
  const mockOnRemoveFromCart = vi.fn();

  it('should render product list with title and icon', () => {
    render(
      <ProductSelectionStep
        title="Pizzas"
        icon={<span>🍕</span>}
        products={mockProducts}
        cart={mockCart}
        onAddToCart={mockOnAddToCart}
        onRemoveFromCart={mockOnRemoveFromCart}
      />
    );

    expect(screen.getByText('Pizzas')).toBeInTheDocument();
    expect(screen.getByText('Margherita')).toBeInTheDocument();
    expect(screen.getByText('Pepperoni')).toBeInTheDocument();
  });

  it('should display product prices', () => {
    render(
      <ProductSelectionStep
        title="Pizzas"
        icon={<span>🍕</span>}
        products={mockProducts}
        cart={mockCart}
        onAddToCart={mockOnAddToCart}
        onRemoveFromCart={mockOnRemoveFromCart}
      />
    );

    expect(screen.getByText('10.50€')).toBeInTheDocument();
    expect(screen.getByText('12.00€')).toBeInTheDocument();
  });

  it('should call onAddToCart when add button is clicked', () => {
    render(
      <ProductSelectionStep
        title="Pizzas"
        icon={<span>🍕</span>}
        products={mockProducts}
        cart={mockCart}
        onAddToCart={mockOnAddToCart}
        onRemoveFromCart={mockOnRemoveFromCart}
      />
    );

    const addButtons = screen.getAllByLabelText(/ajouter/i);
    fireEvent.click(addButtons[0]);

    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('should show quantity and remove button for items in cart', () => {
    const cartWithItems: CartItem[] = [
      { product: mockProducts[0], quantity: 2 },
    ];

    render(
      <ProductSelectionStep
        title="Pizzas"
        icon={<span>🍕</span>}
        products={mockProducts}
        cart={cartWithItems}
        onAddToCart={mockOnAddToCart}
        onRemoveFromCart={mockOnRemoveFromCart}
      />
    );

    expect(screen.getByLabelText(/2 dans le panier/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/retirer margherita/i)).toBeInTheDocument();
  });

  it('should call onRemoveFromCart when remove button is clicked', () => {
    const cartWithItems: CartItem[] = [
      { product: mockProducts[0], quantity: 2 },
    ];

    render(
      <ProductSelectionStep
        title="Pizzas"
        icon={<span>🍕</span>}
        products={mockProducts}
        cart={cartWithItems}
        onAddToCart={mockOnAddToCart}
        onRemoveFromCart={mockOnRemoveFromCart}
      />
    );

    const removeButton = screen.getByLabelText(/retirer margherita/i);
    fireEvent.click(removeButton);

    expect(mockOnRemoveFromCart).toHaveBeenCalledWith('1');
  });

  it('should show loading state', () => {
    render(
      <ProductSelectionStep
        title="Pizzas"
        icon={<span>🍕</span>}
        products={mockProducts}
        cart={mockCart}
        onAddToCart={mockOnAddToCart}
        onRemoveFromCart={mockOnRemoveFromCart}
        loading={true}
      />
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Margherita')).not.toBeInTheDocument();
  });

  it('should show empty state when no products', () => {
    render(
      <ProductSelectionStep
        title="Pizzas"
        icon={<span>🍕</span>}
        products={[]}
        cart={mockCart}
        onAddToCart={mockOnAddToCart}
        onRemoveFromCart={mockOnRemoveFromCart}
      />
    );

    expect(screen.getByText('Aucun produit disponible')).toBeInTheDocument();
  });

  it('should display keyboard shortcut hints by default', () => {
    render(
      <ProductSelectionStep
        title="Pizzas"
        icon={<span>🍕</span>}
        products={mockProducts}
        cart={mockCart}
        onAddToCart={mockOnAddToCart}
        onRemoveFromCart={mockOnRemoveFromCart}
      />
    );

    expect(screen.getByText(/raccourcis: 1-9/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should hide keyboard shortcuts when disabled', () => {
    render(
      <ProductSelectionStep
        title="Pizzas"
        icon={<span>🍕</span>}
        products={mockProducts}
        cart={mockCart}
        onAddToCart={mockOnAddToCart}
        onRemoveFromCart={mockOnRemoveFromCart}
        keyboardHint={false}
      />
    );

    expect(screen.queryByText(/raccourcis: 1-9/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/raccourci clavier: 1/i)).not.toBeInTheDocument();
  });

  it('should display warning message when provided', () => {
    const warningMessage = 'Capacité limitée restante';

    render(
      <ProductSelectionStep
        title="Pizzas"
        icon={<span>🍕</span>}
        products={mockProducts}
        cart={mockCart}
        onAddToCart={mockOnAddToCart}
        onRemoveFromCart={mockOnRemoveFromCart}
        warningMessage={warningMessage}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(warningMessage)).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <ProductSelectionStep
        title="Pizzas"
        icon={<span>🍕</span>}
        products={mockProducts}
        cart={mockCart}
        onAddToCart={mockOnAddToCart}
        onRemoveFromCart={mockOnRemoveFromCart}
      />
    );

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);

    const addButton = screen.getAllByLabelText(/ajouter/i)[0];
    expect(addButton).toHaveAttribute('type', 'button');
  });

  it('should display product descriptions', () => {
    render(
      <ProductSelectionStep
        title="Pizzas"
        icon={<span>🍕</span>}
        products={mockProducts}
        cart={mockCart}
        onAddToCart={mockOnAddToCart}
        onRemoveFromCart={mockOnRemoveFromCart}
      />
    );

    expect(screen.getByText('Tomate, mozzarella, basilic')).toBeInTheDocument();
    expect(screen.getByText('Tomate, mozzarella, pepperoni')).toBeInTheDocument();
  });

  it('should update quantity live region when item is in cart', () => {
    const cartWithItems: CartItem[] = [
      { product: mockProducts[0], quantity: 3 },
    ];

    render(
      <ProductSelectionStep
        title="Pizzas"
        icon={<span>🍕</span>}
        products={mockProducts}
        cart={cartWithItems}
        onAddToCart={mockOnAddToCart}
        onRemoveFromCart={mockOnRemoveFromCart}
      />
    );

    const quantityDisplay = screen.getByLabelText(/3 dans le panier/i);
    expect(quantityDisplay).toHaveAttribute('aria-live', 'polite');
  });
});
