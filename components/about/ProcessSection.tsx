'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ProcessSection() {
  const processSteps = [
    {
      number: '01',
      title: 'Pâte Artisanale',
      description: 'Pétrissage et façonnage manuel de notre pâte avec fermentation de 48h',
      image: '/images/restaurant/fresh-dough.jpg',
      alt: 'Boules de pâte fraîche prêtes pour la préparation'
    },
    {
      number: '02',
      title: 'Sauce Traditionnelle',
      description: 'Application de notre sauce tomate San Marzano en spirale traditionnelle',
      image: '/images/restaurant/sauce-application.jpg',
      alt: 'Application de la sauce tomate sur la pâte'
    },
    {
      number: '03',
      title: 'Garniture Généreuse',
      description: 'Ingrédients frais italiens disposés avec soin par nos pizzaïolos',
      image: '/images/restaurant/pizza-toppings.jpg',
      alt: 'Ajout des ingrédients frais sur la pizza'
    },
    {
      number: '04',
      title: 'Cuisson au Feu de Bois',
      description: 'Cuisson rapide à haute température dans notre four traditionnel',
      image: '/images/restaurant/wood-fired-oven.jpg',
      alt: 'Pizza cuisant dans le four à bois'
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-surface dark:bg-surface transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-2 text-basil-green dark:text-basil-light font-medium text-sm md:text-base mb-4 transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="w-12 h-[2px] bg-basil-green dark:bg-basil-light transition-colors duration-300" />
            <span className="tracking-wider">Notre Savoir-Faire</span>
            <span className="w-12 h-[2px] bg-basil-green dark:bg-basil-light transition-colors duration-300" />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary dark:text-text-primary mb-6 transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            L'Art de la Pizza Authentique
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-text-secondary dark:text-text-secondary max-w-3xl mx-auto transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Découvrez les étapes de fabrication de nos pizzas artisanales, de la pâte fraîche jusqu'à la cuisson au feu de bois
          </motion.p>
        </div>

        {/* Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.number}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Card */}
              <div className="relative bg-warm-cream dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Step Number */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-xl transition-colors duration-300">
                      <span className="text-3xl font-black text-basil-green dark:text-basil-light transition-colors duration-300">
                        {step.number}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-text-primary mb-3 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary dark:text-text-secondary text-base md:text-lg leading-relaxed transition-colors duration-300">
                    {step.description}
                  </p>
                </div>

                {/* Decorative Corner */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-basil-green/10 dark:from-basil-light/10 to-transparent rounded-tl-full transition-colors duration-300" />
              </div>

              {/* Connector Line (except last item on desktop) */}
              {index < processSteps.length - 2 && index % 2 === 0 && (
                <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-12 w-6 lg:w-12 h-[2px] bg-gradient-to-r from-basil-green/50 dark:from-basil-light/50 to-transparent transition-colors duration-300" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-xl md:text-2xl font-semibold text-text-primary dark:text-text-primary mb-4 transition-colors duration-300">
            Passione • Tradizione • Qualità
          </p>
          <p className="text-text-secondary dark:text-text-secondary text-lg transition-colors duration-300">
            Chaque pizza est une œuvre d'art culinaire préparée avec passion
          </p>
        </motion.div>
      </div>
    </section>
  );
}
