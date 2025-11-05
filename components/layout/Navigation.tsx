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
    <nav className="bg-gradient-to-r from-background-tertiary via-background-secondary to-background-tertiary dark:from-background-secondary dark:via-background-primary dark:to-background-secondary shadow-2xl sticky top-0 z-50 border-b-4 border-brand-gold transition-colors duration-300">
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
            <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/images/branding/logo-badge.png"
                alt="Pizza Falchi Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-text-on-dark dark:text-text-primary tracking-tight transition-colors">
                PIZZA <span className="text-brand-gold">FALCHI</span>
              </span>
              <span className="text-xs text-text-tertiary dark:text-text-tertiary font-light tracking-wider transition-colors">
                AUTHENTIQUE • ARTISANAL
              </span>
            </div>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className="relative px-4 py-2 text-text-on-dark dark:text-text-primary font-semibold transition-all duration-300 group"
            >
              <span className="relative z-10 group-hover:text-text-primary dark:group-hover:text-text-on-dark transition-colors">Accueil</span>
              <span className="absolute inset-0 bg-gradient-to-r from-brand-red to-brand-gold opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300 shadow-lg"></span>
            </Link>
            <Link
              href="/menu"
              className="relative px-4 py-2 text-text-on-dark dark:text-text-primary font-semibold transition-all duration-300 group"
            >
              <span className="relative z-10 group-hover:text-text-primary dark:group-hover:text-text-on-dark transition-colors">Menu</span>
              <span className="absolute inset-0 bg-gradient-to-r from-brand-gold to-brand-red opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300 shadow-lg"></span>
            </Link>
            <Link
              href="/about"
              className="relative px-4 py-2 text-text-on-dark dark:text-text-primary font-semibold transition-all duration-300 group"
            >
              <span className="relative z-10 group-hover:text-text-primary dark:group-hover:text-text-on-dark transition-colors">À Propos</span>
              <span className="absolute inset-0 bg-gradient-to-r from-brand-red to-brand-gold opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300 shadow-lg"></span>
            </Link>
            <Link
              href="/contact"
              className="relative px-4 py-2 text-text-on-dark dark:text-text-primary font-semibold transition-all duration-300 group"
            >
              <span className="relative z-10 group-hover:text-text-primary dark:group-hover:text-text-on-dark transition-colors">Contact</span>
              <span className="absolute inset-0 bg-gradient-to-r from-brand-gold to-brand-red opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300 shadow-lg"></span>
            </Link>

            {/* Theme Toggle */}
            <div className="ml-2">
              <ThemeToggle />
            </div>

            {/* Cart Button with Hover Preview */}
            <div
              className="relative ml-3"
              onMouseEnter={() => setShowCartPreview(true)}
              onMouseLeave={() => setShowCartPreview(false)}
            >
              <button
                suppressHydrationWarning
                className="relative bg-gradient-to-r from-brand-red to-brand-red-hover hover:from-brand-gold hover:to-brand-red px-6 py-3 rounded-full font-bold text-text-on-dark hover:text-text-primary transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-2xl flex items-center space-x-2"
                aria-label={`Panier ${getTotalItems() > 0 ? `avec ${getTotalItems()} article${getTotalItems() > 1 ? 's' : ''}` : 'vide'}`}
                aria-expanded={showCartPreview}
                aria-haspopup="true"
                onClick={() => setShowCartPreview(!showCartPreview)}
                onFocus={() => setShowCartPreview(true)}
                onBlur={(e) => {
                  // Only hide if focus is moving outside the cart preview
                  if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
                    setShowCartPreview(false);
                  }
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Panier</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-gold text-text-primary rounded-full w-7 h-7 text-sm font-black flex items-center justify-center shadow-lg animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Cart Preview Dropdown */}
              {showCartPreview && (
                <div
                  className="absolute right-0 top-full mt-2 w-96 bg-surface dark:bg-surface rounded-2xl shadow-2xl border-2 border-border dark:border-border overflow-hidden transition-colors"
                  role="region"
                  aria-label="Aperçu du panier"
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
                        className="inline-block bg-gradient-to-r from-brand-red to-brand-gold text-text-on-dark px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all"
                      >
                        Voir le Menu
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-gradient-to-r from-brand-red to-brand-gold transition-colors">
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
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-bold text-text-primary dark:text-text-primary transition-colors">Total:</span>
                          <span className="font-black text-2xl text-brand-red transition-colors">{getTotalPrice().toFixed(2)}€</span>
                        </div>
                        <Link
                          href="/cart"
                          className="block w-full bg-gradient-to-r from-brand-red to-brand-gold text-text-on-dark text-center px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
                        >
                          Voir le Panier Complet
                        </Link>
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
            className="lg:hidden bg-brand-red hover:bg-brand-red-hover p-2 rounded-lg transition-all"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6 text-text-on-dark" /> : <Menu className="w-6 h-6 text-text-on-dark" />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border-medium dark:border-border-medium">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className="px-4 py-3 text-text-on-dark dark:text-text-primary hover:bg-brand-red rounded-lg transition-all font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/menu"
                className="px-4 py-3 text-text-on-dark dark:text-text-primary hover:bg-brand-red rounded-lg transition-all font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Menu
              </Link>
              <Link
                href="/about"
                className="px-4 py-3 text-text-on-dark dark:text-text-primary hover:bg-brand-red rounded-lg transition-all font-semibold"
                onClick={() => setIsOpen(false)}
              >
                À Propos
              </Link>
              <Link
                href="/contact"
                className="px-4 py-3 text-text-on-dark dark:text-text-primary hover:bg-brand-red rounded-lg transition-all font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/cart"
                className="px-4 py-3 bg-brand-red hover:bg-brand-red-hover text-text-on-dark rounded-lg transition-all font-bold flex items-center justify-between"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Panier</span>
                </div>
                {getTotalItems() > 0 && (
                  <span className="bg-brand-gold text-text-primary px-3 py-1 rounded-full font-black text-sm transition-colors">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}