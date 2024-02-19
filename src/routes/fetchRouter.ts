import { fetch } from '@/utils/fetch';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const url = req.query.url as string | undefined;

  if (!url) {
    res.json({ message: 'No url provided' });
  }

  const response = await fetch(url as string);

  res.send(response);
});

export default router;
