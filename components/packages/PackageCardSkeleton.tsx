import React from 'react';
import Skeleton from '@/components/ui/Skeleton';
import { ROUNDED, SHADOWS } from '@/lib/design-constants';

/**
 * Skeleton loading state for PackageCard
 * Maintains layout consistency while packages load
 */
export default function PackageCardSkeleton() {
  return (
    <div
      className={`bg-white ${ROUNDED.lg} p-5 sm:p-7 ${SHADOWS.md} border-2 border-gray-100`}
      aria-busy="true"
      aria-label="Chargement du forfait..."
    >
      {/* Icon Skeleton */}
      <div className="mb-4">
        <Skeleton variant="rectangular" width="56px" height="56px" className="rounded-xl" />
      </div>

      {/* Title Skeleton */}
      <Skeleton variant="text" height="28px" className="w-2/3 mb-2" />

      {/* Description Skeleton */}
      <div className="space-y-2 mb-4">
        <Skeleton variant="text" height="14px" className="w-full" />
        <Skeleton variant="text" height="14px" className="w-5/6" />
      </div>

      {/* Items List Skeleton */}
      <div className="space-y-2 mb-5 bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
        <Skeleton variant="text" height="14px" className="w-4/5" />
        <Skeleton variant="text" height="14px" className="w-3/4" />
        <Skeleton variant="text" height="14px" className="w-5/6" />
      </div>

      {/* Price Skeleton */}
      <div className="flex items-baseline gap-3 mb-4">
        <Skeleton variant="text" width="100px" height="36px" />
        <Skeleton variant="text" width="80px" height="24px" />
      </div>

      {/* Button Skeleton */}
      <Skeleton variant="rectangular" height="52px" className="w-full rounded-xl" />
    </div>
  );
}
