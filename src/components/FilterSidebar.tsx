import React from 'react';
import { useTranslations } from 'next-intl';

import {
  FilterContainer,
  Card,
  FilterTitle,
  FilterCheckbox,
} from '@/src/styles/components/FilterSidebarStyled';
import { formatPrice, getTranslationKey } from '@/src/utils/utils';
import useHotels from '@/src/store/hotelStore';

// Definición de tipos
interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  title: string;
  options: FilterOption[];
}

const FilterSidebar: React.FC = () => {
  const { filters, handleFilterChange } = useHotels();
  const t = useTranslations();

  return (
    <>
      {filters.map((filter: Filter) => (
        <Card key={filter.title}>
          <FilterContainer>
            <FilterTitle>{t(getTranslationKey(filter.title))}</FilterTitle>
            {filter.options.map((option) => (
              <FilterCheckbox key={option.value}>
                <input
                  id={`filter-${filter.title}-${option.value}`}
                  type="checkbox"
                  value={option.value}
                  onChange={(e) =>
                    handleFilterChange(
                      filter.title,
                      option.value,
                      e.target.checked
                    )
                  }
                  data-testid={`checkbox-${option.value}`}
                />
                <label htmlFor={`filter-${filter.title}-${option.value}`}>
                  {filter.title === 'Stars'
                    ? t('star-rating', {
                        rating: option.value,
                      })
                    : t('price-filter', {
                        price: formatPrice(
                          Number(option.value.split('-')[1]),
                          0
                        ),
                      })}
                </label>
              </FilterCheckbox>
            ))}
          </FilterContainer>
        </Card>
      ))}
    </>
  );
};

export default FilterSidebar;
