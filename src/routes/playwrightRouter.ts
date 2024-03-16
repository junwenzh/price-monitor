import { scrape, scrape2 } from '@/utils/playwright';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/screenshot', async (req: Request, res: Response) => {
  // const url = req.query.url as string | undefined;
  const url = req.body.url as string;

  console.log('get', url);

  if (!url) {
    res.json({ message: 'No url provided' });
  }

  const response = await scrape(url);

  res.send(response);
});

router.post('/coordinates', async (req: Request, res: Response) => {
  // const { url, x, y } = req.body;
  const url = req.body.url as string;
  const x = req.body.x as string;
  const y = req.body.y as string;

  console.log('post', url);

  if (!url || !x || !y) {
    return res.json({ message: 'Missing argument' });
  }

  const element = await scrape2({ url, x: Number(x), y: Number(y) });

  return res.json(element);
});

export default router;
