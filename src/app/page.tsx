'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { defaultLocale, locales } from '@/src/i18n';

/**
 * Sends the visitor to the page in their language. This runs in the browser,
 * so it also works when the site is a static export with no server.
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const preferred = navigator.language.slice(0, 2);
    const locale = (locales as readonly string[]).includes(preferred)
      ? preferred
      : defaultLocale;
    router.replace(`/${locale}`);
  }, [router]);

  return (
    <html lang={defaultLocale}>
      <body />
    </html>
  );
}
