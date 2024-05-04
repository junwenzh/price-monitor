import express, { Request, Response } from 'express';
import refreshController from '@/controllers/refreshController';
import { ErrorObject } from '@/server';
import { playwrightConnection } from '@/utils/playwright';
const router = express.Router();

router.get(
  '/',
  refreshController.getUrlsandSelectors,
  refreshController.getPriceUsingFetch,
  refreshController.getPriceUsingPlaywright,
  refreshController.checkTargetPrice,
  refreshController.updateDatabase,
  (_req: Request, res: Response) => {
    console.log('Done refreshing');
    res.end();
  }
  // async (req: Request, res: Response) => {
  //   // query database for urls > [{url, selectors}]
  //   const sampleData = [
  //     {
  //       url: 'https://www.fragrancenet.com/perfume/gianni-versace/versace-bright-crystal/edt#145893',
  //       selector: '#pwcprice',
  //     },
  //   ];

  //   const results = [];
  //   // iterate through the array
  //   for (const url of sampleData) {
  //     const price = await getPrice(url.url, url.selector);
  //     results.push({
  //       url: url.url,
  //       selector: url.selector,
  //       price,
  //     });

  //     const users = `
  //     select distinct user.username, user.email
  //     from users
  //     join user_produdcts on users.id=user_products.user_id
  //     where user_products.url = '' and users.target_price > price
  //     `;

  //     // iterate through users
  //     // call ses on each email
  //   }

  //   console.log(results);
  //   // for each url
  //   // call fetch('/api/scrape/getprice') > price
  //   // query database (user_products) for users that are tracking this

  //   // for each user
  //   // send email with SES
  //   // console.log(res.locals.urls);
  //   res.end();
  // }
);

// async function getPrice(url: string, selector: string) {
//   if (typeof url !== 'string' && typeof selector !== 'string') {
//     const err: ErrorObject = {
//       log: 'From playwrightController.getPrice. Missing url or selector',
//       message: 'Missing url or selector',
//       status: 400,
//     };
//     return err;
//   }

//   const page = await playwrightConnection.getPage(url);
//   const element = page.locator(selector);

//   if (!element) {
//     const err: ErrorObject = {
//       log: 'From playwrightController.getPrice. Element not found at selector',
//       status: 500,
//     };
//     return err;
//   }

//   const price = await element.textContent();

//   if (!price) {
//     const err: ErrorObject = {
//       log: 'From playwrightController.getPrice. Element has no text',
//       status: 500,
//     };
//     return err;
//   }
//   // convert the price to a number
//   const re = /\d+(\.\d+)?/;
//   const matches = price.match(re);

//   if (!matches) {
//     const err: ErrorObject = {
//       log: 'From playwrightController.getPrice. Element text has no price',
//       status: 500,
//     };
//     return err;
//   }

//   return matches[0];
// }

export default router;
