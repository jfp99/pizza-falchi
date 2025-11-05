'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  onError?: () => void;
  fallbackSrc?: string;
}

/**
 * Progressive Image Component
 * Displays a blur placeholder while the image loads for better perceived performance
 * Handles loading states, errors, and provides smooth transitions
 */
export default function ProgressiveImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  className = '',
  priority = false,
  onError,
  fallbackSrc,
}: ProgressiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(false);
    }
    onError?.();
  };

  // Show placeholder for error state
  if (hasError && !fallbackSrc) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        aria-label="Image non disponible"
      >
        <ImageIcon className="w-12 h-12 text-gray-400" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Blur placeholder - shows while loading */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-gray-100 animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Actual image */}
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        sizes={sizes}
        className={`${className} transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        quality={85}
      />
    </div>
  );
}
