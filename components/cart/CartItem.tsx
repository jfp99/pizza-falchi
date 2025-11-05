import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="bg-background-secondary dark:bg-background-tertiary rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-text-primary dark:text-text-primary">{item.product.name}</h4>
          <p className="text-sm text-text-secondary dark:text-text-secondary">{item.product.price}€ × {item.quantity}</p>
          <p className="text-lg font-bold text-brand-red mt-1">
            {(item.product.price * item.quantity).toFixed(2)}€
          </p>
        </div>

        <button
          onClick={() => removeItem(item.product._id)}
          className="text-brand-red hover:text-brand-red-hover transition"
          aria-label={`Retirer ${item.product.name} du panier`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
            className="bg-surface dark:bg-surface border border-border-medium dark:border-border-medium text-text-primary dark:text-text-primary rounded-lg p-2 hover:bg-background-secondary dark:hover:bg-background-tertiary transition"
            aria-label="Diminuer la quantité"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="w-8 text-center font-bold text-text-primary dark:text-text-primary">{item.quantity}</span>

          <button
            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
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