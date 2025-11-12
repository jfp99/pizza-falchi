/**
 * Environment Variable Validation
 *
 * Validates required environment variables at runtime to fail fast
 * if critical configuration is missing.
 */

import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
  // Database
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL').optional(),

  // Stripe (optional for development, required for production)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),

  // Email (optional)
  RESEND_API_KEY: z.string().optional(),

  // Sentry (optional)
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // Google Analytics (optional)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Additional production-specific validations
const productionEnvSchema = envSchema.extend({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'Stripe publishable key required in production'),
  STRIPE_SECRET_KEY: z.string().min(1, 'Stripe secret key required in production'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL required in production'),
});

type EnvVariables = z.infer<typeof envSchema>;

/**
 * Validates environment variables and throws if validation fails
 */
export function validateEnv(): EnvVariables {
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    const schema = isProduction ? productionEnvSchema : envSchema;

    const env = schema.parse({
      MONGODB_URI: process.env.MONGODB_URI,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
      SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
      NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      NODE_ENV: process.env.NODE_ENV,
    });

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(err => `  - ${err.path.join('.')}: ${err.message}`).join('\n');

      console.error('❌ Environment validation failed:\n' + missingVars);

      if (isProduction) {
        throw new Error('Critical environment variables are missing in production. Cannot start application.');
      } else {
        console.warn('⚠️  Some environment variables are missing. Application may not function correctly.');
      }
    }
    throw error;
  }
}

/**
 * Get a validated environment variable
 * Use this instead of process.env to ensure type safety
 */
export function getEnv<K extends keyof EnvVariables>(key: K): EnvVariables[K] {
  const env = validateEnv();
  return env[key];
}

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && process.env.STRIPE_SECRET_KEY);
}

/**
 * Check if email is configured
 */
export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

/**
 * Check if Sentry is configured
 */
export function isSentryConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SENTRY_DSN;
}

/**
 * Check if Google Analytics is configured
 */
export function isAnalyticsConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
}

// Export validated env for use throughout the app
export const env = validateEnv();
