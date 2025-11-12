import React from 'react';
import type { Metadata } from 'next';
import LegalLayout from '@/components/legal/LegalLayout';
import TableOfContents from '@/components/legal/TableOfContents';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité et protection des données personnelles de Pizza Falchi - Conformité RGPD.',
  robots: {
    index: false,
    follow: true,
  },
};

const toc = [
  { id: 'intro', title: '1. Introduction', level: 2 },
  { id: 'responsable', title: '2. Responsable du traitement', level: 2 },
  { id: 'donnees-collectees', title: '3. Données collectées', level: 2 },
  { id: 'finalites', title: '4. Finalités du traitement', level: 2 },
  { id: 'base-legale', title: '5. Base légale', level: 2 },
  { id: 'destinataires', title: '6. Destinataires des données', level: 2 },
  { id: 'conservation', title: '7. Durée de conservation', level: 2 },
  { id: 'droits', title: '8. Vos droits', level: 2 },
  { id: 'securite', title: '9. Sécurité', level: 2 },
  { id: 'cookies', title: '10. Cookies', level: 2 },
  { id: 'modifications', title: '11. Modifications', level: 2 },
];

export default function PolitiqueConfidentialite() {
  return (
    <LegalLayout
      title="Politique de Confidentialité"
      lastUpdated="7 novembre 2025"
      breadcrumbs={[{ label: 'Confidentialité', href: '/politique-confidentialite' }]}
    >
      <TableOfContents items={toc} />

      <section id="intro" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          1. Introduction
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Pizza Falchi accorde une grande importance à la protection de vos données personnelles et s'engage à les traiter de manière confidentielle, sécurisée et transparente.
          </p>
          <p>
            La présente Politique de Confidentialité vous informe sur la manière dont nous collectons, utilisons, partageons et protégeons vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679) et à la loi française Informatique et Libertés.
          </p>
        </div>
      </section>

      <section id="responsable" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          2. Responsable du traitement
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>Le responsable du traitement de vos données personnelles est :</p>
          <div className="bg-cream/30 dark:bg-gray-700/30 p-6 rounded-lg">
            <p className="font-semibold">Pizza Falchi</p>
            <p>Auto-entrepreneur (Micro-entreprise)</p>
            <p>SIRET : [À COMPLÉTER]</p>
            <p className="mt-3"><strong>Adresse :</strong></p>
            <p>615, avenue de la Touloubre</p>
            <p>13540 Puyricard, France</p>
            <p className="mt-3"><strong>Contact pour les données personnelles :</strong></p>
            <p>Email : <a href="mailto:pizzafalchipro@gmail.com" className="text-primary-red hover:underline">pizzafalchipro@gmail.com</a></p>
            <p>Téléphone : <a href="tel:+33442920308" className="text-primary-red hover:underline">04 42 92 03 08</a></p>
          </div>
        </div>
      </section>

      <section id="donnees-collectees" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          3. Données personnelles collectées
        </h2>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p>Nous collectons les catégories de données suivantes :</p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">🛒 Lors de la passation de commande</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Nom et prénom</li>
              <li>Numéro de téléphone</li>
              <li>Adresse email (facultatif)</li>
              <li>Adresse de livraison (si livraison)</li>
              <li>Détails de la commande (produits, quantités, montants)</li>
              <li>Préférences de créneaux horaires</li>
              <li>Notes et instructions spéciales</li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">📧 Inscription à la newsletter</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Adresse email</li>
              <li>Nom et prénom (facultatif)</li>
              <li>Préférences de communication</li>
              <li>Date d'inscription</li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">💻 Données de navigation</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Adresse IP</li>
              <li>Type de navigateur et système d'exploitation</li>
              <li>Pages visitées et durée de visite</li>
              <li>Référent (site d'origine)</li>
              <li>Cookies et identifiants de session</li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">🔐 Données de connexion (Admin)</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Identifiant de connexion</li>
              <li>Mot de passe chiffré</li>
              <li>Historique des connexions</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="finalites" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          4. Finalités du traitement
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>Vos données personnelles sont collectées et traitées pour les finalités suivantes :</p>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-2xl mr-3">📦</span>
              <div>
                <p className="font-semibold">Gestion et suivi des commandes</p>
                <p className="text-sm">Traitement, préparation et livraison de vos commandes</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">💳</span>
              <div>
                <p className="font-semibold">Paiement et facturation</p>
                <p className="text-sm">Traitement des paiements et émission des factures</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">📧</span>
              <div>
                <p className="font-semibold">Communication</p>
                <p className="text-sm">Confirmation de commande, notifications WhatsApp, newsletter</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">👤</span>
              <div>
                <p className="font-semibold">Gestion de la relation client</p>
                <p className="text-sm">Historique d'achat, préférences, service client</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">📊</span>
              <div>
                <p className="font-semibold">Statistiques et amélioration du service</p>
                <p className="text-sm">Analyse de fréquentation, optimisation de l'expérience utilisateur</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚖️</span>
              <div>
                <p className="font-semibold">Obligations légales</p>
                <p className="text-sm">Conservation des factures, conformité fiscale et comptable</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="base-legale" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          5. Base légale du traitement
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>Conformément au RGPD (Article 6), le traitement de vos données repose sur les bases légales suivantes :</p>
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Finalité</th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Base légale</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Gestion des commandes</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Exécution du contrat (Art. 6.1.b)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Newsletter</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Consentement (Art. 6.1.a)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Profils clients</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Intérêt légitime (Art. 6.1.f)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Obligations comptables</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Obligation légale (Art. 6.1.c)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="destinataires" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          6. Destinataires et sous-traitants
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>Vos données personnelles peuvent être partagées avec les tiers suivants :</p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
            Sous-traitants techniques
          </h3>
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Service</th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Finalité</th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Localisation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">MongoDB Atlas</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Hébergement base de données</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">UE (Irlande)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Vercel</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Hébergement site web</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">UE + USA (clauses contractuelles types)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Stripe</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Paiement en ligne</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">UE + USA (certifié GDPR)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Twilio</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Notifications WhatsApp</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">USA (certifié GDPR)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Resend</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Envoi d'emails</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">UE</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Sentry</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Monitoring erreurs</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">USA (anonymisation IP)</td>
              </tr>
            </tbody>
          </table>

          <p className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mt-4">
            <strong>Transferts hors UE :</strong> Les transferts de données vers des pays hors Union Européenne sont encadrés par les clauses contractuelles types de la Commission Européenne ou par des certifications GDPR des sous-traitants.
          </p>

          <p className="mt-4">
            <strong>Aucune vente de données :</strong> Pizza Falchi ne vend, ne loue et ne cède jamais vos données personnelles à des tiers à des fins commerciales ou marketing.
          </p>
        </div>
      </section>

      <section id="conservation" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          7. Durée de conservation des données
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Type de données</th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Durée de conservation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Données de commande</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">3 ans (obligation comptable)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Profils clients actifs</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">3 ans après dernière commande</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Newsletter</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Jusqu'à désinscription</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Cookies analytiques</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">13 mois maximum</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Logs de connexion</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">12 mois (sécurité)</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-4">
            À l'issue de ces délais, vos données sont supprimées de manière sécurisée et définitive, sauf obligation légale de conservation.
          </p>
        </div>
      </section>

      <section id="droits" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          8. Vos droits sur vos données personnelles
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p className="font-semibold text-lg">
            Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-cream/30 dark:bg-gray-700/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🔍 Droit d'accès</h4>
              <p className="text-sm">Obtenir une copie de vos données personnelles</p>
            </div>
            <div className="bg-cream/30 dark:bg-gray-700/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">✏️ Droit de rectification</h4>
              <p className="text-sm">Corriger vos données inexactes ou incomplètes</p>
            </div>
            <div className="bg-cream/30 dark:bg-gray-700/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🗑️ Droit à l'effacement</h4>
              <p className="text-sm">Demander la suppression de vos données ("droit à l'oubli")</p>
            </div>
            <div className="bg-cream/30 dark:bg-gray-700/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">📤 Droit à la portabilité</h4>
              <p className="text-sm">Récupérer vos données dans un format structuré</p>
            </div>
            <div className="bg-cream/30 dark:bg-gray-700/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🚫 Droit d'opposition</h4>
              <p className="text-sm">S'opposer au traitement pour motif légitime</p>
            </div>
            <div className="bg-cream/30 dark:bg-gray-700/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">⏸️ Droit de limitation</h4>
              <p className="text-sm">Limiter le traitement dans certaines circonstances</p>
            </div>
          </div>

          <div className="bg-primary-red/10 dark:bg-primary-red-light/10 border border-primary-red dark:border-primary-red-light p-6 rounded-lg mt-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              💬 Comment exercer vos droits ?
            </h3>
            <p className="mb-3">
              Pour exercer l'un de ces droits, vous pouvez nous contacter :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Par email : <a href="mailto:pizzafalchipro@gmail.com" className="text-primary-red dark:text-primary-red-light font-semibold hover:underline">pizzafalchipro@gmail.com</a></li>
              <li>Via notre formulaire : <a href="/exercer-mes-droits" className="text-primary-red dark:text-primary-red-light font-semibold hover:underline">Exercer mes droits RGPD</a></li>
              <li>Par courrier : Pizza Falchi, 615 avenue de la Touloubre, 13540 Puyricard</li>
            </ul>
            <p className="mt-4 text-sm">
              Nous nous engageons à répondre à votre demande dans un délai d'<strong>un mois</strong> à compter de sa réception. Ce délai peut être prolongé de deux mois en cas de complexité de la demande.
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg mt-4">
            <h4 className="font-semibold mb-2">⚖️ Droit de réclamation auprès de la CNIL</h4>
            <p>
              Si vous estimez que vos droits ne sont pas respectés, vous avez le droit de déposer une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) :
            </p>
            <p className="mt-2">
              <strong>CNIL</strong><br />
              3 Place de Fontenoy<br />
              TSA 80715<br />
              75334 PARIS CEDEX 07<br />
              Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary-red hover:underline">www.cnil.fr</a>
            </p>
          </div>
        </div>
      </section>

      <section id="securite" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          9. Sécurité des données
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Pizza Falchi met en œuvre toutes les mesures techniques et organisationnelles appropriées pour garantir la sécurité et la confidentialité de vos données personnelles, notamment :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Chiffrement SSL/TLS pour toutes les communications (HTTPS)</li>
            <li>Hébergement sécurisé avec sauvegardes régulières</li>
            <li>Authentification forte et hashage des mots de passe (bcrypt)</li>
            <li>Contrôle d'accès strict aux données (principe du moindre privilège)</li>
            <li>Monitoring et détection des incidents de sécurité</li>
            <li>Mise à jour régulière des systèmes et logiciels</li>
          </ul>
          <p className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg mt-4">
            <strong>En cas de violation de données :</strong> Si une violation de données personnelles susceptible d'engendrer un risque élevé pour vos droits et libertés était détectée, nous vous en informerions dans les 72 heures conformément aux obligations du RGPD.
          </p>
        </div>
      </section>

      <section id="cookies" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          10. Cookies et technologies similaires
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Notre site utilise des cookies pour améliorer votre expérience utilisateur. Pour plus d'informations détaillées sur les cookies utilisés, leur finalité et la gestion de vos préférences, consultez notre{' '}
            <a href="/politique-cookies" className="text-primary-red font-semibold hover:underline">
              Politique des Cookies
            </a>
            .
          </p>
        </div>
      </section>

      <section id="modifications" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          11. Modifications de la politique
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Pizza Falchi se réserve le droit de modifier la présente Politique de Confidentialité à tout moment. Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour.
          </p>
          <p>
            Nous vous encourageons à consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.
          </p>
          <p>
            En cas de modification substantielle, nous vous en informerons par email ou via un bandeau d'information sur le site.
          </p>
        </div>
      </section>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-12">
        <div className="bg-cream/50 dark:bg-gray-700/50 p-6 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <strong>Version de la politique :</strong> 1.0
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <strong>Dernière mise à jour :</strong> 7 novembre 2025
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            Cette politique est conforme au RGPD (Règlement UE 2016/679) et à la loi française Informatique et Libertés du 6 janvier 1978 modifiée.
          </p>
        </div>
      </div>
    </LegalLayout>
  );
}
