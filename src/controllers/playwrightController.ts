import { playwrightConnection, getPriceElements } from '@/utils/playwright';
import { Request, Response, NextFunction } from 'express';
import { ErrorObject } from '@/server';

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

  async getPrice(req: Request, res: Response, next: NextFunction) {
    // given a url and selector, open the page and get the price
    const url = req.body.url;
    const selector = req.body.selector;

    if (typeof url !== 'string' && typeof selector !== 'string') {
      const err: ErrorObject = {
        log: 'From playwrightController.getPrice. Missing url or selector',
        message: 'Missing url or selector',
        status: 400,
      };
      return next(err);
    }

    const page = await playwrightConnection.getPage(url);
    const element = page.locator(selector);

    if (!element) {
      const err: ErrorObject = {
        log: 'From playwrightController.getPrice. Element not found at selector',
        status: 500,
      };
      return next(err);
    }

    const price = await element.textContent();

    if (!price) {
      const err: ErrorObject = {
        log: 'From playwrightController.getPrice. Element has no text',
        status: 500,
      };
      return next(err);
    }
    // convert the price to a number
    const re = /\d+(\.\d+)?/;
    const matches = price.match(re);

    if (!matches) {
      const err: ErrorObject = {
        log: 'From playwrightController.getPrice. Element text has no price',
        status: 500,
      };
      return next(err);
    }

    res.locals.price = matches[0];
    return next();
  }
}

export default new PlaywrightController();
