import {
  assetUrl,
  discountPercent,
  formatPrice,
  getTranslationKey,
  normalizeText,
} from '@/src/utils/utils';

describe('formatPrice', () => {
  it('formats whole euros for the visitor’s language', () => {
    expect(formatPrice(1000)).toBe('€1,000');
    // Spanish puts the symbol after the amount, with a non-breaking space.
    expect(formatPrice(1000, 'es').replace(/\s/g, ' ')).toBe('1000 €');
  });

  it('accepts another currency', () => {
    expect(formatPrice(99, 'en', 'USD')).toBe('$99');
  });
});

describe('discountPercent', () => {
  it('rounds the saving to a whole percentage', () => {
    expect(discountPercent(100, 75)).toBe(25);
    expect(discountPercent(47, 33)).toBe(30);
  });

  it('is zero when there is no discount', () => {
    expect(discountPercent(80, 80)).toBe(0);
  });
});

describe('assetUrl', () => {
  it('points at the site root and leaves full URLs alone', () => {
    expect(assetUrl('images/hotels/01.webp')).toBe('/images/hotels/01.webp');
    expect(assetUrl('/images/hotels/01.webp')).toBe('/images/hotels/01.webp');
    expect(assetUrl('https://example.com/a.webp')).toBe('https://example.com/a.webp');
  });
});

describe('normalizeText', () => {
  it('drops accents, case and surrounding spaces', () => {
    expect(normalizeText('  El Médano ')).toBe('el medano');
  });
});

describe('getTranslationKey', () => {
  it('turns a feature name into a translation key', () => {
    expect(getTranslationKey('Hello World')).toBe('hello-world');
    expect(getTranslationKey('Hello/World')).toBe('hello-world');
    expect(getTranslationKey('Air Conditioner')).toBe('air-conditioner');
  });
});
