import { Request, Response, NextFunction } from 'express';
import { url } from 'inspector';

const priceController = {
  //extract base url from url and selector
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
  async saveUrl(req: Request, res: Response, next: NextFunction) {
    const url = res.locals.url as string;
    const selector = res.locals.selector as string;
    //update urls table with url and selector
  },
  //selector price and timestamp
  async savePrice(req: Request, res: Response, next: NextFunction) {
    const price = res.locals.price as number;
    const url = res.locals.url as string;
    const timestamp = Date.now();
    //update table with price, url and timestamp
  },

  //save to fourth table
};

export { priceController };
