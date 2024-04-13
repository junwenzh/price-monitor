import fetchRouter from '@/routes/fetchRouter';
import playwrightRouter from '@/routes/playwrightRouter';
import userRouter from '@/routes/userRouter';
import express, { NextFunction, Request, Response } from 'express';
//import { testUserDb } from './database/userdb';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { playwrightConnection } from './utils/playwright';

const app = express();
const port = 8084;

app.use(cors({ origin: 'http://localhost:8084', credentials: true }));
app.use(cookieParser());
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

app.use('/api/users', userRouter);

app.get('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'API route not found' });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
  //testUserDb();
});

function shutdown() {
  // db.closeConnection();
  playwrightConnection.closeBrowser();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
