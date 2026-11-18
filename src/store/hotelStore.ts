import { create } from 'zustand';
import type { LngLatBounds } from 'maplibre-gl';

import { fetchHotels } from '@/src/api/api';
import { Hotel } from '@/src/interfaces/Hotel';
import { discountPercent, normalizeText } from '@/src/utils/utils';

export const STAR_OPTIONS = [1, 2, 3, 4, 5] as const;
/** Upper limits offered by the price filter, in euros per night. */
export const MAX_PRICE_OPTIONS = [100, 200, 300] as const;
export const SORT_ORDERS = [
  'price-asc',
  'price-desc',
  'stars-desc',
  'discount-desc',
] as const;

export type SortOrder = (typeof SORT_ORDERS)[number];
export type LoadStatus = 'loading' | 'ready' | 'error';
export type MobileView = 'list' | 'map';

/** A one-off instruction for the map. `nonce` makes repeated requests distinct. */
export type MapRequest =
  | { type: 'focus'; hotelId: string; nonce: number }
  | { type: 'reset'; nonce: number };

export type HotelsState = {
  hotels: Hotel[];
  status: LoadStatus;
  filteredHotels: Hotel[];
  paginatedHotels: Hotel[];
  bounds: LngLatBounds | undefined;
  sortOrder: SortOrder;
  /** Star ratings to show. Empty means every rating. */
  stars: number[];
  /** Highest price per night to show. `null` means any price. */
  maxPrice: number | null;
  query: string;
  hasMore: boolean;
  currentPage: number;
  pageSize: number;
  /** The hotel under the pointer or keyboard focus, highlighted on the map and in the list. */
  hoveredHotelId: string | null;
  /** The hotel shown in the details dialog. */
  selectedHotelId: string | null;
  mapRequest: MapRequest | null;
  /** Which half of the page is shown on small screens. */
  mobileView: MobileView;
  fetchHotelsData: () => Promise<void>;
  filterAndSortHotels: () => void;
  handleLoadMore: () => void;
  handleSortChange: (value: string) => void;
  toggleStar: (star: number) => void;
  setMaxPrice: (maxPrice: number | null) => void;
  setQuery: (query: string) => void;
  clearFilters: () => void;
  handleChangeBounds: (bounds: LngLatBounds | undefined) => void;
  setHoveredHotel: (hotelId: string | null) => void;
  openHotel: (hotelId: string) => void;
  closeHotel: () => void;
  showHotelOnMap: (hotelId: string) => void;
  resetMap: () => void;
  setMobileView: (view: MobileView) => void;
};

export function countActiveFilters(
  state: Pick<HotelsState, 'stars' | 'maxPrice' | 'query'>
) {
  return (
    state.stars.length +
    (state.maxPrice === null ? 0 : 1) +
    (state.query.trim() ? 1 : 0)
  );
}

export function getFilteredHotels(
  hotels: Hotel[],
  { stars, maxPrice, query }: Pick<HotelsState, 'stars' | 'maxPrice' | 'query'>
) {
  const search = normalizeText(query);
  return hotels.filter(
    (hotel) =>
      (stars.length === 0 || stars.includes(hotel.star)) &&
      (maxPrice === null || hotel.finalPrice < maxPrice) &&
      (search === '' ||
        normalizeText(`${hotel.name} ${hotel.town}`).includes(search))
  );
}

function getHotelsInBounds(hotels: Hotel[], bounds: LngLatBounds) {
  return hotels.filter((hotel) =>
    bounds.contains([hotel.coordinates.longitude, hotel.coordinates.latitude])
  );
}

const comparators: Record<SortOrder, (a: Hotel, b: Hotel) => number> = {
  'price-asc': (a, b) => a.finalPrice - b.finalPrice,
  'price-desc': (a, b) => b.finalPrice - a.finalPrice,
  'stars-desc': (a, b) => b.star - a.star || a.finalPrice - b.finalPrice,
  'discount-desc': (a, b) =>
    discountPercent(b.originalPrice, b.finalPrice) -
      discountPercent(a.originalPrice, a.finalPrice) ||
    a.finalPrice - b.finalPrice,
};

export function sortHotels(hotels: Hotel[], sortOrder: SortOrder) {
  return [...hotels].sort(comparators[sortOrder]);
}

const isSortOrder = (value: string): value is SortOrder =>
  (SORT_ORDERS as readonly string[]).includes(value);

let nonce = 0;

const useHotels = create<HotelsState>((set, get) => ({
  hotels: [],
  status: 'loading',
  filteredHotels: [],
  paginatedHotels: [],
  bounds: undefined,
  sortOrder: 'price-asc',
  stars: [],
  maxPrice: null,
  query: '',
  hasMore: false,
  currentPage: 1,
  pageSize: 12,
  hoveredHotelId: null,
  selectedHotelId: null,
  mapRequest: null,
  mobileView: 'list',

  fetchHotelsData: async () => {
    set({ status: 'loading' });
    try {
      const hotels = await fetchHotels();
      set({ hotels, status: 'ready' });
    } catch {
      set({ status: 'error' });
    }
    get().filterAndSortHotels();
  },

  filterAndSortHotels: () => {
    set((state) => {
      let filteredHotels = getFilteredHotels(state.hotels, state);
      if (state.bounds) {
        filteredHotels = getHotelsInBounds(filteredHotels, state.bounds);
      }
      filteredHotels = sortHotels(filteredHotels, state.sortOrder);

      return {
        filteredHotels,
        paginatedHotels: filteredHotels.slice(0, state.pageSize),
        hasMore: filteredHotels.length > state.pageSize,
        currentPage: 1,
      };
    });
  },

  handleLoadMore: () => {
    set((state) => {
      const end = (state.currentPage + 1) * state.pageSize;
      const paginatedHotels = state.filteredHotels.slice(0, end);
      return {
        currentPage: state.currentPage + 1,
        paginatedHotels,
        hasMore: state.filteredHotels.length > paginatedHotels.length,
      };
    });
  },

  handleSortChange: (value) => {
    if (!isSortOrder(value)) return;
    set({ sortOrder: value });
    get().filterAndSortHotels();
  },

  toggleStar: (star) => {
    const { stars } = get();
    set({
      stars: stars.includes(star)
        ? stars.filter((selected) => selected !== star)
        : [...stars, star].sort((a, b) => a - b),
    });
    get().filterAndSortHotels();
  },

  setMaxPrice: (maxPrice) => {
    set({ maxPrice });
    get().filterAndSortHotels();
  },

  setQuery: (query) => {
    set({ query });
    get().filterAndSortHotels();
  },

  clearFilters: () => {
    set({ stars: [], maxPrice: null, query: '' });
    get().filterAndSortHotels();
  },

  handleChangeBounds: (bounds) => {
    set({ bounds });
    get().filterAndSortHotels();
  },

  setHoveredHotel: (hotelId) => set({ hoveredHotelId: hotelId }),

  openHotel: (hotelId) => set({ selectedHotelId: hotelId }),

  closeHotel: () => set({ selectedHotelId: null }),

  showHotelOnMap: (hotelId) =>
    set({
      selectedHotelId: null,
      hoveredHotelId: hotelId,
      mobileView: 'map',
      mapRequest: { type: 'focus', hotelId, nonce: ++nonce },
    }),

  resetMap: () => set({ mapRequest: { type: 'reset', nonce: ++nonce } }),

  setMobileView: (view) => set({ mobileView: view }),
}));

export default useHotels;
