import { playwrightConnection, getPriceElements } from '@/utils/playwright';
import { Request, Response, NextFunction } from 'express';

class PlaywrightController {
  // original scrape
  async getScreenshot(req: Request, res: Response, next: NextFunction) {
    const url = req.body.url as string;
    if (!url) {
      return next({
        message: {
          err: 'Missing URL',
        },
      });
    }

    const page = await playwrightConnection.getPage(url);
    const screenshotBuffer = await page.screenshot({ fullPage: false });
    const screenshotString = screenshotBuffer.toString('base64');
    res.locals.screenshot = screenshotString;
    return next();
  }

  async getElementAtXY(req: Request, res: Response, next: NextFunction) {
    const url = req.body.url as string;
    const coordinates = req.body.coordinates as { x: number; y: number };

    // console.log(url, coordinates);

    if (!url || !coordinates) {
      return next({
        message: {
          err: 'Missing URL or coordinates',
        },
      });
    }

    const page = await playwrightConnection.getPage(url);

    // console.log('page', page);

    const elements = await page.evaluate(getPriceElements, coordinates);

    // console.log('elements', elements);

    if (elements.price !== 'Not found') {
      res.locals.price = elements.price;
      res.locals.selector = elements.selector;
      return next();
    } else {
      return next({
        message: {
          err: 'Price not found',
        },
      });
    }
  }
}

export default new PlaywrightController();
