import express, { Request, Response } from 'express';
import refreshController from '@/controllers/refreshController';
const router = express.Router();

router.get(
  '/',
  refreshController.getUrlsandSelectors,
  async (req: Request, res: Response) => {
    // query database for urls > [{url, selectors}]
    // iterate through the array
    // for each url
    // call fetch('/api/scrape/getprice') > price
    // query database (user_products) for users that are tracking this
    // for each user
    // send email with SES
    console.log(res.locals.urls);
    res.end();
  }
);

export default router;
