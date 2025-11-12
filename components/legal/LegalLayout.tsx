'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Calendar } from 'lucide-react';

interface LegalLayoutProps {
  children: ReactNode;
  title: string;
  lastUpdated: string;
  breadcrumbs?: { label: string; href: string }[];
}

const LegalLayout: React.FC<LegalLayoutProps> = ({
  children,
  title,
  lastUpdated,
  breadcrumbs = [],
}) => {
  return (
    <div className="min-h-screen bg-warm-cream dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm mb-8" aria-label="Breadcrumb">
          <Link
            href="/"
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-red dark:hover:text-primary-red-light transition-colors"
            aria-label="Retour à l'accueil"
          >
            <Home className="w-4 h-4" />
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              <Link
                href={crumb.href}
                className="text-gray-600 dark:text-gray-400 hover:text-primary-red dark:hover:text-primary-red-light transition-colors"
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          <span className="text-gray-900 dark:text-gray-100 font-medium">{title}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h1>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Dernière mise à jour : {lastUpdated}</span>
          </div>
        </header>

        {/* Content */}
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg dark:prose-invert max-w-none legal-content">
            {children}
          </div>
        </article>

        {/* Back to top button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center text-primary-red dark:text-primary-red-light hover:underline"
            aria-label="Retour en haut de la page"
          >
            Retour en haut
          </button>
        </div>

        {/* Print styles */}
        <style jsx global>{`
          @media print {
            .legal-content {
              font-size: 12pt;
              line-height: 1.5;
              color: #000;
            }

            .legal-content h1 {
              font-size: 18pt;
              margin-top: 0;
              page-break-after: avoid;
            }

            .legal-content h2 {
              font-size: 16pt;
              margin-top: 12pt;
              page-break-after: avoid;
            }

            .legal-content h3 {
              font-size: 14pt;
              page-break-after: avoid;
            }

            .legal-content p, .legal-content ul, .legal-content ol {
              page-break-inside: avoid;
            }

            nav, button {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LegalLayout;
