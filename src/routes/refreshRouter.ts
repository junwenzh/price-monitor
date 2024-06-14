import express, { Request, Response } from 'express';
import refreshController from '@/controllers/refreshController';
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
);

export default router;
