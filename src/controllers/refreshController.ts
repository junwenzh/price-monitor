import { priceDb } from '@/database/pricedb';
// import { ErrorObject } from '@/server';
import fetchPriceFromSelector from '@/utils/fetch';
import { playwrightConnection } from '@/utils/playwright';
import sendEmail from '@/utils/sendEmail';
import { NextFunction, Request, Response } from 'express';

// query database for urls > [{url, selectors}]

type UrlsAndSelectors = {
  url: string;
  selector: string;
  use_fetch: boolean;
  price: number;
  price_timestamp: Date;
  rownumber: string;
  valid_url?: boolean;
  valid_selector?: boolean;
  latest_price?: number;
};

type UserProduct = {
  target_price: number;
  url: string;
  email: string;
};

const refreshController = {
  //geturlsandselectors needs to also get latest price
  async getUrlsandSelectors(req: Request, res: Response, next: NextFunction) {
    const result = (await priceDb.getUrls()) as UrlsAndSelectors[];

    if (!result.length) {
      return next();
    }

    const latestPrices = result.filter(record => record.rownumber === '1');

    res.locals.urls = latestPrices;

    next();
  },

  async getPriceUsingFetch(req: Request, res: Response, next: NextFunction) {
    const urls = res.locals.urls as UrlsAndSelectors[];
    const fetchUrls = urls.filter(url => url.use_fetch === true);

    for (const url of fetchUrls) {
      const result = await fetchPriceFromSelector(url.url, url.selector);
      if (result === 'Connection error') {
        url.valid_url = false;
      } else if (result === 'Element not found') {
        url.use_fetch = false;
      } else if (result === 'Element does not contain price') {
        url.valid_selector = false;
      } else {
        url.latest_price = Number(result);
      }
    }

    // res.locals.urls = [
    //   ...urls.filter(url => url.use_fetch === false),
    //   ...fetchUrls,
    // ];

    return next();
  },

  async getPriceUsingPlaywright(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const urls = res.locals.urls as UrlsAndSelectors[];
    const urlsToScrape = urls.filter(url => url.use_fetch === false);

    for (const url of urlsToScrape) {
      const result = await playwrightConnection.getPrice(url.url, url.selector);

      if (result === 'Connection error') {
        url.valid_url = false;
      } else if (
        result === 'Element not found' ||
        result === 'Element does not contain price'
      ) {
        url.valid_selector = false;
      } else {
        url.latest_price = Number(result);
      }
    }

    return next();
  },

  async checkTargetPrice(req: Request, res: Response, next: NextFunction) {
    // filter where latest_price < price
    const urls = res.locals.urls as UrlsAndSelectors[];
    const priceChangeUrls = urls.filter(
      url => url.latest_price && url.latest_price < url.price
    );
    const allUserProducts = (await priceDb.getAllProducts()) as UserProduct[]; //user email, url, target_price
    // const userProductMap = new Map();
    const userProductMap = new Map<string, UserProduct[]>();

    allUserProducts.forEach(url => {
      if (!userProductMap.has(url.url)) {
        userProductMap.set(url.url, []);
      }
      userProductMap.get(url.url)!.push(url);
    });

    priceChangeUrls.forEach(url => {
      const users = userProductMap.get(url.url) || []; // array
      // for each user, compare the target price
      users.forEach(user => {
        console.log(user);
        if (user.target_price >= url.latest_price!) {
          sendEmail({
            to: user.email,
            from: 'noreply@juncafe.com',
            subject: 'Price Drop Alert!',
            item: '',
            url: url.url,
            targetPrice: user.target_price,
            oldPrice: 0, // need to update to the old price
            currentPrice: url.latest_price || 0,
            unsubscribeUrl: '',
          });
        }
      });
    });

    return next();
  },

  // async sendNotifications() {},

  async updateDatabase(req: Request, res: Response, next: NextFunction) {
    const urls = res.locals.urls as UrlsAndSelectors[];

    const updatedUrls = urls.filter(
      url => 'valid_url' in url || 'valid_selector' in url
    );

    for (const url of updatedUrls) {
      // default valid_url and valid_selector to true
      await priceDb.updateValidity(
        url.url,
        url.valid_url || true,
        url.valid_selector || true,
        url.use_fetch
      );
    }

    const hasPrices = urls.filter(url => url.latest_price);
    // update valid_url and valid_selector and use_fetch from urls
    for (const url of hasPrices) {
      await priceDb.addPriceRecord(url.url, url.latest_price!);
    }
    // update price from pricehistory
    return next();
  },
};

export default refreshController;
