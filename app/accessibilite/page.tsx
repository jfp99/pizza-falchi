import React from 'react';
import type { Metadata } from 'next';
import LegalLayout from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Déclaration d\'Accessibilité',
  description: 'Déclaration d\'accessibilité du site Pizza Falchi - Conformité RGAA.',
  robots: { index: false, follow: true },
};

export default function Accessibilite() {
  return (
    <LegalLayout title="Déclaration d'Accessibilité" lastUpdated="7 novembre 2025" breadcrumbs={[{ label: 'Accessibilité', href: '/accessibilite' }]}>
      <div className="space-y-8">
        <section>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Pizza Falchi s'engage à rendre son site internet accessible conformément à l'article 47 de la loi n° 2005-102 du 11 février 2005 et au Référentiel Général d'Amélioration de l'Accessibilité (RGAA) version 4.1.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Cette déclaration d'accessibilité s'applique au site <strong>www.pizzafalchi.com</strong>.
          </p>
        </section>

        <section className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">État de conformité</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Le site <strong>www.pizzafalchi.com</strong> est en <strong>conformité partielle</strong> avec le RGAA 4.1.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Un audit de conformité est prévu pour évaluer précisément le niveau d'accessibilité et identifier les améliorations à apporter.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Résultats des tests</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>Un audit de conformité RGAA n'a pas encore été réalisé. En l'absence d'audit complet, nous ne pouvons garantir une conformité totale aux critères du RGAA 4.1.</p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Éléments accessibles</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Navigation au clavier sur l'ensemble du site</li>
              <li>Structure HTML sémantique (header, nav, main, footer)</li>
              <li>Textes alternatifs pour les images importantes</li>
              <li>Contraste de couleurs conforme sur la majorité du site</li>
              <li>Responsive design adapté aux différents écrans</li>
              <li>Formulaires avec labels associés</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Contenus non accessibles</h3>
            <p>Les contenus listés ci-dessous ne sont pas accessibles pour les raisons suivantes :</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Certaines images décoratives peuvent ne pas avoir d'attribut alt vide</li>
              <li>Certains contrastes de couleurs peuvent être insuffisants sur les éléments interactifs</li>
              <li>Les animations et transitions ne peuvent pas toujours être désactivées</li>
              <li>Certains formulaires peuvent manquer d'indications d'erreur explicites</li>
              <li>La navigation au clavier pourrait être améliorée sur certains composants complexes</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Établissement de cette déclaration</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p><strong>Date de publication :</strong> 7 novembre 2025</p>
            <p><strong>Méthode utilisée :</strong> Auto-évaluation initiale</p>
            <p><strong>Technologies utilisées :</strong> HTML5, CSS3 (Tailwind CSS), JavaScript (React/Next.js), SVG</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Amélioration et contact</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>Pizza Falchi s'engage dans une démarche d'amélioration continue de l'accessibilité de son site internet. Nous travaillons activement à corriger les non-conformités identifiées.</p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg mt-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Signaler un problème d'accessibilité</h3>
              <p className="mb-3">
                Si vous rencontrez un problème d'accessibilité vous empêchant d'accéder à un contenu ou à une fonctionnalité du site, merci de nous le signaler :
              </p>
              <ul className="space-y-2">
                <li><strong>Email :</strong> <a href="mailto:pizzafalchipro@gmail.com" className="text-primary-red hover:underline">pizzafalchipro@gmail.com</a></li>
                <li><strong>Téléphone :</strong> <a href="tel:+33442920308" className="text-primary-red hover:underline">04 42 92 03 08</a></li>
                <li><strong>Adresse :</strong> 615, avenue de la Touloubre, 13540 Puyricard</li>
              </ul>
              <p className="mt-4 text-sm">Nous nous efforcerons de vous apporter une réponse rapide et de vous proposer une alternative accessible.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Voies de recours</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Si vous constatez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une fonctionnalité du site, que vous nous le signalez et que vous ne parvenez pas à obtenir une réponse de notre part, vous êtes en droit de faire parvenir vos doléances ou une demande de saisine au Défenseur des droits.
            </p>
            <p>Plusieurs moyens sont à votre disposition :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <a href="https://formulaire.defenseurdesdroits.fr/" target="_blank" rel="noopener noreferrer" className="text-primary-red hover:underline">
                  Formulaire de contact en ligne
                </a>
              </li>
              <li>
                <a href="https://www.defenseurdesdroits.fr/saisir/delegues" target="_blank" rel="noopener noreferrer" className="text-primary-red hover:underline">
                  Liste des délégués de votre région
                </a>
              </li>
              <li>Téléphone : 09 69 39 00 00 (du lundi au vendredi de 8h à 20h)</li>
              <li>Adresse postale : Le Défenseur des droits, Libre réponse 71120, 75342 Paris CEDEX 07</li>
            </ul>
          </div>
        </section>

        <section className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Plan d'action</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p><strong>Objectif :</strong> Atteindre une conformité complète au RGAA 4.1 d'ici 12 mois.</p>
            <p><strong>Actions prévues :</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Réalisation d'un audit RGAA complet par un expert</li>
              <li>Correction des non-conformités identifiées par ordre de priorité</li>
              <li>Formation de l'équipe aux bonnes pratiques d'accessibilité</li>
              <li>Mise en place de tests automatisés d'accessibilité</li>
              <li>Revue régulière de la conformité lors des évolutions du site</li>
            </ul>
          </div>
        </section>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-12">
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            Cette déclaration d'accessibilité a été créée le 7 novembre 2025. Elle sera mise à jour suite à la réalisation d'un audit de conformité.
          </p>
        </div>
      </div>
    </LegalLayout>
  );
}
