/**
 * FlyerBackgroundLayer - Reusable background image component
 * Print-safe (no backdrop-blur), supports opacity and gradient overlays
 */

'use client';

import React from 'react';

interface FlyerBackgroundLayerProps {
  src: string;
  opacity?: number;
  gradientOverlay?: string;
  grayscale?: boolean;
  className?: string;
}

export default function FlyerBackgroundLayer({
  src,
  opacity = 0.1,
  gradientOverlay,
  grayscale = false,
  className = '',
}: FlyerBackgroundLayerProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: opacity,
          filter: grayscale ? 'grayscale(100%)' : 'none',
        }}
      />

      {/* Optional Gradient Overlay */}
      {gradientOverlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: gradientOverlay,
          }}
        />
      )}
    </div>
  );
}
