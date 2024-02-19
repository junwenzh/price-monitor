import axios, { AxiosResponse } from 'axios';

async function fetch(url: string): Promise<AxiosResponse<any, any>> {
  const fullUrl = ensureHttp(url);

  try {
    const response = await axios.get(fullUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Response is ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching HTML:', error);
    throw error;
  }
}

function ensureHttp(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }

  return url;
}

export { fetch };
