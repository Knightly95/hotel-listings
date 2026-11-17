import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { locales } from '@/src/i18n';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hotel Finder',
  description: 'Find hotels on a map: filter, sort and browse in English or Spanish',
};

/** Pre-render one page per language, which a static export requires. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}
export default async function LocaleLayout({
  children,
  params: { locale },
}: Readonly<RootLayoutProps>) {
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
