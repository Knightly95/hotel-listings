import { formatPrice, getTranslationKey } from '@/src/utils/utils';

describe('formatPrice', () => {
  it('should format the price correctly', () => {
    const price = 1000;
    const formattedPrice = formatPrice(price);

    expect(formattedPrice).toBe('$1,000.00');
  });

  it('should format the price with custom options', () => {
    const price = 1000;
    const maximumFractionDigits = 0;
    const currency = 'EUR';
    const formattedPrice = formatPrice(price, maximumFractionDigits, currency);

    expect(formattedPrice).toBe('€1,000');
  });
});

describe('getTranslationKey', () => {
  it('should return the correct translation key', () => {
    const key = 'Hello World';
    const expectedTranslationKey = 'hello-world';
    const translationKey = getTranslationKey(key);

    expect(translationKey).toBe(expectedTranslationKey);
  });

  it('should handle special characters in the key', () => {
    const key = 'Hello/World';
    const expectedTranslationKey = 'hello-world';
    const translationKey = getTranslationKey(key);

    expect(translationKey).toBe(expectedTranslationKey);
  });

  it('should handle uppercase characters in the key', () => {
    const key = 'Hello World';
    const expectedTranslationKey = 'hello-world';
    const translationKey = getTranslationKey(key);

    expect(translationKey).toBe(expectedTranslationKey);
  });
});
