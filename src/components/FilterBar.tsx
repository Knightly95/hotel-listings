import React from 'react';
import { useLocale, useTranslations } from 'next-intl';

import useHotels, {
  MAX_PRICE_OPTIONS,
  STAR_OPTIONS,
  countActiveFilters,
} from '@/src/store/hotelStore';
import { formatPrice } from '@/src/utils/utils';
import { StarIcon } from './icons';

const pill =
  'inline-flex h-9 cursor-pointer select-none items-center gap-1 whitespace-nowrap rounded-full border px-3.5 text-sm font-medium transition-colors ' +
  'border-slate-200 bg-white text-slate-700 hover:border-slate-400 ' +
  'peer-checked:border-slate-900 peer-checked:bg-slate-900 peer-checked:text-white ' +
  'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600';

/**
 * Star and price filters as pills. They are real checkboxes and radio
 * buttons underneath, so they work with a keyboard and a screen reader.
 */
const FilterBar: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const stars = useHotels((state) => state.stars);
  const maxPrice = useHotels((state) => state.maxPrice);
  const query = useHotels((state) => state.query);
  const toggleStar = useHotels((state) => state.toggleStar);
  const setMaxPrice = useHotels((state) => state.setMaxPrice);
  const clearFilters = useHotels((state) => state.clearFilters);
  const activeCount = countActiveFilters({ stars, maxPrice, query });

  return (
    <div
      className="-mx-4 flex items-center gap-x-6 gap-y-3 overflow-x-auto px-4 pb-1 [mask-image:linear-gradient(to_right,black_85%,transparent)] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:[mask-image:none]"
      data-testid="filter-bar"
    >
      <fieldset className="flex shrink-0 items-center gap-1.5">
        <legend className="sr-only">{t('stars')}</legend>
        <span aria-hidden="true" className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {t('stars')}
        </span>
        {STAR_OPTIONS.map((star) => (
          <label key={star} className="relative">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={stars.includes(star)}
              onChange={() => toggleStar(star)}
              data-testid={`checkbox-${star}`}
            />
            <span className={pill}>
              {star}
              <StarIcon className="size-3.5 text-amber-400" />
              <span className="sr-only">{t('star-rating', { rating: star })}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <fieldset className="flex shrink-0 items-center gap-1.5">
        <legend className="sr-only">{t('max-price')}</legend>
        <span aria-hidden="true" className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {t('price')}
        </span>
        {[null, ...MAX_PRICE_OPTIONS].map((option) => (
          <label key={option ?? 'any'} className="relative">
            <input
              type="radio"
              name="max-price"
              className="peer sr-only"
              checked={maxPrice === option}
              onChange={() => setMaxPrice(option)}
              data-testid={`price-${option ?? 'any'}`}
            />
            <span className={pill}>
              {option === null
                ? t('any-price')
                : t('price-filter', { price: formatPrice(option, locale) })}
            </span>
          </label>
        ))}
      </fieldset>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearFilters}
          className="shrink-0 whitespace-nowrap text-sm font-semibold text-brand-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          {t('clear-filters', { count: activeCount })}
        </button>
      )}
    </div>
  );
};

export default FilterBar;
