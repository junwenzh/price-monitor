import { scrape, scrape2 } from '@/utils/playwright';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/1', async (req: Request, res: Response) => {
  const url = req.query.url as string | undefined;

  if (!url) {
    res.json({ message: 'No url provided' });
  }

  const response = await scrape(url as string);

  res.send(response);
});

router.get('/2', async (req: Request, res: Response) => {
  // const { url, x, y } = req.query;
  const url = req.query.url as string;
  const x = req.query.x as string;
  const y = req.query.y as string;

  console.log(url, x, y);

  if (!url || !x || !y) {
    return res.json({ message: 'Missing argument' });
  }

  const element = await scrape2({ url, x: Number(x), y: Number(y) });

  return res.json(element);
});

export default router;
