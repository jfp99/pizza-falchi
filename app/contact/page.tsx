'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Calendar, Instagram, Facebook, Twitter, X, ExternalLink, Gift, Pizza } from 'lucide-react';
import { CheckIcon, PizzaSliceIcon } from '@/components/icons/CategoryIcons';

export default function Contact() {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-warm-cream dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section - Minimal with Map Background */}
      <section className="relative h-screen flex items-center justify-center bg-warm-cream dark:bg-gray-900 overflow-hidden transition-colors">
        {/* Map as Hero Background */}
        <div className="absolute inset-0">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2890.426430988316!2d5.418354712321976!3d43.57683337098537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c98c9a1aea85bb%3A0x7c03b9a5f1f1d9fb!2sPizza%20Falchi!5e0!3m2!1sfr!2sfr!4v1760007377500!5m2!1sfr!2sfr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full pointer-events-none"
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-charcoal/20"></div>
        </div>

        {/* Badge in top-right corner - Clickable to open map */}
        <button
          onClick={() => setIsMapModalOpen(true)}
          className="absolute top-8 right-8 z-20 cursor-pointer"
        >
          <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-border dark:border-border transition-all duration-300 overflow-hidden group hover:scale-105">
            <div className="relative z-10 flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/images/branding/logo-badge.png"
                  alt="Pizza Falchi Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-primary-red uppercase tracking-wider group-hover:text-white transition-colors duration-300 flex items-center gap-1">
                  Contact
                  <ExternalLink className="w-3 h-3" />
                </span>
                <h1 className="text-lg font-black text-charcoal dark:text-gray-100 leading-tight group-hover:text-white transition-colors duration-300">
                  PIZZA FALCHI
                </h1>
                <span className="text-xs text-text-secondary dark:text-text-secondary group-hover:text-white/90 transition-colors duration-300 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  Voir l'itinéraire
                </span>
              </div>
            </div>
            <span className="absolute inset-0 bg-gradient-to-r from-brand-red to-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </div>
        </button>
      </section>

      {/* Map Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsMapModalOpen(false)}>
          <div className="relative w-full max-w-6xl h-[80vh] bg-surface dark:bg-surface rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setIsMapModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-charcoal dark:text-gray-100 p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Full map */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2890.426430988316!2d5.418354712321976!3d43.57683337098537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c98c9a1aea85bb%3A0x7c03b9a5f1f1d9fb!2sPizza%20Falchi!5e0!3m2!1sfr!2sfr!4v1760007377500!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Contact Info Section - Clean & Minimal */}
      <section className="py-20 bg-surface dark:bg-surface transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="bg-primary-red text-white px-4 py-2 rounded-full flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Contact</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-charcoal dark:text-gray-100 mb-6 transition-colors duration-300">
              Parlons de votre envie de pizza !
            </h2>
            <p className="text-xl text-text-secondary dark:text-text-secondary mb-8 leading-relaxed transition-colors duration-300">
              Une question ? Une commande ? Notre équipe est à votre écoute.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <a href="tel:+33442920308" className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="bg-primary-red/10 dark:bg-primary-red/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Phone className="w-10 h-10 text-primary-red" />
              </div>
              <p className="text-sm text-text-tertiary dark:text-text-tertiary mb-3">Téléphone</p>
              <p className="text-xl font-bold text-charcoal dark:text-gray-100 hover:text-primary-red transition-colors">
                04 42 92 03 08
              </p>
            </a>

            <a href="mailto:pizzafalchipro@gmail.com" className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="bg-basil-light/10 dark:bg-basil-light/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-basil-light" />
              </div>
              <p className="text-sm text-text-tertiary dark:text-text-tertiary mb-3">Email</p>
              <p className="text-base font-bold text-charcoal dark:text-gray-100 hover:text-basil-light transition-colors break-words">
                pizzafalchipro@gmail.com
              </p>
            </a>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center transition-all duration-300">
              <div className="bg-primary-yellow/20 dark:bg-primary-yellow/30 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-primary-yellow-dark" />
              </div>
              <p className="text-sm text-text-tertiary dark:text-text-tertiary mb-3">Adresse</p>
              <p className="text-lg font-bold text-charcoal dark:text-gray-100 leading-tight">
                615, av. de la Touloubre
              </p>
              <p className="text-sm text-text-secondary dark:text-text-secondary mt-1">
                13540 Puyricard
              </p>
            </div>
          </div>

          <div className="text-center">
            <a
              href="tel:+33442920308"
              className="relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg overflow-hidden group bg-primary-red text-white"
            >
              <span className="relative z-10 flex items-center gap-3 group-hover:text-charcoal transition-colors duration-300">
                <Phone className="w-5 h-5" />
                Appelez-nous maintenant
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary-yellow to-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </a>
          </div>
        </div>
      </section>

      {/* Horaires Section - Same Style */}
      <section className="py-20 bg-warm-cream dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div className="lg:order-2">
              <div className="inline-block mb-4">
                <div className="bg-primary-yellow text-charcoal px-4 py-2 rounded-full flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Horaires</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-charcoal dark:text-gray-100 mb-6 transition-colors duration-300">
                Quand nous trouver ?
              </h2>
              <p className="text-xl text-text-secondary dark:text-text-secondary mb-8 leading-relaxed transition-colors duration-300">
                Ouvert 6 jours sur 7 pour régaler vos papilles avec nos pizzas artisanales au feu de bois.
              </p>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-charcoal dark:text-gray-100">Lundi</span>
                    <span className="text-gray-500 dark:text-gray-400 italic">Fermé</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-charcoal dark:text-gray-100">Mardi - Dimanche</span>
                    <span className="text-primary-red dark:text-primary-red-light font-bold">18h00 - 21h30</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="bg-primary-red/10 dark:bg-primary-red/20 text-primary-red px-4 py-2 rounded-xl font-semibold text-sm">
                  <CheckIcon className="inline w-4 h-4 mr-2" />
                  Commandes téléphoniques
                </div>
                <div className="bg-basil-light/10 dark:bg-basil-light/20 text-basil-light px-4 py-2 rounded-xl font-semibold text-sm">
                  <CheckIcon className="inline w-4 h-4 mr-2" />
                  Paiement CB et espèces
                </div>
                <div className="bg-primary-yellow/20 dark:bg-primary-yellow/30 text-primary-yellow-dark px-4 py-2 rounded-xl font-semibold text-sm">
                  <CheckIcon className="inline w-4 h-4 mr-2" />
                  À emporter
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl lg:order-1">
              <Image
                src="/images/restaurant/soiree-pizza.jpg"
                alt="Pizza Falchi - Horaires"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced with Brand Colors */}
      <section className="py-20 bg-warm-cream dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="bg-basil-light text-white px-4 py-2 rounded-full flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">FAQ</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-charcoal dark:text-gray-100 mb-4 transition-colors duration-300">
              Questions Fréquentes
            </h2>
            <p className="text-xl text-text-secondary dark:text-text-secondary transition-colors duration-300">
              Les réponses à vos questions les plus courantes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* FAQ Item 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-l-4 border-primary-red">
              <div className="flex items-start gap-4 mb-3">
                <div className="bg-primary-red/10 dark:bg-primary-red/20 p-2 rounded-xl">
                  <MapPin className="w-5 h-5 text-primary-red" />
                </div>
                <h3 className="text-xl font-bold text-charcoal dark:text-gray-100 transition-colors duration-300">
                  Où puis-je vous trouver ?
                </h3>
              </div>
              <p className="text-text-secondary dark:text-text-secondary leading-relaxed transition-colors duration-300 pl-13">
                Nous sommes installés à Puyricard, 615 avenue de la Touloubre (13540 Aix en Provence). Pour toute question sur nos disponibilités ou horaires, appelez-nous au 04 42 92 03 08. Suivez-nous également sur Instagram et Facebook pour ne rien manquer de nos actualités !
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-l-4 border-primary-yellow">
              <div className="flex items-start gap-4 mb-3">
                <div className="bg-primary-yellow/20 dark:bg-primary-yellow/30 p-2 rounded-xl">
                  <Gift className="w-5 h-5 text-primary-yellow-dark" />
                </div>
                <h3 className="text-xl font-bold text-charcoal dark:text-gray-100 transition-colors duration-300">
                  Proposez-vous la livraison à domicile ?
                </h3>
              </div>
              <p className="text-text-secondary dark:text-text-secondary leading-relaxed transition-colors duration-300 pl-13">
                Pour l'instant, nous fonctionnons uniquement en food truck. Cependant, vous pouvez commander par téléphone et venir récupérer votre commande sur place. Nous travaillons sur un service de livraison pour bientôt !
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-l-4 border-basil-light">
              <div className="flex items-start gap-4 mb-3">
                <div className="bg-basil-light/10 dark:bg-basil-light/20 p-2 rounded-xl">
                  <PizzaSliceIcon className="w-5 h-5 text-basil-light" />
                </div>
                <h3 className="text-xl font-bold text-charcoal dark:text-gray-100 transition-colors duration-300">
                  Avez-vous des options végétariennes et sans gluten ?
                </h3>
              </div>
              <p className="text-text-secondary dark:text-text-secondary leading-relaxed transition-colors duration-300 pl-13">
                Oui ! Nous proposons plusieurs pizzas végétariennes (Margherita, 4 Fromages, Végétarienne...). Pour les options sans gluten, merci de nous prévenir 24h à l'avance car nous utilisons une pâte spéciale préparée séparément.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-l-4 border-brand-gold">
              <div className="flex items-start gap-4 mb-3">
                <div className="bg-brand-gold/20 dark:bg-brand-gold/30 p-2 rounded-xl">
                  <Calendar className="w-5 h-5 text-brand-gold" />
                </div>
                <h3 className="text-xl font-bold text-charcoal dark:text-gray-100 transition-colors duration-300">
                  Puis-je réserver pour un grand groupe ?
                </h3>
              </div>
              <p className="text-text-secondary dark:text-text-secondary leading-relaxed transition-colors duration-300 pl-13">
                Absolument ! Pour les groupes de plus de 10 personnes, nous vous recommandons de passer commande à l'avance par téléphone. Cela nous permet de vous garantir les meilleures conditions de service et d'éviter l'attente.
              </p>
            </div>
          </div>

          {/* Contact prompt after FAQ */}
          <div className="text-center mt-12">
            <p className="text-lg text-text-secondary dark:text-text-secondary mb-6 transition-colors duration-300">
              Vous avez d'autres questions ? N'hésitez pas à nous contacter !
            </p>
            <a
              href="mailto:pizzafalchipro@gmail.com"
              className="relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg overflow-hidden group bg-basil-light text-white"
            >
              <span className="relative z-10 flex items-center gap-3 group-hover:text-charcoal transition-colors duration-300">
                <Mail className="w-5 h-5" />
                Envoyez-nous un email
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary-yellow to-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-warm-cream dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
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
                className="relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg shadow-lg overflow-hidden group bg-primary-red text-white"
              >
                <span className="relative z-10 flex items-center gap-3 group-hover:text-charcoal transition-colors duration-300">
                  Voir le Menu
                  <Pizza className="w-5 h-5" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary-yellow to-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
              <Link
                href="tel:+33442920308"
                className="relative inline-flex items-center justify-center gap-3 border-2 border-charcoal dark:border-gray-300 px-10 py-5 rounded-2xl font-bold text-lg shadow-lg overflow-hidden group bg-transparent text-charcoal dark:text-gray-100"
              >
                <span className="relative z-10 flex items-center gap-3 group-hover:text-white dark:group-hover:text-charcoal transition-colors duration-300">
                  <Phone className="w-5 h-5" />
                  Appelez-nous
                </span>
                <span className="absolute inset-0 bg-charcoal dark:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
