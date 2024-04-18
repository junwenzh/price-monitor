import fetchRouter from '@/routes/fetchRouter';
import playwrightRouter from '@/routes/playwrightRouter';
import userRouter from '@/routes/userRouter';
import priceRouter from '@/routes/priceRouter';
import express, { NextFunction, Request, Response } from 'express';
//import { testUserDb } from './database/userdb';
import path from 'path';
import { playwrightConnection } from './utils/playwright';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import refreshRouter from './routes/refreshRouter';

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

// app.use(
//   (
//     err: ErrorObject,
//     req: Request,
//     res: Response,
//     _next: NextFunction
//   ): void => {
//     const defaultError: ErrorObject = {
//       log: 'Express error handler caught unknown middleware error',
//       status: 500,
//       message: 'An error occurred',
//     };

//     const errorObj = Object.assign({}, defaultError, err);

//     console.error(errorObj.log); // Log the error

//     res.status(errorObj.status || 400).json({
//       message: errorObj.message,
//     }); // Send an error response
//   }
// );

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
