export const formatPrice = (
  price: number,
  maximumFractionDigits = 2,
  currency = 'USD',
) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    maximumFractionDigits,
    currency,
  }).format(price);
};

export const getTranslationKey = (key: string) => {
  return key.toLowerCase().replace(/ |-|\//g, '-');
};
