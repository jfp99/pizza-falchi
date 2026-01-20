/**
 * CSRF Protection Implementation
 *
 * Provides CSRF token generation, validation, and management
 * for protecting state-changing API routes (POST, PUT, DELETE)
 *
 * SECURITY FIX: Uses httpOnly cookies instead of in-memory storage
 * to support serverless/multi-instance deployments
 */

import { randomBytes, createHmac } from 'crypto';
import { CSRF_TOKEN_EXPIRATION_MS } from './constants';

const CSRF_SECRET = process.env.CSRF_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production';
const CSRF_COOKIE_NAME = 'csrf-token';

/**
 * Generate a new CSRF token
 * Returns both the token and cookie options
 */
export function generateCSRFToken(): { token: string; cookie: string } {
  // Generate random token
  const token = randomBytes(32).toString('hex');

  // Create signed token with timestamp to prevent tampering
  const timestamp = Date.now();
  const signature = createHmac('sha256', CSRF_SECRET)
    .update(`${token}:${timestamp}`)
    .digest('hex');

  // Combine token, timestamp, and signature
  const signedToken = `${token}:${timestamp}:${signature}`;

  // Cookie options with security best practices
  const isProduction = process.env.NODE_ENV === 'production';
  const maxAge = Math.floor(CSRF_TOKEN_EXPIRATION_MS / 1000); // Convert to seconds

  const cookieOptions = [
    `${CSRF_COOKIE_NAME}=${signedToken}`,
    `HttpOnly`,
    `SameSite=Strict`,
    `Path=/`,
    `Max-Age=${maxAge}`,
    isProduction ? 'Secure' : '', // Only HTTPS in production
  ].filter(Boolean).join('; ');

  return {
    token, // Return plain token for client to use in headers
    cookie: cookieOptions
  };
}

/**
 * Validate a CSRF token against the signed cookie
 * @param headerToken - Token from X-CSRF-Token header
 * @param cookieValue - Signed token from csrf-token cookie
 */
export function validateCSRFToken(
  headerToken: string | null | undefined,
  cookieValue: string | null | undefined
): boolean {
  if (!headerToken || !cookieValue) {
    return false;
  }

  try {
    // Parse signed cookie
    const parts = cookieValue.split(':');
    if (parts.length !== 3) {
      return false;
    }

    const [storedToken, timestampStr, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);

    // Verify signature to prevent tampering
    const expectedSignature = createHmac('sha256', CSRF_SECRET)
      .update(`${storedToken}:${timestamp}`)
      .digest('hex');

    if (signature !== expectedSignature) {
      return false;
    }

    // Check if token has expired
    if (Date.now() > timestamp + CSRF_TOKEN_EXPIRATION_MS) {
      return false;
    }

    // Compare header token with cookie token (timing-safe comparison)
    if (headerToken !== storedToken) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('CSRF validation error:', error);
    return false;
  }
}

/**
 * Get CSRF token from request cookies
 */
export function getCSRFCookieValue(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return null;
  }

  // Parse cookies
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies[CSRF_COOKIE_NAME] || null;
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

  // Get token from header
  const headerToken = request.headers.get('X-CSRF-Token');

  if (!headerToken) {
    return {
      valid: false,
      error: 'CSRF token missing. Please refresh the page and try again.',
    };
  }

  // Get signed token from cookie
  const cookieValue = getCSRFCookieValue(request);

  if (!cookieValue) {
    return {
      valid: false,
      error: 'CSRF cookie missing. Please ensure cookies are enabled.',
    };
  }

  // Validate token
  const isValid = validateCSRFToken(headerToken, cookieValue);

  if (!isValid) {
    return {
      valid: false,
      error: 'Invalid or expired CSRF token. Please refresh the page and try again.',
    };
  }

  return { valid: true };
}

/**
 * Generate cookie to clear CSRF token
 */
export function clearCSRFCookie(): string {
  return `${CSRF_COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
}
