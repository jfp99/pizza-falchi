// This file is used to register instrumentation for monitoring
// It runs once when the server starts
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

import { validateEnv } from './lib/env';

export async function register() {
  // Validate environment variables on startup
  // Skip validation in serverless to avoid crashes during cold starts
  if (process.env.NEXT_RUNTIME !== 'nodejs' && process.env.NEXT_RUNTIME !== 'edge') {
    console.log('⏭️  Skipping env validation in non-runtime context');
    return;
  }

  try {
    validateEnv();
    console.log('✅ Environment variables validated successfully');
  } catch (error) {
    console.error('❌ Environment validation failed during startup');
    // Don't throw in production to prevent crashes
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}
