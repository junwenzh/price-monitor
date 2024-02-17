import express from 'express';
import { test } from './utils/scraper';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/scrape', async (req, res) => {
  const content = await test();
  // console.log(content);
  res.send(content);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
