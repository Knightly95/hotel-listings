'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import AppHeader from '@/src/components/layout/AppHeader';
import FilterBar from '@/src/components/FilterBar';
import HotelList from '@/src/components/HotelList';
import HotelDialog from '@/src/components/HotelDialog';
import MapView from '@/src/components/MapView';
import { ListIcon, MapIcon } from '@/src/components/icons';
import useHotels from '@/src/store/hotelStore';

/**
 * The search page: filters and results on the left, the map on the right.
 * On small screens one of the two is shown at a time, with a button to switch.
 */
const Search = () => {
  const t = useTranslations();
  const fetchHotelsData = useHotels((state) => state.fetchHotelsData);
  const mobileView = useHotels((state) => state.mobileView);
  const setMobileView = useHotels((state) => state.setMobileView);

  useEffect(() => {
    fetchHotelsData();
  }, [fetchHotelsData]);

  return (
    <div className="flex h-dvh flex-col bg-slate-50 text-slate-900">
      <AppHeader />

      <main className="relative grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(420px,46%)]">
        <div
          className={`min-h-0 overflow-y-auto ${mobileView === 'map' ? 'hidden lg:block' : ''}`}
          data-testid="results-panel"
        >
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/90 px-4 py-3 backdrop-blur lg:px-6">
            <FilterBar />
          </div>
          <div className="@container px-4 pb-24 pt-5 lg:px-6 lg:pb-8">
            <HotelList />
            <p className="mt-8 text-center text-xs text-slate-500">
              {t('demo-footer')}
            </p>
          </div>
        </div>

        <div
          className={`min-h-0 border-slate-200 lg:block lg:border-l ${mobileView === 'list' ? 'hidden' : ''}`}
          data-testid="map-panel"
        >
          <MapView />
        </div>

        <button
          type="button"
          onClick={() => setMobileView(mobileView === 'list' ? 'map' : 'list')}
          className="fixed bottom-10 left-1/2 z-30 inline-flex h-12 -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white shadow-xl shadow-slate-900/25 transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 motion-reduce:transition-none lg:hidden"
        >
          {mobileView === 'list' ? (
            <>
              <MapIcon className="size-4" />
              {t('show-map')}
            </>
          ) : (
            <>
              <ListIcon className="size-4" />
              {t('show-list')}
            </>
          )}
        </button>
      </main>

      <HotelDialog />
    </div>
  );
};

export default Search;
