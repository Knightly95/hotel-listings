import { fetchHotels } from '../../src/api/api';
import fetchDataResponse from '../../mocks/fetchDataResponse';


describe('API Suite', () => {
  it('should fetch hotels successfully', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(fetchDataResponse),
    });

    const hotels = await fetchHotels();

    expect(hotels).toEqual(fetchDataResponse);
  });

  it('should handle fetch error', async () => {
    const mockError = new Error('Failed to fetch hotels');

    global.fetch = jest.fn().mockRejectedValue(mockError);

    await expect(fetchHotels()).rejects.toThrowError(mockError);
  });
});
