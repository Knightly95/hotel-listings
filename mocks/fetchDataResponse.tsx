import { Hotel } from '@/src/interfaces/Hotel';

const hotels: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'Ocean Vista Hotel',
    town: 'Costa Adeje',
    finalPrice: 299,
    originalPrice: 340,
    star: 2,
    features: ['WIFI', 'TV', 'Air Conditioner', 'Breakfast'],
    image: 'images/hotels/01.webp',
    coordinates: {
      latitude: 28.2916,
      longitude: -16.6291,
    },
  },
  {
    id: 'hotel-2',
    name: 'Sunrise Retreat',
    town: 'La Laguna',
    finalPrice: 400,
    originalPrice: 499,
    star: 4,
    features: ['WIFI', 'TV', 'Air Conditioner', 'Breakfast'],
    image: 'images/hotels/01.webp',
    coordinates: {
      latitude: 28.4845,
      longitude: -16.3434,
    },
  },
  {
    id: 'hotel-3',
    name: 'Costa Harmony Resort',
    town: 'Puerto de la Cruz',
    finalPrice: 600,
    originalPrice: 700,
    star: 2,
    features: ['WIFI', 'TV', 'Air Conditioner', 'Breakfast'],
    image: 'images/hotels/01.webp',
    coordinates: {
      latitude: 28.1007,
      longitude: -16.6809,
    },
  },
  {
    id: 'hotel-4',
    name: 'Blue Wave Inn',
    town: 'Los Cristianos',
    finalPrice: 300,
    originalPrice: 400,
    star: 5,
    features: ['WIFI', 'TV', 'Air Conditioner', 'Breakfast'],
    image: 'images/hotels/01.webp',
    coordinates: {
      latitude: 28.1235,
      longitude: -16.726,
    },
  },
  {
    id: 'hotel-5',
    name: 'Cliffside Getaway',
    town: 'Santa Cruz',
    finalPrice: 400,
    originalPrice: 500,
    star: 2,
    features: ['WIFI', 'TV', 'Air Conditioner', 'Breakfast'],
    image: 'images/hotels/01.webp',
    coordinates: {
      latitude: 28.2925,
      longitude: -16.5123,
    },
  },
  {
    id: 'hotel-6',
    name: 'Tropical Paradise Hotel',
    town: 'El Médano',
    finalPrice: 400,
    originalPrice: 500,
    star: 2,
    features: ['Pool', 'Free Parking', 'Pet Friendly', 'Gym'],
    image: 'images/hotels/01.webp',
    coordinates: {
      latitude: 28.2563,
      longitude: -16.4291,
    },
  },
];

export default hotels;
