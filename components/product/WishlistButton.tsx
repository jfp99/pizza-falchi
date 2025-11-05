'use client';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';

interface WishlistButtonProps {
  productId: string;
  productName: string;
  className?: string;
  showLabel?: boolean;
}

export default function WishlistButton({
  productId,
  productName,
  className = '',
  showLabel = false,
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      removeFromWishlist(productId, productName);
    } else {
      addToWishlist(productId, productName);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group transition-all duration-300 ${className}`}
      aria-label={inWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      title={inWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <div className="flex items-center gap-2">
        <Heart
          className={`w-6 h-6 transition-all duration-300 ${
            inWishlist
              ? 'fill-primary-red text-primary-red'
              : 'text-gray-400 group-hover:text-primary-red group-hover:scale-110'
          }`}
        />
        {showLabel && (
          <span className="text-sm font-semibold text-gray-700">
            {inWishlist ? 'Favoris' : 'Ajouter aux favoris'}
          </span>
        )}
      </div>
    </button>
  );
}
