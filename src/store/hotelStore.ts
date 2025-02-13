import { create } from 'zustand';
import { fetchHotels } from '@/src/api/api';
import { Hotel } from '@/src/interfaces/Hotel';
import { LngLatBounds } from 'mapbox-gl';
import { filterData } from '@/src/constants/FilterData';

type HotelsState = {
  hotels: Hotel[];
  filteredHotels: Hotel[];
  paginatedHotels: Hotel[];
  bounds: LngLatBounds | undefined;
  sortOrder: string;
  activeFilters: { [key: string]: Set<string> };
  filters: any;
  hasMore: boolean;
  currentPage: number;
  pageSize: number;
  filterAndSortHotels: () => void;
  handleLoadMore: () => void;
  handleSortChange: (value: string) => void;
  handleFilterChange: (
    filterTitle: string,
    optionValue: string,
    isChecked: boolean
  ) => void;
  fetchHotelsData: () => Promise<void>;
  handleChangeBounds: (bounds: LngLatBounds | undefined) => void;
};

function getFilteredHotels(hotels: Hotel[], activeFilters: any) {
  return hotels.filter((hotel: Hotel) => {
    return Object.keys(activeFilters).every((filterKey) => {
      const filterValues = Array.from(activeFilters[filterKey] || []);
      if (filterKey === 'Stars') {
        return filterValues.includes(hotel.star.toString());
      }
      if (filterKey === 'Price Range') {
        if (filterValues.includes('under-100') && hotel.finalPrice < 100)
          return true;
        if (filterValues.includes('under-200') && hotel.finalPrice < 200)
          return true;
        if (filterValues.includes('under-300') && hotel.finalPrice < 300)
          return true;
      }
      return false;
    });
  });
}

function getHotelsInBounds(hotels: Hotel[], bounds: LngLatBounds) {
  return hotels.filter((hotel) => {
    return bounds.contains([
      hotel.coordinates.longitude,
      hotel.coordinates.latitude,
    ]);
  });
}

function sortHotels(hotels: Hotel[], sortOrder: string) {
  return hotels.sort((a, b) => {
    if (sortOrder === 'price-asc') {
      return a.finalPrice - b.finalPrice;
    }
    if (sortOrder === 'price-desc') {
      return b.finalPrice - a.finalPrice;
    }
    return 0;
  });
}

const useHotels = create<HotelsState>((set) => ({
  hotels: [],
  filteredHotels: [],
  paginatedHotels: [],
  bounds: undefined,
  sortOrder: 'price-asc',
  activeFilters: {},
  filters: filterData,
  hasMore: false,
  currentPage: 1,
  pageSize: 5,
  fetchHotelsData: async () => {
    const hotelsData = await fetchHotels();
    set({ hotels: hotelsData });
  },
  filterAndSortHotels: () => {
    set((state) => {
      const { activeFilters, bounds, sortOrder, hotels, pageSize } = state;

      let filteredHotels = getFilteredHotels(hotels, activeFilters);

      if (bounds) {
        filteredHotels = getHotelsInBounds(filteredHotels, bounds);
      }

      filteredHotels = sortHotels(filteredHotels, sortOrder);
      const paginatedHotels = filteredHotels.slice(0, pageSize);
      const hasMore = filteredHotels.length > pageSize;

      return {
        filteredHotels,
        paginatedHotels,
        hasMore,
        currentPage: 1,
      };
    });
  },
  handleLoadMore: () => {
    set((state) => {
      const startIndex = state.currentPage * state.pageSize;
      const endIndex = startIndex + state.pageSize;
      const nextPage = state.filteredHotels.slice(startIndex, endIndex);
      const paginatedHotels = [...state.paginatedHotels, ...nextPage];

      const currentPage = state.currentPage + 1;
      const hasMore = state.filteredHotels.length > paginatedHotels.length;

      return {
        currentPage,
        paginatedHotels,
        hasMore,
      };
    });
  },
  handleSortChange: (value: string) => {
    set({ sortOrder: value });
  },
  handleFilterChange: (
    filterTitle: string,
    optionValue: string,
    isChecked: boolean
  ) => {
    set((state) => {
      const newFilters = { ...state.activeFilters };
      if (isChecked) {
        if (!newFilters[filterTitle]) {
          newFilters[filterTitle] = new Set();
        }
        newFilters[filterTitle].add(optionValue);
      } else {
        newFilters[filterTitle]?.delete(optionValue);
        if (newFilters[filterTitle]?.size === 0) {
          delete newFilters[filterTitle];
        }
      }
      return { activeFilters: newFilters };
    });
  },
  handleChangeBounds: (bounds) => {
    set({ bounds });
  },
}));

export default useHotels;
