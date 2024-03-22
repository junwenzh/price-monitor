//import { scrape, scrape2 } from '@/utils/playwright';
import express, { Request, Response } from 'express';
import playwrightController from '@/controllers/playwrightController';

const router = express.Router();

router.post(
  '/screenshot',
  playwrightController.getScreenshot,
  (req: Request, res: Response) => {
    return res.json({ screenshot: res.locals.screenshot });
  }
);

router.post(
  '/coordinates',
  playwrightController.getElementAtXY,
  (req: Request, res: Response) => {
    return res.json({ price: res.locals.price, selector: res.locals.selector });
  }
);

export default router;
