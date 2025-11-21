'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Phone, Pizza, Users, RefreshCw, Bell, BellOff, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import type { TimeSlot } from '@/types';
import TimeSlotGrid from '@/components/admin/TimeSlotGrid';
import QuickPhoneOrderModal from '@/components/admin/QuickPhoneOrderModal';
import SlotOrderHistoryModal from '@/components/admin/SlotOrderHistoryModal';
import { AUTO_REFRESH_INTERVAL_MS } from '@/lib/constants';

export default function TimeSlotDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historySlot, setHistorySlot] = useState<TimeSlot | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Statistics
  const [stats, setStats] = useState({
    totalSlots: 0,
    availableSlots: 0,
    fullSlots: 0,
    totalOrders: 0,
    totalPizzas: 0,
    utilizationRate: 0,
  });

  // Generate next 3 days for quick selection (today + 2 days)
  const getNextDays = (count: number = 3) => {
    const days: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const availableDays = getNextDays(3);

  useEffect(() => {
    fetchSlots();

    // Auto-refresh at configured interval
    const interval = setInterval(() => {
      fetchSlots(true); // Silent refresh
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [selectedDate]);

  const fetchSlots = async (silent: boolean = false) => {
    if (!silent) setLoading(true);

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`/api/time-slots?date=${dateStr}`);

      if (!response.ok) throw new Error('Failed to fetch slots');

      const data = await response.json();
      setSlots(data.slots || []);

      // Calculate stats
      const totalSlots = data.slots.length;
      const availableSlots = data.slots.filter((s: TimeSlot) => s.isAvailable).length;
      const fullSlots = data.slots.filter((s: TimeSlot) => s.status === 'full').length;
      const totalOrders = data.slots.reduce((sum: number, s: TimeSlot) => sum + s.currentOrders, 0);
      const totalPizzas = data.slots.reduce((sum: number, s: TimeSlot) => sum + (s.pizzaCount || 0), 0);
      const totalCapacity = data.slots.reduce((sum: number, s: TimeSlot) => sum + s.capacity, 0);
      const utilizationRate = totalCapacity > 0 ? (totalPizzas / totalCapacity) * 100 : 0;

      setStats({
        totalSlots,
        availableSlots,
        fullSlots,
        totalOrders,
        totalPizzas,
        utilizationRate,
      });
    } catch (error) {
      console.error('Error fetching slots:', error);
      if (!silent) {
        toast.error('Erreur lors du chargement des créneaux');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.status === 'closed') {
      toast.error('Ce créneau est fermé');
      return;
    }

    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleViewHistory = (slot: TimeSlot) => {
    setHistorySlot(slot);
    setIsHistoryModalOpen(true);
  };

  const handleExportDay = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];

      // Fetch all orders for the selected date
      const response = await fetch(`/api/orders?date=${dateStr}`);
      if (!response.ok) throw new Error('Failed to fetch orders');

      const orders = await response.json();

      if (orders.length === 0) {
        toast.error('Aucune commande pour cette date');
        return;
      }

      // Build CSV content
      const headers = [
        'Date',
        'Créneau',
        'Commande #',
        'Client',
        'Téléphone',
        'Type',
        'Adresse',
        'Articles',
        'Pizzas',
        'Sous-total',
        'Livraison',
        'Total',
        'Statut',
        'Notes',
      ];

      const rows = orders.map((order: any, index: number) => {
        const timeSlotStr = order.pickupTimeRange || 'N/A';
        const pizzaCount = order.items?.filter((item: any) => item.product?.category === 'pizza')
          .reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
        const itemsStr = order.items?.map((item: any) =>
          `${item.quantity}x ${item.product?.name || 'Produit'}`
        ).join('; ') || '';
        const addressStr = order.deliveryType === 'delivery' && order.deliveryAddress
          ? `${order.deliveryAddress.street}, ${order.deliveryAddress.postalCode} ${order.deliveryAddress.city}`
          : '';

        return [
          new Date(order.createdAt).toLocaleDateString('fr-FR'),
          timeSlotStr,
          `#${index + 1}`,
          order.customerName,
          order.phone,
          order.deliveryType === 'delivery' ? 'Livraison' : 'À emporter',
          addressStr,
          itemsStr,
          pizzaCount,
          order.subtotal.toFixed(2),
          order.deliveryFee.toFixed(2),
          order.total.toFixed(2),
          order.status,
          order.notes || '',
        ].map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',');
      });

      const csv = [headers.join(','), ...rows].join('\n');

      // Create and download file
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `commandes-${dateStr}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${orders.length} commande(s) exportée(s)`);
    } catch (error) {
      console.error('Error exporting orders:', error);
      toast.error('Erreur lors de l\'export');
    }
  };

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Pleasant notification tone (C note)
      oscillator.frequency.value = 523.25;
      oscillator.type = 'sine';

      // Envelope: quick attack, short sustain, quick decay
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      // Silent fail - audio not critical
      console.log('Audio notification not available');
    }
  };

  const handleOrderCreated = () => {
    // Play notification sound if enabled
    if (notificationsEnabled) {
      playNotificationSound();
    }

    // Refresh slots
    fetchSlots();

    // Close modal
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream via-white to-primary-yellow/5 py-6">
      <div className="max-w-[1920px] mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-charcoal mb-1">
              Dashboard <span className="bg-gradient-to-r from-primary-red to-primary-yellow bg-clip-text text-transparent">Commandes Téléphone</span>
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Prise de commande rapide par créneau horaire
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`p-3 rounded-xl border-2 transition-all ${
                notificationsEnabled
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-gray-50 border-gray-300 text-gray-500'
              }`}
              title={notificationsEnabled ? 'Notifications activées' : 'Notifications désactivées'}
            >
              {notificationsEnabled ? (
                <Bell className="w-5 h-5" />
              ) : (
                <BellOff className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={handleExportDay}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors"
              title="Exporter les commandes du jour"
            >
              <Download className="w-5 h-5" />
              <span>Exporter CSV</span>
            </button>

            <button
              onClick={() => fetchSlots()}
              disabled={loading}
              className="bg-white border-2 border-gray-300 text-charcoal px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-200">
            <div className="flex items-center justify-between">
              <Clock className="w-6 h-6 text-primary-red" />
              <span className="text-2xl font-black text-charcoal">{stats.totalSlots}</span>
            </div>
            <p className="text-xs text-gray-600 font-semibold mt-1">Créneaux</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border-2 border-green-200">
            <div className="flex items-center justify-between">
              <Clock className="w-6 h-6 text-green-600" />
              <span className="text-2xl font-black text-green-600">{stats.availableSlots}</span>
            </div>
            <p className="text-xs text-gray-600 font-semibold mt-1">Disponibles</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border-2 border-red-200">
            <div className="flex items-center justify-between">
              <Clock className="w-6 h-6 text-red-600" />
              <span className="text-2xl font-black text-red-600">{stats.fullSlots}</span>
            </div>
            <p className="text-xs text-gray-600 font-semibold mt-1">Complets</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-2xl font-black text-blue-600">{stats.totalOrders}</span>
            </div>
            <p className="text-xs text-gray-600 font-semibold mt-1">Commandes</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border-2 border-orange-200">
            <div className="flex items-center justify-between">
              <Pizza className="w-6 h-6 text-orange-600" />
              <span className="text-2xl font-black text-orange-600">{stats.totalPizzas}</span>
            </div>
            <p className="text-xs text-gray-600 font-semibold mt-1">Pizzas</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <Calendar className="w-6 h-6 text-purple-600" />
              <span className="text-2xl font-black text-purple-600">{stats.utilizationRate.toFixed(0)}%</span>
            </div>
            <p className="text-xs text-gray-600 font-semibold mt-1">Occupation</p>
          </div>
        </div>

        {/* Date Selection - Compact */}
        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-200 mb-6">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-primary-red flex-shrink-0" />
            <div className="grid grid-cols-3 gap-3 flex-1">
              {availableDays.map((day, index) => {
                const isSelected = day.toDateString() === selectedDate.toDateString();
                const dayLabel = isToday(day) ? "Aujourd'hui" : day.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`px-4 py-3 rounded-xl border-2 transition-all font-bold ${
                      isSelected
                        ? 'bg-gradient-to-r from-primary-red to-primary-yellow text-white border-primary-yellow shadow-lg scale-105'
                        : 'bg-white text-charcoal border-gray-200 hover:border-primary-red hover:shadow-md'
                    }`}
                  >
                    {dayLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Time Slot Grid */}
        <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200">
          <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-red" />
            Grille horaire - {formatDate(selectedDate)}
          </h3>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-red border-t-transparent"></div>
              <p className="text-gray-600 mt-4">Chargement...</p>
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold">Aucun créneau pour cette date</p>
              <p className="text-gray-500 text-sm mt-2">
                Générez des créneaux depuis la page de gestion
              </p>
            </div>
          ) : (
            <TimeSlotGrid
              slots={slots}
              onSlotClick={handleSlotClick}
              onViewHistory={handleViewHistory}
            />
          )}
        </div>

        {/* Quick Phone Order Modal */}
        {selectedSlot && (
          <QuickPhoneOrderModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedSlot(null);
            }}
            slot={selectedSlot}
            onOrderCreated={handleOrderCreated}
          />
        )}

        {/* Slot Order History Modal */}
        <SlotOrderHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => {
            setIsHistoryModalOpen(false);
            setHistorySlot(null);
          }}
          slot={historySlot}
        />
      </div>
    </div>
  );
}
