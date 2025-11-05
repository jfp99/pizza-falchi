import React from 'react';
import Skeleton from '@/components/ui/Skeleton';

/**
 * Skeleton loading state for cart items
 * Used in cart page and checkout summary
 */
export default function CartItemSkeleton() {
  return (
    <div
      className="flex justify-between items-start p-3 bg-gray-50 rounded-xl"
      aria-busy="true"
      aria-label="Chargement de l'article..."
    >
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" height="16px" className="w-3/4" />
        <Skeleton variant="text" height="14px" className="w-1/2" />
      </div>
      <Skeleton variant="text" width="60px" height="20px" />
    </div>
  );
}
