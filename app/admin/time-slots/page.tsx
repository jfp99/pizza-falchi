'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, RefreshCw, AlertCircle, CheckCircle2, XCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import type { TimeSlot } from '@/types';
import { useCSRF } from '@/hooks/useCSRF';

export default function AdminTimeSlots() {
  const { getHeaders } = useCSRF();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    full: 0,
    totalOrders: 0,
    utilization: 0,
  });

  // Generate next 7 days for quick selection
  const getNextSevenDays = () => {
    const days: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const availableDays = getNextSevenDays();

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`/api/time-slots?date=${dateStr}`);

      if (!response.ok) throw new Error('Failed to fetch slots');

      const data = await response.json();
      setSlots(data.slots || []);

      // Calculate stats
      const total = data.slots.length;
      const available = data.slots.filter((s: TimeSlot) => s.isAvailable).length;
      const full = data.slots.filter((s: TimeSlot) => s.status === 'full').length;
      const totalOrders = data.slots.reduce((sum: number, s: TimeSlot) => sum + s.currentOrders, 0);
      const totalCapacity = data.slots.reduce((sum: number, s: TimeSlot) => sum + s.capacity, 0);
      const utilization = totalCapacity > 0 ? (totalOrders / totalCapacity) * 100 : 0;

      setStats({ total, available, full, totalOrders, utilization });
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Erreur lors du chargement des créneaux');
    } finally {
      setLoading(false);
    }
  };

  const generateSlots = async (days: number = 7) => {
    setGenerating(true);
    try {
      const response = await fetch('/api/time-slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getHeaders(),
        },
        body: JSON.stringify({
          startDate: new Date().toISOString(),
          numberOfDays: days,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate slots');

      const data = await response.json();
      toast.success(`Créneaux générés pour ${data.result.success} jours`);
      fetchSlots();
    } catch (error) {
      console.error('Error generating slots:', error);
      toast.error('Erreur lors de la génération des créneaux');
    } finally {
      setGenerating(false);
    }
  };

  const updateSlotStatus = async (slotId: string, status: 'active' | 'closed') => {
    try {
      const response = await fetch(`/api/time-slots/${slotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getHeaders(),
        },
        body: JSON.stringify({ action: 'updateStatus', status }),
      });

      if (!response.ok) throw new Error('Failed to update slot');

      toast.success('Statut du créneau mis à jour');
      fetchSlots();
    } catch (error) {
      console.error('Error updating slot:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return (
      checkDate.getDate() === today.getDate() &&
      checkDate.getMonth() === today.getMonth() &&
      checkDate.getFullYear() === today.getFullYear()
    );
  };

  const getStatusColor = (slot: TimeSlot) => {
    if (slot.status === 'closed') return 'bg-gray-100 border-gray-300';
    if (slot.status === 'full') return 'bg-red-50 border-red-300';
    return 'bg-green-50 border-green-300';
  };

  const getStatusIcon = (slot: TimeSlot) => {
    if (slot.status === 'closed') return <XCircle className="w-5 h-5 text-gray-600" />;
    if (slot.status === 'full') return <AlertCircle className="w-5 h-5 text-red-600" />;
    return <CheckCircle2 className="w-5 h-5 text-green-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream via-white to-primary-yellow/5 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-charcoal mb-2">
            Gestion des <span className="bg-gradient-to-r from-primary-red to-primary-yellow bg-clip-text text-transparent">Créneaux</span>
          </h1>
          <p className="text-gray-600">
            Gérez les plages horaires et la capacité de commandes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-primary-red" />
              <span className="text-3xl font-black text-charcoal">{stats.total}</span>
            </div>
            <p className="text-sm text-gray-600 font-semibold">Total Créneaux</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-black text-green-600">{stats.available}</span>
            </div>
            <p className="text-sm text-gray-600 font-semibold">Disponibles</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-red-200">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <span className="text-3xl font-black text-red-600">{stats.full}</span>
            </div>
            <p className="text-sm text-gray-600 font-semibold">Complets</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-black text-blue-600">{stats.totalOrders}</span>
            </div>
            <p className="text-sm text-gray-600 font-semibold">Commandes</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-black text-purple-600">{stats.utilization.toFixed(0)}%</span>
            </div>
            <p className="text-sm text-gray-600 font-semibold">Taux Occupation</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-primary-red" />
              <h2 className="text-xl font-bold text-charcoal">Actions Rapides</h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => generateSlots(7)}
                disabled={generating}
                className="bg-gradient-to-r from-primary-red to-primary-yellow text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Génération...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Générer 7 Jours</span>
                  </>
                )}
              </button>
              <button
                onClick={fetchSlots}
                disabled={loading}
                className="bg-white border-2 border-gray-300 text-charcoal px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 mb-8">
          <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-red" />
            Sélectionnez un jour
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {availableDays.map((day, index) => {
              const isSelected = day.toDateString() === selectedDate.toDateString();
              const dayLabel = isToday(day) ? "Aujourd'hui" : day.getDate().toString();

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-primary-red to-primary-yellow text-white border-primary-yellow shadow-lg scale-105'
                      : 'bg-white text-charcoal border-gray-200 hover:border-primary-red hover:shadow-md'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xs font-medium opacity-80 capitalize">
                      {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </div>
                    <div className="text-2xl font-bold my-1">{dayLabel}</div>
                    <div className="text-xs opacity-80 capitalize">
                      {day.toLocaleDateString('fr-FR', { month: 'short' })}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Slots Grid */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
          <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-red" />
            Créneaux pour {formatDate(selectedDate)}
          </h3>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-red border-t-transparent"></div>
              <p className="text-gray-600 mt-4">Chargement...</p>
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold mb-2">Aucun créneau pour cette date</p>
              <p className="text-gray-500 text-sm mb-4">
                Générez des créneaux pour commencer
              </p>
              <button
                onClick={() => generateSlots(1)}
                className="bg-gradient-to-r from-primary-red to-primary-yellow text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Plus className="w-5 h-5" />
                <span>Générer pour ce jour</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {slots.map((slot) => (
                <div
                  key={slot._id}
                  className={`p-4 rounded-xl border-2 transition-all ${getStatusColor(slot)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(slot)}
                      <span className="text-lg font-bold text-charcoal">
                        {slot.startTime}
                      </span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-white rounded-lg border border-gray-300 capitalize">
                      {slot.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Capacité:</span>
                      <span className="font-bold">{slot.capacity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Commandes:</span>
                      <span className="font-bold text-primary-red">{slot.currentOrders}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Restantes:</span>
                      <span className="font-bold text-green-600">
                        {slot.capacity - slot.currentOrders}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        slot.status === 'full' ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(slot.currentOrders / slot.capacity) * 100}%` }}
                    ></div>
                  </div>

                  {/* Actions */}
                  {slot.status !== 'closed' && slot.currentOrders === 0 && (
                    <button
                      onClick={() => updateSlotStatus(slot._id!, 'closed')}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                    >
                      Fermer ce créneau
                    </button>
                  )}
                  {slot.status === 'closed' && (
                    <button
                      onClick={() => updateSlotStatus(slot._id!, 'active')}
                      className="w-full bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                    >
                      Réouvrir
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
