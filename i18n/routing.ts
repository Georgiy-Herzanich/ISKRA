import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['sk', 'uk', 'en'],
  defaultLocale: 'sk',
  localePrefix: 'as-needed',
  // Always serve Slovak at "/"; don't switch based on the browser's
  // Accept-Language. Visitors choose other languages via the switcher.
  localeDetection: false
});

export type Locale = (typeof routing.locales)[number];
