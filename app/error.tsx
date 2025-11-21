'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to Sentry with additional context
    Sentry.captureException(error, {
      tags: {
        errorBoundary: 'root',
      },
      contexts: {
        errorInfo: {
          digest: error.digest,
          message: error.message,
        },
      },
    });

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application error:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-red-lighter via-warm-cream to-soft-yellow-lighter flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="bg-primary-red/10 rounded-full p-8">
              <AlertTriangle className="w-24 h-24 text-primary-red animate-pulse" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
          Oups! Quelque chose a mal tourné
        </h1>

        <p className="text-xl text-gray-700 mb-4 max-w-md mx-auto">
          Notre four à pizza a rencontré un problème inattendu...
        </p>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left max-w-lg mx-auto">
            <p className="text-sm text-red-800 font-mono break-words">
              <strong>Erreur:</strong> {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="btn-primary inline-flex items-center gap-2 group"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-200" />
            Réessayer
          </button>

          <Link
            href="/"
            className="bg-primary-yellow text-charcoal px-8 py-4 rounded-full font-bold hover:bg-primary-yellow-dark transition-all duration-200 inline-flex items-center gap-2 group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Retour à l&apos;accueil
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-gray-600 mb-4">
            Le problème persiste? Contactez-nous:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a
              href="tel:+33442920308"
              className="text-primary-red hover:underline font-semibold"
            >
              📞 04 42 92 03 08
            </a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <Link
              href="/contact"
              className="text-primary-red hover:underline font-semibold"
            >
              📧 Formulaire de contact
            </Link>
          </div>
        </div>

        {/* Reassurance Message */}
        <div className="mt-8 p-4 bg-white/50 rounded-lg max-w-md mx-auto">
          <p className="text-sm text-gray-600">
            Nos équipes sont automatiquement informées de ce problème
            et travaillent à le résoudre rapidement.
          </p>
        </div>
      </div>
    </div>
  );
}
