'use client';

import React from 'react';
import { getIngredientIcon } from '@/components/icons/IngredientIcons';

interface PizzaPlaceholderProps {
  ingredients?: string[];
  className?: string;
  size?: number;
  isVegetarian?: boolean;
}

/**
 * PizzaPlaceholder - Dynamic SVG pizza placeholder with ingredient icons
 *
 * Creates a circular pizza with ingredients arranged as toppings
 * Maximum 6 visible ingredients, with "+N" badge if more
 */
export const PizzaPlaceholder: React.FC<PizzaPlaceholderProps> = ({
  ingredients = [],
  className = '',
  size = 400,
  isVegetarian = false,
}) => {
  const maxVisibleIngredients = 6;
  const visibleIngredients = ingredients.slice(0, maxVisibleIngredients);
  const extraCount = Math.max(0, ingredients.length - maxVisibleIngredients);

  // Detect if this is a cream-based pizza
  const isCreamBase = ingredients.some(ing =>
    ing.toLowerCase().includes('crème') ||
    ing.toLowerCase().includes('creme') ||
    ing.toLowerCase().includes('cream')
  );

  // Calculate positions for ingredients in a grid centered on the pizza
  const getIngredientPosition = (index: number, total: number) => {
    const centerX = 200;
    const centerY = 150;

    // Grid layout for centered icons
    if (total <= 3) {
      // Single row for 1-3 icons
      const spacing = 50;
      const startX = centerX - ((total - 1) * spacing) / 2;
      return {
        x: startX + index * spacing,
        y: centerY,
      };
    } else if (total <= 6) {
      // Two rows for 4-6 icons
      const cols = total === 4 ? 2 : 3;
      const row = Math.floor(index / cols);
      const col = index % cols;
      const spacingX = 50;
      const spacingY = 45;
      const startX = centerX - ((cols - 1) * spacingX) / 2;
      const startY = centerY - spacingY / 2;
      return {
        x: startX + col * spacingX,
        y: startY + row * spacingY,
      };
    } else {
      // Compact grid for more icons
      const cols = 3;
      const row = Math.floor(index / cols);
      const col = index % cols;
      const spacingX = 45;
      const spacingY = 40;
      const startX = centerX - ((cols - 1) * spacingX) / 2;
      const startY = centerY - spacingY;
      return {
        x: startX + col * spacingX,
        y: startY + row * spacingY,
      };
    }
  };

  return (
    <svg
      width={size}
      height={size * 0.75} // 4:3 aspect ratio
      viewBox="0 0 400 300"
      className={className}
      role="img"
      aria-label={`Pizza placeholder${ingredients.length > 0 ? ` avec ${ingredients.join(', ')}` : ''}`}
    >
      {/* Background */}
      <rect
        width="400"
        height="300"
        fill="url(#bg-gradient)"
      />

      {/* Gradient definitions */}
      <defs>
        {/* Background gradient */}
        <radialGradient id="bg-gradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor={isVegetarian ? '#F0F7EB' : '#FFF9F0'} />
          <stop offset="100%" stopColor={isVegetarian ? '#E8F5E0' : '#FFF5E6'} />
        </radialGradient>

        {/* Pizza dough gradient */}
        <radialGradient id="dough-gradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FFF5E6" />
          <stop offset="70%" stopColor="#FFE8CC" />
          <stop offset="100%" stopColor="#FFD700" />
        </radialGradient>

        {/* Tomato sauce gradient */}
        <radialGradient id="sauce-gradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#E30613" />
        </radialGradient>

        {/* Cream sauce gradient */}
        <radialGradient id="cream-gradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FFFEF5" />
          <stop offset="100%" stopColor="#FFF9E6" />
        </radialGradient>

        {/* Icon background */}
        <filter id="icon-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="0" dy="2" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Pizza Base (outer circle with crust) */}
      <circle
        cx="200"
        cy="150"
        r="145"
        fill="url(#dough-gradient)"
        stroke="#D4A574"
        strokeWidth="3"
      />

      {/* Pizza Sauce (inner circle) - tomato or cream base */}
      <circle
        cx="200"
        cy="150"
        r="130"
        fill={isCreamBase ? "url(#cream-gradient)" : "url(#sauce-gradient)"}
        opacity={isCreamBase ? "0.9" : "0.8"}
      />

      {/* Cheese texture overlay */}
      <circle
        cx="200"
        cy="150"
        r="130"
        fill="#FFE999"
        opacity="0.3"
      />

      {/* Ingredient icons positioned in center of pizza */}
      {visibleIngredients.map((ingredient, index) => {
        const Icon = getIngredientIcon(ingredient);
        const position = getIngredientPosition(index, visibleIngredients.length);

        // Get color for ingredient type
        const getIngredientColor = (ing: string) => {
          const lower = ing.toLowerCase();
          // Vegetables = green
          if (lower.includes('tomate') || lower.includes('poivron') || lower.includes('oignon') ||
              lower.includes('champignon') || lower.includes('basilic') || lower.includes('olive')) {
            return '#16A34A';
          }
          // Cheese = yellow/orange
          if (lower.includes('fromage') || lower.includes('mozzarella') || lower.includes('emmental') ||
              lower.includes('chèvre') || lower.includes('parmesan') || lower.includes('raclette')) {
            return '#F59E0B';
          }
          // Meats = red/brown
          if (lower.includes('jambon') || lower.includes('poulet') || lower.includes('viande') ||
              lower.includes('merguez') || lower.includes('chorizo') || lower.includes('lardons')) {
            return '#DC2626';
          }
          // Seafood = blue
          if (lower.includes('anchois') || lower.includes('thon') || lower.includes('saumon') ||
              lower.includes('fruits de mer')) {
            return '#0EA5E9';
          }
          // Default = brand red
          return '#E30613';
        };

        const iconColor = getIngredientColor(ingredient);

        return (
          <g key={`${ingredient}-${index}`} transform={`translate(${position.x - 20}, ${position.y - 20})`}>
            {/* Icon background circle with slight gradient */}
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="white"
              opacity="0.95"
              filter="url(#icon-shadow)"
            />

            {/* Ingredient icon with color */}
            <foreignObject x="4" y="4" width="32" height="32">
              <div className="flex items-center justify-center w-full h-full">
                <Icon
                  size={24}
                  style={{ color: iconColor }}
                  aria-label={ingredient}
                />
              </div>
            </foreignObject>
          </g>
        );
      })}

      {/* Extra ingredients badge */}
      {extraCount > 0 && (
        <g transform="translate(200, 150)">
          {/* Badge background */}
          <circle
            cx="0"
            cy="0"
            r="24"
            fill="#FFD700"
            stroke="#E30613"
            strokeWidth="3"
            filter="url(#icon-shadow)"
          />

          {/* +N text */}
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#E30613"
            fontSize="16"
            fontWeight="bold"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            +{extraCount}
          </text>
        </g>
      )}
    </svg>
  );
};

export default PizzaPlaceholder;
