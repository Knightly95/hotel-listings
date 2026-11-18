import { act } from '@testing-library/react';
import type { LngLatBounds } from 'maplibre-gl';

import useHotels, { countActiveFilters, sortHotels } from '@/src/store/hotelStore';
import fetchDataResponse from '@/mocks/fetchDataResponse';
import { resetStore } from '@/test-utils/render';

const state = () => useHotels.getState();
const names = () => state().filteredHotels.map((hotel) => hotel.name);

describe('hotel store', () => {
  beforeEach(async () => {
    resetStore();
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(fetchDataResponse),
    });
    await act(() => state().fetchHotelsData());
  });

  it('loads the hotels and shows the first page', () => {
    expect(state().status).toBe('ready');
    expect(state().hotels).toHaveLength(fetchDataResponse.length);
    expect(state().paginatedHotels).toHaveLength(fetchDataResponse.length);
    expect(state().hasMore).toBe(false);
  });

  it('marks the load as failed when the request fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('offline'));
    await act(() => state().fetchHotelsData());
    expect(state().status).toBe('error');
  });

  it('pages through the results', () => {
    act(() => {
      useHotels.setState({ pageSize: 2 });
      state().filterAndSortHotels();
    });
    expect(state().paginatedHotels).toHaveLength(2);
    expect(state().hasMore).toBe(true);

    act(() => state().handleLoadMore());
    expect(state().paginatedHotels).toHaveLength(4);
    expect(state().currentPage).toBe(2);

    act(() => state().handleLoadMore());
    expect(state().paginatedHotels).toHaveLength(6);
    expect(state().hasMore).toBe(false);
  });

  it('filters by star rating, and toggles a rating off again', () => {
    act(() => state().toggleStar(5));
    expect(state().filteredHotels.every((hotel) => hotel.star === 5)).toBe(true);
    expect(state().filteredHotels).toHaveLength(1);

    act(() => state().toggleStar(2));
    expect(state().stars).toEqual([2, 5]);

    act(() => {
      state().toggleStar(5);
      state().toggleStar(2);
    });
    expect(state().stars).toEqual([]);
    expect(state().filteredHotels).toHaveLength(fetchDataResponse.length);
  });

  it('filters by maximum price', () => {
    act(() => state().setMaxPrice(300));
    expect(state().filteredHotels.every((hotel) => hotel.finalPrice < 300)).toBe(true);
    expect(state().filteredHotels.length).toBeGreaterThan(0);
  });

  it('searches names and towns, ignoring case and accents', () => {
    act(() => state().setQuery('MEDANO'));
    expect(state().filteredHotels.map((hotel) => hotel.town)).toEqual(['El Médano']);

    act(() => state().setQuery('ocean vista'));
    expect(names()).toEqual(['Ocean Vista Hotel']);
  });

  it('counts and clears the active filters', () => {
    act(() => {
      state().toggleStar(4);
      state().setMaxPrice(200);
      state().setQuery('sun');
    });
    expect(countActiveFilters(state())).toBe(3);

    act(() => state().clearFilters());
    expect(countActiveFilters(state())).toBe(0);
    expect(state().filteredHotels).toHaveLength(fetchDataResponse.length);
  });

  it('only keeps the hotels inside the visible map area', () => {
    act(() =>
      state().handleChangeBounds({
        contains: jest.fn(() => false),
      } as unknown as LngLatBounds)
    );
    expect(state().filteredHotels).toHaveLength(0);
  });

  it('sorts by price, stars and discount, and ignores unknown orders', () => {
    const prices = () => state().filteredHotels.map((hotel) => hotel.finalPrice);

    act(() => state().handleSortChange('price-desc'));
    expect(prices()).toEqual([...prices()].sort((a, b) => b - a));

    act(() => state().handleSortChange('stars-desc'));
    expect(state().filteredHotels[0].star).toBe(5);

    act(() => state().handleSortChange('not-a-sort'));
    expect(state().sortOrder).toBe('stars-desc');
  });

  it('orders the biggest discount first', () => {
    const sorted = sortHotels(fetchDataResponse, 'discount-desc');
    const discount = (index: number) =>
      1 - sorted[index].finalPrice / sorted[index].originalPrice;
    expect(discount(0)).toBeGreaterThanOrEqual(discount(1));
  });

  it('opens a hotel, and shows it on the map', () => {
    act(() => state().openHotel('hotel-2'));
    expect(state().selectedHotelId).toBe('hotel-2');

    act(() => state().showHotelOnMap('hotel-2'));
    expect(state().selectedHotelId).toBeNull();
    expect(state().hoveredHotelId).toBe('hotel-2');
    expect(state().mobileView).toBe('map');
    expect(state().mapRequest).toMatchObject({ type: 'focus', hotelId: 'hotel-2' });
  });

  it('asks the map to reset, with a new request each time', () => {
    act(() => state().resetMap());
    const first = state().mapRequest;
    act(() => state().resetMap());
    expect(state().mapRequest).toMatchObject({ type: 'reset' });
    expect(state().mapRequest).not.toBe(first);
  });

  it('remembers the hovered hotel, the closed dialog and the mobile view', () => {
    act(() => {
      state().setHoveredHotel('hotel-3');
      state().openHotel('hotel-3');
      state().closeHotel();
      state().setMobileView('map');
    });
    expect(state().hoveredHotelId).toBe('hotel-3');
    expect(state().selectedHotelId).toBeNull();
    expect(state().mobileView).toBe('map');
  });
});
