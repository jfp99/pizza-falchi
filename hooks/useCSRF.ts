/**
 * CSRF Token Hook
 *
 * Provides CSRF token management for client-side API calls
 */

import { useEffect, useState } from 'react';

interface UseCSRFReturn {
  token: string | null;
  loading: boolean;
  error: string | null;
  refreshToken: () => Promise<void>;
  getHeaders: () => Record<string, string>;
}

export function useCSRF(): UseCSRFReturn {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/csrf', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
      }

      const data = await response.json();
      setToken(data.token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching CSRF token:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  const refreshToken = async () => {
    await fetchToken();
  };

  const getHeaders = (): Record<string, string> => {
    if (!token) {
      return {};
    }

    return {
      'X-CSRF-Token': token,
    };
  };

  return {
    token,
    loading,
    error,
    refreshToken,
    getHeaders,
  };
}

/**
 * Utility function to add CSRF token to fetch options
 */
export function withCSRF(
  token: string | null,
  options: RequestInit = {}
): RequestInit {
  if (!token) {
    return options;
  }

  return {
    ...options,
    headers: {
      ...options.headers,
      'X-CSRF-Token': token,
    },
  };
}
