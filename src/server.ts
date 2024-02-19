import fetchRouter from '@/routes/fetchRouter';
import { test } from '@/utils/scraper';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';

const app = express();
const port = 8084;

if (process.env.NODE_ENV !== 'development') {
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

app.use('/api/fetch', fetchRouter);

app.get('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'API route not found' });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
