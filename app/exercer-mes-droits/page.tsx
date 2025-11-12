'use client';

import React, { useState } from 'react';
import LegalLayout from '@/components/legal/LegalLayout';
import { User, Mail, Phone, FileText, Shield, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExercerMesDroits() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    requestType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real implementation, this would send to an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Votre demande a été envoyée avec succès. Nous vous répondrons dans un délai d\'un mois.', {
        duration: 5000,
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        requestType: '',
        message: '',
      });
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer ou nous contacter par email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <LegalLayout
      title="Exercer mes Droits RGPD"
      lastUpdated="7 novembre 2025"
      breadcrumbs={[{ label: 'Exercer mes droits', href: '/exercer-mes-droits' }]}
    >
      <div className="space-y-8">
        <section>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg mb-8">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Vos droits sur vos données personnelles</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez de droits sur vos données personnelles :
                </p>
                <ul className="grid md:grid-cols-2 gap-3 text-sm">
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                    <span>Droit d'accès à vos données</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                    <span>Droit de rectification</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                    <span>Droit à l'effacement ("droit à l'oubli")</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                    <span>Droit à la portabilité</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                    <span>Droit d'opposition</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                    <span>Droit de limitation du traitement</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Formulaire de demande</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Remplissez le formulaire ci-dessous pour exercer vos droits. Nous nous engageons à vous répondre dans un délai d'<strong>un mois</strong> à compter de la réception de votre demande.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="Votre prénom"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="Votre nom"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="votre@email.com"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Nous utiliserons cet email pour vous répondre</p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Téléphone (facultatif)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>

            <div>
              <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type de demande <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  id="requestType"
                  name="requestType"
                  value={formData.requestType}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent dark:bg-gray-800 dark:text-white appearance-none"
                >
                  <option value="">Sélectionnez un type de demande</option>
                  <option value="acces">Droit d'accès - Obtenir une copie de mes données</option>
                  <option value="rectification">Droit de rectification - Corriger mes données</option>
                  <option value="effacement">Droit à l'effacement - Supprimer mes données</option>
                  <option value="portabilite">Droit à la portabilité - Récupérer mes données</option>
                  <option value="opposition">Droit d'opposition - M'opposer au traitement</option>
                  <option value="limitation">Droit de limitation - Limiter le traitement</option>
                  <option value="autre">Autre demande</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Détails de votre demande <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                placeholder="Décrivez votre demande en détail..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Soyez aussi précis que possible pour nous permettre de traiter votre demande rapidement</p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Vérification d'identité :</strong> Pour des raisons de sécurité, nous pourrions vous demander une preuve d'identité avant de traiter votre demande (copie de pièce d'identité). Cette vérification permet de protéger vos données contre tout accès non autorisé.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-red hover:bg-primary-red-dark text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Envoyer ma demande</span>
                </>
              )}
            </button>
          </form>
        </section>

        <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Autres moyens de contact</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">Vous pouvez également exercer vos droits en nous contactant directement :</p>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Email :</strong> <a href="mailto:pizzafalchipro@gmail.com" className="text-primary-red hover:underline">pizzafalchipro@gmail.com</a></li>
            <li><strong>Téléphone :</strong> <a href="tel:+33442920308" className="text-primary-red hover:underline">04 42 92 03 08</a></li>
            <li><strong>Courrier :</strong> Pizza Falchi, 615 avenue de la Touloubre, 13540 Puyricard</li>
          </ul>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            En cas de réponse insatisfaisante, vous pouvez saisir la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary-red hover:underline">www.cnil.fr</a>
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
