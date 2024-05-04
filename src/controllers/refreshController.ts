import { priceDb } from '@/database/pricedb';
import { ErrorObject } from '@/server';
import fetchPriceFromSelector from '@/utils/fetch';
import { NextFunction, Request, Response } from 'express';

// query database for urls > [{url, selectors}]

type UrlsAndSelectors = {
  url: string;
  selector: string;
  use_fetch: boolean;
};

const refreshController = {
  //geturlsandselectors needs to also get latest price
  async getUrlsandSelectors(req: Request, res: Response, next: NextFunction) {
    const result = (await priceDb.getUrls()) as UrlsAndSelectors[];

    if (!result.length) {
      return next();
    }

    res.locals.urls = result;
    next();
  },
  // iterate through the array
  async getPrices(req: Request, res: Response, next: NextFunction) {
    // guaranteed to exist at this point
    const urls = res.locals.urls as UrlsAndSelectors[];

    for (const url of urls) {
      if (url.use_fetch) {
        const price = await fetchPriceFromSelector(url.url, url.selector);
        if (price === 'Element not found') {
          // update database

          const err: ErrorObject = {
            log: 'From refreshController getPrices. Could not find price element',
            status: 500,
            message: 'Could not find price element',
          };

          return next(err);
        }

        if (price === 'Connection error') {
          // update database

          const err: ErrorObject = {
            log: 'From refreshController getPrices. Error accessing url',
            status: 500,
            message: 'Error accessing the URL',
          };

          return next(err);
        }
      } else {
        console.log('Use playwright');
      }
    }
  },
  // get price for each url
  // if price != old price, save this to a list

  // iterate through each url/price object

  // update database

  // iterate through each url again
  // if price < old price, query users for their target price and compare
  // notify user
};

export default refreshController;
