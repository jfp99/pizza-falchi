// This file is used to register instrumentation for monitoring
// It runs once when the server starts
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

import { validateEnv } from './lib/env';

export async function register() {
  // Validate environment variables on startup
  try {
    validateEnv();
    console.log('✅ Environment variables validated successfully');
  } catch (error) {
    console.error('❌ Environment validation failed during startup');
    // Error will be logged by validateEnv()
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}
