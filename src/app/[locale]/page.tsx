'use client';

import React from 'react';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import FilterSidebar from '@/src/components/FilterSidebar';
import Header from '@/src/components/layout/Header';
import HotelList from '@/src/components/HotelList';
import MapView from '@/src/components/MapView';
import {
  LayoutContainer,
  HeaderContainer,
  MainContainer,
  Sidebar,
  MainContent,
  MapContainer,
  ContentContainer,
} from '@/src/styles/components/LayoutSearchStyled';
import useHotels from '@/src/store/hotelStore';

const Search = () => {
  const t = useTranslations();
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
    <LayoutContainer>
      <HeaderContainer>
        <h1>{t('hotel-finder')}</h1>
      </HeaderContainer>
      <MainContainer>
        <ContentContainer>
          <Sidebar data-testid="filter-sidebar">
            <FilterSidebar />
          </Sidebar>
          <MainContent>
            <Header />
            <HotelList />
          </MainContent>
        </ContentContainer>
        <MapContainer>
          <MapView />
        </MapContainer>
      </MainContainer>
    </LayoutContainer>
  );
};

export default Search;
