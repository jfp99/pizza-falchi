/**
 * FlyerQRCode - QR Code component for Google Maps link
 * Uses a real QR code image that links to Pizza Falchi on Google Maps
 * URL: https://maps.google.com/?q=Pizza+Falchi+615+avenue+de+la+Touloubre+13540+Puyricard
 */

'use client';

import React from 'react';

interface FlyerQRCodeProps {
  size?: number;
  className?: string;
}

export default function FlyerQRCode({
  size = 60,
  className = '',
}: FlyerQRCodeProps) {
  return (
    <div className={className}>
      <img
        src="/images/qr-code-google-maps.png"
        alt="QR Code vers Google Maps - Scannez pour l'itinéraire"
        width={size}
        height={size}
        // Critical for export - forces proper rendering
        data-no-compress="true"
        loading="eager"
        decoding="sync"
        crossOrigin="anonymous"
        style={{
          display: 'block',
          // crisp-edges is better for export than pixelated
          imageRendering: 'crisp-edges',
          width: `${size}px`,
          height: `${size}px`,
          // Prevent any scaling artifacts
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
        }}
      />
    </div>
  );
}
