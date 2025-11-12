import React from 'react';
import type { Metadata } from 'next';
import LegalLayout from '@/components/legal/LegalLayout';
import TableOfContents from '@/components/legal/TableOfContents';

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation (CGU)',
  description: 'Conditions générales d\'utilisation du site Pizza Falchi.',
  robots: { index: false, follow: true },
};

const toc = [
  { id: 'objet', title: '1. Objet', level: 2 },
  { id: 'acces', title: '2. Accès au site', level: 3 },
  { id: 'propriete', title: '3. Propriété intellectuelle', level: 2 },
  { id: 'utilisation', title: '4. Utilisation du site', level: 2 },
  { id: 'responsabilite', title: '5. Responsabilité', level: 2 },
  { id: 'liens', title: '6. Liens hypertextes', level: 2 },
  { id: 'modification', title: '7. Modification des CGU', level: 2 },
];

export default function ConditionsGeneralesUtilisation() {
  return (
    <LegalLayout title="Conditions Générales d'Utilisation" lastUpdated="7 novembre 2025" breadcrumbs={[{ label: 'CGU', href: '/conditions-generales-utilisation' }]}>
      <TableOfContents items={toc} />

      <section id="objet" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">1. Objet</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>Les présentes Conditions Générales d'Utilisation (« CGU ») définissent les règles d'utilisation du site internet www.pizzafalchi.com édité par Pizza Falchi.</p>
          <p>L'accès et l'utilisation du site impliquent l'acceptation pleine et entière des présentes CGU. Tout utilisateur qui ne souhaite pas accepter ces conditions doit s'abstenir d'utiliser le site.</p>
        </div>
      </section>

      <section id="acces" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">2. Accès au site</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>Le site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. Les frais de connexion et d'équipement nécessaires sont à la charge de l'utilisateur.</p>
          <p>Pizza Falchi se réserve le droit de suspendre, interrompre ou limiter l'accès au site, notamment pour des raisons de maintenance, de mise à jour ou pour toute autre raison technique, sans préavis ni indemnité.</p>
          <p className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg"><strong>Disponibilité :</strong> Nous mettons tout en œuvre pour assurer la disponibilité du site 24h/24 et 7j/7, mais ne garantissons pas une accessibilité continue et sans interruption.</p>
        </div>
      </section>

      <section id="propriete" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">3. Propriété intellectuelle</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>L'ensemble des éléments du site (structure, textes, logos, images, vidéos, sons, bases de données, logiciels) sont protégés par le droit d'auteur, le droit des marques et le droit des bases de données.</p>
          <p>Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit, est interdite sans l'autorisation écrite préalable de Pizza Falchi.</p>
          <p><strong>Utilisation autorisée :</strong> L'utilisateur est autorisé à consulter le site et à imprimer des copies à des fins strictement personnelles et non commerciales.</p>
        </div>
      </section>

      <section id="utilisation" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">4. Utilisation du site</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>L'utilisateur s'engage à utiliser le site de manière loyale et conformément à sa destination. Il est notamment interdit de :</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Porter atteinte aux droits de propriété intellectuelle de Pizza Falchi</li>
            <li>Utiliser le site à des fins illégales ou non autorisées</li>
            <li>Tenter d'accéder aux zones protégées du site sans autorisation</li>
            <li>Transmettre des virus, malwares ou tout code malveillant</li>
            <li>Collecter des données personnelles d'autres utilisateurs</li>
            <li>Usurper l'identité d'autrui ou falsifier des informations</li>
            <li>Perturber le bon fonctionnement du site</li>
          </ul>
          <p className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg mt-4"><strong>⚠️ Sanctions :</strong> Tout manquement à ces règles peut entraîner la suspension immédiate de l'accès au site et des poursuites judiciaires.</p>
        </div>
      </section>

      <section id="responsabilite" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">5. Responsabilité</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.1. Contenu du site</h3>
          <p>Pizza Falchi s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site, mais ne peut garantir l'exactitude, la précision ou l'exhaustivité de ces informations.</p>
          <p>Les informations présentes sur le site sont fournies à titre indicatif et peuvent être modifiées à tout moment sans préavis.</p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.2. Limitation de responsabilité</h3>
          <p>Pizza Falchi ne saurait être tenu responsable :</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Des interruptions ou dysfonctionnements techniques du site</li>
            <li>De l'impossibilité d'accéder au site ou de la lenteur de chargement</li>
            <li>Des dommages directs ou indirects résultant de l'utilisation du site</li>
            <li>Du contenu des sites tiers accessibles via des liens hypertextes</li>
            <li>De la perte de données ou d'informations</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.3. Force majeure</h3>
          <p>Pizza Falchi ne pourra être tenu responsable en cas de force majeure ou d'événement hors de son contrôle (panne réseau, interruption électrique, cyberattaque, catastrophe naturelle, etc.).</p>
        </div>
      </section>

      <section id="liens" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">6. Liens hypertextes</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>Le site peut contenir des liens vers d'autres sites internet. Pizza Falchi n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur disponibilité ou leur politique de confidentialité.</p>
          <p>La création de liens vers le site www.pizzafalchi.com nécessite l'autorisation écrite préalable de Pizza Falchi, sauf pour les liens simples vers la page d'accueil.</p>
        </div>
      </section>

      <section id="modification" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">7. Modification des CGU et droit applicable</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>Pizza Falchi se réserve le droit de modifier à tout moment les présentes CGU. Les modifications entrent en vigueur dès leur publication en ligne. Il est conseillé de consulter régulièrement cette page.</p>
          <p className="mt-6"><strong>Droit applicable :</strong> Les présentes CGU sont régies par le droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.</p>
        </div>
      </section>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-12">
        <p className="text-sm text-gray-600 dark:text-gray-400">Pour toute question concernant les CGU, contactez-nous : <a href="mailto:pizzafalchipro@gmail.com" className="text-primary-red hover:underline">pizzafalchipro@gmail.com</a></p>
      </div>
    </LegalLayout>
  );
}
