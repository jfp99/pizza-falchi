'use client';

import { Clock, Pizza, Users, AlertTriangle, CheckCircle2, XCircle, Eye } from 'lucide-react';
import type { TimeSlot } from '@/types';

interface TimeSlotGridProps {
  slots: TimeSlot[];
  onSlotClick: (slot: TimeSlot) => void;
  onViewHistory?: (slot: TimeSlot) => void;
}

export default function TimeSlotGrid({ slots, onSlotClick, onViewHistory }: TimeSlotGridProps) {
  const getSlotColor = (slot: TimeSlot) => {
    if (slot.status === 'closed') {
      return 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60';
    }

    const pizzaCount = slot.pizzaCount || 0;
    const capacity = slot.capacity;
    const percentage = (pizzaCount / capacity) * 100;

    if (slot.status === 'full' || percentage >= 100) {
      return 'bg-red-50 border-red-400 hover:border-red-500 cursor-not-allowed';
    }

    if (percentage >= 75) {
      return 'bg-orange-50 border-orange-300 hover:border-orange-400 hover:shadow-lg cursor-pointer';
    }

    if (percentage >= 50) {
      return 'bg-yellow-50 border-yellow-300 hover:border-yellow-400 hover:shadow-lg cursor-pointer';
    }

    return 'bg-green-50 border-green-300 hover:border-green-400 hover:shadow-lg cursor-pointer';
  };

  const getSlotIcon = (slot: TimeSlot) => {
    if (slot.status === 'closed') {
      return <XCircle className="w-5 h-5 text-gray-500" />;
    }

    const pizzaCount = slot.pizzaCount || 0;
    const capacity = slot.capacity;
    const percentage = (pizzaCount / capacity) * 100;

    if (slot.status === 'full' || percentage >= 100) {
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }

    if (percentage >= 50) {
      return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    }

    return <CheckCircle2 className="w-5 h-5 text-green-600" />;
  };

  const getPizzaBarColor = (slot: TimeSlot) => {
    const pizzaCount = slot.pizzaCount || 0;
    const capacity = slot.capacity;
    const percentage = (pizzaCount / capacity) * 100;

    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleClick = (slot: TimeSlot) => {
    if (slot.status === 'closed' || slot.status === 'full') {
      return; // Don't allow clicking on closed or full slots
    }
    onSlotClick(slot);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
      {slots.map((slot) => {
        const pizzaCount = slot.pizzaCount || 0;
        const capacity = slot.capacity;
        const remainingPizzas = capacity - pizzaCount;
        const percentage = (pizzaCount / capacity) * 100;

        return (
          <div
            key={slot._id}
            onClick={() => {
              if (slot.status !== 'closed' && slot.status !== 'full') {
                handleClick(slot);
              }
            }}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${getSlotColor(slot)} ${
              slot.status === 'closed' || slot.status === 'full' ? 'cursor-not-allowed opacity-60' : ''
            }`}
          >
            {/* Time Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                {getSlotIcon(slot)}
                <span className="text-lg font-black text-charcoal">
                  {slot.startTime}
                </span>
              </div>
              {slot.status === 'closed' && (
                <span className="text-xs font-bold px-2 py-0.5 bg-gray-200 rounded text-gray-600">
                  FERMÉ
                </span>
              )}
              {slot.status === 'full' && (
                <span className="text-xs font-bold px-2 py-0.5 bg-red-200 rounded text-red-700">
                  COMPLET
                </span>
              )}
            </div>

            {/* Pizza Count - Large and Prominent */}
            <div className="mb-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Pizza className="w-6 h-6 text-primary-red" />
                <div className="text-center">
                  <span className="text-3xl font-black text-primary-red">{pizzaCount}</span>
                  <span className="text-lg font-bold text-gray-500">/{capacity}</span>
                </div>
              </div>
              <p className="text-xs text-center font-semibold text-gray-600">
                {remainingPizzas} pizza{remainingPizzas > 1 ? 's' : ''} restante{remainingPizzas > 1 ? 's' : ''}
              </p>
            </div>

            {/* Pizza Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className={`h-2 rounded-full transition-all ${getPizzaBarColor(slot)}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>

            {/* Order Count */}
            <div className="flex items-center justify-center gap-1 text-sm">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-blue-600">{slot.currentOrders}</span>
              <span className="text-gray-600">commande{slot.currentOrders > 1 ? 's' : ''}</span>
            </div>

            {/* View History Button */}
            {slot.currentOrders > 0 && onViewHistory && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewHistory(slot);
                }}
                className="mt-2 w-full py-1 px-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center justify-center gap-1 text-xs font-semibold"
              >
                <Eye className="w-3 h-3" />
                Voir commandes
              </button>
            )}

            {/* Click Hint for Available Slots */}
            {slot.status === 'active' && !slot.currentOrders && (
              <div className="mt-2 text-xs text-center font-semibold text-primary-red opacity-0 group-hover:opacity-100 transition-opacity">
                Cliquez pour commander
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
