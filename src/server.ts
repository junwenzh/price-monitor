import playwrightRouter from '@/routes/playwrightRouter';
import priceRouter from '@/routes/priceRouter';
import userRouter from '@/routes/userRouter';
import express, { NextFunction, Request, Response } from 'express';
//import { testUserDb } from './database/userdb';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import refreshRouter from './routes/refreshRouter';
import { playwrightConnection } from './utils/playwright';

const app = express();
const port = 8084;

app.use(cors({ origin: '*', credentials: true }));
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

app.use('/api/users', userRouter);

app.use('/api/price', priceRouter);

app.use('/api/refresh', refreshRouter);

app.get('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'API route not found' });
});

export type ErrorObject = {
  log?: string;
  status?: number;
  message?: string;
};

app.use(
  (err: ErrorObject, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
      return next(err); // Delegate to the default error handler if the headers are already sent
    }

    const defaultError: ErrorObject = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: 'An error occurred',
    };

    const errorObj = Object.assign({}, defaultError, err);
    console.error(errorObj.log); // Log the error
    res.status(errorObj.status || 500).json({ message: errorObj.message });
  }
);

app.listen(port, '0.0.0.0', () => {
  console.log(`App listening at http://localhost:${port}`);

  const getDateTime = () => {
    const date = Date.now();
    const dateString = date.toLocaleString();
    return dateString;
  };

  setInterval(
    () => {
      console.log(`${getDateTime()}: Initiating refresh`);
      fetch('http://localhost:8084/api/refresh').then(() =>
        console.log(`${getDateTime()}: Completed refresh`)
      );
    },
    1000 * 60 * 60 * 8
  );
});

function shutdown() {
  // db.closeConnection();
  playwrightConnection.closeBrowser();
  console.log('Shutting down...');
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
