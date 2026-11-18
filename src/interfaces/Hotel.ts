export interface Hotel {
  id: string;
  name: string;
  /** The town the hotel is in, for example "Costa Adeje". */
  town: string;
  /** Price per night after any discount, in euros. */
  finalPrice: number;
  /** Price per night before the discount, in euros. */
  originalPrice: number;
  star: number;
  features: string[];
  /** Path relative to the site root, for example "images/hotels/01.webp". */
  image: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}
