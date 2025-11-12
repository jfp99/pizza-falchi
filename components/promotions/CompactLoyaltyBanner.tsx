'use client';

import { useState } from 'react';
import { Gift, ChevronRight } from 'lucide-react';
import LoyaltyModal from './LoyaltyModal';

export default function CompactLoyaltyBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mb-8">
        <div className="relative bg-gradient-to-r from-soft-red/20 via-soft-yellow/10 to-soft-red/20 dark:from-soft-red/15 dark:via-soft-yellow/5 dark:to-soft-red/15 backdrop-blur-sm overflow-hidden rounded-2xl border border-primary-red/15 dark:border-primary-red/20 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="px-5 py-4 md:px-6 md:py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Icon + Content */}
              <div className="flex items-center gap-3 md:gap-4">
                <div className="flex-shrink-0 bg-primary-red rounded-xl p-2 shadow-sm">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-base md:text-lg font-bold text-text-primary dark:text-text-primary mb-0.5 transition-colors">
                    10 Pizzas = 11<sup className="text-xs">ème</sup> Offerte
                  </h4>
                  <p className="text-xs text-text-secondary dark:text-text-secondary transition-colors">
                    Programme de fidélité
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary-red dark:text-primary-red hover:bg-primary-red/15 dark:hover:bg-primary-red/20 bg-primary-red/10 dark:bg-primary-red/15 px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105"
                  aria-label="En savoir plus sur le programme de fidélité"
                >
                  <span>En savoir plus</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loyalty Modal */}
      <LoyaltyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
