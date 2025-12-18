/**
 * FlyerStylizedMap - Professional illustrated map of Puyricard area
 * Shows clear road layout, landmarks and Pizza Falchi location
 * Designed for print quality
 */

'use client';

import React from 'react';

interface FlyerStylizedMapProps {
  width?: number;
  height?: number;
  className?: string;
}

// Brand colors
const COLORS = {
  primary: '#C41E1A',
  gold: '#D4A84B',
  goldLight: '#E8C87A',
  cream: '#FDF8F0',
  text: '#2C1810',
  textLight: '#5C4A3D',
  // Map specific colors
  roadMain: '#FFFFFF',
  roadMainBorder: '#B8A89A',
  roadSecondary: '#F5EFE6',
  roadSecondaryBorder: '#D4C9BB',
  greenArea: '#D4E5C7',
  greenAreaDark: '#B8D4A3',
  water: '#C5DDE8',
  building: '#E8E0D4',
  buildingStroke: '#C9BBA8',
};

export default function FlyerStylizedMap({
  width = 200,
  height = 120,
  className = '',
}: FlyerStylizedMapProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 120"
      className={className}
      role="img"
      aria-label="Plan d'accès Pizza Falchi - 615 Avenue de la Touloubre, Puyricard"
    >
      <defs>
        {/* Gradient for main road */}
        <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={COLORS.roadMain} />
          <stop offset="100%" stopColor="#F8F4EE" />
        </linearGradient>
        {/* Drop shadow for marker */}
        <filter id="markerShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.3"/>
        </filter>
        {/* Pattern for green areas */}
        <pattern id="greenPattern" patternUnits="userSpaceOnUse" width="6" height="6">
          <circle cx="3" cy="3" r="1" fill={COLORS.greenAreaDark} opacity="0.3"/>
        </pattern>
      </defs>

      {/* Background - Light beige */}
      <rect x="0" y="0" width="200" height="120" fill="#F5EFE6" rx="4" />

      {/* Green areas (parks/vegetation) */}
      <ellipse cx="25" cy="25" rx="28" ry="20" fill={COLORS.greenArea} />
      <ellipse cx="25" cy="25" rx="28" ry="20" fill="url(#greenPattern)" />
      <ellipse cx="175" cy="100" rx="35" ry="25" fill={COLORS.greenArea} />
      <ellipse cx="175" cy="100" rx="35" ry="25" fill="url(#greenPattern)" />
      <ellipse cx="170" cy="25" rx="22" ry="18" fill={COLORS.greenArea} opacity="0.6" />

      {/* D14 - Secondary road (top) */}
      <path
        d="M 0 35 Q 40 30 80 38 Q 120 46 160 35 Q 180 30 200 32"
        stroke={COLORS.roadSecondaryBorder}
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 0 35 Q 40 30 80 38 Q 120 46 160 35 Q 180 30 200 32"
        stroke={COLORS.roadSecondary}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Cross street - Chemin vertical */}
      <path
        d="M 130 0 L 130 50 Q 128 70 125 120"
        stroke={COLORS.roadSecondaryBorder}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 130 0 L 130 50 Q 128 70 125 120"
        stroke={COLORS.roadSecondary}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* AVENUE DE LA TOULOUBRE - Main road */}
      <path
        d="M 0 75 Q 50 72 100 76 Q 150 80 200 75"
        stroke={COLORS.roadMainBorder}
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 0 75 Q 50 72 100 76 Q 150 80 200 75"
        stroke="url(#roadGradient)"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      {/* Road center dashes */}
      <path
        d="M 0 75 Q 50 72 100 76 Q 150 80 200 75"
        stroke={COLORS.gold}
        strokeWidth="1.5"
        strokeDasharray="6 4"
        fill="none"
        opacity="0.5"
      />

      {/* Road name label - Avenue de la Touloubre */}
      <rect x="8" y="83" width="68" height="9" fill="white" opacity="0.85" rx="2" />
      <text
        x="42"
        y="90"
        fontSize="5.5"
        fill={COLORS.text}
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
        textAnchor="middle"
      >
        AV. DE LA TOULOUBRE
      </text>

      {/* Building: Maternité de l'Étoile */}
      <g transform="translate(55, 50)">
        <rect x="-12" y="-8" width="24" height="16" fill={COLORS.building} stroke={COLORS.buildingStroke} strokeWidth="0.8" rx="1" />
        <rect x="-9" y="-5" width="5" height="4" fill="white" opacity="0.6" />
        <rect x="4" y="-5" width="5" height="4" fill="white" opacity="0.6" />
        <rect x="-3" y="2" width="6" height="6" fill={COLORS.textLight} opacity="0.3" />
        {/* Hospital cross */}
        <rect x="-1.5" y="-14" width="3" height="8" fill={COLORS.primary} rx="0.5" />
        <rect x="-4" y="-11" width="8" height="3" fill={COLORS.primary} rx="0.5" />
        <text x="0" y="18" fontSize="5" fill={COLORS.text} textAnchor="middle" fontWeight="600" fontFamily="system-ui, sans-serif">
          Maternité
        </text>
      </g>

      {/* Building: Stade */}
      <g transform="translate(160, 50)">
        <ellipse cx="0" cy="0" rx="14" ry="9" fill="#E8F5E0" stroke={COLORS.greenAreaDark} strokeWidth="1.5" />
        <ellipse cx="0" cy="0" rx="10" ry="6" fill="#D4E8C8" />
        <line x1="-8" y1="0" x2="8" y2="0" stroke="white" strokeWidth="1" />
        <line x1="0" y1="-5" x2="0" y2="5" stroke="white" strokeWidth="0.5" opacity="0.7" />
        <text x="0" y="18" fontSize="5" fill={COLORS.text} textAnchor="middle" fontWeight="600" fontFamily="system-ui, sans-serif">
          Stade
        </text>
      </g>

      {/* Parking indicator */}
      <g transform="translate(150, 90)">
        <rect x="-8" y="-6" width="16" height="12" fill="#3B82F6" rx="2" />
        <text x="0" y="3" fontSize="9" fill="white" textAnchor="middle" fontWeight="bold" fontFamily="system-ui, sans-serif">
          P
        </text>
        <text x="0" y="14" fontSize="4" fill={COLORS.textLight} textAnchor="middle" fontWeight="500" fontFamily="system-ui, sans-serif">
          Parking
        </text>
      </g>

      {/* PIZZA FALCHI - Main marker */}
      <g transform="translate(90, 68)" filter="url(#markerShadow)">
        {/* Glow effect */}
        <circle cx="0" cy="0" r="18" fill={COLORS.gold} opacity="0.2">
          <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Pin shape */}
        <path
          d="M 0 -22 C -12 -22 -16 -12 -16 -5 C -16 8 0 22 0 22 C 0 22 16 8 16 -5 C 16 -12 12 -22 0 -22"
          fill={COLORS.primary}
          stroke={COLORS.gold}
          strokeWidth="3"
        />

        {/* Inner circle */}
        <circle cx="0" cy="-7" r="8" fill={COLORS.gold} />

        {/* Pizza slice icon */}
        <path d="M 0 -13 L 5 -2 L -5 -2 Z" fill={COLORS.primary} />
        <circle cx="0" cy="-6" r="1.5" fill={COLORS.primary} />

        {/* Label banner */}
        <rect x="-28" y="24" width="56" height="14" fill={COLORS.primary} rx="3" />
        <text x="0" y="33" fontSize="7" fill="white" textAnchor="middle" fontWeight="bold" fontFamily="system-ui, sans-serif">
          PIZZA FALCHI
        </text>
      </g>

      {/* Compass */}
      <g transform="translate(180, 18)">
        <circle cx="0" cy="0" r="10" fill="white" stroke={COLORS.textLight} strokeWidth="0.5" />
        <polygon points="0,-7 2,-2 -2,-2" fill={COLORS.primary} />
        <polygon points="0,7 2,2 -2,2" fill={COLORS.textLight} opacity="0.5" />
        <text x="0" y="-2" fontSize="6" fill={COLORS.primary} textAnchor="middle" fontWeight="bold" fontFamily="system-ui, sans-serif">
          N
        </text>
      </g>

      {/* Scale */}
      <g transform="translate(15, 108)">
        <line x1="0" y1="0" x2="35" y2="0" stroke={COLORS.text} strokeWidth="1" />
        <line x1="0" y1="-3" x2="0" y2="3" stroke={COLORS.text} strokeWidth="1" />
        <line x1="35" y1="-3" x2="35" y2="3" stroke={COLORS.text} strokeWidth="1" />
        <text x="17.5" y="-4" fontSize="5" fill={COLORS.text} textAnchor="middle" fontFamily="system-ui, sans-serif">
          ~500m
        </text>
      </g>

      {/* Border */}
      <rect
        x="1"
        y="1"
        width="198"
        height="118"
        fill="none"
        stroke={COLORS.gold}
        strokeWidth="1.5"
        rx="4"
        opacity="0.6"
      />
    </svg>
  );
}
