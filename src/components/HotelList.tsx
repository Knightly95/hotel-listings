'use client';

import React, { useRef, useEffect } from 'react';
import HotelCard from './HotelCard';
import {
  ListContainer,
  CardWrapper,
} from '../styles/components/HotelListStyled';

import useHotels from '../store/hotelStore';

const HotelList: React.FC = () => {
  const { paginatedHotels, hasMore, handleLoadMore } = useHotels();
  const observer = useRef<IntersectionObserver | null>(null);
  const lastHotelRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore) {
      handleLoadMore();
    }
  };

  useEffect(() => {
    if (lastHotelRef.current) {
      observer.current = new IntersectionObserver(handleObserver, {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      });
      observer.current.observe(lastHotelRef.current);
    }
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, paginatedHotels]);

  return (
    <ListContainer data-testid={`hotel-list-container`}>
      {paginatedHotels.map((hotel, index) => {
        if (index === paginatedHotels.length - 1) {
          return (
            <CardWrapper
              data-testid={`hotel-card-${index}`}
              key={index}
              ref={lastHotelRef}
            >
              <HotelCard hotel={hotel} />
            </CardWrapper>
          );
        }
        return (
          <CardWrapper data-testid={`hotel-card-${index}`} key={index}>
            <HotelCard hotel={hotel} />
          </CardWrapper>
        );
      })}
    </ListContainer>
  );
};

export default HotelList;
