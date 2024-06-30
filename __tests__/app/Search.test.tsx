import { render, screen, act , renderHook} from '@testing-library/react';
import Search from '../../src/app/[locale]/page';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../messages/en.json';
import fetchDataResponse from '../../mocks/fetchDataResponse';

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      json: () => Promise.resolve(fetchDataResponse),
    }) as Promise<Response>
);

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      useParams: () => ({ locale: 'en' }),
      useSelectedLayoutSegment: () => ({ locale: 'en' }),
    };
  },
}));

describe('Search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the Search page', async () => {
    await act(async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <Search />
        </NextIntlClientProvider>
      );
    });

    expect(screen.getByTestId('hotel-card-0')).toBeInTheDocument();
  });
});
