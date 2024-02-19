import { fetch } from '@/utils/fetch';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

describe('fetch', () => {
  it('successfully fetches data', async () => {
    const fakeResponse = {
      status: 200,
      data: 'data',
    };
    mockedAxios.get.mockResolvedValue(fakeResponse);

    const url = 'http://test.com';
    const result = await fetch(url);

    expect(result).toEqual(fakeResponse.data);
    expect(mockedAxios.get).toHaveBeenCalledWith(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      },
    });
  });

  it('throws an error when the fetch fails', async () => {
    const errorMessage = 'Error';
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

    const url = 'http://test.com';

    try {
      await fetch(url);
      fail('Fetch failed to throw an error');
    } catch (error) {
      expect((error as Error).message).toBe(errorMessage);
    }
  });
});
