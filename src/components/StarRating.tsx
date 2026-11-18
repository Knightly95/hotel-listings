import React from 'react';
import { useTranslations } from 'next-intl';

import { StarIcon } from './icons';

interface StarRatingProps {
  stars: number;
  className?: string;
}

/** The hotel's star category as filled stars, read out as "4 stars". */
const StarRating: React.FC<StarRatingProps> = ({ stars, className = '' }) => {
  const t = useTranslations();
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-amber-400 ${className}`}
      role="img"
      aria-label={t('star-rating', { rating: stars })}
    >
      {Array.from({ length: stars }, (_, index) => (
        <StarIcon key={index} className="size-3.5" />
      ))}
    </span>
  );
};

export default StarRating;
