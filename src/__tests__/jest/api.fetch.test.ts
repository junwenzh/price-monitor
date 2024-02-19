import server from '@/server';
import axios from 'axios';
import request from 'supertest';

jest.mock('axios');

const mockedAxios = jest.mocked(axios);

afterAll(done => {
  server.close(done);
});

describe('GET /api/fetch', () => {
  it('should fetch data from url', async () => {
    const fakeResponse = {
      status: 200,
      data: 'html',
    };

    mockedAxios.get.mockResolvedValueOnce(fakeResponse);

    const res = await request(server).get('/api/fetch?url=http://test.com');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual(fakeResponse.data);
  });
});
