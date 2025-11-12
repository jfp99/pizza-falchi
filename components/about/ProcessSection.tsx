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
              className="group relative flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Card grouping image and text */}
              <div className="bg-surface dark:bg-surface rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 w-full max-w-md">
                {/* Circular Image Container */}
                <div className="relative w-full aspect-square mb-6">
                  <div className="absolute inset-0 rounded-full overflow-hidden shadow-lg border-8 border-primary-yellow dark:border-primary-yellow-dark transition-colors bg-warm-cream dark:bg-gray-800">
                    <div className="relative w-full h-full p-4">
                      <Image
                        src={step.image}
                        alt={step.alt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 90vw, 400px"
                        quality={95}
                        priority={index < 2}
                      />
                    </div>

                    {/* Step Number Badge - top center */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                      <div className="bg-white dark:bg-gray-900 rounded-full w-16 h-16 flex items-center justify-center shadow-xl border-4 border-primary-red transition-colors">
                        <span className="text-2xl font-black text-primary-red dark:text-primary-yellow transition-colors">
                          {step.number}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Content - Separated */}
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-black text-primary-red dark:text-primary-yellow mb-3 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary dark:text-text-secondary text-sm md:text-base leading-relaxed transition-colors">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
