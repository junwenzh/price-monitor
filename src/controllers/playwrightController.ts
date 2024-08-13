import { ErrorObject } from '@/server';
import { playwrightConnection } from '@/utils/playwright';
import { NextFunction, Request, Response } from 'express';

class PlaywrightController {
  async getScreenshot(req: Request, res: Response, next: NextFunction) {
    const url = req.body.url as string;

    console.log(`Received url ${url}`);

    if (!url) {
      return next({
        message: {
          err: 'Missing URL',
        },
      });
    }

    console.log('Opening url with playwright');

    const screenshotString = await playwrightConnection.getScreenshot(url);
    res.locals.screenshot = screenshotString;
    return next();
  }

  async getElementAtCoordinates(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const url = req.body.url as string;
    const coordinates = req.body.coordinates as { x: number; y: number };

    if (!url || !coordinates) {
      return next({
        message: {
          err: 'Missing URL or coordinates',
        },
      });
    }

    const price = await playwrightConnection.getElementAtCoordinates(
      url,
      coordinates
    );

    if (!price) {
      const err: ErrorObject = {
        log: 'Could not find an element with number at the specified coordinates',
        status: 400,
        message: 'Error locating the price element',
      };

      return next(err);
    }

    res.locals.price = price.price;
    res.locals.selector = price.selector;

    return next();
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

    const price = await playwrightConnection.getPrice(url, selector);

    if (
      price === 'Element not found' ||
      price === 'Price element does not contain number'
    ) {
      const err: ErrorObject = {
        log: 'Could not find the price element',
        status: 400,
        message: 'Error locating the price',
      };
      return next(err);
    }

    res.locals.price = price;
    return next();
  }
}

export default new PlaywrightController();
