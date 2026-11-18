import '@testing-library/jest-dom/';
import fetchDataResponse from './/mocks/fetchDataResponse';

jest.mock('maplibre-gl', () => {
  const api = {
    Marker: jest.fn(() => ({
      setLngLat: jest.fn().mockReturnThis(),
      setPopup: jest.fn().mockReturnThis(),
      addTo: jest.fn().mockReturnThis(),
      remove: jest.fn(),
      getElement: jest.fn(() => document.createElement('div')),
    })),
    Popup: jest.fn(() => ({
      setLngLat: jest.fn().mockReturnThis(),
      setDOMContent: jest.fn().mockReturnThis(),
      addTo: jest.fn().mockReturnThis(),
    })),
    Map: jest.fn(() => ({
      addControl: jest.fn(),
      on: jest.fn(),
      remove: jest.fn(),
      getBounds: jest.fn(() => ({ contains: jest.fn(() => true) })),
    })),
  };
  return { __esModule: true, default: api, ...api };
});

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