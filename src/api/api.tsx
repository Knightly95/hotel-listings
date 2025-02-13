import { Hotel } from '../interfaces/Hotel';

export const fetchHotels = async (): Promise<Hotel[]> => {
  try {
    const response = await fetch(
      'https://my-json-server.typicode.com/ma-maarlab/ma-maarlab/hotels'
    );
    const data = await response.json();
    return data;
  } catch (error) {
    //console.error(error);
    throw error;
  }
};
