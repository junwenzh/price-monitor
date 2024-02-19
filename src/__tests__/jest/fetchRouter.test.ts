import fetchRouter from '@/routes/fetchRouter';
import axios from 'axios';
import express from 'express';
import request from 'supertest';

const app = express();
app.use('/api/fetch', fetchRouter);

jest.mock('axios');

const mockedAxios = jest.mocked(axios);

describe('GET /api/fetch', () => {
  it('should fetch data from url', async () => {
    const fakeResponse = {
      status: 200,
      data: 'html',
    };

    mockedAxios.get.mockResolvedValueOnce(fakeResponse);

    const res = await request(app).get('/api/fetch?url=http://test.com');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual(fakeResponse.data);
  });
});
