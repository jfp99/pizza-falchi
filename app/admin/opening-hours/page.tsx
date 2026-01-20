'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Save, X, AlertCircle, CheckCircle2, Settings, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCSRF } from '@/hooks/useCSRF';

interface OpeningHours {
  _id?: string;
  dayOfWeek: number;
  isOpen: boolean;
  hours?: {
    open: string;
    close: string;
  };
  slotDuration: number;
  ordersPerSlot: number;
  exceptions: Exception[];
}

interface Exception {
  date: Date;
  isClosed: boolean;
  reason?: string;
  customHours?: {
    open: string;
    close: string;
  };
}

export default function AdminOpeningHours() {
  const { getHeaders } = useCSRF();
  const [openingHours, setOpeningHours] = useState<OpeningHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [newException, setNewException] = useState<Partial<Exception>>({
    date: new Date(),
    isClosed: false,
    reason: '',
  });

  const daysOfWeek = [
    { value: 0, label: 'Dimanche', short: 'Dim' },
    { value: 1, label: 'Lundi', short: 'Lun' },
    { value: 2, label: 'Mardi', short: 'Mar' },
    { value: 3, label: 'Mercredi', short: 'Mer' },
    { value: 4, label: 'Jeudi', short: 'Jeu' },
    { value: 5, label: 'Vendredi', short: 'Ven' },
    { value: 6, label: 'Samedi', short: 'Sam' },
  ];

  useEffect(() => {
    fetchOpeningHours();
  }, []);

  const fetchOpeningHours = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/opening-hours');
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setOpeningHours(data.openingHours || []);
    } catch (error) {
      console.error('Error fetching opening hours:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const updateDay = async (dayOfWeek: number, updates: Partial<OpeningHours>) => {
    setSaving(true);
    try {
      const existingDay = openingHours.find(oh => oh.dayOfWeek === dayOfWeek);
      const payload = { ...existingDay, ...updates, dayOfWeek };

      const response = await fetch('/api/opening-hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update');
      }

      toast.success('Horaires mis à jour avec succès!');
      fetchOpeningHours();
      setEditingDay(null);
    } catch (error) {
      console.error('Error updating:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const addException = async () => {
    if (!newException.date) {
      toast.error('La date est requise');
      return;
    }

    try {
      const response = await fetch('/api/opening-hours/exceptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newException),
      });

      if (!response.ok) throw new Error('Failed to add exception');

      toast.success('Exception ajoutée');
      fetchOpeningHours();
      setShowExceptionModal(false);
      setNewException({
        date: new Date(),
        isClosed: false,
        reason: '',
      });
    } catch (error) {
      console.error('Error adding exception:', error);
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const removeException = async (date: Date) => {
    try {
      const dateStr = new Date(date).toISOString().split('T')[0];
      const response = await fetch(`/api/opening-hours/exceptions?date=${dateStr}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove exception');

      toast.success('Exception supprimée');
      fetchOpeningHours();
    } catch (error) {
      console.error('Error removing exception:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getDayHours = (dayOfWeek: number): OpeningHours => {
    return openingHours.find(oh => oh.dayOfWeek === dayOfWeek) || {
      dayOfWeek,
      isOpen: false,
      slotDuration: 10,
      ordersPerSlot: 2,
      exceptions: [],
    };
  };

  const formatTime = (time?: string) => time || '--:--';

  const getAllExceptions = (): Exception[] => {
    const exceptions: Exception[] = [];
    openingHours.forEach(oh => {
      if (oh.exceptions) {
        exceptions.push(...oh.exceptions);
      }
    });
    return exceptions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-cream via-white to-primary-yellow/5 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-red border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream via-white to-primary-yellow/5 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-charcoal mb-2">
            Horaires <span className="bg-gradient-to-r from-primary-red to-primary-yellow bg-clip-text text-transparent">d'Ouverture</span>
          </h1>
          <p className="text-gray-600">
            Configurez les horaires d'ouverture et les exceptions
          </p>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-charcoal mb-6 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary-red" />
            Horaires Hebdomadaires
          </h2>

          <div className="space-y-4">
            {daysOfWeek.map((day) => {
              const dayHours = getDayHours(day.value);
              const isEditing = editingDay === day.value;

              return (
                <div
                  key={day.value}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    dayHours.isOpen
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-32">
                        <h3 className="text-lg font-bold text-charcoal">{day.label}</h3>
                      </div>

                      {isEditing ? (
                        <div className="flex-1 flex flex-wrap items-center gap-3">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={dayHours.isOpen}
                              onChange={(e) => {
                                const updated = { ...dayHours, isOpen: e.target.checked };
                                setOpeningHours(prev =>
                                  prev.map(oh => oh.dayOfWeek === day.value ? updated : oh)
                                );
                              }}
                              className="w-5 h-5 text-primary-red rounded focus:ring-2 focus:ring-primary-red"
                            />
                            <span className="font-semibold">Ouvert</span>
                          </label>

                          {dayHours.isOpen && (
                            <>
                              <input
                                type="time"
                                value={dayHours.hours?.open || '18:00'}
                                onChange={(e) => {
                                  const updated = {
                                    ...dayHours,
                                    hours: { ...dayHours.hours!, open: e.target.value }
                                  };
                                  setOpeningHours(prev =>
                                    prev.map(oh => oh.dayOfWeek === day.value ? updated : oh)
                                  );
                                }}
                                className="px-3 py-2 border-2 border-gray-300 rounded-lg font-semibold"
                              />
                              <span className="text-gray-600">à</span>
                              <input
                                type="time"
                                value={dayHours.hours?.close || '21:30'}
                                onChange={(e) => {
                                  const updated = {
                                    ...dayHours,
                                    hours: { ...dayHours.hours!, close: e.target.value }
                                  };
                                  setOpeningHours(prev =>
                                    prev.map(oh => oh.dayOfWeek === day.value ? updated : oh)
                                  );
                                }}
                                className="px-3 py-2 border-2 border-gray-300 rounded-lg font-semibold"
                              />
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex-1">
                          {dayHours.isOpen ? (
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-green-600" />
                                <span className="font-bold text-charcoal">
                                  {formatTime(dayHours.hours?.open)} - {formatTime(dayHours.hours?.close)}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-semibold">{dayHours.slotDuration}min</span> /
                                <span className="font-semibold ml-1">{dayHours.ordersPerSlot} commandes</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500 font-semibold">Fermé</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => updateDay(day.value, dayHours)}
                            disabled={saving}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            <span>Sauvegarder</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingDay(null);
                              fetchOpeningHours();
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span>Annuler</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setEditingDay(day.value)}
                          className="bg-primary-red hover:bg-primary-red-dark text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Modifier</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Exceptions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-charcoal flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-primary-red" />
              Exceptions (Jours Fériés / Spéciaux)
            </h2>
            <button
              onClick={() => setShowExceptionModal(true)}
              className="bg-gradient-to-r from-primary-red to-primary-yellow text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter Exception</span>
            </button>
          </div>

          {getAllExceptions().length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold">Aucune exception configurée</p>
              <p className="text-gray-500 text-sm mt-2">
                Les exceptions permettent de fermer ou modifier les horaires pour des dates spécifiques
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getAllExceptions().map((exception, index) => (
                <div
                  key={index}
                  className={`p-5 rounded-xl border-2 ${
                    exception.isClosed
                      ? 'bg-red-50 border-red-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {exception.isClosed ? (
                        <X className="w-5 h-5 text-red-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-blue-600" />
                      )}
                      <span className="font-bold text-charcoal">
                        {new Date(exception.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <button
                      onClick={() => removeException(exception.date)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {exception.reason && (
                    <p className="text-sm text-gray-700 mb-2 font-semibold">
                      {exception.reason}
                    </p>
                  )}

                  {exception.isClosed ? (
                    <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-bold">
                      Fermé
                    </span>
                  ) : exception.customHours ? (
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Horaires spéciaux:</span>
                      <br />
                      {exception.customHours.open} - {exception.customHours.close}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exception Modal */}
        {showExceptionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold text-charcoal mb-6">
                Ajouter une Exception
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newException.date ? new Date(newException.date).toISOString().split('T')[0] : ''}
                    onChange={(e) =>
                      setNewException({ ...newException, date: new Date(e.target.value) })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newException.isClosed}
                      onChange={(e) =>
                        setNewException({ ...newException, isClosed: e.target.checked })
                      }
                      className="w-5 h-5 text-primary-red rounded focus:ring-2 focus:ring-primary-red"
                    />
                    <span className="font-semibold">Fermé ce jour</span>
                  </label>
                </div>

                {!newException.isClosed && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Ouverture
                      </label>
                      <input
                        type="time"
                        value={newException.customHours?.open || ''}
                        onChange={(e) =>
                          setNewException({
                            ...newException,
                            customHours: {
                              ...newException.customHours!,
                              open: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Fermeture
                      </label>
                      <input
                        type="time"
                        value={newException.customHours?.close || ''}
                        onChange={(e) =>
                          setNewException({
                            ...newException,
                            customHours: {
                              ...newException.customHours!,
                              close: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Raison (optionnel)
                  </label>
                  <input
                    type="text"
                    value={newException.reason || ''}
                    onChange={(e) =>
                      setNewException({ ...newException, reason: e.target.value })
                    }
                    placeholder="Ex: Jour férié, Vacances..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={addException}
                  className="flex-1 bg-gradient-to-r from-primary-red to-primary-yellow text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => {
                    setShowExceptionModal(false);
                    setNewException({
                      date: new Date(),
                      isClosed: false,
                      reason: '',
                    });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
