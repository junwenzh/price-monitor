import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import { test } from './utils/scraper';
import { fetch } from './utils/fetch';

const app = express();
const port = 8084;

if (process.env.NODE_ENV !== 'DEVELOPMENT') {
  app.use(express.static(__dirname));

  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/')) {
      next();
    } else {
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  });
}

app.get('/api/scrape', async (req: Request, res: Response) => {
  const content = await test();
  res.send(content);
});

app.get('/api/fetch', async (req: Request, res: Response) => {
  const url = req.query.url as string | undefined;

  if (!url) {
    res.json({ message: 'No url provided' });
  }

  const response = await fetch(url as string);

  res.send(response);
});

app.get('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'API route not found' });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
