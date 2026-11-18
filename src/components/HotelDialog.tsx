'use client';

import React, { useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import useHotels from '@/src/store/hotelStore';
import {
  assetUrl,
  discountPercent,
  formatPrice,
  getTranslationKey,
} from '@/src/utils/utils';
import StarRating from './StarRating';
import { CheckIcon, CloseIcon, MapIcon, MapPinIcon } from './icons';

/**
 * The details of one hotel in a native modal dialog: the browser traps focus,
 * closes it with Escape and gives focus back to the card afterwards.
 */
const HotelDialog: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const hotel = useHotels((state) =>
    state.selectedHotelId
      ? state.hotels.find((candidate) => candidate.id === state.selectedHotelId)
      : undefined
  );
  const closeHotel = useHotels((state) => state.closeHotel);
  const showHotelOnMap = useHotels((state) => state.showHotelOnMap);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (hotel && !dialog.open) dialog.showModal?.();
    if (!hotel && dialog.open) dialog.close?.();
  }, [hotel]);

  const discount = hotel ? discountPercent(hotel.originalPrice, hotel.finalPrice) : 0;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="hotel-dialog-title"
      onClose={closeHotel}
      // A click on the dimmed backdrop lands on the dialog element itself.
      onClick={(event) => event.target === event.currentTarget && closeHotel()}
      className="m-auto w-[min(100%-2rem,44rem)] overflow-hidden rounded-3xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/55 backdrop:backdrop-blur-[2px] open:animate-[dialog-in_180ms_ease-out] motion-reduce:open:animate-none"
    >
      {hotel && (
        <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
          <div className="relative aspect-[16/9] bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer */}
            <img
              src={assetUrl(hotel.image)}
              alt=""
              width={720}
              height={540}
              className="size-full object-cover"
            />
            <button
              type="button"
              onClick={closeHotel}
              className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/95 text-slate-900 shadow-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <CloseIcon className="size-5" />
              <span className="sr-only">{t('close')}</span>
            </button>
            {discount > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-rose-600 px-3 py-1 text-sm font-bold text-white shadow-sm">
                {t('discount-badge', { percent: discount })}
              </span>
            )}
          </div>

          <div className="grid gap-8 p-6 sm:grid-cols-[1fr_auto] sm:p-8">
            <div>
              <p className="flex items-center gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon className="size-4" />
                  {hotel.town}, Tenerife
                </span>
                <StarRating stars={hotel.star} />
              </p>
              <h2 id="hotel-dialog-title" className="mt-2 text-2xl font-bold tracking-tight">
                {hotel.name}
              </h2>

              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
                {t('amenities')}
              </h3>
              <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-slate-700 sm:grid-cols-2">
                {hotel.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckIcon className="size-4 shrink-0 text-brand-700" />
                    {t('ammenities.' + getTranslationKey(feature))}
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-fit rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 sm:w-60">
              <p className="text-sm text-slate-500">{t('price-per-night')}</p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">
                  {formatPrice(hotel.finalPrice, locale)}
                </span>
                {discount > 0 && (
                  <span className="text-slate-500 line-through">
                    <span className="sr-only">{t('was')} </span>
                    {formatPrice(hotel.originalPrice, locale)}
                  </span>
                )}
              </p>
              {discount > 0 && (
                <p className="mt-2 text-sm font-semibold text-emerald-700">
                  {t('you-save', {
                    amount: formatPrice(hotel.originalPrice - hotel.finalPrice, locale),
                  })}
                </p>
              )}
              <button
                type="button"
                onClick={() => showHotelOnMap(hotel.id)}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-5 text-sm font-semibold text-white transition hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
              >
                <MapIcon className="size-4" />
                {t('show-on-map')}
              </button>
              <p className="mt-3 text-center text-xs text-slate-500">{t('demo-note')}</p>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
};

export default HotelDialog;
