import Link from 'next/link';
import Image from 'next/image';
import { Pizza, Truck, Clock, Star, ChefHat, Award, Heart, MapPin, Timer, Flame } from 'lucide-react';
import StorySection from '@/components/home/StorySection';
import StructuredData from '@/components/seo/StructuredData';
import CompactLoyaltyBanner from '@/components/promotions/CompactLoyaltyBanner';
import { SPACING, ROUNDED, SHADOWS, TRANSITIONS } from '@/lib/design-constants';

export default function Home() {
  // Organization and LocalBusiness structured data for SEO
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': 'https://www.pizzafalchi.com/#restaurant',
    name: 'Pizza Falchi',
    image: 'https://www.pizzafalchi.com/images/branding/logo-badge.png',
    description: 'Restaurant de pizzas artisanales à Puyricard. Pizzas au feu de bois préparées avec des ingrédients frais et authentiques. Food truck moderne proposant des recettes italiennes traditionnelles.',
    url: 'https://www.pizzafalchi.com',
    telephone: '+33442920308',
    priceRange: '€€',
    servesCuisine: ['Italian', 'Pizza'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Puyricard',
      addressLocality: 'Puyricard',
      addressRegion: 'Provence-Alpes-Côte d\'Azur',
      postalCode: '13540',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.5894,
      longitude: 5.5683,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '18:00',
        closes: '21:30',
      },
    ],
    acceptsReservations: 'True',
    menu: 'https://www.pizzafalchi.com/menu',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '150',
      bestRating: '5',
      worstRating: '1',
    },
    sameAs: [
      'https://www.facebook.com/pizzafalchi',
      'https://www.instagram.com/pizzafalchi',
    ],
  };

  return (
    <>
      <StructuredData data={organizationSchema} />
      <div className="min-h-screen bg-warm-cream dark:bg-gray-900 transition-colors">
      {/* Hero Section - Clean & Impactful */}
      <section className="relative min-h-screen flex items-center justify-center bg-warm-cream dark:bg-gray-900 overflow-hidden transition-colors">
        {/* Large Hero Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/restaurant/wood-fired-oven.jpg"
            alt="Pizza Falchi - Pizzas artisanales italiennes authentiques"
            fill
            className="object-cover"
            priority
          />
          {/* Clean overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/50 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="max-w-3xl mx-auto text-center">
            {/* Info Badge - Main Focus */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl mb-10 max-w-2xl">
              {/* Logo */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 flex-shrink-0">
                <Image
                  src="/images/branding/logo-badge.png"
                  alt="Pizza Falchi Logo"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1 text-center sm:text-left">
                <div className="inline-block mb-2">
                  <span className="bg-primary-red text-white px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg">
                    Pizzas Artisanales
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  PIZZA FALCHI
                </h1>
                <p className="text-primary-yellow font-bold text-xl md:text-2xl">
                  depuis 2001
                </p>
                <p className="text-white/90 font-medium text-base md:text-lg">
                  Puyricard Aix-en-Provence
                </p>
                <div className="inline-block mt-2">
                  <span className="bg-primary-red px-4 py-1.5 rounded-full text-white text-sm font-bold uppercase tracking-wider shadow-lg">
                    À EMPORTER
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed font-medium">
              Authenticité italienne • Ingrédients premium • Savoir-faire artisanal
            </p>

            {/* Tagline */}
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white/80 leading-relaxed mb-10">
              Des pizzas
              <span className="text-primary-yellow"> qui voyagent </span>
              jusqu'à vous
            </div>

            {/* CTA Buttons at bottom */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="relative px-8 py-4 sm:px-12 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl shadow-2xl text-center overflow-hidden group bg-primary-red text-white"
              >
                <span className="relative z-10 group-hover:text-charcoal transition-colors duration-300">Voir le Menu</span>
              </Link>

              <Link
                href="/contact"
                className="relative border-2 border-white bg-white/10 backdrop-blur px-8 py-4 sm:px-12 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl shadow-xl text-center overflow-hidden group text-white"
              >
                <span className="relative z-10 group-hover:text-charcoal transition-colors duration-300">Nous Trouver</span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <StorySection />

      {/* Showcase Section - Soirée Pizza Style */}
      <section className="py-20 bg-surface dark:bg-surface transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/fallbacks/home-img.avif"
                alt="Pizza Falchi - Nos Pizzas Artisanales"
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div>
              <div className="inline-block mb-4">
                <div className="bg-primary-red text-white px-4 py-2 rounded-full flex items-center gap-2">
                  <Pizza className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Notre Spécialité</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-charcoal dark:text-gray-100 mb-6 transition-colors duration-300">
                Pizzas Authentiques
              </h2>
              <p className="text-xl text-text-secondary dark:text-text-secondary leading-relaxed mb-8 transition-colors duration-300">
                Chaque pizza est préparée avec des ingrédients sélectionnés directement d'Italie. Notre pâte fermente 48 heures pour une texture légère et croustillante.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-warm-cream dark:bg-gray-700 rounded-2xl p-4 text-center transition-colors duration-300">
                  <div className="text-3xl font-black text-primary-red mb-1">48h</div>
                  <div className="text-sm text-charcoal dark:text-gray-300 font-medium">Fermentation</div>
                </div>
                <div className="bg-warm-cream dark:bg-gray-700 rounded-2xl p-4 text-center transition-colors duration-300">
                  <div className="text-3xl font-black text-primary-yellow mb-1">100%</div>
                  <div className="text-sm text-charcoal dark:text-gray-300 font-medium">Italien</div>
                </div>
                <div className="bg-warm-cream dark:bg-gray-700 rounded-2xl p-4 text-center transition-colors duration-300">
                  <div className="text-3xl font-black text-basil-light mb-1">Feu</div>
                  <div className="text-sm text-charcoal dark:text-gray-300 font-medium">De bois</div>
                </div>
              </div>

              <Link
                href="/menu"
                className="relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg overflow-hidden group bg-primary-red text-white"
              >
                <span className="relative z-10 flex items-center gap-3 group-hover:text-charcoal transition-colors duration-300">
                  Découvrir le Menu
                  <span>→</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Subtle & Elegant with Loyalty */}
      <section className="py-8 md:py-12 bg-background/50 dark:bg-gray-900/50 transition-colors border-t border-border/50 dark:border-border/30">
        <div className="max-w-5xl mx-auto px-4">
          {/* Loyalty Banner - Compact & Integrated */}
          <CompactLoyaltyBanner />

          {/* CTA Content */}
          <div className="text-center">
            <p className="text-sm uppercase tracking-widest text-text-tertiary dark:text-text-tertiary mb-3 font-medium transition-colors">
              Une question ?
            </p>
            <h3 className="text-2xl md:text-3xl font-semibold text-text-primary dark:text-text-primary mb-8 transition-colors">
              Découvrez notre menu
            </h3>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/menu"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-base bg-primary-red text-white hover:bg-primary-red-hover transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Pizza className="w-4 h-4" />
                <span>Voir le Menu</span>
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-base border border-border dark:border-border bg-transparent text-text-primary dark:text-text-primary hover:bg-background-secondary dark:hover:bg-background-tertiary transition-all duration-200"
              >
                <span>Nous Contacter</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}