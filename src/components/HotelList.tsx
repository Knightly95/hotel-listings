'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import useHotels, { SORT_ORDERS, countActiveFilters } from '@/src/store/hotelStore';
import HotelCard from './HotelCard';
import { ChevronDownIcon, MapIcon, ResetIcon } from './icons';

/** Columns follow the width of the list, not of the window: the map takes part of it. */
const GRID = 'grid grid-cols-1 gap-5 @xl:grid-cols-2 @5xl:grid-cols-3';

/** Number of results, sort order, the cards, and the states around them. */
const HotelList: React.FC = () => {
  const t = useTranslations();
  const status = useHotels((state) => state.status);
  const filteredHotels = useHotels((state) => state.filteredHotels);
  const paginatedHotels = useHotels((state) => state.paginatedHotels);
  const hasMore = useHotels((state) => state.hasMore);
  const handleLoadMore = useHotels((state) => state.handleLoadMore);
  const sortOrder = useHotels((state) => state.sortOrder);
  const handleSortChange = useHotels((state) => state.handleSortChange);
  const fetchHotelsData = useHotels((state) => state.fetchHotelsData);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Load the next page when the end of the list scrolls into view.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) handleLoadMore();
      },
      { rootMargin: '400px 0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, paginatedHotels.length, handleLoadMore]);

  return (
    <section aria-labelledby="results-heading" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="results-heading"
          className="text-lg font-semibold tracking-tight text-slate-900"
          aria-live="polite"
        >
          {status === 'loading'
            ? t('loading-hotels')
            : t('results-count', { count: filteredHotels.length })}
        </h2>
        <div className="relative">
          <label htmlFor="sort" className="sr-only">
            {t('sort-by')}
          </label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(event) => handleSortChange(event.target.value)}
            className="h-9 appearance-none rounded-full border border-slate-200 bg-white pl-4 pr-9 text-sm font-medium text-slate-700 transition hover:border-slate-400 focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-600/15"
          >
            {SORT_ORDERS.map((order) => (
              <option key={order} value={order}>
                {t(`sort.${order}`)}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      {status === 'loading' && <LoadingCards />}
      {status === 'error' && (
        <EmptyState
          title={t('error-title')}
          text={t('error-text')}
          action={
            <button type="button" onClick={() => fetchHotelsData()} className={primaryButton}>
              {t('try-again')}
            </button>
          }
        />
      )}
      {status === 'ready' && filteredHotels.length === 0 && <NoResults />}

      {status === 'ready' && filteredHotels.length > 0 && (
        <div className={GRID} data-testid="hotel-list-container">
          {paginatedHotels.map((hotel, index) => (
            <div key={hotel.id} data-testid={`hotel-card-${index}`}>
              <HotelCard hotel={hotel} priority={index < 2} />
            </div>
          ))}
        </div>
      )}
      {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}

      {status === 'ready' && !hasMore && filteredHotels.length > 0 && (
        <p className="py-2 text-center text-sm text-slate-500">
          {t('end-of-results')}
        </p>
      )}
    </section>
  );
};

const primaryButton =
  'inline-flex h-10 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600';
const secondaryButton =
  'inline-flex h-10 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600';

function NoResults() {
  const t = useTranslations();
  const stars = useHotels((state) => state.stars);
  const maxPrice = useHotels((state) => state.maxPrice);
  const query = useHotels((state) => state.query);
  const clearFilters = useHotels((state) => state.clearFilters);
  const resetMap = useHotels((state) => state.resetMap);
  const hasFilters = countActiveFilters({ stars, maxPrice, query }) > 0;

  return (
    <EmptyState
      title={t('empty-title')}
      text={t(hasFilters ? 'empty-text-filters' : 'empty-text')}
      action={
        <>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className={primaryButton}>
              {t('clear-filters', { count: 0 })}
            </button>
          )}
          <button
            type="button"
            onClick={resetMap}
            className={hasFilters ? secondaryButton : primaryButton}
          >
            <ResetIcon className="size-4" />
            {t('reset-map')}
          </button>
        </>
      }
    />
  );
}

interface EmptyStateProps {
  title: string;
  text: string;
  action: React.ReactNode;
}

function EmptyState({ title, text, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-brand-50 text-brand-700">
        <MapIcon className="size-6" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>
    </div>
  );
}

function LoadingCards() {
  return (
    <div className={GRID} aria-hidden="true">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
          <div className="aspect-[3/2] animate-pulse bg-slate-200 motion-reduce:animate-none" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
            <div className="h-3 w-3/5 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
            <div className="h-5 w-1/4 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default HotelList;
