//import { scrape, scrape2 } from '@/utils/playwright';
import playwrightController from '@/controllers/playwrightController';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post(
  '/screenshot',
  playwrightController.getScreenshot,
  (req: Request, res: Response) => {
    console.log('Sending screenshot to front end');
    console.log(res.locals.screenshot.slice(0, 10));
    return res.json({ screenshot: res.locals.screenshot });
  }
);

router.post(
  '/coordinates',
  playwrightController.getElementAtCoordinates,
  (req: Request, res: Response) => {
    return res.json({ price: res.locals.price, selector: res.locals.selector });
  }
);

export default router;
