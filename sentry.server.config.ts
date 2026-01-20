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
    tracesSampleRate: 1.0,
    debug: false,
    ignoreErrors: [
      'MongooseError',
      'NotFoundError',
      'ValidationError',
    ],
    beforeSend(event) {
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
