import { render, screen, act } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import Search from '@/src/app/[locale]/page';
import messages from '@/messages/en.json';

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
