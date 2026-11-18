import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { locales } from '@/src/i18n';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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

export async function generateMetadata({
  params: { locale },
}: Omit<RootLayoutProps, 'children'>): Promise<Metadata> {
  const t = await getTranslations({ locale });
  return {
    title: t('meta-title'),
    description: t('meta-description'),
  };
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: Readonly<RootLayoutProps>) {
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
