import { act, fireEvent, screen } from '@testing-library/react';

import Search from '@/src/app/[locale]/page';
import fetchDataResponse from '@/mocks/fetchDataResponse';
import { renderWithIntl, resetStore } from '@/test-utils/render';

describe('Search page', () => {
  beforeEach(() => {
    resetStore();
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(fetchDataResponse),
    });
  });

  it('loads the hotels and lists them', async () => {
    await act(async () => {
      renderWithIntl(<Search />);
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Hotel Finder' })).toBeInTheDocument();
    expect(screen.getByTestId('hotel-card-0')).toBeInTheDocument();
  });

  it('switches between the list and the map on small screens', async () => {
    await act(async () => {
      renderWithIntl(<Search />);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Show map' }));
    expect(screen.getByTestId('results-panel')).toHaveClass('hidden');
    expect(screen.getByTestId('map-panel')).not.toHaveClass('hidden');

    fireEvent.click(screen.getByRole('button', { name: 'Show list' }));
    expect(screen.getByTestId('map-panel')).toHaveClass('hidden');
  });
});
