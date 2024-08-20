// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { BrowserTracing } from '@sentry/tracing';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const PRODUCT_ENV = process.env.PRODUCT_ENV || process.env.NEXT_PUBLIC_PRODUCT_ENV || 'production';

Sentry.init({
  dsn:
    SENTRY_DSN ||
    'https://4921197f143ab8bf7c9628c412eca1d1@o1163674.ingest.us.sentry.io/4507802005667840',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.01,
  environment: PRODUCT_ENV,
  integrations: [
    new BrowserTracing({
      startTransactionOnLocationChange: false,
    }),
  ],
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
