import React from 'react';
import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import en from '@/messages/en.json';
import es from '@/messages/es.json';
import useHotels from '@/src/store/hotelStore';
import fetchDataResponse from '@/mocks/fetchDataResponse';

const initialState = useHotels.getState();

/** Puts the store back to its first state, optionally with hotels already loaded. */
export function resetStore(loaded = false) {
  useHotels.setState(initialState, true);
  if (loaded) {
    useHotels.setState({ hotels: fetchDataResponse, status: 'ready' });
    useHotels.getState().filterAndSortHotels();
  }
}

export function renderWithIntl(ui: React.ReactElement, locale: 'en' | 'es' = 'en') {
  return render(
    <NextIntlClientProvider locale={locale} messages={locale === 'en' ? en : es}>
      {ui}
    </NextIntlClientProvider>
  );
}
