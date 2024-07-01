import '@testing-library/jest-dom/';
import fetchDataResponse from './/mocks/fetchDataResponse';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Marker: jest.fn(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    setPopup: jest.fn().mockReturnThis(),
    addTo: jest.fn(),
  })),
  Popup: jest.fn(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    setHTML: jest.fn().mockReturnThis(),
    addTo: jest.fn(),
  })),
  LngLat: jest.fn(),
  GeolocateControl: jest.fn(),
  Map: jest.fn(() => ({
    addControl: jest.fn(),
    on: jest.fn(),
    remove: jest.fn(),
    getBounds: jest.fn(() => {
      contains: jest.fn(() => true);
    }),
  })),
  NavigationControl: jest.fn(),
}));

class IntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

global.fetch = jest.fn(
    () =>
      Promise.resolve({
        json: () => Promise.resolve(fetchDataResponse),
      }) as Promise<Response>
  );

/* jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      useParams: () => ({ locale: 'en' }),
      useSelectedLayoutSegment: () => ({ locale: 'en' }),
    };
  },
}));
 */