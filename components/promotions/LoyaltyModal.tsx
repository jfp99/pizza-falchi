'use client';
import { X, Gift, CheckCircle, Info } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface LoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoyaltyModal({ isOpen, onClose }: LoyaltyModalProps) {
  const modalRef = useFocusTrap(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div ref={modalRef} className="relative bg-warm-cream dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300" role="dialog" aria-modal="true" aria-labelledby="loyalty-modal-title">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-red to-primary-yellow p-6 md:p-8 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110"
            aria-label="Fermer"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="flex items-center gap-4">
            <div className="bg-white rounded-2xl p-3 shadow-lg">
              <Gift className="w-8 h-8 text-primary-red" />
            </div>
            <div>
              <h2 id="loyalty-modal-title" className="text-3xl md:text-4xl font-black text-white mb-1">
                Programme de Fidélité
              </h2>
              <p className="text-white/90 font-medium">
                10 Pizzas Achetées = 11<sup className="text-xs">ème</sup> Offerte
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* How it works */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-black text-charcoal mb-4 flex items-center gap-2">
              <span className="text-primary-red">🍕</span>
              Comment ça marche ?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-basil-light flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  <span className="font-bold">Achetez 10 pizzas</span> au prix normal
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-basil-light flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  <span className="font-bold">Conservez vos tickets</span> de caisse comme preuve d'achat
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-basil-light flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  <span className="font-bold">Présentez vos 10 tickets</span> lors de votre prochaine visite
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-yellow flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  <span className="font-bold text-primary-red">Recevez votre 11ème pizza gratuitement !</span>
                </p>
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-black text-charcoal mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-primary-red" />
              Conditions
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-primary-red font-bold">•</span>
                <span>Valable uniquement sur les pizzas (boissons et desserts exclus)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-red font-bold">•</span>
                <span>La pizza gratuite doit être de valeur égale ou inférieure à la moins chère des 10 pizzas achetées</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-red font-bold">•</span>
                <span>Les tickets doivent être présentés en original (pas de photocopies)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-red font-bold">•</span>
                <span>Offre non cumulable avec d'autres promotions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-red font-bold">•</span>
                <span>Pas de limite de durée pour collecter vos 10 tickets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-red font-bold">•</span>
                <span>Une seule pizza gratuite par présentation de 10 tickets</span>
              </li>
            </ul>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-soft-yellow/30 to-soft-red/20 rounded-2xl p-6 border-2 border-primary-yellow/30">
            <h3 className="text-xl font-black text-charcoal mb-3 flex items-center gap-2">
              💡 Astuce
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Gardez vos tickets dans un endroit sûr ! Vous pouvez les conserver dans votre portefeuille ou prendre une photo de sauvegarde. N'oubliez pas : plus vous commandez, plus vite vous profitez de votre pizza gratuite !
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-primary-red to-primary-yellow text-white px-6 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              J'ai compris !
            </button>
            <button
              onClick={() => {
                onClose();
                // Navigate to menu (will be handled by parent component)
              }}
              className="flex-1 border-2 border-primary-red bg-white text-charcoal px-6 py-4 rounded-2xl font-bold text-lg hover:bg-primary-red hover:text-white transition-all duration-300"
            >
              Voir le Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
