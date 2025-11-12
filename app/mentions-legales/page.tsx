/**
 * MENTIONS LÉGALES - LEGAL NOTICE
 *
 * ⚠️ BUSINESS OWNER: This page contains placeholders that MUST be filled before production.
 * See LEGAL_SETUP_GUIDE.md in the project root for detailed instructions.
 *
 * Required information for SARL:
 * - SIRET number (14 digits)
 * - SIREN number (9 digits)
 * - VAT number (format: FR XX XXXXXXXXX)
 * - Capital social (share capital amount)
 * - RCS registration (city and number)
 * - Gérant name (company manager)
 */

import React from 'react';
import type { Metadata } from 'next';
import LegalLayout from '@/components/legal/LegalLayout';
import TableOfContents from '@/components/legal/TableOfContents';

export const metadata: Metadata = {
  title: 'Mentions Légales',
  description: 'Mentions légales et informations légales de Pizza Falchi, food truck de pizzas artisanales à Puyricard.',
  robots: {
    index: false,
    follow: true,
  },
};

const toc = [
  { id: 'editeur', title: '1. Éditeur du site', level: 2 },
  { id: 'hebergement', title: '2. Hébergement', level: 2 },
  { id: 'directeur', title: '3. Directeur de la publication', level: 2 },
  { id: 'propriete', title: '4. Propriété intellectuelle', level: 2 },
  { id: 'donnees', title: '5. Données personnelles', level: 2 },
  { id: 'cookies', title: '6. Cookies', level: 2 },
  { id: 'credits', title: '7. Crédits', level: 2 },
];

export default function MentionsLegales() {
  return (
    <LegalLayout
      title="Mentions Légales"
      lastUpdated="7 novembre 2025"
      breadcrumbs={[{ label: 'Mentions Légales', href: '/mentions-legales' }]}
    >
      <TableOfContents items={toc} />

      <section id="editeur" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          1. Éditeur du site
        </h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            Le site <strong>www.pizzafalchi.com</strong> est édité par :
          </p>
          <div className="bg-cream/30 dark:bg-gray-700/30 p-6 rounded-lg">
            <p className="font-semibold text-lg mb-3">Pizza Falchi</p>
            <p><strong>Forme juridique :</strong> SARL (Société à Responsabilité Limitée)</p>
            {/* ⚠️ BUSINESS OWNER: Replace with your 14-digit SIRET number from INSEE */}
            <p><strong>SIRET :</strong> [À COMPLÉTER]</p>
            {/* ⚠️ BUSINESS OWNER: Replace with your 9-digit SIREN number (first 9 digits of SIRET) */}
            <p><strong>SIREN :</strong> [À COMPLÉTER]</p>
            {/* ⚠️ BUSINESS OWNER: Replace with your VAT number (format: FR XX XXXXXXXXX) */}
            <p><strong>TVA intracommunautaire :</strong> [À COMPLÉTER]</p>
            {/* ⚠️ BUSINESS OWNER: Replace with your registered share capital amount */}
            <p><strong>Capital social :</strong> [À COMPLÉTER] €</p>
            {/* ⚠️ BUSINESS OWNER: Replace with your RCS registration (city and number) */}
            <p><strong>RCS :</strong> [À COMPLÉTER - Ville et numéro RCS]</p>
            <p className="mt-4"><strong>Adresse du siège social :</strong></p>
            <p>615, avenue de la Touloubre</p>
            <p>13540 Puyricard</p>
            <p>France</p>
            <p className="mt-4"><strong>Téléphone :</strong> <a href="tel:+33442920308" className="text-primary-red hover:underline">04 42 92 03 08</a></p>
            <p><strong>Email :</strong> <a href="mailto:pizzafalchipro@gmail.com" className="text-primary-red hover:underline">pizzafalchipro@gmail.com</a></p>
          </div>
        </div>
      </section>

      <section id="hebergement" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          2. Hébergement
        </h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Le site www.pizzafalchi.com est hébergé par :</p>
          <div className="bg-cream/30 dark:bg-gray-700/30 p-6 rounded-lg">
            <p className="font-semibold">Vercel Inc.</p>
            <p>440 N Barranca Ave #4133</p>
            <p>Covina, CA 91723</p>
            <p>États-Unis</p>
            <p className="mt-2">Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary-red hover:underline">https://vercel.com</a></p>
          </div>
        </div>
      </section>

      <section id="directeur" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          3. Directeur de la publication
        </h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            Le directeur de la publication du site www.pizzafalchi.com est :
          </p>
          {/* ⚠️ BUSINESS OWNER: Replace with full legal name of the gérant (company manager) */}
          <p className="font-semibold bg-cream/30 dark:bg-gray-700/30 p-4 rounded-lg">
            [À COMPLÉTER - Nom et prénom du gérant]
          </p>
          <p className="text-sm">
            en sa qualité de Gérant de la SARL Pizza Falchi
          </p>
        </div>
      </section>

      <section id="propriete" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          4. Propriété intellectuelle
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
          </p>
          <p>
            La reproduction de tout ou partie de ce site sur un support électronique ou autre quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
          </p>
          <p>
            Les marques, logos, signes ainsi que tous les contenus du site (textes, images, son, vidéos...) font l'objet d'une protection par le Code de la propriété intellectuelle et plus particulièrement par le droit d'auteur.
          </p>
          <p className="font-semibold">
            L'utilisateur doit solliciter l'autorisation préalable du site pour toute reproduction, publication, copie des différents contenus. Il s'engage à une utilisation des contenus du site dans un cadre strictement privé, toute utilisation à des fins commerciales et publicitaires est strictement interdite.
          </p>
        </div>
      </section>

      <section id="donnees" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          5. Données personnelles
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Pizza Falchi accorde une grande importance à la protection de vos données personnelles et s'engage à respecter le Règlement Général sur la Protection des Données (RGPD) ainsi que la loi Informatique et Libertés.
          </p>
          <p>
            Pour en savoir plus sur la collecte, le traitement et la protection de vos données personnelles, veuillez consulter notre{' '}
            <a href="/politique-confidentialite" className="text-primary-red font-semibold hover:underline">
              Politique de Confidentialité
            </a>
            .
          </p>
          <p className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
            <strong>Vos droits :</strong> Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition concernant vos données personnelles. Pour exercer ces droits, contactez-nous à l'adresse :{' '}
            <a href="mailto:pizzafalchipro@gmail.com" className="text-primary-red font-semibold hover:underline">
              pizzafalchipro@gmail.com
            </a>
          </p>
        </div>
      </section>

      <section id="cookies" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          6. Cookies
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Le site www.pizzafalchi.com utilise des cookies pour améliorer l'expérience utilisateur et analyser la fréquentation du site.
          </p>
          <p>
            Pour plus d'informations sur les cookies utilisés et la gestion de vos préférences, veuillez consulter notre{' '}
            <a href="/politique-cookies" className="text-primary-red font-semibold hover:underline">
              Politique des Cookies
            </a>
            .
          </p>
        </div>
      </section>

      <section id="credits" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          7. Crédits
        </h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p><strong>Conception et développement :</strong> Pizza Falchi</p>
          <p><strong>Technologies utilisées :</strong> Next.js, React, TypeScript, Tailwind CSS</p>
          <p><strong>Photographies :</strong> © Pizza Falchi - Tous droits réservés</p>
        </div>
      </section>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-12">
        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
          Dernière mise à jour de cette page : 7 novembre 2025
        </p>
      </div>
    </LegalLayout>
  );
}
