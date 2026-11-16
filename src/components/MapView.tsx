import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { formatPrice } from '@/src/utils/utils';
import { MapContainer } from '@/src/styles/components/MapViewStyled';
import useHotels from '@/src/store/hotelStore';
import { Hotel } from '@/src/interfaces/Hotel';

/**
 * Open map tiles that need no account or access token:
 * MapLibre GL renders OpenStreetMap data served by OpenFreeMap.
 */
const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
const TENERIFE_CENTER: [number, number] = [-16.523, 28.2811];
const INITIAL_ZOOM = 8.5;

/** Built with DOM nodes, not an HTML string, so hotel data is never parsed as markup. */
function buildPopupContent(hotel: Hotel): HTMLElement {
  const container = document.createElement('div');
  const name = document.createElement('h3');
  name.textContent = hotel.name;
  const price = document.createElement('p');
  price.textContent = formatPrice(hotel.finalPrice);
  const stars = document.createElement('p');
  stars.textContent = '⭐'.repeat(hotel.star);
  container.append(name, price, stars);
  return container;
}

const MapView: React.FC = () => {
  const { paginatedHotels, handleChangeBounds } = useHotels();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Create the map once and keep the store in sync with the visible area.
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE_URL,
      center: TENERIFE_CENTER,
      zoom: INITIAL_ZOOM,
    });
    mapRef.current = map;

    const syncBounds = () => handleChangeBounds(map.getBounds());
    syncBounds();
    map.on('moveend', syncBounds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Replace the markers whenever the visible page of hotels changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = paginatedHotels.map((hotel) =>
      new maplibregl.Marker()
        .setLngLat([hotel.coordinates.longitude, hotel.coordinates.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setDOMContent(
            buildPopupContent(hotel)
          )
        )
        .addTo(map)
    );
  }, [paginatedHotels]);

  return <MapContainer ref={mapContainerRef} />;
};

export default MapView;
