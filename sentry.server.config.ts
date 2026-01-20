// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only initialize Sentry if a valid DSN is provided
const isValidDsn = dsn && dsn.startsWith('https://') && dsn.includes('.sentry.io');

if (isValidDsn) {
  Sentry.init({
    dsn,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Ignore common errors that aren't actionable
  ignoreErrors: [
    // MongoDB connection errors (already handled)
    'MongooseError',
    // Expected API errors
    'NotFoundError',
    'ValidationError',
  ],

  beforeSend(event, hint) {
    // Don't send errors for rate limiting (expected behavior)
    if (event.exception) {
      const exception = event.exception.values?.[0];
      if (exception?.value?.includes('Rate limit exceeded')) {
        return null;
      }
    }
    return event;
  },
  });
}
