import { generateHotels, HOTEL_COUNT, PHOTO_COUNT } from '@/src/data/hotels';
import { getTranslationKey } from '@/src/utils/utils';
import en from '@/messages/en.json';
import es from '@/messages/es.json';

describe('Hotels dataset', () => {
  const hotels = generateHotels();

  it('generates the expected number of hotels', () => {
    expect(hotels).toHaveLength(HOTEL_COUNT);
  });

  it('is deterministic: the same seed gives the same data', () => {
    expect(generateHotels()).toEqual(hotels);
    expect(generateHotels(HOTEL_COUNT, 7)).not.toEqual(hotels);
  });

  it('produces valid prices, ratings and coordinates in Tenerife', () => {
    for (const hotel of hotels) {
      expect(hotel.star).toBeGreaterThanOrEqual(1);
      expect(hotel.star).toBeLessThanOrEqual(5);
      expect(hotel.finalPrice).toBeGreaterThan(0);
      expect(hotel.finalPrice).toBeLessThanOrEqual(hotel.originalPrice);
      expect(hotel.coordinates.latitude).toBeGreaterThan(27.9);
      expect(hotel.coordinates.latitude).toBeLessThan(28.6);
      expect(hotel.coordinates.longitude).toBeGreaterThan(-17);
      expect(hotel.coordinates.longitude).toBeLessThan(-16.1);
    }
  });

  it('gives every hotel an id, a town and one of the bundled photos', () => {
    expect(new Set(hotels.map((hotel) => hotel.id)).size).toBe(HOTEL_COUNT);
    for (const hotel of hotels) {
      expect(hotel.name).toContain(hotel.town);
      expect(hotel.image).toMatch(/^images\/hotels\/\d{2}\.webp$/);
      const photo = Number(hotel.image.match(/(\d{2})\.webp$/)?.[1]);
      expect(photo).toBeGreaterThanOrEqual(1);
      expect(photo).toBeLessThanOrEqual(PHOTO_COUNT);
    }
  });

  it('never shows the same photo twice in a row when sorted by price', () => {
    const byPrice = [...hotels].sort((a, b) => a.finalPrice - b.finalPrice);
    byPrice.slice(1).forEach((hotel, index) => {
      expect(hotel.image).not.toBe(byPrice[index].image);
    });
  });

  it('only uses features that are translated in every language', () => {
    const features = new Set(hotels.flatMap((hotel) => hotel.features));
    for (const feature of Array.from(features)) {
      const key = getTranslationKey(feature);
      expect(en.ammenities).toHaveProperty([key]);
      expect(es.ammenities).toHaveProperty([key]);
    }
  });
});
