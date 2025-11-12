import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Mail, Clock, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black dark:from-background-secondary dark:to-background-tertiary text-text-on-dark dark:text-text-primary relative overflow-hidden transition-colors">
      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-brand-red via-brand-gold to-brand-red transition-colors"></div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Content - Compact Single Row with Aligned Headers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Logo & Tagline */}
          <div className="lg:col-span-3">
            <Link href="/" className="flex items-center space-x-2 mb-3 group">
              <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src="/images/branding/logo-badge.png"
                  alt="Pizza Falchi Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-text-on-dark dark:text-text-primary transition-colors">
                  PIZZA <span className="text-brand-gold">FALCHI</span>
                </span>
                <span className="text-xs text-text-tertiary dark:text-text-tertiary tracking-wider transition-colors">
                  AUTHENTIQUE • ARTISANAL
                </span>
              </div>
            </Link>
            {/* Social Media */}
            <div className="flex space-x-3">
              <a
                href="#"
                className="bg-white/20 dark:bg-white/10 text-white hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 hover:text-white p-2.5 rounded-full transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="bg-white/20 dark:bg-white/10 text-white hover:bg-blue-600 hover:text-white p-2.5 rounded-full transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="bg-white/20 dark:bg-white/10 text-white hover:bg-red-600 hover:text-white p-2.5 rounded-full transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="Google"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </a>
            </div>
            {/* Fait Maison Badge */}
            <div className="mt-4 flex items-center gap-2">
              <div className="relative w-16 h-16 bg-white/10 dark:bg-white/5 rounded-xl p-1 backdrop-blur-sm">
                <Image
                  src="/images/branding/fait-maison-badge.png"
                  alt="Fait Maison - Produits faits maison"
                  fill
                  className="object-contain filter brightness-[2] contrast-125 invert dark:brightness-100 dark:invert-0"
                />
              </div>
              <p className="text-xs text-white dark:text-gray-200 font-medium transition-colors">
                Produits<br/>Faits Maison
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold mb-3 text-brand-gold uppercase tracking-wider transition-colors">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 dark:text-text-secondary hover:text-brand-gold transition-all duration-300 text-sm inline-block hover:translate-x-1 hover:font-semibold">
                  → Accueil
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-gray-300 dark:text-text-secondary hover:text-brand-red transition-all duration-300 text-sm inline-block hover:translate-x-1 hover:font-semibold">
                  → Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 dark:text-text-secondary hover:text-brand-gold transition-all duration-300 text-sm inline-block hover:translate-x-1 hover:font-semibold">
                  → À Propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 dark:text-text-secondary hover:text-brand-red transition-all duration-300 text-sm inline-block hover:translate-x-1 hover:font-semibold">
                  → Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - Compact */}
          <div className="lg:col-span-4">
            <h3 className="text-sm font-bold mb-3 text-brand-gold uppercase tracking-wider transition-colors">Contact</h3>
            <div className="space-y-2 text-sm">
              <a href="tel:+33442920308" className="flex items-center gap-2 text-gray-300 dark:text-text-secondary hover:text-brand-gold transition-all duration-300 hover:translate-x-1">
                <Phone className="w-3.5 h-3.5" />
                <span>04 42 92 03 08</span>
              </a>
              <a href="mailto:pizzafalchipro@gmail.com" className="flex items-center gap-2 text-gray-300 dark:text-text-secondary hover:text-brand-red transition-all duration-300 hover:translate-x-1">
                <Mail className="w-3.5 h-3.5" />
                <span>pizzafalchipro@gmail.com</span>
              </a>
              <div className="flex items-start gap-2 text-gray-300 dark:text-text-secondary transition-colors">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>615, av. de la Touloubre, 13540 Puyricard</span>
              </div>
            </div>
          </div>

          {/* Hours - Compact */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold mb-3 text-brand-gold uppercase tracking-wider transition-colors">Horaires</h3>
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2 text-gray-300 dark:text-text-secondary transition-colors">
                <Clock className="w-3.5 h-3.5" />
                <span>Mar - Dim</span>
              </div>
              <p className="text-white dark:text-text-primary font-semibold transition-colors">18h00 - 21h30</p>
              <p className="text-gray-400 dark:text-text-tertiary text-xs transition-colors">Fermé le lundi</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Compact */}
        <div className="border-t border-gray-800 dark:border-border-medium mt-6 pt-4 transition-colors">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
            <p className="text-gray-400 dark:text-text-tertiary transition-colors">
              © {currentYear} <span className="text-brand-gold font-semibold transition-colors">Pizza Falchi</span>. Tous droits réservés.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4 text-sm">
              <Link href="/mentions-legales" className="text-gray-400 dark:text-text-tertiary hover:text-brand-red transition-colors">Mentions Légales</Link>
              <span className="text-gray-600 dark:text-gray-500">•</span>
              <Link href="/politique-confidentialite" className="text-gray-400 dark:text-text-tertiary hover:text-brand-gold transition-colors">Confidentialité</Link>
              <span className="text-gray-600 dark:text-gray-500">•</span>
              <Link href="/conditions-generales-vente" className="text-gray-400 dark:text-text-tertiary hover:text-brand-red transition-colors">CGV</Link>
              <span className="text-gray-600 dark:text-gray-500">•</span>
              <Link href="/conditions-generales-utilisation" className="text-gray-400 dark:text-text-tertiary hover:text-brand-gold transition-colors">CGU</Link>
              <span className="text-gray-600 dark:text-gray-500">•</span>
              <Link href="/politique-cookies" className="text-gray-400 dark:text-text-tertiary hover:text-brand-red transition-colors">Cookies</Link>
              <span className="text-gray-600 dark:text-gray-500">•</span>
              <Link href="/accessibilite" className="text-gray-400 dark:text-text-tertiary hover:text-brand-gold transition-colors">Accessibilité</Link>
              <span className="text-gray-600 dark:text-gray-500">•</span>
              <Link href="/exercer-mes-droits" className="text-gray-400 dark:text-text-tertiary hover:text-brand-red transition-colors">Exercer mes droits</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,210,0,0.1),transparent_50%)]"></div>
      </div>
    </footer>
  );
}