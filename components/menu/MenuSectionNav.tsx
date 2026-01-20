/**
 * Menu Section Navigation - Pizza Falchi
 * Sticky navigation for quick access to menu sections
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Star, Pizza, Droplets, ChefHat, Wine, LucideIcon } from 'lucide-react';
import { menuSections, type MenuSectionId } from '@/lib/menuHelpers';
import { colors } from '@/lib/design-tokens';

interface MenuSectionNavProps {
  className?: string;
}

// Map section IDs to icons - memoized outside component
const sectionIcons: Record<MenuSectionId, LucideIcon> = {
  'best-sellers': Star,
  classiques: Pizza,
  cremes: Droplets,
  specialites: ChefHat,
  boissons: Wine,
};

export default function MenuSectionNav({ className = '' }: MenuSectionNavProps) {
  const [activeSection, setActiveSection] = useState<MenuSectionId>('best-sellers');
  const [isSticky, setIsSticky] = useState(false);

  // Check for prefers-reduced-motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Handle scroll to update active section
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + 100; // Offset for sticky nav

    // Check if nav should be sticky
    setIsSticky(window.scrollY > 200);

    // Find current active section
    for (let i = menuSections.length - 1; i >= 0; i--) {
      const section = menuSections[i];
      const element = document.getElementById(section.id);
      if (element && element.offsetTop <= scrollPosition) {
        setActiveSection(section.id);
        break;
      }
    }
  }, []); // menuSections is constant, no need to add as dependency

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Call once on mount to set initial state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Smooth scroll to section - respects reduced motion preference
  const scrollToSection = useCallback((sectionId: MenuSectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for sticky nav height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [prefersReducedMotion]);

  return (
    <nav
      className={`${isSticky ? 'sticky top-0 z-40' : ''} ${className}`}
      aria-label="Navigation des sections du menu"
      role="navigation"
    >
      <div
        className={`py-3 ${
          isSticky
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md border-b border-gray-100 dark:border-gray-800'
            : 'bg-transparent'
        }`}
        style={{
          transitionProperty: 'background-color, box-shadow, border-color',
          transitionDuration: prefersReducedMotion ? '0ms' : '300ms',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          {/* Scrollable container for mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" role="tablist">
            {menuSections.map((section) => {
              const Icon = sectionIcons[section.id];
              const isActive = activeSection === section.id;
              const isBestSellers = section.id === 'best-sellers';

              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      scrollToSection(section.id);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 min-h-[44px] rounded-full text-sm font-medium whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    isActive
                      ? isBestSellers
                        ? 'bg-brand-gold text-gray-900 shadow-md focus-visible:ring-brand-gold'
                        : 'bg-brand-red text-white shadow-md focus-visible:ring-brand-red'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus-visible:ring-gray-400'
                  }`}
                  style={{
                    transitionProperty: 'background-color, box-shadow, transform',
                    transitionDuration: prefersReducedMotion ? '0ms' : '200ms',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={section.id}
                  tabIndex={isActive ? 0 : -1}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive && isBestSellers ? 'fill-current' : ''}`}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">{section.title}</span>
                  <span className="sm:hidden">
                    {/* Shorter text for mobile */}
                    {section.id === 'best-sellers'
                      ? 'Stars'
                      : section.id === 'classiques'
                      ? 'Classiques'
                      : section.id === 'cremes'
                      ? 'Cremes'
                      : section.id === 'specialites'
                      ? 'Specialites'
                      : 'Boissons'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
