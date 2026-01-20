'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingCart, Phone, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const { getTotalItems, items, removeItem, getTotalPrice } = useCart();

  // Handle Escape key to close cart preview
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCartPreview) {
        setShowCartPreview(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showCartPreview]);

  return (
    <nav className="bg-surface dark:bg-surface shadow-soft-lg sticky top-0 z-50 border-b-2 border-brand-gold transition-colors duration-200">
      {/* Top Bar - Contact Info */}
      <div className="bg-brand-red text-text-on-dark transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span className="font-medium">04 42 92 03 08</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold">Ouvert 6j/7 • 18h-21h30</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src="/images/branding/logo-badge.png"
                alt="Pizza Falchi Logo"
                fill
                className="object-contain relative z-10 transition-transform duration-200 group-hover:scale-105"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-brand-red dark:text-text-primary tracking-tight transition-colors">
                PIZZA <span className="text-brand-gold">FALCHI</span>
              </span>
              <span className="text-xs text-text-tertiary dark:text-text-tertiary font-light tracking-wider transition-colors">
                AUTHENTIQUE • ARTISANAL
              </span>
            </div>
          </Link>

          {/* Menu Desktop - Enhanced with visual effects */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className="group relative px-5 py-2 text-text-primary dark:text-text-primary font-bold tracking-wide transition-all duration-300 uppercase text-sm hover:text-brand-red dark:hover:text-brand-gold rounded-lg overflow-hidden"
            >
              <span className="relative z-10">Accueil</span>
              {/* Animated underline */}
              <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-brand-red dark:bg-brand-gold transition-all duration-300 ease-out group-hover:w-3/4 group-hover:left-[12.5%]" />
              {/* Subtle glow effect */}
              <span className="absolute inset-0 bg-brand-red/0 dark:bg-brand-gold/0 transition-all duration-300 group-hover:bg-brand-red/5 dark:group-hover:bg-brand-gold/10 rounded-lg" />
            </Link>
            <Link
              href="/menu"
              className="group relative px-5 py-2 text-text-primary dark:text-text-primary font-bold tracking-wide transition-all duration-300 uppercase text-sm hover:text-brand-red dark:hover:text-brand-gold rounded-lg overflow-hidden"
            >
              <span className="relative z-10">Menu</span>
              <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-brand-red dark:bg-brand-gold transition-all duration-300 ease-out group-hover:w-3/4 group-hover:left-[12.5%]" />
              <span className="absolute inset-0 bg-brand-red/0 dark:bg-brand-gold/0 transition-all duration-300 group-hover:bg-brand-red/5 dark:group-hover:bg-brand-gold/10 rounded-lg" />
            </Link>
            <Link
              href="/about"
              className="group relative px-5 py-2 text-text-primary dark:text-text-primary font-bold tracking-wide transition-all duration-300 uppercase text-sm hover:text-brand-red dark:hover:text-brand-gold rounded-lg overflow-hidden"
            >
              <span className="relative z-10">Vision</span>
              <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-brand-red dark:bg-brand-gold transition-all duration-300 ease-out group-hover:w-3/4 group-hover:left-[12.5%]" />
              <span className="absolute inset-0 bg-brand-red/0 dark:bg-brand-gold/0 transition-all duration-300 group-hover:bg-brand-red/5 dark:group-hover:bg-brand-gold/10 rounded-lg" />
            </Link>
            <Link
              href="/contact"
              className="group relative px-5 py-2 text-text-primary dark:text-text-primary font-bold tracking-wide transition-all duration-300 uppercase text-sm hover:text-brand-red dark:hover:text-brand-gold rounded-lg overflow-hidden"
            >
              <span className="relative z-10">Contact</span>
              <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-brand-red dark:bg-brand-gold transition-all duration-300 ease-out group-hover:w-3/4 group-hover:left-[12.5%]" />
              <span className="absolute inset-0 bg-brand-red/0 dark:bg-brand-gold/0 transition-all duration-300 group-hover:bg-brand-red/5 dark:group-hover:bg-brand-gold/10 rounded-lg" />
            </Link>

            {/* Cart Button with Hover Preview - REFINED: No gradients, subtle badge pulse */}
            <div
              className="relative ml-3"
              onMouseEnter={() => setShowCartPreview(true)}
              onMouseLeave={() => setShowCartPreview(false)}
            >
              <Link
                href="/cart"
                suppressHydrationWarning
                className="bg-brand-red px-6 py-3 rounded-full font-bold shadow-soft-md hover:shadow-soft-lg flex items-center space-x-2 text-text-on-dark transition-all duration-200 hover:bg-brand-red-hover active:scale-98 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
                aria-label={`Panier ${getTotalItems() > 0 ? `avec ${getTotalItems()} article${getTotalItems() > 1 ? 's' : ''}` : 'vide'}`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="uppercase text-sm tracking-wide">Panier</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-gold text-gray-900 rounded-full w-7 h-7 text-sm font-black flex items-center justify-center shadow-soft-md ring-2 ring-white dark:ring-gray-900 animate-badge-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </Link>

              {/* Cart Preview Dropdown */}
              {showCartPreview && (
                <div
                  className="absolute right-0 top-full mt-2 w-full max-w-[calc(100vw-2rem)] sm:w-96 bg-surface dark:bg-surface rounded-2xl shadow-2xl border-2 border-border dark:border-border overflow-hidden transition-colors"
                  role="region"
                  aria-label="Aperçu du panier"
                  aria-live="polite"
                  aria-atomic="true"
                  onBlur={(e) => {
                    // Hide preview if focus moves outside
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setShowCartPreview(false);
                    }
                  }}
                >
                  {getTotalItems() === 0 ? (
                    <div className="p-8 text-center">
                      <ShoppingCart className="w-16 h-16 mx-auto text-text-tertiary dark:text-text-tertiary mb-4 transition-colors" />
                      <h3 className="text-xl font-bold text-text-primary dark:text-text-primary mb-2 transition-colors">Votre panier est vide</h3>
                      <p className="text-text-secondary dark:text-text-secondary mb-4 transition-colors">Ajoutez des pizzas délicieuses !</p>
                      <Link
                        href="/menu"
                        className="inline-block px-6 py-3 rounded-xl font-bold bg-brand-red text-text-on-dark hover:bg-brand-red-hover transition-colors duration-200"
                      >
                        Voir le Menu
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-brand-red transition-colors">
                        <h3 className="text-text-on-dark font-bold text-lg transition-colors">Mon Panier ({getTotalItems()} articles)</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                        {items.map((item) => (
                          <div key={item.product._id} className="flex items-center gap-3 bg-background-secondary dark:bg-background-tertiary p-3 rounded-xl hover:bg-background-tertiary dark:hover:bg-background-secondary transition-colors">
                            <div className="flex-1">
                              <h4 className="font-bold text-text-primary dark:text-text-primary text-sm transition-colors">{item.product.name}</h4>
                              <p className="text-xs text-text-secondary dark:text-text-secondary transition-colors">Quantité: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-brand-red transition-colors">{(item.product.price * item.quantity).toFixed(2)}€</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeItem(item.product._id);
                              }}
                              className="p-2 hover:bg-brand-red-lighter dark:hover:bg-brand-red-lighter rounded-lg transition-colors"
                              aria-label={`Retirer ${item.product.name} du panier`}
                            >
                              <Trash2 className="w-4 h-4 text-brand-red transition-colors" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-background-secondary dark:bg-background-tertiary border-t-2 border-border dark:border-border transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-text-primary dark:text-text-primary transition-colors">Total:</span>
                          <span className="font-black text-2xl text-brand-red transition-colors">{getTotalPrice().toFixed(2)}€</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Menu Mobile Button */}
          <button
            suppressHydrationWarning
            className="lg:hidden bg-brand-red hover:bg-brand-red-hover p-3 rounded-lg transition-all min-w-[44px] min-h-[44px]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="w-6 h-6 text-text-on-dark" /> : <Menu className="w-6 h-6 text-text-on-dark" />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden py-4 border-t border-border-medium dark:border-border-medium"
            role="navigation"
            aria-label="Menu mobile"
          >
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className="group relative px-4 py-3 text-brand-red dark:text-text-primary hover:bg-brand-red hover:text-text-on-dark rounded-lg transition-all duration-300 font-bold tracking-wide uppercase text-sm overflow-hidden"
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-4" />
                  Accueil
                </span>
              </Link>
              <Link
                href="/menu"
                className="group relative px-4 py-3 text-brand-red dark:text-text-primary hover:bg-brand-red hover:text-text-on-dark rounded-lg transition-all duration-300 font-bold tracking-wide uppercase text-sm overflow-hidden"
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-4" />
                  Menu
                </span>
              </Link>
              <Link
                href="/about"
                className="group relative px-4 py-3 text-brand-red dark:text-text-primary hover:bg-brand-red hover:text-text-on-dark rounded-lg transition-all duration-300 font-bold tracking-wide uppercase text-sm overflow-hidden"
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-4" />
                  Vision
                </span>
              </Link>
              <Link
                href="/contact"
                className="group relative px-4 py-3 text-brand-red dark:text-text-primary hover:bg-brand-red hover:text-text-on-dark rounded-lg transition-all duration-300 font-bold tracking-wide uppercase text-sm overflow-hidden"
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-4" />
                  Contact
                </span>
              </Link>
              <Link
                href="/cart"
                className="px-4 py-3 rounded-lg font-bold tracking-wide flex items-center justify-between bg-brand-red text-text-on-dark hover:bg-brand-red-hover transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center space-x-2 uppercase text-sm">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Panier</span>
                </span>
                {getTotalItems() > 0 && (
                  <span className="bg-brand-gold text-gray-900 px-3 py-1 rounded-full font-black text-sm">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Theme Toggle - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </nav>
  );
}