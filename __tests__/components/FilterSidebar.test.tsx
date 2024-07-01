import { render, screen, act } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import FilterSidebar from '@/src/components/FilterSidebar';
import messages from '@/messages/en.json';

describe('FilterSidebar', () => {
  it('should render the FilterSidebar component', async () => {
    await act(async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <FilterSidebar />
        </NextIntlClientProvider>
      );
    });
    expect(screen.getByTestId('checkbox-1')).toBeInTheDocument();
  });
});
