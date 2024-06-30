'use client';

import FilterSidebar from '@/src/components/FilterSidebar';
import Header from '@/src/components/Header';
import HotelList from '@/src/components/HotelList';
import LayoutSearch from '@/src/components/LayoutSearch';
import MapView from '@/src/components/MapView';
import React from 'react';
import { useEffect } from 'react';

import useHotels from '../../store/hotelStore';

const Search = () => {
  const {
    hotels,
    bounds,
    sortOrder,
    activeFilters,
    fetchHotelsData,
    filterAndSortHotels,
  } = useHotels();

  useEffect(() => {
    fetchHotelsData();
  }, []);

  useEffect(() => {
    filterAndSortHotels();
  }, [hotels, sortOrder, activeFilters, bounds]);

  return (
    <LayoutSearch sidebar={<FilterSidebar />} map={<MapView />}>
      <Header />
      <HotelList />
    </LayoutSearch>
  );
};

export default Search;
