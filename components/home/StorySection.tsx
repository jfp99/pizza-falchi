'use client';
import Image from 'next/image';
import { Heart, Users, ChefHat } from 'lucide-react';
import PhoneButton from '@/components/ui/PhoneButton';

export default function StorySection() {
  const features = [
    {
      icon: Heart,
      title: 'Produits Frais',
      description: 'Ingrédients de qualité préparés à la demande'
    },
    {
      icon: Users,
      title: 'Cadre Convivial',
      description: 'Accueil chaleureux pour toute la famille'
    },
    {
      icon: ChefHat,
      title: 'Savoir-faire',
      description: 'Pizzaïolos passionnés et expérimentés'
    }
  ];

  return (
    <section className="relative py-20 md:py-32 bg-surface dark:bg-surface transition-colors duration-300 overflow-hidden">
      {/* Background decorative element */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-basil-green/5 dark:bg-basil-green/10 rounded-full blur-3xl transition-colors duration-300" />

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Italian Tagline */}
            <div className="inline-flex items-center gap-2 text-basil-green dark:text-basil-light font-medium text-sm md:text-base transition-colors duration-300">
              <span className="w-12 h-[2px] bg-basil-green dark:bg-basil-light transition-colors duration-300" />
              <span className="tracking-wider">Tradizione • Qualità • Passione</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary dark:text-text-primary transition-colors duration-300">
              Soirée Pizza ?
            </h2>

            {/* Story Content */}
            <div className="space-y-6 text-lg text-text-secondary dark:text-text-secondary leading-relaxed transition-colors duration-300">
              <p>
                Pizza FALCHI vous accueille dans un <strong className="text-text-primary dark:text-text-primary">cadre convivial</strong> et vous propose
                un large choix de pizzas confectionnées à partir de <strong className="text-text-primary dark:text-text-primary">produits frais et de qualité</strong>.
                Il nous tient à cœur de vous faire savourer des pizzas faites maison et authentiques.
              </p>

              <p>
                Nos <strong className="text-text-primary dark:text-text-primary">pizzaïolos passionnés</strong> sauront mettre à profit leur savoir-faire
                pour faire voyager vos papilles gustatives et celles de vos proches.
              </p>

              <p>
                Dans un cadre chaleureux à des prix très légers, nous vous accueillons comme nous pourrions accueillir des amis à la maison.
                Chacun pourra trouver son bonheur dans notre <strong className="text-text-primary dark:text-text-primary">carte diversifiée</strong>.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-start gap-3 group"
                  >
                    <div className="bg-basil-green dark:bg-basil-light/20 p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                      <Icon className="w-6 h-6 text-white dark:text-basil-light transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary dark:text-text-primary mb-1 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-text-secondary dark:text-text-secondary transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <PhoneButton
                variant="primary"
                location="homepage-story"
                showIcon={true}
                showText={true}
              />
              <p className="mt-3 text-sm text-text-secondary dark:text-text-secondary transition-colors duration-300">
                Un coup de téléphone et nous vous préparons votre commande !
              </p>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative order-first lg:order-last">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-3xl group">
              <Image
                src="/images/restaurant/soiree-pizza.jpg"
                alt="Soirée pizza entre amis - Pizza Falchi"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Decorative element */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-yellow/30 dark:bg-primary-yellow/20 rounded-full blur-2xl transition-colors duration-300" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-basil-green/20 dark:bg-basil-green/10 rounded-full blur-2xl transition-colors duration-300" />
          </div>
        </div>
      </div>
    </section>
  );
}
