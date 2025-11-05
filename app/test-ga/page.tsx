'use client';

import { useEffect, useState } from 'react';
import { event, GA_TRACKING_ID } from '@/lib/gtag';

export default function GATestPage() {
  const [gaLoaded, setGaLoaded] = useState(false);
  const [gtagAvailable, setGtagAvailable] = useState(false);

  useEffect(() => {
    // Check if GA script loaded
    const checkGA = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        setGtagAvailable(true);
        clearInterval(checkGA);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkGA);
      setGaLoaded(true);
    }, 5000);

    return () => clearInterval(checkGA);
  }, []);

  const testEvent = () => {
    event('test_button_click', {
      category: 'Test',
      label: 'GA Test Button',
      value: 1,
    });
    alert('Test event sent! Check GA4 Realtime > Events');
  };

  return (
    <div className="min-h-screen bg-warm-cream flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12">
        <h1 className="text-4xl font-black text-charcoal mb-8">
          Google Analytics Test Page
        </h1>

        <div className="space-y-6">
          {/* GA Configuration */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-charcoal mb-4">Configuration</h2>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">GA Tracking ID:</span>
                <span className="font-bold text-primary-red">
                  {GA_TRACKING_ID || 'NOT SET'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">gtag() Available:</span>
                <span
                  className={`font-bold ${
                    gtagAvailable ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {gtagAvailable ? '✓ YES' : '✗ NO'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check Complete:</span>
                <span
                  className={`font-bold ${
                    gaLoaded ? 'text-green-600' : 'text-yellow-600'
                  }`}
                >
                  {gaLoaded ? '✓ YES' : 'Checking...'}
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              How to Verify GA is Working
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>
                Open Google Analytics:{' '}
                <a
                  href="https://analytics.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline font-semibold"
                >
                  analytics.google.com
                </a>
              </li>
              <li>Select your "Pizza Falchi" property</li>
              <li>
                Go to <strong>Reports → Realtime</strong> (left sidebar)
              </li>
              <li>
                Click the <strong>Test Event Button</strong> below
              </li>
              <li>
                You should see the event appear in <strong>Realtime Events</strong>
              </li>
            </ol>
          </div>

          {/* Test Button */}
          <button
            onClick={testEvent}
            disabled={!gtagAvailable}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              gtagAvailable
                ? 'bg-gradient-to-r from-primary-red to-primary-yellow text-white hover:scale-105 hover:shadow-xl cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {gtagAvailable ? '🎉 Send Test Event' : '⏳ Waiting for GA to load...'}
          </button>

          {/* Troubleshooting */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-yellow-900 mb-4">
              Not Seeing Events?
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
              <li>
                <strong>Disable ad blockers</strong> (uBlock Origin, Privacy Badger,
                etc.)
              </li>
              <li>
                <strong>Try Incognito/Private browsing</strong> without extensions
              </li>
              <li>
                <strong>Check browser console</strong> (F12) for errors
              </li>
              <li>
                <strong>Test from production URL</strong> (not localhost)
              </li>
              <li>
                <strong>Wait 1-2 minutes</strong> for data to appear in Realtime
              </li>
              <li>
                <strong>Verify data collection is enabled</strong> in GA4 settings
              </li>
            </ul>
          </div>

          {/* Debug Info */}
          <details className="bg-gray-100 rounded-xl p-6">
            <summary className="font-bold text-charcoal cursor-pointer">
              🔍 Debug Information
            </summary>
            <pre className="mt-4 text-xs bg-white p-4 rounded border overflow-x-auto">
              {JSON.stringify(
                {
                  GA_TRACKING_ID,
                  gtagAvailable,
                  gaLoaded,
                  userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'N/A',
                  url: typeof window !== 'undefined' ? window.location.href : 'N/A',
                },
                null,
                2
              )}
            </pre>
          </details>

          <div className="text-center pt-4">
            <a
              href="/"
              className="text-primary-red underline font-semibold hover:text-primary-yellow transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
