// Header.tsx
import React from 'react';
import { useTranslations } from 'next-intl';

import {
  HeaderContainer,
  SortSelect,
} from '@/src/styles/components/HeaderStyled';
import useHotels from '@/src/store/hotelStore';

// Componente Header
const Header: React.FC = () => {
  const { handleSortChange } = useHotels();
  const t = useTranslations();

  return (
    <HeaderContainer>
      <h1>{t('hotels')}</h1>
      <SortSelect onChange={(e) => handleSortChange(e.target.value)}>
        <option value="price-asc">{t('price-asc')}</option>
        <option value="price-desc">{t('price-desc')}</option>
      </SortSelect>
    </HeaderContainer>
  );
};

export default Header;
