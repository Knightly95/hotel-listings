import { Hotel } from '@/src/interfaces/Hotel';

/**
 * Deterministic hotel dataset served by `/api/hotels.json`.
 *
 * Hotels are generated around real towns in Tenerife with a seeded random
 * generator, so every build produces the same data and the map, filters and
 * pagination have a realistic amount of content to work with.
 */

export const HOTEL_COUNT = 300;

const TOWNS = [
  { name: 'Santa Cruz', latitude: 28.4636, longitude: -16.2518 },
  { name: 'La Laguna', latitude: 28.4874, longitude: -16.3159 },
  { name: 'Puerto de la Cruz', latitude: 28.414, longitude: -16.5448 },
  { name: 'Los Cristianos', latitude: 28.0519, longitude: -16.7167 },
  { name: 'Costa Adeje', latitude: 28.099, longitude: -16.737 },
  { name: 'Playa de las Américas', latitude: 28.062, longitude: -16.73 },
  { name: 'Los Gigantes', latitude: 28.243, longitude: -16.841 },
  { name: 'El Médano', latitude: 28.045, longitude: -16.536 },
  { name: 'Garachico', latitude: 28.373, longitude: -16.764 },
  { name: 'La Orotava', latitude: 28.39, longitude: -16.523 },
  { name: 'Candelaria', latitude: 28.355, longitude: -16.371 },
  { name: 'Icod de los Vinos', latitude: 28.367, longitude: -16.718 },
  { name: 'Vilaflor', latitude: 28.157, longitude: -16.636 },
  { name: 'Güímar', latitude: 28.315, longitude: -16.412 },
  { name: 'Tacoronte', latitude: 28.477, longitude: -16.411 },
  { name: 'Las Galletas', latitude: 28.008, longitude: -16.657 },
];

const NAME_PREFIXES = [
  'Ocean',
  'Sunrise',
  'Costa',
  'Blue Wave',
  'Atlantic',
  'Volcano',
  'Palm',
  'Coral',
  'Golden Sand',
  'Teide',
  'Marina',
  'Sunset',
  'Laurel',
  'Dragon Tree',
  'Trade Wind',
];

const NAME_SUFFIXES = [
  'Vista Hotel',
  'Retreat',
  'Harmony Resort',
  'Inn',
  'Suites',
  'Boutique Hotel',
  'Lodge',
  'Beach Club',
  'Apartments',
  'Grand Hotel',
  'Garden Resort',
  'Spa & Resort',
];

/** Every entry has a matching translation under `ammenities` in `messages/`. */
const FEATURES = [
  'WIFI',
  'TV',
  'Air Conditioner',
  'Breakfast',
  'Pool',
  'Free Parking',
  'Pet Friendly',
  'Gym',
  'Private Beach',
  'Airport Shuttle',
  'Kids Club',
  'All Inclusive',
  'Mountain View',
  'Jacuzzi',
  'Spa',
  'Room Service',
  'Ocean View',
  'Rooftop Terrace',
  'Infinity Pool',
  'Beach Bar',
  'Balcony',
  'Kitchenette',
];

/** Roughly 600 m: keeps hotels close to their town. */
const COORDINATE_JITTER = 0.006;

/** mulberry32: a tiny seeded pseudo-random number generator. */
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateHotels(count = HOTEL_COUNT, seed = 2024): Hotel[] {
  const random = createRandom(seed);
  const int = (min: number, max: number) =>
    min + Math.floor(random() * (max - min + 1));
  const pick = <T>(items: T[]): T => items[int(0, items.length - 1)];
  const jitter = () => (random() * 2 - 1) * COORDINATE_JITTER;

  const hotels: Hotel[] = [];
  for (let i = 0; i < count; i++) {
    const town = pick(TOWNS);
    const star = int(1, 5);
    // Price loosely follows the star rating, with some overlap between tiers.
    const originalPrice = int(35, 75) * star + int(10, 60);
    const discounted = random() < 0.6;
    const finalPrice = discounted
      ? Math.round(originalPrice * (1 - int(5, 30) / 100))
      : originalPrice;

    const features: string[] = [];
    const featureCount = int(3, 6);
    while (features.length < featureCount) {
      const feature = pick(FEATURES);
      if (!features.includes(feature)) features.push(feature);
    }

    hotels.push({
      name: `${pick(NAME_PREFIXES)} ${pick(NAME_SUFFIXES)} ${town.name}`,
      finalPrice,
      originalPrice,
      star,
      features,
      image: `https://picsum.photos/seed/hotel-${i + 1}/400/300`,
      coordinates: {
        latitude: Number((town.latitude + jitter()).toFixed(5)),
        longitude: Number((town.longitude + jitter()).toFixed(5)),
      },
    });
  }
  return hotels;
}
