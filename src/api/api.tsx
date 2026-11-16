import { Hotel } from '../interfaces/Hotel';

/** Set when the app is hosted under a sub-path, e.g. on GitHub Pages. */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const HOTELS_ENDPOINT = `${BASE_PATH}/api/hotels.json`;

export const fetchHotels = async (): Promise<Hotel[]> => {
  const response = await fetch(HOTELS_ENDPOINT);
  return response.json();
};
