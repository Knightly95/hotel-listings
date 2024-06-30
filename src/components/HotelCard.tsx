import React from 'react';
import { useTranslations } from 'next-intl';

import { formatPrice, getTranslationKey } from '../utils/utils';
import {
  CardContainer,
  ImageContainer,
  InfoContainer,
  Image,
  HotelName,
  RatingContainer,
  StarRating,
  Distance,
  PriceContainer,
  FinalPrice,
  OriginalPrice,
  FeaturesContainer,
  Feature,
  Button,
} from '../styles/components/HotelCardStyled';
import { Hotel } from '../interfaces/Hotel';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const t = useTranslations();
  return (
    <CardContainer>
      <ImageContainer>
        <Image src={hotel.image} alt={hotel.name} />
      </ImageContainer>
      <InfoContainer>
        <div>
          <HotelName>{hotel.name}</HotelName>
          <RatingContainer>
            <StarRating>{'⭐'.repeat(hotel.star)}</StarRating>
            <span>{hotel.star}</span>
          </RatingContainer>
          <Distance>
            {t('km-from-location', {
              km: hotel.coordinates.latitude.toFixed(2),
            })}
          </Distance>
          <PriceContainer>
            <FinalPrice>{formatPrice(hotel.finalPrice)}</FinalPrice>
            {hotel.finalPrice < hotel.originalPrice && (
              <OriginalPrice>{formatPrice(hotel.originalPrice)}</OriginalPrice>
            )}
          </PriceContainer>
        </div>
        <FeaturesContainer>
          {hotel.features.map((feature, index) => (
            <Feature key={index}>
              {t('ammenities.' + getTranslationKey(feature))}
            </Feature>
          ))}
        </FeaturesContainer>
        <Button>{t('view-details')}</Button>
      </InfoContainer>
    </CardContainer>
  );
};

export default HotelCard;
