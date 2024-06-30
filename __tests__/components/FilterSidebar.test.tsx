import { render, screen, act } from '@testing-library/react';
import FilterSidebar from '../../src/components/FilterSidebar';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../messages/en.json';

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
