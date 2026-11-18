import { Hotel } from '../interfaces/Hotel';
import { BASE_PATH } from '../utils/utils';

export const HOTELS_ENDPOINT = `${BASE_PATH}/api/hotels.json`;

export const fetchHotels = async (): Promise<Hotel[]> => {
  const response = await fetch(HOTELS_ENDPOINT);
  if (response.ok === false) {
    throw new Error(`Hotels request failed with status ${response.status}`);
  }
  return response.json();
};
