import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import {
  LayoutContainer,
  HeaderContainer,
  MainContainer,
  Sidebar,
  MainContent,
  MapContainer,
  ContentContainer,
} from '../styles/components/LayoutSearchStyled';

interface LayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  map: ReactNode;
}

// Componente Layout
const Layout: React.FC<LayoutProps> = ({ children, sidebar, map }) => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <LayoutContainer>
      <HeaderContainer>
        <h1>{t('hotel-finder')}</h1>
      </HeaderContainer>
      <MainContainer>
        <ContentContainer>
          <Sidebar>{sidebar}</Sidebar>
          <MainContent>{children}</MainContent>
        </ContentContainer>
        <MapContainer>{map}</MapContainer>
      </MainContainer>
    </LayoutContainer>
  );
};

export default Layout;
