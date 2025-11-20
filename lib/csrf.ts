/**
 * CSRF Protection Implementation
 *
 * Provides CSRF token generation, validation, and management
 * for protecting state-changing API routes (POST, PUT, DELETE)
 */

import { randomBytes } from 'crypto';

interface CSRFToken {
  token: string;
  expiresAt: number;
}

// In-memory token storage (use Redis in production for multi-instance deployments)
const tokenStore = new Map<string, CSRFToken>();

// Token expiration time (15 minutes)
const TOKEN_EXPIRATION_MS = 15 * 60 * 1000;

// Cleanup interval (5 minutes)
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Generate a new CSRF token
 */
export function generateCSRFToken(): string {
  const token = randomBytes(32).toString('hex');

  tokenStore.set(token, {
    token,
    expiresAt: Date.now() + TOKEN_EXPIRATION_MS,
  });

  return token;
}

/**
 * Validate a CSRF token
 * @param oneTimeUse - If true, token is deleted after validation (default: false for better UX)
 */
export function validateCSRFToken(token: string | null | undefined, oneTimeUse: boolean = false): boolean {
  if (!token) {
    return false;
  }

  const storedToken = tokenStore.get(token);

  if (!storedToken) {
    return false;
  }

  // Check if token has expired
  if (Date.now() > storedToken.expiresAt) {
    tokenStore.delete(token);
    return false;
  }

  // Token is valid - optionally remove it (one-time use)
  // For better UX in admin interfaces, we allow reuse within validity period
  if (oneTimeUse) {
    tokenStore.delete(token);
  }

  return true;
}

/**
 * Cleanup expired tokens
 * Should be called periodically
 */
export function cleanupExpiredTokens(): void {
  const now = Date.now();

  for (const [token, data] of tokenStore.entries()) {
    if (now > data.expiresAt) {
      tokenStore.delete(token);
    }
  }
}

/**
 * Get CSRF token from request headers or body
 */
export function getCSRFTokenFromRequest(
  headers: Headers,
  body?: any
): string | null {
  // Check X-CSRF-Token header first
  const headerToken = headers.get('X-CSRF-Token');
  if (headerToken) {
    return headerToken;
  }

  // Check request body
  if (body && typeof body === 'object' && body._csrf) {
    return body._csrf;
  }

  return null;
}

/**
 * Middleware to validate CSRF token on API routes
 * Use this for all POST, PUT, DELETE endpoints
 */
export async function validateCSRFMiddleware(
  request: Request
): Promise<{ valid: boolean; error?: string }> {
  const method = request.method;

  // Only validate state-changing methods
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return { valid: true };
  }

  // Get token from headers
  const token = request.headers.get('X-CSRF-Token');

  if (!token) {
    return {
      valid: false,
      error: 'CSRF token missing. Please refresh the page and try again.',
    };
  }

  const isValid = validateCSRFToken(token);

  if (!isValid) {
    return {
      valid: false,
      error: 'Invalid or expired CSRF token. Please refresh the page and try again.',
    };
  }

  return { valid: true };
}

/**
 * Start periodic cleanup of expired tokens
 */
if (typeof window === 'undefined') {
  // Only run cleanup on server side
  setInterval(cleanupExpiredTokens, CLEANUP_INTERVAL_MS);
}

/**
 * Get token count (for debugging/monitoring)
 */
export function getTokenCount(): number {
  return tokenStore.size;
}
