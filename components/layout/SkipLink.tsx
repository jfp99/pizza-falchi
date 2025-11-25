'use client';

/**
 * SkipLink component for accessibility (WCAG 2.1 AA)
 * Allows keyboard users to skip navigation and jump directly to main content
 * Becomes visible only when focused via Tab key
 *
 * Usage: Place at the very beginning of the page before navigation
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-brand-red dark:focus:bg-brand-gold focus:text-white dark:focus:text-gray-900 focus:rounded-xl focus:font-bold focus:shadow-soft-lg focus:outline-none focus:ring-4 focus:ring-brand-gold dark:focus:ring-brand-red focus:ring-offset-2 transition-all duration-200"
    >
      Aller au contenu principal
    </a>
  );
}
