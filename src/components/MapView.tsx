'use client';

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useLocale, useTranslations } from 'next-intl';

import { assetUrl, formatPrice } from '@/src/utils/utils';
import useHotels from '@/src/store/hotelStore';
import { Hotel } from '@/src/interfaces/Hotel';
import { ResetIcon } from './icons';

/**
 * Open map tiles that need no account or access token:
 * MapLibre GL renders OpenStreetMap data served by OpenFreeMap.
 */
const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
/** The whole island, south-west to north-east corner. */
const TENERIFE_BOUNDS: [[number, number], [number, number]] = [
  [-16.93, 27.99],
  [-16.11, 28.6],
];
const FIT_OPTIONS = { padding: 32, duration: 800 };
const FOCUS_ZOOM = 14;

const markerClass =
  'relative block -translate-y-1.5 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[13px] font-bold text-slate-900 shadow-md ring-1 ring-slate-900/10 transition-transform hover:scale-110 ' +
  'after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-x-[6px] after:border-t-[6px] after:border-x-transparent after:border-t-white ' +
  'data-[active=true]:scale-110 data-[active=true]:bg-slate-900 data-[active=true]:text-white data-[active=true]:after:border-t-slate-900 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 motion-reduce:transition-none';

interface MarkerEntry {
  marker: maplibregl.Marker;
  button: HTMLButtonElement;
}

const MapView: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const paginatedHotels = useHotels((state) => state.paginatedHotels);
  const hotels = useHotels((state) => state.hotels);
  const hoveredHotelId = useHotels((state) => state.hoveredHotelId);
  const mapRequest = useHotels((state) => state.mapRequest);
  const handleChangeBounds = useHotels((state) => state.handleChangeBounds);
  const setHoveredHotel = useHotels((state) => state.setHoveredHotel);
  const openHotel = useHotels((state) => state.openHotel);
  const resetMap = useHotels((state) => state.resetMap);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef(new Map<string, MarkerEntry>());
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const focusedIdRef = useRef<string | null>(null);

  /** A small card shown over the map when a price marker is clicked. */
  const showPopup = (hotel: Hotel) => {
    const map = mapRef.current;
    if (!map) return;
    popupRef.current?.remove();
    popupRef.current = new maplibregl.Popup({
      offset: 30,
      maxWidth: '260px',
      className: 'hotel-popup',
      focusAfterOpen: false,
    })
      .setLngLat([hotel.coordinates.longitude, hotel.coordinates.latitude])
      .setDOMContent(buildPopupContent(hotel))
      .addTo(map);
  };

  /** Built with DOM nodes, not an HTML string, so hotel data is never parsed as markup. */
  const buildPopupContent = (hotel: Hotel) => {
    const card = document.createElement('div');
    card.className = 'w-60 overflow-hidden rounded-xl bg-white font-sans';
    const image = document.createElement('img');
    image.src = assetUrl(hotel.image);
    image.alt = '';
    image.className = 'aspect-[16/10] w-full object-cover';
    const body = document.createElement('div');
    body.className = 'space-y-1 p-3';
    const name = document.createElement('p');
    name.className = 'text-sm font-semibold leading-snug text-slate-900';
    name.textContent = hotel.name;
    const meta = document.createElement('p');
    meta.className = 'text-xs text-slate-500';
    meta.textContent = `${hotel.town} · ${t('star-rating', { rating: hotel.star })}`;
    const footer = document.createElement('div');
    footer.className = 'flex items-center justify-between pt-1';
    const price = document.createElement('p');
    price.className = 'text-sm text-slate-500';
    const amount = document.createElement('span');
    amount.className = 'text-base font-bold text-slate-900';
    amount.textContent = formatPrice(hotel.finalPrice, locale);
    price.append(amount, ` ${t('per-night')}`);
    const details = document.createElement('button');
    details.type = 'button';
    details.className =
      'rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600';
    details.textContent = t('view-details');
    details.addEventListener('click', () => openHotel(hotel.id));
    footer.append(price, details);
    body.append(name, meta, footer);
    card.append(image, body);
    return card;
  };

  // Create the map once and keep the store in sync with the visible area.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE_URL,
      bounds: TENERIFE_BOUNDS,
      fitBoundsOptions: { padding: 32 },
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;

    const syncBounds = () => handleChangeBounds(map.getBounds());
    syncBounds();
    map.on('moveend', syncBounds);

    // The map is hidden on small screens until the visitor asks for it.
    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => map.resize());
    resizeObserver?.observe(containerRef.current);
    return () => resizeObserver?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep one price marker per hotel in the list, plus the one asked for with "Show on map".
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const focused = hotels.find((hotel) => hotel.id === focusedIdRef.current);
    const wanted = new Map(paginatedHotels.map((hotel) => [hotel.id, hotel]));
    if (focused) wanted.set(focused.id, focused);

    markersRef.current.forEach((entry, id) => {
      if (!wanted.has(id)) {
        entry.marker.remove();
        markersRef.current.delete(id);
      }
    });

    wanted.forEach((hotel, id) => {
      if (markersRef.current.has(id)) return;
      const element = document.createElement('div');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = markerClass;
      button.textContent = formatPrice(hotel.finalPrice, locale);
      button.setAttribute(
        'aria-label',
        `${hotel.name}, ${formatPrice(hotel.finalPrice, locale)} ${t('per-night')}`
      );
      button.addEventListener('click', () => showPopup(hotel));
      button.addEventListener('mouseenter', () => setHoveredHotel(id));
      button.addEventListener('mouseleave', () => setHoveredHotel(null));
      element.append(button);

      const marker = new maplibregl.Marker({ element, anchor: 'bottom' })
        .setLngLat([hotel.coordinates.longitude, hotel.coordinates.latitude])
        .addTo(map);
      // The button inside carries the name; MapLibre's generic label on the
      // wrapper would be announced as well.
      marker.getElement().removeAttribute('aria-label');
      markersRef.current.set(id, { marker, button });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatedHotels, hotels]);

  // Highlight the marker of the card under the pointer or keyboard focus.
  useEffect(() => {
    markersRef.current.forEach(({ marker, button }, id) => {
      const active = id === hoveredHotelId;
      button.dataset.active = String(active);
      marker.getElement().style.zIndex = active ? '2' : '';
    });
  }, [hoveredHotelId, paginatedHotels]);

  // "Show on map" and "Reset map".
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapRequest) return;
    if (mapRequest.type === 'reset') {
      popupRef.current?.remove();
      focusedIdRef.current = null;
      map.fitBounds(TENERIFE_BOUNDS, FIT_OPTIONS);
      return;
    }
    const hotel = hotels.find((candidate) => candidate.id === mapRequest.hotelId);
    if (!hotel) return;
    focusedIdRef.current = hotel.id;
    map.flyTo({
      center: [hotel.coordinates.longitude, hotel.coordinates.latitude],
      zoom: FOCUS_ZOOM,
      duration: 1200,
    });
    showPopup(hotel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRequest]);

  return (
    <div className="relative size-full">
      {/* MapLibre labels its canvas as a "Map" region itself. */}
      <div ref={containerRef} className="size-full" />
      <button
        type="button"
        onClick={resetMap}
        className="absolute left-3 top-3 inline-flex h-9 items-center gap-2 rounded-full bg-white px-3.5 text-sm font-semibold text-slate-900 shadow-md ring-1 ring-slate-900/10 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        <ResetIcon className="size-4" />
        {t('reset-map')}
      </button>
    </div>
  );
};

export default MapView;
