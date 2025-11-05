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

        {/* Badge in top-right corner */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-border dark:border-border transition-colors">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/images/branding/logo-badge.png"
                  alt="Pizza Falchi Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-primary-red uppercase tracking-wider">
                  Contact
                </span>
                <h1 className="text-lg font-black text-charcoal dark:text-gray-100 leading-tight">
                  PIZZA FALCHI
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Open Map Link */}
        <button
          onClick={() => setIsMapModalOpen(true)}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-surface dark:bg-surface text-charcoal dark:text-gray-100 px-6 py-3 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center gap-2 border border-border dark:border-border z-20"
        >
          <MapPin className="w-5 h-5 text-primary-red" />
          Voir l'itinéraire
          <ExternalLink className="w-4 h-4" />
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

      {/* Main Content */}
      <section className="py-20 bg-warm-cream dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">

          {/* Contact Info Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              {/* Contact Cards */}
              <div className="bg-surface dark:bg-surface rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-red p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-charcoal dark:text-gray-100 mb-2 transition-colors duration-300">Adresse</h3>
                    <p className="text-lg text-text-secondary dark:text-text-secondary font-medium mb-2 transition-colors duration-300">
                      Pizza Falchi
                    </p>
                    <p className="text-text-secondary dark:text-text-secondary transition-colors duration-300">
                      615, avenue de la Touloubre<br />
                      13540 Puyricard - Aix en Provence
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface dark:bg-surface rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-yellow p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-charcoal dark:text-gray-900" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-charcoal dark:text-gray-100 mb-2 transition-colors duration-300">Téléphone</h3>
                    <a href="tel:+33442920308" className="text-lg text-primary-red dark:text-primary-red-light hover:text-primary-red-dark dark:hover:text-primary-red transition font-semibold block mb-2">
                      04 42 92 03 08
                    </a>
                    <p className="text-text-secondary dark:text-text-secondary text-sm transition-colors duration-300">
                      Appelez-nous pour vos commandes et réservations
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface dark:bg-surface rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex items-start gap-4">
                  <div className="bg-basil-light p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-charcoal dark:text-gray-100 mb-2 transition-colors duration-300">Email</h3>
                    <a href="mailto:pizzafalchipro@gmail.com" className="text-lg text-primary-red dark:text-primary-red-light hover:text-primary-red-dark dark:hover:text-primary-red transition font-semibold block mb-2">
                      pizzafalchipro@gmail.com
                    </a>
                    <p className="text-text-secondary dark:text-text-secondary text-sm transition-colors duration-300">
                      Réponse sous 24h
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-surface dark:bg-surface rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
                <h3 className="text-xl font-bold text-charcoal dark:text-gray-100 mb-2 transition-colors duration-300">Suivez-nous</h3>
                <p className="text-text-secondary dark:text-text-secondary mb-6 transition-colors duration-300">Restez informé de nos déplacements et nouveautés !</p>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:scale-110 p-4 rounded-2xl transition-all shadow-lg"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href="#"
                    className="bg-blue-600 hover:bg-blue-700 hover:scale-110 p-4 rounded-2xl transition-all shadow-lg"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href="#"
                    className="bg-sky-500 hover:bg-sky-600 hover:scale-110 p-4 rounded-2xl transition-all shadow-lg"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-6 h-6 text-white" />
                  </a>
                </div>
              </div>
            </div>

            {/* Hours & Schedule */}
            <div className="flex flex-col gap-6">
              <div className="bg-surface dark:bg-surface rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary-yellow p-4 rounded-2xl">
                    <Clock className="w-7 h-7 text-charcoal dark:text-gray-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-charcoal dark:text-gray-100 transition-colors duration-300">Horaires d'ouverture</h3>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-center py-3 border-b border-border dark:border-border hover:bg-gray-50 dark:hover:bg-gray-700 px-2 rounded transition-colors">
                    <span className="font-semibold text-charcoal dark:text-gray-100">Lundi</span>
                    <span className="text-gray-500 dark:text-gray-400 italic">Fermé</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border dark:border-border hover:bg-gray-50 dark:hover:bg-gray-700 px-2 rounded transition-colors">
                    <span className="font-semibold text-charcoal dark:text-gray-100">Mardi</span>
                    <span className="text-text-secondary dark:text-text-secondary">18h00 - 21h30</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border dark:border-border hover:bg-gray-50 dark:hover:bg-gray-700 px-2 rounded transition-colors">
                    <span className="font-semibold text-charcoal dark:text-gray-100">Mercredi</span>
                    <span className="text-text-secondary dark:text-text-secondary">18h00 - 21h30</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border dark:border-border hover:bg-gray-50 dark:hover:bg-gray-700 px-2 rounded transition-colors">
                    <span className="font-semibold text-charcoal dark:text-gray-100">Jeudi</span>
                    <span className="text-text-secondary dark:text-text-secondary">18h00 - 21h30</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border dark:border-border hover:bg-gray-50 dark:hover:bg-gray-700 px-2 rounded transition-colors">
                    <span className="font-semibold text-charcoal dark:text-gray-100">Vendredi</span>
                    <span className="text-text-secondary dark:text-text-secondary">18h00 - 21h30</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border dark:border-border hover:bg-gray-50 dark:hover:bg-gray-700 px-2 rounded transition-colors">
                    <span className="font-semibold text-charcoal dark:text-gray-100">Samedi</span>
                    <span className="text-text-secondary dark:text-text-secondary">18h00 - 21h30</span>
                  </div>
                  <div className="flex justify-between items-center py-3 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 rounded transition-colors">
                    <span className="font-semibold text-charcoal dark:text-gray-100">Dimanche</span>
                    <span className="text-text-secondary dark:text-text-secondary">18h00 - 21h30</span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-surface dark:bg-surface rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-charcoal dark:text-gray-100 mb-4 transition-colors duration-300">Informations pratiques</h3>
                <div className="space-y-3 text-text-secondary dark:text-text-secondary flex-1 transition-colors duration-300">
                  <div className="flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                    <CheckIcon size={20} className="text-primary-red dark:text-primary-red-light mt-0.5" />
                    <p>Commandes par téléphone acceptées</p>
                  </div>
                  <div className="flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                    <CheckIcon size={20} className="text-primary-red dark:text-primary-red-light mt-0.5" />
                    <p>Paiement CB et espèces</p>
                  </div>
                  <div className="flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                    <CheckIcon size={20} className="text-primary-red dark:text-primary-red-light mt-0.5" />
                    <p>Service sur place et à emporter</p>
                  </div>
                  <div className="flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                    <CheckIcon size={20} className="text-primary-red dark:text-primary-red-light mt-0.5" />
                    <p>Possibilité de réservation pour groupes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Soirée Pizza Section */}
      <section className="py-20 bg-surface dark:bg-surface transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/restaurant/soiree-pizza.jpg"
                alt="Soirée pizza entre amis - Pizza Falchi"
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div>
              <div className="inline-block mb-4">
                <div className="bg-primary-red text-white px-4 py-2 rounded-full flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Événements</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-charcoal dark:text-gray-100 mb-6 transition-colors duration-300">
                Organisez une Soirée Pizza
              </h2>
              <p className="text-xl text-text-secondary dark:text-text-secondary mb-8 leading-relaxed transition-colors duration-300">
                Anniversaires, mariages, événements d'entreprise... Notre équipe peut venir animer votre événement avec nos délicieuses pizzas artisanales !
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-warm-cream dark:bg-gray-700 rounded-2xl p-4 text-center transition-colors duration-300">
                  <div className="text-3xl font-black text-primary-red mb-1">50+</div>
                  <div className="text-sm text-charcoal dark:text-gray-300 font-medium">Personnes minimum</div>
                </div>
                <div className="bg-warm-cream dark:bg-gray-700 rounded-2xl p-4 text-center transition-colors duration-300">
                  <div className="text-3xl font-black text-primary-yellow mb-1">Menu</div>
                  <div className="text-sm text-charcoal dark:text-gray-300 font-medium">Personnalisable</div>
                </div>
                <div className="bg-warm-cream dark:bg-gray-700 rounded-2xl p-4 text-center transition-colors duration-300">
                  <div className="text-3xl font-black text-basil-light mb-1">100%</div>
                  <div className="text-sm text-charcoal dark:text-gray-300 font-medium">Satisfaction</div>
                </div>
              </div>

              <a
                href="mailto:pizzafalchipro@gmail.com?subject=Demande d'événement - Soirée Pizza"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-red to-primary-yellow text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Demander un Devis
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-warm-cream dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-charcoal dark:text-gray-100 mb-4 transition-colors duration-300">
              Questions Fréquentes
            </h2>
            <p className="text-xl text-text-secondary dark:text-text-secondary transition-colors duration-300">
              Les réponses à vos questions les plus courantes
            </p>
          </div>

          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <div className="bg-surface dark:bg-surface rounded-2xl p-6 shadow-lg transition-colors duration-300">
              <h3 className="text-xl font-bold text-charcoal dark:text-gray-100 mb-3 transition-colors duration-300">
                Où puis-je vous trouver ?
              </h3>
              <p className="text-text-secondary dark:text-text-secondary leading-relaxed transition-colors duration-300">
                Nous sommes installés à Puyricard, 615 avenue de la Touloubre (13540 Aix en Provence). Pour toute question sur nos disponibilités ou horaires, appelez-nous au 04 42 92 03 08. Suivez-nous également sur Instagram et Facebook pour ne rien manquer de nos actualités !
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-surface dark:bg-surface rounded-2xl p-6 shadow-lg transition-colors duration-300">
              <h3 className="text-xl font-bold text-charcoal dark:text-gray-100 mb-3 transition-colors duration-300">
                Proposez-vous la livraison à domicile ?
              </h3>
              <p className="text-text-secondary dark:text-text-secondary leading-relaxed transition-colors duration-300">
                Pour l'instant, nous fonctionnons uniquement en food truck. Cependant, vous pouvez commander par téléphone et venir récupérer votre commande sur place. Nous travaillons sur un service de livraison pour bientôt !
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-surface dark:bg-surface rounded-2xl p-6 shadow-lg transition-colors duration-300">
              <h3 className="text-xl font-bold text-charcoal dark:text-gray-100 mb-3 transition-colors duration-300">
                Avez-vous des options végétariennes et sans gluten ?
              </h3>
              <p className="text-text-secondary dark:text-text-secondary leading-relaxed transition-colors duration-300">
                Oui ! Nous proposons plusieurs pizzas végétariennes (Margherita, 4 Fromages, Végétarienne...). Pour les options sans gluten, merci de nous prévenir 24h à l'avance car nous utilisons une pâte spéciale préparée séparément.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-surface dark:bg-surface rounded-2xl p-6 shadow-lg transition-colors duration-300">
              <h3 className="text-xl font-bold text-charcoal dark:text-gray-100 mb-3 transition-colors duration-300">
                Puis-je réserver pour un grand groupe ?
              </h3>
              <p className="text-text-secondary dark:text-text-secondary leading-relaxed transition-colors duration-300">
                Absolument ! Pour les groupes de plus de 10 personnes, nous vous recommandons de passer commande à l'avance par téléphone. Cela nous permet de vous garantir les meilleures conditions de service et d'éviter l'attente.
              </p>
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
              <p className="text-lg text-text-secondary dark:text-text-secondary mb-8 max-w-2xl mx-auto">
                Profitez de notre programme de fidélité et régalez-vous !
              </p>
            </div>
          </div>

          {/* CTA Content */}
          <div className="text-center">
            <h3 className="text-4xl md:text-5xl font-black text-charcoal dark:text-gray-100 mb-6 transition-colors">
              Prêt à Commander ?
            </h3>
            <p className="text-xl text-text-secondary dark:text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed transition-colors">
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
                href="tel:+33442920308"
                className="inline-flex items-center justify-center gap-3 border-2 border-charcoal dark:border-gray-300 bg-transparent text-charcoal dark:text-gray-100 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-charcoal hover:text-white dark:hover:bg-gray-100 dark:hover:text-charcoal transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Phone className="w-5 h-5" />
                Appelez-nous
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
