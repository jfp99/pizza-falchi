/**
 * CONDITIONS GÉNÉRALES DE VENTE (CGV) - TERMS OF SALE
 *
 * ⚠️ BUSINESS OWNER: This page contains placeholders for SARL information.
 * See LEGAL_SETUP_GUIDE.md in the project root for detailed instructions.
 *
 * Required: SIRET, RCS, Capital social
 */

import React from 'react';
import type { Metadata } from 'next';
import LegalLayout from '@/components/legal/LegalLayout';
import TableOfContents from '@/components/legal/TableOfContents';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente (CGV)',
  description: 'Conditions générales de vente de Pizza Falchi - Consultez nos termes et conditions pour la commande et la livraison de nos pizzas artisanales.',
  robots: {
    index: false,
    follow: true,
  },
};

const toc = [
  { id: 'preambule', title: '1. Préambule', level: 2 },
  { id: 'champ-application', title: '2. Champ d\'application', level: 2 },
  { id: 'produits', title: '3. Produits et services', level: 2 },
  { id: 'commandes', title: '4. Commandes', level: 2 },
  { id: 'prix', title: '5. Prix', level: 2 },
  { id: 'paiement', title: '6. Modalités de paiement', level: 2 },
  { id: 'retrait', title: '7. Retrait et livraison', level: 2 },
  { id: 'retractation', title: '8. Droit de rétractation', level: 2 },
  { id: 'reclamations', title: '9. Réclamations et litiges', level: 2 },
  { id: 'donnees', title: '10. Données personnelles', level: 2 },
  { id: 'loi', title: '11. Loi applicable', level: 2 },
];

export default function ConditionsGeneralesVente() {
  return (
    <LegalLayout
      title="Conditions Générales de Vente"
      lastUpdated="7 novembre 2025"
      breadcrumbs={[{ label: 'CGV', href: '/conditions-generales-vente' }]}
    >
      <TableOfContents items={toc} />

      <section id="preambule" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          1. Préambule
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent les relations contractuelles entre :
          </p>
          <div className="bg-cream/30 dark:bg-gray-700/30 p-6 rounded-lg">
            <p><strong>Pizza Falchi</strong></p>
            <p>SARL (Société à Responsabilité Limitée)</p>
            {/* ⚠️ BUSINESS OWNER: Replace with your 14-digit SIRET number */}
            <p>SIRET : [À COMPLÉTER]</p>
            {/* ⚠️ BUSINESS OWNER: Replace with your RCS registration */}
            <p>RCS : [À COMPLÉTER - Ville et numéro RCS]</p>
            {/* ⚠️ BUSINESS OWNER: Replace with your share capital amount */}
            <p>Capital social : [À COMPLÉTER] €</p>
            <p>Adresse : 615, avenue de la Touloubre, 13540 Puyricard</p>
            <p>Email : pizzafalchipro@gmail.com</p>
            <p>Téléphone : 04 42 92 03 08</p>
            <p className="mt-2">(ci-après dénommé « le Vendeur »)</p>
          </div>
          <p>et toute personne physique ou morale souhaitant procéder à l'achat de produits proposés à la vente (ci-après dénommé « le Client » ou « l'Acheteur »).</p>
        </div>
      </section>

      <section id="champ-application" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          2. Champ d'application
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Les présentes CGV s'appliquent à toutes les ventes de produits alimentaires (pizzas, boissons, accompagnements, desserts) effectuées sur le site internet www.pizzafalchi.com ou par téléphone.
          </p>
          <p>
            Le fait de passer commande implique l'acceptation pleine et entière des présentes CGV. Le Client reconnaît avoir pris connaissance de ces conditions et les avoir acceptées avant de passer commande.
          </p>
          <p className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
            <strong>Important :</strong> En validant votre commande, vous acceptez expressément les présentes Conditions Générales de Vente dans leur intégralité. Elles sont accessibles à tout moment sur notre site et prévaudront sur tout autre document.
          </p>
        </div>
      </section>

      <section id="produits" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          3. Produits et services
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
            3.1. Description des produits
          </h3>
          <p>
            Pizza Falchi propose à la vente :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Pizzas artisanales cuites au feu de bois</li>
            <li>Boissons fraîches et chaudes</li>
            <li>Accompagnements (salades, entrées)</li>
            <li>Desserts</li>
          </ul>
          <p>
            Les produits proposés sont ceux figurant sur le site www.pizzafalchi.com au jour de la consultation par le Client. Les photographies et graphismes présentés sont les plus fidèles possibles mais n'ont pas de valeur contractuelle.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
            3.2. Disponibilité
          </h3>
          <p>
            Nos produits sont proposés dans la limite des stocks disponibles. En cas d'indisponibilité d'un produit après passation de la commande, le Client en sera informé dans les meilleurs délais et pourra demander l'annulation de sa commande avec remboursement intégral.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
            3.3. Allergènes et informations nutritionnelles
          </h3>
          <p>
            Les informations relatives aux allergènes sont disponibles sur demande. Le Client est invité à se renseigner avant de passer commande en cas d'allergie alimentaire.
          </p>
          <p className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
            <strong>⚠️ Attention :</strong> Nos produits peuvent contenir ou avoir été en contact avec des allergènes : gluten, lactose, œufs, fruits à coque, etc. Les personnes allergiques doivent impérativement nous contacter avant de commander.
          </p>
        </div>
      </section>

      <section id="commandes" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          4. Commandes
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
            4.1. Modalités de commande
          </h3>
          <p>
            Les commandes peuvent être passées :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>En ligne sur le site www.pizzafalchi.com</li>
            <li>Par téléphone au 04 42 92 03 08</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
            4.2. Validation de la commande
          </h3>
          <p>
            Le processus de commande en ligne comprend les étapes suivantes :
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Sélection des produits et ajout au panier</li>
            <li>Vérification du contenu du panier</li>
            <li>Saisie des informations de contact et de retrait/livraison</li>
            <li>Choix du mode de paiement</li>
            <li>Acceptation des présentes CGV</li>
            <li>Confirmation de la commande</li>
          </ol>
          <p>
            La commande est considérée comme définitive après sa validation par le Client et la réception de l'email de confirmation de commande.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
            4.3. Confirmation de commande
          </h3>
          <p>
            Une confirmation de commande est envoyée par email au Client après validation de la commande. Ce message récapitule les éléments essentiels de la commande : produits commandés, prix, date et heure de retrait ou de livraison prévue.
          </p>
          <p>
            Le Client peut également recevoir une notification par WhatsApp si un numéro de téléphone portable a été renseigné.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
            4.4. Annulation de commande
          </h3>
          <p>
            Le Client peut annuler sa commande gratuitement jusqu'à 30 minutes après sa validation en contactant le Vendeur par téléphone au 04 42 92 03 08. Passé ce délai, aucune annulation ne pourra être acceptée, sauf accord exceptionnel du Vendeur.
          </p>
        </div>
      </section>

      <section id="prix" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          5. Prix
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Les prix de nos produits sont indiqués en euros <strong>toutes taxes comprises (TTC)</strong>, incluant la TVA au taux en vigueur (actuellement 10% pour la restauration rapide à emporter).
          </p>
          <p>
            Les prix affichés sur le site sont ceux en vigueur au moment de la commande. Pizza Falchi se réserve le droit de modifier ses prix à tout moment, mais les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
          </p>
          <p className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <strong>Information TVA :</strong> Pizza Falchi est soumis au régime de TVA applicable aux auto-entrepreneurs. Le taux de TVA de 10% s'applique à la restauration sur place ou à emporter.
          </p>
          <p>
            Les frais de livraison, le cas échéant, sont indiqués avant la validation définitive de la commande.
          </p>
        </div>
      </section>

      <section id="paiement" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          6. Modalités de paiement
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Le règlement des commandes peut s'effectuer par les moyens suivants :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Espèces</strong> : paiement en liquide lors du retrait ou de la livraison</li>
            <li><strong>Carte bancaire</strong> : paiement par carte bancaire lors du retrait ou de la livraison</li>
            <li><strong>Paiement en ligne (bientôt disponible)</strong> : paiement sécurisé par carte bancaire via Stripe</li>
          </ul>
          <p>
            Le paiement est exigible immédiatement lors du retrait ou de la réception de la commande. Pour les paiements en ligne, le montant sera débité au moment de la validation de la commande.
          </p>
          <p className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
            <strong>Sécurité des paiements :</strong> Les paiements en ligne sont sécurisés par Stripe, conforme aux normes PCI-DSS. Pizza Falchi ne conserve aucune donnée bancaire.
          </p>
        </div>
      </section>

      <section id="retrait" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          7. Retrait et livraison
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
            7.1. Retrait sur place (Click & Collect)
          </h3>
          <p>
            Le retrait des commandes s'effectue à l'adresse suivante :
          </p>
          <div className="bg-cream/30 dark:bg-gray-700/30 p-6 rounded-lg">
            <p className="font-semibold">Pizza Falchi</p>
            <p>615, avenue de la Touloubre</p>
            <p>13540 Puyricard</p>
            <p className="mt-2">Horaires : Mardi au Dimanche de 18h00 à 21h30 (Fermé le lundi)</p>
          </div>
          <p>
            Le Client choisit un créneau horaire de retrait lors de la commande. Le temps de préparation estimé est de <strong>30 à 45 minutes</strong> selon l'affluence.
          </p>
          <p>
            Le Client s'engage à venir récupérer sa commande dans le créneau horaire choisi. En cas de retard supérieur à 15 minutes, Pizza Falchi ne peut garantir la qualité optimale des produits.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
            7.2. Livraison à domicile (Service à venir)
          </h3>
          <p>
            Le service de livraison à domicile sera prochainement disponible. Les modalités et zones de livraison seront communiquées ultérieurement.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
            7.3. Vérification de la commande
          </h3>
          <p>
            Le Client est invité à vérifier sa commande dès sa réception. Toute réclamation doit être formulée immédiatement, avant de quitter le point de retrait ou en présence du livreur.
          </p>
        </div>
      </section>

      <section id="retractation" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          8. Droit de rétractation
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
            <strong>⚠️ Information importante :</strong> Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation de 14 jours ne s'applique PAS aux produits alimentaires périssables.
          </p>
          <p>
            Les produits proposés par Pizza Falchi étant des denrées périssables (pizzas fraîches, produits alimentaires), <strong>aucun droit de rétractation ne peut être exercé</strong> une fois la commande validée et préparée.
          </p>
          <p>
            Cependant, en cas de problème de qualité, de non-conformité ou d'erreur dans la commande, le Client peut contacter Pizza Falchi dans les plus brefs délais pour trouver une solution amiable (échange, remboursement, avoir).
          </p>
        </div>
      </section>

      <section id="reclamations" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          9. Réclamations et litiges
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
            9.1. Service client
          </h3>
          <p>
            Pour toute réclamation, question ou information, le Client peut contacter le service client de Pizza Falchi :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Par email : <a href="mailto:pizzafalchipro@gmail.com" className="text-primary-red font-semibold hover:underline">pizzafalchipro@gmail.com</a></li>
            <li>Par téléphone : <a href="tel:+33442920308" className="text-primary-red font-semibold hover:underline">04 42 92 03 08</a></li>
            <li>Horaires : Mardi au Dimanche de 18h00 à 21h30</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
            9.2. Médiation de la consommation
          </h3>
          <p>
            Conformément à l'article L.612-1 du Code de la consommation, il est rappelé que tout consommateur a le droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d'un litige.
          </p>
          <p>
            En cas de litige non résolu, le Client peut saisir gratuitement le médiateur de la consommation dont relève Pizza Falchi ou utiliser la plateforme de règlement en ligne des litiges mise en place par la Commission Européenne :
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <p><strong>Plateforme européenne de règlement en ligne des litiges (RLL) :</strong></p>
            <a
              href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=FR"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-red font-semibold hover:underline break-all"
            >
              https://ec.europa.eu/consumers/odr
            </a>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
            9.3. Garanties légales
          </h3>
          <p>
            Le Client bénéficie des garanties légales suivantes :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Garantie légale de conformité (articles L.217-4 à L.217-14 du Code de la consommation)</li>
            <li>Garantie contre les vices cachés (articles 1641 à 1649 du Code civil)</li>
          </ul>
        </div>
      </section>

      <section id="donnees" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          10. Données personnelles
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Les informations collectées lors de la commande sont nécessaires au traitement et à la gestion de celle-ci. Elles sont destinées exclusivement à Pizza Falchi et ne sont jamais cédées à des tiers.
          </p>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, le Client dispose d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition concernant ses données personnelles.
          </p>
          <p>
            Pour plus d'informations et pour exercer vos droits, consultez notre{' '}
            <a href="/politique-confidentialite" className="text-primary-red font-semibold hover:underline">
              Politique de Confidentialité
            </a>
            {' '}ou contactez-nous à l'adresse : pizzafalchipro@gmail.com
          </p>
        </div>
      </section>

      <section id="loi" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          11. Loi applicable et juridiction compétente
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Les présentes CGV sont soumises au droit français. La langue du présent contrat est la langue française.
          </p>
          <p>
            En cas de litige et à défaut de solution amiable, le litige sera porté devant les tribunaux compétents conformément aux règles de droit commun.
          </p>
          <p>
            Pour les litiges avec un consommateur, les tribunaux compétents sont ceux du lieu de domicile du consommateur ou du lieu de livraison effective.
          </p>
        </div>
      </section>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-12">
        <div className="bg-cream/50 dark:bg-gray-700/50 p-6 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <strong>Version des CGV :</strong> 1.0
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <strong>Date d'entrée en vigueur :</strong> 7 novembre 2025
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            Pizza Falchi se réserve le droit de modifier les présentes CGV à tout moment. Les modifications s'appliqueront aux commandes passées après leur mise en ligne.
          </p>
        </div>
      </div>
    </LegalLayout>
  );
}
