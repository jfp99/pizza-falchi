import Link from 'next/link';
import Image from 'next/image';
import { Heart, Users, Award, Star, Leaf, Flame, Phone, Pizza } from 'lucide-react';
import { ChefIcon, TruckIcon } from '@/components/icons/CategoryIcons';
import ProcessSection from '@/components/about/ProcessSection';
import CompactLoyaltyBanner from '@/components/promotions/CompactLoyaltyBanner';
import type { Metadata } from 'next';
import { SPACING, ROUNDED, SHADOWS, TRANSITIONS } from '@/lib/design-constants';

export const metadata: Metadata = {
  title: 'Notre Histoire',
  description: 'Découvrez l\'histoire de Pizza Falchi, une passion transmise de génération en génération depuis 2001. Notre équipe prépare des pizzas artisanales avec des ingrédients 100% italiens à Puyricard.',
  openGraph: {
    title: 'Notre Histoire | Pizza Falchi',
    description: 'Une passion transmise de génération en génération, depuis les ruelles de Naples jusqu\'à votre quartier. Découvrez notre histoire, nos valeurs et notre équipe.',
    url: 'https://www.pizzafalchi.com/about',
    type: 'website',
    images: [
      {
        url: '/images/restaurant/wood-fired-oven.jpg',
        width: 1200,
        height: 630,
        alt: 'Pizza Falchi - Notre Histoire',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notre Histoire | Pizza Falchi',
    description: 'Une passion transmise de génération en génération, depuis les ruelles de Naples jusqu\'à votre quartier.',
    images: ['/images/restaurant/wood-fired-oven.jpg'],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function About() {
  return (
    <div className="min-h-screen bg-warm-cream dark:bg-gray-900 transition-colors">
      {/* Hero Section - Same presentation as homepage */}
      <section className="relative min-h-screen flex items-center justify-center bg-warm-cream dark:bg-gray-900 overflow-hidden transition-colors">
        {/* Large Hero Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/about-hero.avif"
            alt="Pizza Falchi - Notre Histoire"
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
                    Notre Histoire
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
              </div>
            </div>

            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed font-medium">
              Une passion transmise de génération en génération
            </p>

            {/* Tagline */}
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white/80 leading-relaxed mb-10">
              L'Art de la
              <span className="text-primary-yellow"> Pizza Italienne </span>
              authentique
            </div>

            {/* CTA Buttons at bottom */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="relative px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl text-center overflow-hidden group bg-primary-red text-white"
              >
                <span className="relative z-10 group-hover:text-charcoal transition-colors duration-300">Voir le Menu</span>
              </Link>

              <Link
                href="/contact"
                className="relative border-2 border-white bg-white/10 backdrop-blur px-12 py-6 rounded-2xl font-bold text-xl shadow-xl text-center overflow-hidden group text-white"
              >
                <span className="relative z-10 group-hover:text-charcoal transition-colors duration-300">Nous Contacter</span>
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

      {/* Notre Histoire & Valeurs - Unified Section */}
      <section className="py-20 md:py-32 bg-surface dark:bg-surface transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main Container - Histoire de Famille with embedded Valeurs */}
          <div className="bg-warm-cream dark:bg-gray-900 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl transition-colors border-t-4 border-primary-red">

            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-basil-green dark:text-basil-light font-medium text-sm md:text-base mb-4 transition-colors duration-300">
                <span className="w-12 h-[2px] bg-basil-green dark:bg-basil-light transition-colors duration-300" />
                <span className="tracking-wider">Notre Origine</span>
                <span className="w-12 h-[2px] bg-basil-green dark:bg-basil-light transition-colors duration-300" />
              </div>
            </div>

            {/* Story Content */}
            <div className="max-w-4xl mx-auto space-y-6 text-lg text-text-secondary dark:text-text-secondary leading-relaxed transition-colors mb-12">
              <p>
                En 2001, la pizzeria a vu le jour et depuis cette année-là les Falchi servent de délicieuses pizzas sur la commune de Puyricard. J'ai eu l'honneur de me joindre à cette aventure en 2014 et d'apprendre la confection de ces pizzas gourmandes dont je maîtrise désormais les secrets.
              </p>
              <p>
                M. et Mme Falchi me font confiance pour la reprise de cette pizzeria et pour faire perdurer leurs recettes afin de continuer à régaler les habitants de Puyricard et de ses alentours.
              </p>
              <p>
                Chaque pizza est préparée avec des <span className="font-bold text-basil-light">ingrédients importés d'Italie</span> : tomates San Marzano, mozzarella di bufala, basilic frais et huile d'olive extra vierge. Notre pâte fermente pendant 48 heures pour une texture légère et croustillante, exactement comme à Naples.
              </p>
            </div>

            {/* Nos Valeurs - Integrated within the same container */}
            <div className="mt-16 pt-12 border-t-2 border-border dark:border-border transition-colors">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 text-basil-green dark:text-basil-light font-medium text-sm md:text-base mb-4 transition-colors duration-300">
                  <span className="w-12 h-[2px] bg-basil-green dark:bg-basil-light transition-colors duration-300" />
                  <span className="tracking-wider">Nos Valeurs</span>
                  <span className="w-12 h-[2px] bg-basil-green dark:bg-basil-light transition-colors duration-300" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Passion */}
                <div className="group bg-warm-cream dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-primary-red">
                  <div className="bg-gradient-to-br from-primary-red to-primary-red-dark p-3 rounded-2xl w-14 h-14 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto">
                    <Heart className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg font-black mb-2 text-charcoal dark:text-gray-100 transition-colors text-center">
                    Passion
                  </h4>
                  <p className="text-text-secondary dark:text-text-secondary leading-relaxed text-sm transition-colors text-center">
                    Chaque pizza est préparée avec amour et dévouement, comme si nous la faisions pour notre propre famille
                  </p>
                </div>

                {/* Qualité */}
                <div className="group bg-warm-cream dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-primary-yellow">
                  <div className="bg-gradient-to-br from-primary-yellow to-primary-yellow-dark p-3 rounded-2xl w-14 h-14 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg font-black mb-2 text-charcoal dark:text-gray-100 transition-colors text-center">
                    Qualité
                  </h4>
                  <p className="text-text-secondary dark:text-text-secondary leading-relaxed text-sm transition-colors text-center">
                    Ingrédients 100% italiens, sélectionnés avec soin auprès de producteurs de confiance
                  </p>
                </div>

                {/* Authenticité */}
                <div className="group bg-warm-cream dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-basil-light">
                  <div className="bg-gradient-to-br from-basil-light to-basil-green p-3 rounded-2xl w-14 h-14 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto">
                    <Leaf className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg font-black mb-2 text-charcoal dark:text-gray-100 transition-colors text-center">
                    Authenticité
                  </h4>
                  <p className="text-text-secondary dark:text-text-secondary leading-relaxed text-sm transition-colors text-center">
                    Recettes traditionnelles napolitaines respectées à la lettre, sans compromis
                  </p>
                </div>

                {/* Proximité */}
                <div className="group bg-warm-cream dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-brand-gold">
                  <div className="bg-gradient-to-br from-brand-gold to-primary-yellow p-3 rounded-2xl w-14 h-14 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg font-black mb-2 text-charcoal dark:text-gray-100 transition-colors text-center">
                    Proximité
                  </h4>
                  <p className="text-text-secondary dark:text-text-secondary leading-relaxed text-sm transition-colors text-center">
                    Nous nous déplaçons dans votre quartier pour vous offrir une expérience unique
                  </p>
                </div>
              </div>
            </div>

            {/* Signature Quote at the bottom */}
            <div className="mt-12 pt-10 border-t-2 border-border dark:border-border text-center transition-colors">
              <p className="text-2xl md:text-3xl font-black text-charcoal dark:text-gray-100 italic transition-colors">
                Passione • Tradizione • Qualità
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Process Section */}
      <ProcessSection />

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
  );
}
