import { act, fireEvent, screen, within } from '@testing-library/react';
import maplibregl from 'maplibre-gl';

import AppHeader from '@/src/components/layout/AppHeader';
import FilterBar from '@/src/components/FilterBar';
import HotelCard from '@/src/components/HotelCard';
import HotelDialog from '@/src/components/HotelDialog';
import HotelList from '@/src/components/HotelList';
import MapView from '@/src/components/MapView';
import useHotels from '@/src/store/hotelStore';
import fetchDataResponse from '@/mocks/fetchDataResponse';
import { renderWithIntl, resetStore } from '@/test-utils/render';

const state = () => useHotels.getState();
const [firstHotel] = fetchDataResponse;

describe('AppHeader', () => {
  beforeEach(() => resetStore(true));

  it('searches as you type and clears the search', () => {
    renderWithIntl(<AppHeader />);
    const [search] = screen.getAllByRole('searchbox', { name: 'Search hotels or towns' });

    fireEvent.change(search, { target: { value: 'laguna' } });
    expect(state().query).toBe('laguna');
    expect(state().filteredHotels).toHaveLength(1);

    fireEvent.click(screen.getAllByRole('button', { name: 'Clear search' })[0]);
    expect(state().query).toBe('');
  });

  it('links to both languages and marks the current one', () => {
    renderWithIntl(<AppHeader />, 'es');
    const nav = screen.getByRole('navigation', { name: 'Idioma' });
    expect(within(nav).getByRole('link', { name: /Español/ })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: /English/ })).toHaveAttribute('href', '/en');
  });
});

describe('FilterBar', () => {
  beforeEach(() => resetStore(true));

  it('filters by stars and price, and clears both', () => {
    renderWithIntl(<FilterBar />);

    fireEvent.click(screen.getByTestId('checkbox-5'));
    expect(screen.getByRole('checkbox', { name: /5 stars/ })).toBeChecked();
    expect(state().stars).toEqual([5]);

    fireEvent.click(screen.getByRole('radio', { name: 'Under €300' }));
    expect(state().maxPrice).toBe(300);

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters (2)' }));
    expect(state().stars).toEqual([]);
    expect(state().maxPrice).toBeNull();
    expect(screen.getByRole('radio', { name: 'Any' })).toBeChecked();
  });
});

describe('HotelCard', () => {
  beforeEach(() => resetStore(true));

  it('shows the hotel with its price and discount, and opens its details', () => {
    renderWithIntl(<HotelCard hotel={firstHotel} />);

    expect(screen.getByText('Costa Adeje')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '2 stars' })).toBeInTheDocument();
    expect(screen.getByText('€299')).toBeInTheDocument();
    expect(screen.getByText('−12%')).toBeInTheDocument();
    expect(screen.getByText(/\+2 more/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: firstHotel.name }));
    expect(state().selectedHotelId).toBe(firstHotel.id);
  });

  it('highlights its marker while hovered or focused', () => {
    renderWithIntl(<HotelCard hotel={firstHotel} />);
    const card = screen.getByRole('article');

    fireEvent.mouseEnter(card);
    expect(state().hoveredHotelId).toBe(firstHotel.id);
    fireEvent.mouseLeave(card);
    expect(state().hoveredHotelId).toBeNull();

    fireEvent.focus(screen.getByRole('button', { name: firstHotel.name }));
    expect(state().hoveredHotelId).toBe(firstHotel.id);
    fireEvent.blur(screen.getByRole('button', { name: firstHotel.name }));
    expect(state().hoveredHotelId).toBeNull();
  });
});

describe('HotelDialog', () => {
  beforeEach(() => resetStore(true));

  it('shows the selected hotel and sends it to the map', () => {
    renderWithIntl(<HotelDialog />);
    act(() => state().openHotel(firstHotel.id));

    const dialog = screen.getByRole('dialog', { name: firstHotel.name });
    expect(dialog).toHaveAttribute('open');
    expect(within(dialog).getByText('Air Conditioner')).toBeInTheDocument();
    expect(within(dialog).getByText('You save €41 per night')).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Show on map' }));
    expect(state().mapRequest).toMatchObject({ type: 'focus', hotelId: firstHotel.id });
    expect(dialog).not.toHaveAttribute('open');
  });

  it('closes with the close button and with a click on the backdrop', () => {
    renderWithIntl(<HotelDialog />);
    act(() => state().openHotel(firstHotel.id));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(state().selectedHotelId).toBeNull();

    act(() => state().openHotel(firstHotel.id));
    fireEvent.click(screen.getByRole('dialog'));
    expect(state().selectedHotelId).toBeNull();
  });
});

describe('HotelList', () => {
  it('shows placeholders while loading', () => {
    resetStore();
    renderWithIntl(<HotelList />);
    expect(screen.getByRole('heading', { name: 'Finding stays…' })).toBeInTheDocument();
  });

  it('counts the results and changes the sort order', () => {
    resetStore(true);
    renderWithIntl(<HotelList />);
    expect(screen.getByRole('heading', { name: '6 stays in this map area' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(6);
    expect(screen.getByText(/You've seen every stay/)).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox', { name: 'Sort by' }), {
      target: { value: 'price-desc' },
    });
    expect(state().sortOrder).toBe('price-desc');
  });

  it('offers to clear the filters when nothing matches', () => {
    resetStore(true);
    act(() => state().setQuery('no such hotel'));
    renderWithIntl(<HotelList />);

    expect(screen.getByRole('heading', { name: 'No stays here' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(state().query).toBe('');
  });

  it('offers to reset the map when the area is empty', () => {
    resetStore(true);
    act(() => useHotels.setState({ filteredHotels: [], paginatedHotels: [] }));
    renderWithIntl(<HotelList />);

    fireEvent.click(screen.getByRole('button', { name: 'Reset map' }));
    expect(state().mapRequest).toMatchObject({ type: 'reset' });
  });

  it('lets the visitor retry after a failed load', async () => {
    resetStore();
    act(() => useHotels.setState({ status: 'error' }));
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(fetchDataResponse),
    });
    renderWithIntl(<HotelList />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    });
    expect(global.fetch).toHaveBeenCalled();
    expect(screen.getAllByRole('article')).toHaveLength(fetchDataResponse.length);
  });
});

describe('MapView', () => {
  beforeEach(() => {
    resetStore(true);
    jest.clearAllMocks();
  });

  const lastMap = () =>
    (maplibregl.Map as unknown as jest.Mock).mock.results.at(-1)?.value;

  it('adds a price marker per listed hotel', () => {
    renderWithIntl(<MapView />);
    expect(maplibregl.Marker).toHaveBeenCalledTimes(fetchDataResponse.length);
  });

  it('flies to a hotel and resets to the whole island', () => {
    renderWithIntl(<MapView />);

    act(() => state().showHotelOnMap(firstHotel.id));
    expect(lastMap().flyTo).toHaveBeenCalledWith(
      expect.objectContaining({
        center: [firstHotel.coordinates.longitude, firstHotel.coordinates.latitude],
      })
    );
    expect(maplibregl.Popup).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Reset map' }));
    expect(lastMap().fitBounds).toHaveBeenCalled();
  });
});
