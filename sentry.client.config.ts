import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://<PUBLIC_KEY>@o<ORG_ID>.ingest.sentry.io/<PROJECT_ID>', // Remplace par ton DSN Sentry
  tracesSampleRate: 1.0,
}); 