'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PizzaPlaceholder } from '@/components/placeholders/PizzaPlaceholder';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'pizza' | 'boisson' | 'dessert' | 'accompagnement';
  image?: string;
  ingredients?: string[];
  available?: boolean;
  vegetarian?: boolean;
  tags?: string[];
}

interface ProductImageProps {
  product: Product;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

/**
 * ProductImage - Intelligent image component with category-specific placeholders
 *
 * Displays real product images with graceful fallback to:
 * - Dynamic pizza placeholders (based on ingredients)
 * - Static drink illustrations (based on drink type)
 * - Generic category placeholders
 */
export const ProductImage: React.FC<ProductImageProps> = ({
  product,
  className = '',
  priority = false,
  fill = true,
  sizes,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.image || '');

  /**
   * Get the appropriate drink placeholder based on product name and tags
   */
  const getDrinkPlaceholder = (): string => {
    const nameLower = product.name.toLowerCase();
    const tags = product.tags || [];

    // Wine detection
    if (nameLower.includes('rouge') || nameLower.includes('red wine')) {
      return '/images/placeholders/wine-red.svg';
    }
    if (nameLower.includes('rosé') || nameLower.includes('rose') || nameLower.includes('rosé wine')) {
      return '/images/placeholders/wine-rose.svg';
    }
    if (nameLower.includes('blanc') || nameLower.includes('white wine')) {
      return '/images/placeholders/wine-white.svg';
    }
    if (nameLower.includes('vin') || tags.includes('vin')) {
      return '/images/placeholders/wine-red.svg'; // Default wine
    }

    // Beer detection
    if (
      tags.includes('bière') ||
      tags.includes('biere') ||
      tags.includes('beer') ||
      tags.includes('alcool') ||
      nameLower.includes('heineken') ||
      nameLower.includes('corona') ||
      nameLower.includes('miguel') ||
      nameLower.includes('chouffe')
    ) {
      return '/images/placeholders/beer-bottle.svg';
    }

    // Water detection
    if (
      tags.includes('eau') ||
      tags.includes('water') ||
      nameLower.includes('perrier') ||
      nameLower.includes('cristaline') ||
      nameLower.includes('eau')
    ) {
      return '/images/placeholders/water-bottle.svg';
    }

    // Default to soft drink for everything else
    return '/images/placeholders/soft-drink-can.svg';
  };

  /**
   * Render the appropriate placeholder based on product category
   */
  const renderPlaceholder = () => {
    switch (product.category) {
      case 'pizza':
        return (
          <div className={`relative w-full h-full ${className} flex items-center justify-center`}>
            <div className="w-[90%] h-[90%]">
              <PizzaPlaceholder
                ingredients={product.ingredients || []}
                isVegetarian={product.vegetarian}
                className="w-full h-full"
              />
            </div>
          </div>
        );

      case 'boisson':
        const drinkPlaceholder = getDrinkPlaceholder();
        return (
          <div className={`relative w-full h-full ${className} flex items-center justify-center`}>
            <div className="relative w-[90%] h-[90%]">
              <Image
                src={drinkPlaceholder}
                alt={`${product.name} placeholder`}
                fill={fill}
                sizes={sizes}
                className="object-contain"
                priority={priority}
              />
            </div>
          </div>
        );

      case 'dessert':
      case 'accompagnement':
      default:
        // Generic SVG placeholder for other categories
        return (
          <div className={`relative w-full h-full ${className} flex items-center justify-center bg-gradient-to-br from-background-secondary to-background-tertiary`}>
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-text-tertiary opacity-30"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
              <path d="M3 9h18" strokeWidth="2" />
              <path d="M9 21V9" strokeWidth="2" />
            </svg>
          </div>
        );
    }
  };

  // If image failed to load or doesn't exist, show placeholder
  if (imageError || !imageSrc) {
    return renderPlaceholder();
  }

  // Try to load the real image
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Image
        src={imageSrc}
        alt={`${product.name} - ${product.description}`}
        fill={fill}
        sizes={sizes}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        onError={() => {
          console.log(`Image failed to load for ${product.name}: ${imageSrc}`);
          setImageError(true);
          setImageSrc('');
        }}
      />
    </div>
  );
};

export default ProductImage;
