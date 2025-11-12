'use client';
import { useState, useEffect } from 'react';
import { X, ShoppingCart, Check } from 'lucide-react';
import { Product } from '@/types';
import Image from 'next/image';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface PackageItem {
  type: string;
  quantity: number;
  description: string;
}

interface Package {
  _id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  items: PackageItem[];
  icon: string;
  color: string;
  popular: boolean;
  badge?: string;
}

interface ComboSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: Package;
  onConfirm: (selectedProducts: Product[], totalPrice: number) => void;
  allProducts: Product[];
}

export default function ComboSelectionModal({
  isOpen,
  onClose,
  package: pkg,
  onConfirm,
  allProducts,
}: ComboSelectionModalProps) {
  const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: Product[] }>({});
  const modalRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (isOpen) {
      // Initialize empty selection for each item type
      const initialSelection: { [key: string]: Product[] } = {};
      pkg.items.forEach((item, index) => {
        initialSelection[`${item.type}-${index}`] = [];
      });
      setSelectedProducts(initialSelection);
    }
  }, [isOpen, pkg]);

  if (!isOpen) return null;

  // Filter eligible products
  const getEligibleProducts = (type: string): Product[] => {
    if (type === 'pizza') {
      // Only pizzas under 13€
      return allProducts.filter(p => p.category === 'pizza' && p.price < 13 && p.available);
    } else if (type === 'boisson') {
      // All available drinks except those costing 7€
      return allProducts.filter(p => p.category === 'boisson' && p.price !== 7 && p.available);
    }
    return [];
  };

  const handleProductToggle = (itemKey: string, product: Product, maxQuantity: number) => {
    setSelectedProducts(prev => {
      const current = prev[itemKey] || [];
      const productIndex = current.findIndex(p => p._id === product._id);

      if (productIndex >= 0) {
        // Remove product
        return {
          ...prev,
          [itemKey]: current.filter(p => p._id !== product._id),
        };
      } else if (current.length < maxQuantity) {
        // Add product
        return {
          ...prev,
          [itemKey]: [...current, product],
        };
      }
      return prev;
    });
  };

  const isProductSelected = (itemKey: string, productId: string): boolean => {
    return (selectedProducts[itemKey] || []).some(p => p._id === productId);
  };

  const getSelectedCount = (itemKey: string): number => {
    return (selectedProducts[itemKey] || []).length;
  };

  const calculateTotalPrice = (): number => {
    let total = 0;
    Object.values(selectedProducts).forEach(products => {
      products.forEach(product => {
        total += product.price;
      });
    });
    return total;
  };

  const isSelectionComplete = (): boolean => {
    return pkg.items.every((item, index) => {
      const itemKey = `${item.type}-${index}`;
      return getSelectedCount(itemKey) === item.quantity;
    });
  };

  const handleConfirm = () => {
    const allSelected = Object.values(selectedProducts).flat();
    const totalPrice = pkg.discountedPrice;
    onConfirm(allSelected, totalPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl transition-colors duration-300" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-red to-primary-yellow p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl flex justify-between items-start sm:items-center gap-3 z-10">
          <div className="flex-1 min-w-0">
            <h2 id="modal-title" className="text-lg sm:text-2xl font-black text-white mb-1 break-words">
              {pkg.icon} {pkg.name}
            </h2>
            <p className="text-white/90 text-xs sm:text-sm">{pkg.description}</p>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors flex-shrink-0"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {pkg.items.map((item, itemIndex) => {
            const itemKey = `${item.type}-${itemIndex}`;
            const eligibleProducts = getEligibleProducts(item.type);
            const selectedCount = getSelectedCount(itemKey);

            return (
              <div key={itemKey} className="space-y-4">
                {/* Item Header */}
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.type === 'pizza' ? '🍕 Pizzas' : '🥤 Boissons'}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-black ${
                      selectedCount === item.quantity ? 'text-green-600' : 'text-primary-red'
                    }`}>
                      {selectedCount}/{item.quantity}
                    </div>
                    <p className="text-xs text-gray-500">sélectionné{selectedCount > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {eligibleProducts.map(product => {
                    const isSelected = isProductSelected(itemKey, product._id);
                    const canSelect = selectedCount < item.quantity || isSelected;

                    return (
                      <button
                        key={product._id}
                        onClick={() => handleProductToggle(itemKey, product, item.quantity)}
                        disabled={!canSelect}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-green-500 bg-green-50 shadow-lg'
                            : canSelect
                            ? 'border-gray-200 bg-white hover:border-primary-red hover:shadow-md'
                            : 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {/* Selection Check */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                            <Check className="w-4 h-4" />
                          </div>
                        )}

                        {/* Product Image */}
                        <div className="relative w-full h-24 mb-2 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={product.image || '/images/placeholder-pizza.jpg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <h4 className="font-bold text-sm text-gray-900 mb-1 line-clamp-2">
                          {product.name}
                        </h4>
                        <p className="text-primary-red font-black text-lg">
                          {product.price.toFixed(2)}€
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-4 sm:p-6 rounded-b-2xl sm:rounded-b-3xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Prix normal estimé</p>
              <p className="text-base sm:text-lg text-gray-400 line-through">
                {calculateTotalPrice().toFixed(2)}€
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-600">Prix du combo</p>
              <p className="text-2xl sm:text-3xl font-black text-green-600">
                {pkg.discountedPrice.toFixed(2)}€
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="w-full sm:flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 sm:py-4 rounded-xl font-bold transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isSelectionComplete()}
              className={`w-full sm:flex-[2] py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                isSelectionComplete()
                  ? 'bg-gradient-to-r from-primary-red to-primary-yellow text-white hover:shadow-xl sm:hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">
                {isSelectionComplete() ? 'Ajouter au panier' : 'Compléter la sélection'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
