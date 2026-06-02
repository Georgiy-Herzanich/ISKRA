import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { site } from '@/lib/site';
import '../globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap'
});

const body = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap'
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

const ogLocaleMap: Record<Locale, string> = {
  sk: 'sk_SK',
  uk: 'uk_UA',
  en: 'en_US'
};

function pathFor(locale: Locale) {
  return locale === routing.defaultLocale ? '/' : `/${locale}`;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: 'meta' });

  return {
    metadataBase: new URL(site.url),
    title: t('title'),
    description: t('description'),
    applicationName: site.name,
    alternates: {
      canonical: pathFor(safeLocale),
      languages: {
        sk: '/',
        uk: '/uk',
        en: '/en',
        'x-default': '/'
      }
    },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: t('title'),
      description: t('description'),
      url: pathFor(safeLocale),
      locale: ogLocaleMap[safeLocale],
      images: [{ url: '/media/after.jpg', alt: t('ogAlt') }]
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/media/after.jpg']
    },
    robots: { index: true, follow: true }
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'meta' });
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    description: t('description'),
    url: site.url,
    image: `${site.url}/media/after.jpg`,
    email: site.email,
    telephone: site.phoneDisplay,
    priceRange: '€€'
  };

  return (
    <html lang={locale} className={`${display.variable} ${body.variable}`}>
      <head>
        <script
          // Mirrors the original inline script: enables reveal animations only
          // when JS is available, preventing a flash of hidden content.
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');"
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
