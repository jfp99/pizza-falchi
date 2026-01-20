import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const itemPrice = item.calculatedPrice || item.product.price;
  const hasCustomizations = item.customizations && (item.customizations.size || (item.customizations.extras && item.customizations.extras.length > 0));

  // BUGFIX: Generate customizationKey to uniquely identify this cart item
  // This ensures we remove/update the correct item when multiple customizations exist
  const getCustomizationKey = () => {
    if (!item.customizations) return '';
    const size = item.customizations.size || '';
    const extras = (item.customizations.extras || []).sort().join(',');
    const cut = item.customizations.cut !== undefined ? (item.customizations.cut ? 'cut' : 'whole') : '';
    return `${size}|${extras}|${cut}`;
  };

  const customizationKey = getCustomizationKey();

  return (
    <div className="bg-background-secondary dark:bg-background-tertiary rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-text-primary dark:text-text-primary">{item.product.name}</h4>

          {/* Display customizations */}
          {hasCustomizations && (
            <div className="mt-1 space-y-0.5">
              {item.customizations?.size && (
                <p className="text-xs text-text-secondary dark:text-text-secondary">
                  Taille: <span className="font-medium capitalize">{item.customizations.size}</span>
                </p>
              )}
              {item.customizations?.extras && item.customizations.extras.length > 0 && (
                <p className="text-xs text-text-secondary dark:text-text-secondary">
                  Extras: <span className="font-medium capitalize">{item.customizations.extras.join(', ')}</span>
                </p>
              )}
              {item.customizations?.cut !== undefined && (
                <p className="text-xs text-text-secondary dark:text-text-secondary">
                  {item.customizations.cut ? '✓ À couper' : '✗ Entière'}
                </p>
              )}
            </div>
          )}

          <p className="text-sm text-text-secondary dark:text-text-secondary mt-1">{itemPrice.toFixed(2)}€ × {item.quantity}</p>
          <p className="text-lg font-bold text-brand-red mt-1">
            {(itemPrice * item.quantity).toFixed(2)}€
          </p>
        </div>

        <button
          onClick={() => removeItem(item.product._id, customizationKey)}
          className="text-brand-red hover:text-brand-red-hover transition"
          aria-label={`Retirer ${item.product.name} du panier`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateQuantity(item.product._id, item.quantity - 1, customizationKey)}
            className="bg-surface dark:bg-surface border border-border-medium dark:border-border-medium text-text-primary dark:text-text-primary rounded-lg p-2 hover:bg-background-secondary dark:hover:bg-background-tertiary transition"
            aria-label="Diminuer la quantité"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="w-8 text-center font-bold text-text-primary dark:text-text-primary">{item.quantity}</span>

          <button
            onClick={() => updateQuantity(item.product._id, item.quantity + 1, customizationKey)}
            className="bg-surface dark:bg-surface border border-border-medium dark:border-border-medium text-text-primary dark:text-text-primary rounded-lg p-2 hover:bg-background-secondary dark:hover:bg-background-tertiary transition"
            aria-label="Augmenter la quantité"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}