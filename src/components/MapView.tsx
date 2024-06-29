import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styled from 'styled-components';
import { Hotel } from '../interfaces/Hotel';
import { MapContainer } from '../styles/components/MapViewStyled';
import useHotels from '../store/hotelStore';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const MapView: React.FC = () => {
  const { paginatedHotels, handleChangeBounds } = useHotels();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]); // Referencia para almacenar marcadores

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-16.523, 28.2811], // Coordenadas iniciales (e.g., Nueva York)
        zoom: 8.5,
      });

      mapRef.current = map;

      const bounds = mapRef.current?.getBounds();
      handleChangeBounds(bounds);
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      // Eliminar marcadores anteriores
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = []; // Vaciar la referencia de marcadores

      // Añadir nuevos marcadores
      const newMarkers = paginatedHotels.map((hotel) => {
        const marker = new mapboxgl.Marker()
          .setLngLat([hotel.coordinates.longitude, hotel.coordinates.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <h3>${hotel.name}</h3>
              <p>${hotel.finalPrice}</p>
              <p>${'⭐'.repeat(hotel.star)}</p>
            `)
          )
          .addTo(mapRef.current!); // ¡El signo de exclamación asegura que mapRef.current no sea null!
        return marker;
      });

      // Actualizar la referencia de marcadores
      markersRef.current = newMarkers;

      mapRef.current.on('moveend', () => {
        const bounds = mapRef.current?.getBounds(); // Obtener los límites del mapa
        handleChangeBounds(bounds); // Actualizar los límites del mapa
      });
    }
  }, [paginatedHotels]);

  return <MapContainer ref={mapContainerRef} />;
};

export default MapView;
