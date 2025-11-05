import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting
// Note: In production with multiple instances, use Redis or similar
const store: RateLimitStore = {};

// Clean up old entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

/**
 * Creates a rate limiter middleware function
 * @param config - Configuration for the rate limiter
 * @returns Middleware function that returns null if allowed, or NextResponse with 429 if rate limited
 */
export const createRateLimiter = (config: RateLimitConfig) => {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    // Get client identifier (IP address or forwarded IP)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const now = Date.now();
    const key = `${ip}:${request.nextUrl.pathname}`;

    // If no entry exists or the window has passed, create new entry
    if (!store[key] || now > store[key].resetTime) {
      store[key] = {
        count: 1,
        resetTime: now + config.windowMs,
      };
      return null; // Allow request
    }

    // Increment request count
    store[key].count++;

    // Check if limit exceeded
    if (store[key].count > config.maxRequests) {
      const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);

      return NextResponse.json(
        {
          error: 'Trop de requêtes. Veuillez réessayer plus tard.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(config.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(store[key].resetTime),
          },
        }
      );
    }

    // Request allowed, add rate limit headers
    const remaining = config.maxRequests - store[key].count;
    return null; // Allow request (headers can be added in middleware if needed)
  };
};

/**
 * Strict rate limiter for authentication endpoints
 * 5 attempts per 15 minutes
 */
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});

/**
 * General API rate limiter
 * 30 requests per minute
 */
export const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
});

/**
 * Strict rate limiter for order creation
 * 10 orders per hour per user
 */
export const orderLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10,
});

/**
 * Lenient rate limiter for read-only operations
 * 60 requests per minute
 */
export const readLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60,
});

/**
 * Rate limiter for write operations
 * 20 requests per minute
 */
export const writeLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20,
});
