import { act, renderHook } from '@testing-library/react';
import useHotels from '../../src/store/hotelStore';

describe('useHotels', () => {
  let storedResult;
  beforeEach(async () => {
    const { result } = renderHook(() => useHotels());

    await act(async () => {
      await result.current.fetchHotelsData();
    });

    storedResult = result;
  });

  test('fetchHotelsData should load hotel store with the data fetches', async () => {
    expect(storedResult.current.hotels.length).toBeGreaterThan(0);
  });

  test('filterAndSortHotels should update filteredHotels, paginatedHotels, hasMore, and currentPage state', async () => {
    act(() => {
      storedResult.current.filterAndSortHotels();
    });
    debugger;

    expect(storedResult.current.filteredHotels.length).toBeGreaterThan(0);
    expect(storedResult.current.paginatedHotels.length).toBeGreaterThan(0);
    expect(storedResult.current.hasMore).toBe(true);
    expect(storedResult.current.currentPage).toBe(1);
  });

  test('handleLoadMore should update paginatedHotels, currentPage, and hasMore state', () => {
    act(() => {
      storedResult.current.handleLoadMore();
    });

    expect(storedResult.current.paginatedHotels.length).toBeGreaterThan(0);
    expect(storedResult.current.currentPage).toBe(2);
    expect(storedResult.current.hasMore).toBe(false);
  });

  test('handleSortChange should update sortOrder state', () => {
    act(() => {
      storedResult.current.handleSortChange('price-desc');
    });

    expect(storedResult.current.sortOrder).toBe('price-desc');
  });

  test('handleFilterChange should update activeFilters state', () => {
    act(() => {
      storedResult.current.handleFilterChange('Stars', '5', true);
    });

    expect(storedResult.current.activeFilters['Stars']).toContain('5');
  });

  test('after changing the filter the filteredHotels should update and have only one hotel', () => {
    act(() => {
      storedResult.current.handleFilterChange('Stars', '5', true);
      storedResult.current.filterAndSortHotels();
    });

    expect(storedResult.current.activeFilters['Stars']).toContain('5');
    expect(storedResult.current.filteredHotels.length).toBe(1);
  });

  test('handleChangeBounds should update bounds state', () => {
    act(() => {
      storedResult.current.handleChangeBounds({});
    });

    expect(storedResult.current.bounds).toBeDefined();
  });

  test('after changing the map bounds the filteredHotels should update and have no hotels', () => {
    // Map mock bounds.contains always returns false
    act(() => {
      storedResult.current.handleChangeBounds({
        contains: jest.fn(() => false),
      });
      storedResult.current.filterAndSortHotels();
    });

    expect(storedResult.current.filteredHotels.length).toBe(0);
  });
});
