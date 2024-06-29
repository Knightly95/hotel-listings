import { create } from 'zustand';
import { fetchHotels } from '../api/api';
import { Hotel } from '../interfaces/Hotel';
import { LngLat } from 'mapbox-gl';
import { filterData } from '../constants/FilterData';

type HotelsState = {
  hotels: Hotel[];
  filteredHotels: Hotel[];
  paginatedHotels: Hotel[];
  bounds: mapboxgl.LngLatBounds | undefined;
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
  handleChangeBounds: (bounds: mapboxgl.LngLatBounds | undefined) => void;
};

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
      let filteredHotels = state.hotels.filter((hotel: Hotel) => {
        return Object.keys(state.activeFilters).every((filterKey) => {
          const filterValues = Array.from(state.activeFilters[filterKey] || []);
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

      if (state.bounds) {
        filteredHotels = filteredHotels.filter((hotel) => {
          const lngLat = new LngLat(
            hotel.coordinates.longitude,
            hotel.coordinates.latitude
          );
          return state.bounds?.contains(lngLat);
        });
      }

      if (state.sortOrder === 'price-asc') {
        filteredHotels.sort((a, b) => a.finalPrice - b.finalPrice);
      } else {
        filteredHotels.sort((a, b) => b.finalPrice - a.finalPrice);
      }

      return {
        filteredHotels,
        paginatedHotels: filteredHotels.slice(0, 5),
        hasMore: filteredHotels.length > 5,
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
