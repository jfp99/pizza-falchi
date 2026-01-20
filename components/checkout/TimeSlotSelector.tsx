'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { TimeSlot } from '@/types';
import { getUTCToday, formatUTCDate } from '@/lib/datetime';

interface TimeSlotSelectorProps {
  onSlotSelect: (slot: TimeSlot | null) => void;
  selectedSlot: TimeSlot | null;
  pizzaCount: number;
}

/**
 * TimeSlotSelector Component
 * Allows customers to select a pickup time slot during checkout
 * ONLY shows same-day slots with sufficient capacity for the current order
 *
 * TIMEZONE FIX: Uses UTC consistently to prevent timezone bugs
 */
export default function TimeSlotSelector({
  onSlotSelect,
  selectedSlot,
  pizzaCount,
}: TimeSlotSelectorProps) {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TIMEZONE FIX: Use UTC today to ensure consistency
  const today = getUTCToday();

  // Fetch available slots when pizzaCount changes
  useEffect(() => {
    fetchAvailableSlots();
  }, [pizzaCount]);

  /**
   * Filter slots to only show those starting from 18:30 onwards
   * Ensures customers can only book evening time slots
   */
  const filterSlotsByTime = (slots: TimeSlot[]): TimeSlot[] => {
    const MIN_START_TIME = '18:30';

    return slots.filter(slot => {
      // Compare time strings directly (HH:MM format)
      return slot.startTime >= MIN_START_TIME;
    });
  };

  const fetchAvailableSlots = async () => {
    setLoading(true);
    setError(null);

    try {
      // TIMEZONE FIX: Use formatUTCDate for consistent date formatting
      const dateStr = formatUTCDate(today);
      const response = await fetch(
        `/api/time-slots?date=${dateStr}&onlyAvailable=true&pizzaCount=${pizzaCount}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch time slots');
      }

      const data = await response.json();

      // Filter slots to only show from 18:30 onwards
      const filteredSlots = filterSlotsByTime(data.slots || []);
      setAvailableSlots(filteredSlots);

      // If no slots available, show error
      if (filteredSlots.length === 0) {
        setError(pizzaCount > 1
          ? `Aucun créneau disponible pour ${pizzaCount} pizzas aujourd'hui`
          : 'Aucun créneau disponible pour cette date'
        );
      }
    } catch (err) {
      setError('Erreur lors du chargement des créneaux');
      console.error('Error fetching time slots:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot._id === selectedSlot?._id) {
      onSlotSelect(null); // Deselect if clicking the same slot
    } else {
      onSlotSelect(slot);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700 transition-colors duration-300">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary-red dark:bg-primary-red/90 p-3 rounded-xl transition-colors duration-300">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
              Choisissez votre créneau
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
              Créneaux disponibles aujourd'hui pour {pizzaCount} pizza{pizzaCount > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-300">
          <Calendar className="w-4 h-4 inline mr-2" />
          {formatDate(today)}
        </label>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-red dark:border-primary-red-light border-t-transparent"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4 transition-colors duration-300">Chargement des créneaux...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-700 rounded-xl p-4 flex items-start gap-3 transition-colors duration-300">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5 transition-colors duration-300" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-semibold transition-colors duration-300">{error}</p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1 transition-colors duration-300">
                Contactez-nous pour passer commande par téléphone
              </p>
            </div>
          </div>
        )}

        {!loading && !error && availableSlots.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableSlots.map((slot) => {
              const isSelected = slot._id === selectedSlot?._id;
              const remainingCapacity = (slot.capacity || 4) - (slot.pizzaCount || 0);

              return (
                <button
                  key={slot._id}
                  onClick={() => handleSlotSelect(slot)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    isSelected
                      ? 'bg-gradient-to-br from-primary-red to-primary-yellow text-white border-primary-yellow shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 hover:border-primary-red hover:shadow-md'
                  }`}
                  aria-label={`Créneau ${slot.startTime} - ${slot.endTime}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Clock
                      className={`w-5 h-5 ${
                        isSelected ? 'text-white' : 'text-primary-red dark:text-primary-red-light'
                      } transition-colors duration-300`}
                    />
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="text-lg font-bold mb-1">
                    {formatTime(slot.startTime)}
                  </div>
                  <div
                    className={`text-xs ${
                      isSelected ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                    } transition-colors duration-300`}
                  >
                    {remainingCapacity} place{remainingCapacity > 1 ? 's' : ''}{' '}
                    restante{remainingCapacity > 1 ? 's' : ''}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!loading && !error && availableSlots.length === 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-6 text-center transition-colors duration-300">
            <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 transition-colors duration-300" />
            <p className="text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-300">
              Aucun créneau disponible
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 transition-colors duration-300">
              Contactez-nous directement pour passer commande
            </p>
          </div>
        )}
      </div>

      {/* Selected Slot Summary */}
      {selectedSlot && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-2 border-green-300 dark:border-green-700 rounded-xl p-4 transition-colors duration-300">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5 transition-colors duration-300" />
            <div className="flex-1">
              <p className="text-green-900 dark:text-green-200 font-bold transition-colors duration-300">Créneau sélectionné</p>
              <p className="text-green-800 dark:text-green-300 text-sm mt-1 transition-colors duration-300">
                Aujourd'hui à {selectedSlot.startTime} - {selectedSlot.endTime}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
