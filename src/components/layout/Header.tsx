import React from 'react';
import { useTranslations } from 'next-intl';

import {
  HeaderContainer,
  SortSelect,
} from '@/src/styles/components/HeaderStyled';
import useHotels from '@/src/store/hotelStore';

// Sort control shown above the hotel list
const Header: React.FC = () => {
  const { handleSortChange } = useHotels();
  const t = useTranslations();

  return (
    <HeaderContainer>
      <h2>{t('hotels')}</h2>
      <SortSelect
        aria-label={t('sort-by')}
        onChange={(e) => handleSortChange(e.target.value)}
      >
        <option value="price-asc">{t('price-asc')}</option>
        <option value="price-desc">{t('price-desc')}</option>
      </SortSelect>
    </HeaderContainer>
  );
};

export default Header;
