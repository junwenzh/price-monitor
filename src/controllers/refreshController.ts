import { Request, Response, NextFunction } from 'express';
import { priceDb } from '@/database/pricedb';

// query database for urls > [{url, selectors}]

const refreshController = {
  //geturlsandselectors needs to also get latest price
  async getUrlsandSelectors(req: Request, res: Response, next: NextFunction) {
    const result = await priceDb.getUrls();

    if (!result.length) {
      return next();
    }

    res.locals.urls = result;
    next();
  },
  // iterate through the array
  // get price for each url
  // if price != old price, save this to a list

  // iterate through each url/price object

  // update database

  // iterate through each url again
  // if price < old price, query users for their target price and compare
  // notify user
};

export default refreshController;
