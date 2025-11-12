import React from 'react';
import type { Metadata } from 'next';
import LegalLayout from '@/components/legal/LegalLayout';
import TableOfContents from '@/components/legal/TableOfContents';
import CookieManagerButton from '@/components/legal/CookieManagerButton';

export const metadata: Metadata = {
  title: 'Politique des Cookies',
  description: 'Politique relative à l\'utilisation des cookies sur le site Pizza Falchi.',
  robots: {
    index: false,
    follow: true,
  },
};

const toc = [
  { id: 'definition', title: '1. Qu\'est-ce qu\'un cookie ?', level: 2 },
  { id: 'types', title: '2. Types de cookies utilisés', level: 2 },
  { id: 'liste', title: '3. Liste détaillée des cookies', level: 2 },
  { id: 'gestion', title: '4. Gestion des cookies', level: 2 },
  { id: 'opposition', title: '5. Comment refuser les cookies', level: 2 },
];

export default function PolitiqueCookies() {
  return (
    <LegalLayout
      title="Politique des Cookies"
      lastUpdated="7 novembre 2025"
      breadcrumbs={[{ label: 'Cookies', href: '/politique-cookies' }]}
    >
      <TableOfContents items={toc} />

      <section id="definition" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          1. Qu'est-ce qu'un cookie ?
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone, tablette) lors de la visite d'un site internet. Il permet de mémoriser des informations relatives à votre navigation et de faciliter votre expérience sur le site.
          </p>
          <p>
            Les cookies peuvent être émis par Pizza Falchi (cookies "first-party") ou par des tiers comme Google Analytics (cookies "third-party").
          </p>
        </div>
      </section>

      <section id="types" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          2. Types de cookies utilisés
        </h2>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">✅ Cookies essentiels (obligatoires)</h3>
            <p>
              Ces cookies sont strictement nécessaires au fonctionnement du site et ne nécessitent pas votre consentement. Ils ne peuvent pas être désactivés.
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li>Gestion du panier d'achat</li>
              <li>Authentification (administrateurs)</li>
              <li>Préférences de thème (clair/sombre)</li>
              <li>Mémorisation du consentement aux cookies</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">📊 Cookies analytiques (nécessitent consentement)</h3>
            <p>
              Ces cookies nous permettent de mesurer l'audience du site et d'améliorer son contenu et son ergonomie. Ils nécessitent votre consentement préalable.
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li>Google Analytics (si configuré)</li>
              <li>Statistiques de fréquentation</li>
              <li>Mesure de performance</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="liste" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          3. Liste détaillée des cookies
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Nom</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Finalité</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Durée</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 p-3 font-mono">pizza-cart</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">Mémorisation du panier</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">Persistant</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">Essentiel</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 p-3 font-mono">theme</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">Préférence thème clair/sombre</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">Persistant</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">Essentiel</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 p-3 font-mono">next-auth.session-token</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">Session administrateur</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">Session</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">Essentiel</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 p-3 font-mono">tarteaucitron</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">Consentement cookies</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">12 mois</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">Essentiel</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 p-3 font-mono">_ga, _gid</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">Google Analytics (mesure audience)</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">13 mois</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">Analytique</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="gestion" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          4. Gestion de vos préférences
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Lors de votre première visite sur notre site, un bandeau d'information vous invite à accepter ou refuser les cookies non essentiels. Vous pouvez modifier vos préférences à tout moment.
          </p>
          <div className="bg-primary-red/10 dark:bg-primary-red-light/10 border border-primary-red dark:border-primary-red-light p-6 rounded-lg">
            <p className="font-semibold mb-3">Pour modifier vos préférences :</p>
            <CookieManagerButton />
          </div>
        </div>
      </section>

      <section id="opposition" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          5. Comment refuser les cookies via votre navigateur
        </h2>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p>
            Vous pouvez également paramétrer votre navigateur pour refuser les cookies. Voici les liens vers les instructions pour les principaux navigateurs :
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-cream/30 dark:bg-gray-700/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Google Chrome</h4>
              <a
                href="https://support.google.com/chrome/answer/95647?hl=fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-red hover:underline text-sm"
              >
                Instructions Chrome →
              </a>
            </div>
            <div className="bg-cream/30 dark:bg-gray-700/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Mozilla Firefox</h4>
              <a
                href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-red hover:underline text-sm"
              >
                Instructions Firefox →
              </a>
            </div>
            <div className="bg-cream/30 dark:bg-gray-700/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Safari (macOS / iOS)</h4>
              <a
                href="https://support.apple.com/fr-fr/HT201265"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-red hover:underline text-sm"
              >
                Instructions Safari →
              </a>
            </div>
            <div className="bg-cream/30 dark:bg-gray-700/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Microsoft Edge</h4>
              <a
                href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-red hover:underline text-sm"
              >
                Instructions Edge →
              </a>
            </div>
          </div>

          <p className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg mt-6">
            <strong>⚠️ Attention :</strong> La désactivation de certains cookies peut affecter le bon fonctionnement du site (par exemple, votre panier ne sera pas mémorisé).
          </p>

          <div className="mt-6">
            <h4 className="font-semibold mb-3">Liens utiles CNIL :</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <a
                  href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-red hover:underline"
                >
                  Tout savoir sur les cookies (CNIL)
                </a>
              </li>
              <li>
                <a
                  href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/comment-se-proteger/maitriser-votre-navigateur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-red hover:underline"
                >
                  Maîtriser votre navigateur (CNIL)
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-12">
        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
          Pour toute question concernant l'utilisation des cookies, contactez-nous à : <a href="mailto:pizzafalchipro@gmail.com" className="text-primary-red hover:underline">pizzafalchipro@gmail.com</a>
        </p>
      </div>
    </LegalLayout>
  );
}
