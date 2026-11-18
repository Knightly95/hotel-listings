import React from 'react';
import { useLocale, useTranslations } from 'next-intl';

import {
  assetUrl,
  discountPercent,
  formatPrice,
  getTranslationKey,
} from '@/src/utils/utils';
import { Hotel } from '@/src/interfaces/Hotel';
import useHotels from '@/src/store/hotelStore';
import StarRating from './StarRating';
import { MapPinIcon } from './icons';

interface HotelCardProps {
  hotel: Hotel;
  /** The first cards are above the fold: load their photos straight away. */
  priority?: boolean;
}

const MAX_FEATURES = 2;

const HotelCard: React.FC<HotelCardProps> = ({ hotel, priority = false }) => {
  const t = useTranslations();
  const locale = useLocale();
  const isHovered = useHotels((state) => state.hoveredHotelId === hotel.id);
  const setHoveredHotel = useHotels((state) => state.setHoveredHotel);
  const openHotel = useHotels((state) => state.openHotel);

  const discount = discountPercent(hotel.originalPrice, hotel.finalPrice);
  const features = hotel.features.slice(0, MAX_FEATURES);
  const moreFeatures = hotel.features.length - features.length;

  return (
    <article
      onMouseEnter={() => setHoveredHotel(hotel.id)}
      onMouseLeave={() => setHoveredHotel(null)}
      onFocus={() => setHoveredHotel(hotel.id)}
      onBlur={() => setHoveredHotel(null)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        isHovered ? 'shadow-lg shadow-slate-900/10 ring-slate-900' : 'shadow-sm ring-slate-200'
      }`}
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer */}
        <img
          src={assetUrl(hotel.image)}
          alt=""
          width={720}
          height={540}
          loading={priority ? 'eager' : 'lazy'}
          // React 18 passes the lowercase attribute through; it tells the
          // browser to fetch the first photos before anything else.
          {...{ fetchpriority: priority ? 'high' : 'auto' }}
          decoding="async"
          className="size-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            {t('discount-badge', { percent: discount })}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPinIcon className="size-3.5 shrink-0" />
            <span className="truncate">{hotel.town}</span>
          </span>
          <StarRating stars={hotel.star} />
        </div>

        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900">
          {/* The whole card opens the details: this button's area is stretched over it. */}
          <button
            type="button"
            onClick={() => openHotel(hotel.id)}
            className="text-left after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand-600"
          >
            {hotel.name}
          </button>
        </h3>

        <p className="line-clamp-1 text-sm text-slate-500">
          {features
            .map((feature) => t('ammenities.' + getTranslationKey(feature)))
            .join(' · ')}
          {moreFeatures > 0 && (
            <span className="text-slate-500"> · {t('more-features', { count: moreFeatures })}</span>
          )}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <p className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              {formatPrice(hotel.finalPrice, locale)}
            </span>
            {discount > 0 && (
              <span className="text-sm text-slate-500 line-through">
                <span className="sr-only">{t('was')} </span>
                {formatPrice(hotel.originalPrice, locale)}
              </span>
            )}
            <span className="text-sm text-slate-500">{t('per-night')}</span>
          </p>
          <span
            aria-hidden="true"
            className="text-sm font-semibold text-brand-700 transition-transform group-hover:translate-x-0.5"
          >
            {t('view-details')} →
          </span>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;
