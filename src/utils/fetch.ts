import axios, { AxiosResponse } from 'axios';

async function fetch(url: string): Promise<AxiosResponse<any, any>> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching HTML:', error);
    throw error;
  }
}

export { fetch };
