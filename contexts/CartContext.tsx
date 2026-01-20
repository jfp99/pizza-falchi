'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product, CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, customizations?: { size: 'medium' | 'large'; extras: string[]; cut?: boolean }, calculatedPrice?: number) => void;
  removeItem: (productId: string, customizationKey?: string) => void;
  updateQuantity: (productId: string, quantity: number, customizationKey?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('pizza-cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      localStorage.removeItem('pizza-cart');
      setItems([]);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pizza-cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // Helper to generate unique key for customized items
  const getCustomizationKey = (customizations?: { size?: 'medium' | 'large'; extras?: string[]; cut?: boolean }) => {
    if (!customizations) return '';
    const size = customizations.size || '';
    const extras = (customizations.extras || []).sort().join(',');
    const cut = customizations.cut !== undefined ? (customizations.cut ? 'cut' : 'whole') : '';
    return `${size}|${extras}|${cut}`;
  };

  const addItem = (product: Product, customizations?: { size: 'medium' | 'large'; extras: string[]; cut?: boolean }, calculatedPrice?: number) => {
    setItems(currentItems => {
      const customizationKey = getCustomizationKey(customizations);

      // Find existing item with same product AND customizations
      const existingItem = currentItems.find(item => {
        if (item.product._id !== product._id) return false;
        const itemKey = getCustomizationKey(item.customizations);
        return itemKey === customizationKey;
      });

      if (existingItem) {
        // Increment quantity of existing item
        return currentItems.map(item => {
          if (item.product._id !== product._id) return item;
          const itemKey = getCustomizationKey(item.customizations);
          if (itemKey === customizationKey) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      }

      // Add new item
      return [...currentItems, {
        product,
        quantity: 1,
        customizations,
        calculatedPrice
      }];
    });
  };

  /**
   * BUGFIX: Remove item by productId AND customizationKey
   * Previously only matched by productId, causing wrong items to be removed when multiple
   * customizations of the same product existed in cart
   */
  const removeItem = (productId: string, customizationKey?: string) => {
    setItems(currentItems => currentItems.filter(item => {
      if (item.product._id !== productId) return true;

      // If customizationKey provided, match both ID and customizations
      if (customizationKey !== undefined) {
        const itemKey = getCustomizationKey(item.customizations);
        return itemKey !== customizationKey;
      }

      // If no customizationKey, remove all items with this productId (backward compat)
      return false;
    }));
  };

  /**
   * BUGFIX: Update quantity by productId AND customizationKey
   * Previously only matched by productId, causing wrong items to be updated
   */
  const updateQuantity = (productId: string, quantity: number, customizationKey?: string) => {
    if (quantity <= 0) {
      removeItem(productId, customizationKey);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item => {
        if (item.product._id !== productId) return item;

        // If customizationKey provided, match both ID and customizations
        if (customizationKey !== undefined) {
          const itemKey = getCustomizationKey(item.customizations);
          if (itemKey === customizationKey) {
            return { ...item, quantity };
          }
          return item;
        }

        // If no customizationKey, update first matching product (backward compat)
        return { ...item, quantity };
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = item.calculatedPrice || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotal = () => {
    return getTotalPrice();
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      getTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
