import { Request, Response, NextFunction } from 'express';
import { priceDb } from '@/database/pricedb';

// query database for urls > [{url, selectors}]

const refreshController = {
  async getUrlsandSelectors(req: Request, res: Response, next: NextFunction) {
    const result = await priceDb.getUrls();

    if (!result.length) {
      return next();
    }

    res.locals.urls = result;
    next();
  },
};

export default refreshController;
