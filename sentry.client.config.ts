// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
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

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Ignore common errors that aren't actionable
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    // Random plugins/extensions
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    // Facebook errors
    'fb_xd_fragment',
    // ISP "optimizing" proxy
    'bmi_SafeAddOnload',
    'EBCallBackMessageReceived',
    // Ignore network errors
    'NetworkError',
    'Network request failed',
    // Ignore ResizeObserver errors (common, not actionable)
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
  ],

  // Don't capture errors from these URLs
  denyUrls: [
    // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
    // Firefox extensions
    /^moz-extension:\/\//i,
  ],

  beforeSend(event, hint) {
    // Filter out errors from browser extensions
    if (event.exception) {
      const exception = event.exception.values?.[0];
      if (exception?.stacktrace?.frames) {
        const frames = exception.stacktrace.frames;
        if (frames.some(frame => frame.filename?.includes('extension://'))) {
          return null;
        }
      }
    }
    return event;
  },
  });
}
