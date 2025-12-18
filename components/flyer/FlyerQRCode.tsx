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
        alt="QR Code vers Google Maps"
        width={size}
        height={size}
        style={{
          display: 'block',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
