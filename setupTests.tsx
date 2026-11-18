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
      remove: jest.fn(),
    })),
    NavigationControl: jest.fn(),
    Map: jest.fn(() => ({
      addControl: jest.fn(),
      on: jest.fn(),
      remove: jest.fn(),
      resize: jest.fn(),
      flyTo: jest.fn(),
      fitBounds: jest.fn(),
      getBounds: jest.fn(() => ({ contains: jest.fn(() => true) })),
    })),
  };
  return { __esModule: true, default: api, ...api };
});

// jsdom has no modal dialogs: open and close the element directly.
HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
  this.open = true;
};
HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
  this.open = false;
  this.dispatchEvent(new Event('close'));
};

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