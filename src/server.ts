import fetchRouter from '@/routes/fetchRouter';
import playwrightRouter from '@/routes/playwrightRouter';
import express, { NextFunction, Request, Response } from 'express';
import { endPool, testConnection } from './database/db';
import path from 'path';
import { playwrightConnection } from './utils/playwright';

const app = express();
const port = 8084;

app.use(express.json());

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

app.use('/api/scrape', playwrightRouter);

app.use('/api/fetch', fetchRouter);

app.get('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'API route not found' });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
  testConnection();
});

function shutdown() {
  endPool();
  playwrightConnection.closeBrowser();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
