import { Request, Response, NextFunction } from 'express';
//import { url } from 'inspector';
import { priceDb } from '@/database/pricedb';

const priceController = {
  // //extract base url from url and selector
  async saveBaseUrl(req: Request, res: Response, next: NextFunction) {
    const url = res.locals.url as string;
    const regex = /^(https?:\/\/[^\/]+)/;
    const matchedUrl: RegExpMatchArray | null = url.match(regex);
    if (matchedUrl) {
      const baseUrl = matchedUrl[0];
      //update the base url table with base url and selector
    } else {
      console.log('no base url');
    }
  },
  //save to urls table, pass in url and selector
  async newTrackedItem(req: Request, res: Response, next: NextFunction) {
    try {
      // const url = res.locals.url as string;
      // const selector = res.locals.selector as string;
      const { url, selector, username, user_note, price, target_price } =
        req.body;
      const result = await priceDb.newTrackedItem(
        url,
        selector,
        username,
        user_note,
        price,
        target_price
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
  // //selector price and timestamp
  // async savePrice(req: Request, res: Response, next: NextFunction) {
  //   const price = res.locals.price as number;
  //   const url = res.locals.url as string;
  //   const timestamp = Date.now();
  //   //update table with price, url and timestamp
  // },

  // //save to fourth table
};

export { priceController };
