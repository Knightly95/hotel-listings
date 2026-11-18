/** Set when the app is hosted under a sub-path, e.g. on GitHub Pages. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** A whole-euro price in the visitor's language: "€120" in English, "120 €" in Spanish. */
export const formatPrice = (price: number, locale = 'en', currency = 'EUR') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);

/** Percentage saved, rounded: 100 → 75 is 25. */
export const discountPercent = (originalPrice: number, finalPrice: number) =>
  originalPrice > finalPrice
    ? Math.round((1 - finalPrice / originalPrice) * 100)
    : 0;

/** URL of a file in `public/`, working under the GitHub Pages sub-path too. */
export const assetUrl = (path: string) =>
  /^https?:\/\//.test(path) ? path : `${BASE_PATH}/${path.replace(/^\//, '')}`;

export const getTranslationKey = (key: string) => {
  return key.toLowerCase().replace(/ |-|\//g, '-');
};

/** Lower case without accents, so "medano" finds "El Médano". */
export const normalizeText = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
