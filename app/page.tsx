import Link from 'next/link';
import Image from 'next/image';
import { Pizza, Truck, Clock, Star, ChefHat, Award, Heart, MapPin, Timer, Flame } from 'lucide-react';
import StorySection from '@/components/home/StorySection';
import StructuredData from '@/components/seo/StructuredData';
import { SPACING, ROUNDED, SHADOWS, TRANSITIONS } from '@/lib/design-constants';

export default function Home() {
  // Organization and LocalBusiness structured data for SEO
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': 'https://www.pizzafalchi.com/#restaurant',
    name: 'Pizza Falchi',
    image: 'https://www.pizzafalchi.com/images/branding/logo-badge.png',
    description: 'Restaurant de pizzas artisanales à Ajaccio. Pizzas au feu de bois préparées avec des ingrédients frais et authentiques. Food truck moderne proposant des recettes italiennes traditionnelles.',
    url: 'https://www.pizzafalchi.com',
    telephone: '+33442920308',
    priceRange: '€€',
    servesCuisine: ['Italian', 'Pizza'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ajaccio',
      addressLocality: 'Ajaccio',
      addressRegion: 'Corse',
      postalCode: '20000',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.9267,
      longitude: 8.7369,
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
            <div className="inline-flex items-center gap-6 bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl mb-10 max-w-2xl">
              {/* Logo */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                <Image
                  src="/images/branding/logo-badge.png"
                  alt="Pizza Falchi Logo"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1">
                <div className="inline-block mb-2">
                  <span className="bg-primary-red text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                    Pizzas Artisanales
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
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
                className="bg-gradient-to-r from-primary-red to-primary-red-dark hover:from-primary-yellow hover:to-primary-red text-white hover:text-charcoal px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-primary-yellow/50 text-center"
              >
                Voir le Menu
              </Link>

              <Link
                href="/contact"
                className="border-2 border-white bg-white/10 backdrop-blur text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-white hover:text-charcoal transition-all duration-300 shadow-xl hover:shadow-2xl text-center"
              >
                Nous Trouver
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

      {/* Showcase Section - Clean & Simple */}
      <section className="py-32 bg-surface dark:bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Image - Clean & Large */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/fallbacks/home-img.avif"
                  alt="Pizza Falchi - Nos Pizzas Artisanales"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Simple badge */}
              <div className="absolute -bottom-8 -right-8 bg-primary-red text-white px-8 py-4 rounded-2xl font-black text-xl shadow-xl">
                100% Artisanal
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="text-primary-red font-bold uppercase tracking-wider text-sm">
                Notre Spécialité
              </span>
              <h2 className="text-5xl md:text-6xl font-black text-charcoal mt-4 mb-6 leading-tight">
                Pizzas
                <span className="block text-primary-red">Authentiques</span>
              </h2>
              <p className="text-xl text-text-secondary dark:text-text-secondary leading-relaxed mb-8">
                Chaque pizza est préparée avec des ingrédients sélectionnés directement d'Italie. Notre pâte fermente 48 heures pour une texture légère et croustillante.
              </p>

              {/* Clean features */}
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-soft-red-lighter rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary-red" />
                  </div>
                  <p className="text-lg font-semibold text-charcoal">Recettes napolitaines authentiques</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-soft-yellow-lighter rounded-xl flex items-center justify-center">
                    <Timer className="w-6 h-6 text-primary-yellow" />
                  </div>
                  <p className="text-lg font-semibold text-charcoal">Pâte fermentée 48h</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-soft-red-lighter rounded-xl flex items-center justify-center">
                    <Flame className="w-6 h-6 text-primary-red" />
                  </div>
                  <p className="text-lg font-semibold text-charcoal">Cuisson au feu de bois</p>
                </div>
              </div>

              <Link
                href="/menu"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-red to-primary-red-dark hover:from-primary-yellow hover:to-primary-red text-white hover:text-charcoal px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Découvrir le Menu
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Elegant with Fidelity Banner */}
      <section className="py-20 bg-warm-cream dark:bg-gray-900 transition-colors">
        <div className="max-w-5xl mx-auto px-4">
          {/* Fidelity Banner Integration */}
          <div className="bg-gradient-to-r from-soft-red/30 via-soft-yellow/20 to-soft-red/30 dark:from-soft-red/20 dark:via-soft-yellow/10 dark:to-soft-red/20 rounded-3xl p-8 md:p-12 shadow-xl border-2 border-primary-red/20 dark:border-primary-red/30 mb-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center bg-primary-red rounded-2xl p-4 mb-6 shadow-lg">
                <Gift className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-charcoal dark:text-gray-100 mb-4 transition-colors">
                Programme de Fidélité
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-primary-red dark:text-primary-red-light mb-6">
                10 Pizzas Achetées = 11<sup className="text-xl">ème</sup> Offerte
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Profitez de notre programme de fidélité et régalez-vous !
              </p>
            </div>
          </div>

          {/* CTA Content */}
          <div className="text-center">
            <h3 className="text-4xl md:text-5xl font-black text-charcoal dark:text-gray-100 mb-6 transition-colors">
              Prêt à Commander ?
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed transition-colors">
              Découvrez notre menu et savourez l'authenticité italienne
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary-red to-primary-yellow text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Voir le Menu
                <Pizza className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 border-2 border-charcoal dark:border-gray-300 bg-transparent text-charcoal dark:text-gray-100 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-charcoal hover:text-white dark:hover:bg-gray-100 dark:hover:text-charcoal transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Nous Contacter
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}