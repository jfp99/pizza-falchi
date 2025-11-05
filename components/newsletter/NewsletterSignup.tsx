'use client';

import { useState, FormEvent } from 'react';
import { Mail, Check, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface NewsletterSignupProps {
  source?: string;
  variant?: 'default' | 'compact' | 'inline';
  showTitle?: boolean;
  className?: string;
}

export default function NewsletterSignup({
  source = 'footer',
  variant = 'default',
  showTitle = true,
  className = '',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || undefined,
          source,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setEmail('');
      setName('');

      toast.success(
        data.isNew
          ? 'Merci ! Vous êtes inscrit à notre newsletter.'
          : 'Vous êtes déjà inscrit à notre newsletter.',
        { duration: 5000 }
      );

      // Reset success state after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      setErrorMessage(message);
      toast.error(message);

      // Reset error state after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  // Compact variant for inline use (e.g., checkout page)
  if (variant === 'compact') {
    return (
      <div className={`bg-warm-cream/50 dark:bg-gray-800/50 rounded-xl p-4 transition-colors duration-300 ${className}`}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              required
              disabled={status === 'loading' || status === 'success'}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-medium dark:border-border-medium bg-surface dark:bg-surface text-text-primary dark:text-text-primary placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-red focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-300"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-4 py-2 bg-gradient-to-r from-primary-red to-soft-red text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
          >
            {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
            {status === 'success' && <Check className="w-4 h-4" />}
            {status !== 'loading' && status !== 'success' && 'S\'inscrire'}
            {status === 'loading' && 'En cours...'}
            {status === 'success' && 'Inscrit !'}
          </button>
        </form>
      </div>
    );
  }

  // Inline variant for single-line layout
  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            required
            disabled={status === 'loading' || status === 'success'}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-medium dark:border-border-medium bg-surface dark:bg-surface text-text-primary dark:text-text-primary placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-red focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-300"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="px-6 py-3 bg-gradient-to-r from-primary-red to-soft-red text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap flex items-center justify-center gap-2"
        >
          {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
          {status === 'success' && <Check className="w-5 h-5" />}
          {status !== 'loading' && status !== 'success' && 'S\'inscrire'}
          {status === 'loading' && 'En cours...'}
          {status === 'success' && 'Inscrit !'}
        </button>
      </form>
    );
  }

  // Default variant for footer
  return (
    <div className={className}>
      {showTitle && (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-text-primary dark:text-text-primary mb-2 transition-colors duration-300">Newsletter</h3>
          <p className="text-text-secondary dark:text-text-secondary transition-colors duration-300">
            Recevez nos promotions exclusives et nos nouvelles pizzas en avant-première !
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name field (optional) */}
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom (optionnel)"
            disabled={status === 'loading' || status === 'success'}
            className="w-full px-4 py-3 rounded-lg border border-border-medium dark:border-border-medium bg-surface dark:bg-surface text-text-primary dark:text-text-primary placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-red focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-300"
          />
        </div>

        {/* Email field */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email *"
            required
            disabled={status === 'loading' || status === 'success'}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-medium dark:border-border-medium bg-surface dark:bg-surface text-text-primary dark:text-text-primary placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-red focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-300"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="w-full px-6 py-3 bg-gradient-to-r from-primary-red to-soft-red text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {status === 'loading' && (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Inscription en cours...</span>
            </>
          )}
          {status === 'success' && (
            <>
              <Check className="w-5 h-5" />
              <span>Inscrit avec succès !</span>
            </>
          )}
          {status === 'error' && (
            <>
              <AlertCircle className="w-5 h-5" />
              <span>Réessayer</span>
            </>
          )}
          {status === 'idle' && <span>S'inscrire à la newsletter</span>}
        </button>

        {/* Error message */}
        {status === 'error' && errorMessage && (
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800 transition-colors duration-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Privacy notice */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">
          En vous inscrivant, vous acceptez de recevoir nos emails promotionnels.
          Vous pouvez vous désinscrire à tout moment.
        </p>
      </form>
    </div>
  );
}
