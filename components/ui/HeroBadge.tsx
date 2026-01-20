'use client';
import Image from 'next/image';
import { ReactNode } from 'react';

interface HeroBadgeProps {
  /** Category badge text (e.g., "Menu Complet", "Contact", "Panier") */
  categoryBadge: string;
  /** Main title (usually "PIZZA FALCHI") */
  title?: string;
  /** Subtitle in yellow (e.g., "depuis 2001") */
  subtitle?: string;
  /** Location text */
  location?: string;
  /** Additional badge below (e.g., "À EMPORTER") */
  additionalBadge?: string;
  /** Whether to show the logo */
  showLogo?: boolean;
  /** Size: 'default' for hero sections, 'compact' for smaller placements */
  size?: 'default' | 'compact';
  /** Custom icon instead of logo */
  icon?: ReactNode;
  /** Whether this is clickable (for interactive badges) */
  onClick?: () => void;
  /** Additional className */
  className?: string;
}

/**
 * HeroBadge - Unified glassmorphism badge component
 * Used in hero sections across the site for consistent branding
 *
 * Design specs:
 * - Glassmorphism: bg-white/10 backdrop-blur-lg
 * - Border: border-white/20
 * - Rounded: rounded-3xl
 * - Shadow: shadow-2xl
 *
 * Sizes:
 * - default: Full hero badge (/, /menu)
 * - compact: Smaller badge for corner placements (/contact)
 */
export default function HeroBadge({
  categoryBadge,
  title = 'PIZZA FALCHI',
  subtitle = 'depuis 2001',
  location = 'Puyricard Aix-en-Provence',
  additionalBadge,
  showLogo = true,
  size = 'default',
  icon,
  onClick,
  className = '',
}: HeroBadgeProps) {

  // Compact size for corner placements (like contact page)
  if (size === 'compact') {
    const BadgeContent = (
      <>
        {(showLogo || icon) && (
          <div className="relative w-12 h-12 flex-shrink-0">
            {icon ? (
              <div className="w-full h-full flex items-center justify-center">
                {icon}
              </div>
            ) : (
              <Image
                src="/images/branding/logo-badge.png"
                alt="Pizza Falchi Logo"
                fill
                className="object-contain drop-shadow-2xl"
              />
            )}
          </div>
        )}
        <div className={`flex flex-col gap-0.5 ${showLogo || icon ? 'text-left' : 'text-center'}`}>
          <span className="bg-primary-red text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg inline-block w-fit">
            {categoryBadge}
          </span>
          <span className="text-lg font-black text-white tracking-tight leading-tight">
            {title}
          </span>
          {subtitle && (
            <span className="text-primary-yellow font-bold text-sm">
              {subtitle}
            </span>
          )}
        </div>
      </>
    );

    const compactClasses = `inline-flex flex-row items-center gap-3 bg-white/10 backdrop-blur-lg rounded-2xl p-3 border border-white/20 shadow-2xl ${className}`;

    if (onClick) {
      return (
        <button
          onClick={onClick}
          className={`${compactClasses} cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50`}
        >
          {BadgeContent}
        </button>
      );
    }

    return (
      <div className={compactClasses}>
        {BadgeContent}
      </div>
    );
  }

  // Default size for hero sections (/, /menu)
  const BadgeContent = (
    <>
      {/* Logo or Custom Icon */}
      {(showLogo || icon) && (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 flex-shrink-0">
          {icon ? (
            <div className="w-full h-full flex items-center justify-center">
              {icon}
            </div>
          ) : (
            <Image
              src="/images/branding/logo-badge.png"
              alt="Pizza Falchi Logo"
              fill
              className="object-contain drop-shadow-2xl"
            />
          )}
        </div>
      )}

      {/* Info */}
      <div className={`flex flex-col gap-1 ${showLogo || icon ? 'text-center sm:text-left' : 'text-center'}`}>
        {/* Category Badge */}
        <div className="inline-block mb-2">
          <span className="bg-primary-red text-white px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg">
            {categoryBadge}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-primary-yellow font-bold text-xl md:text-2xl">
            {subtitle}
          </p>
        )}

        {/* Location */}
        {location && (
          <p className="text-white/90 font-medium text-base md:text-lg">
            {location}
          </p>
        )}

        {/* Additional Badge */}
        {additionalBadge && (
          <div className="inline-block mt-2">
            <span className="bg-primary-red px-3 sm:px-4 py-1.5 rounded-full text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg">
              {additionalBadge}
            </span>
          </div>
        )}
      </div>
    </>
  );

  const baseClasses = `inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl max-w-2xl ${className}`;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50`}
      >
        {BadgeContent}
      </button>
    );
  }

  return (
    <div className={baseClasses}>
      {BadgeContent}
    </div>
  );
}
