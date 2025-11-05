'use client';

import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Displays a fallback UI instead of crashing the whole app
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // TODO: Log to error reporting service (Sentry, LogRocket, etc.)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-warm-cream flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-2xl w-full shadow-2xl border-2 border-gray-100">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <AlertCircle className="w-16 h-16 text-red-600" aria-hidden="true" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-4">
              Oups ! Une erreur est survenue
            </h1>
            <p className="text-lg text-gray-600 text-center mb-8">
              Quelque chose s'est mal passé. Nous nous excusons pour la gêne occasionnée.
            </p>

            {/* Error Details (development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 overflow-auto">
                <p className="font-mono text-sm text-red-800 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-red to-primary-yellow text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg"
              >
                <RefreshCw className="w-5 h-5" aria-hidden="true" />
                <span>Réessayer</span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-4 rounded-2xl font-bold transition-colors"
              >
                <Home className="w-5 h-5" aria-hidden="true" />
                <span>Retour à l'accueil</span>
              </Link>
            </div>

            {/* Support Message */}
            <p className="text-sm text-gray-500 text-center mt-8">
              Si le problème persiste, contactez-nous au{' '}
              <a href="tel:+33442920308" className="text-primary-red font-semibold hover:underline">
                04 42 92 03 08
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
