import refreshController from '@/controllers/refreshController';
import express, { Request, Response } from 'express';
const router = express.Router();

router.get(
  '/',
  refreshController.getUrlsandSelectors,
  refreshController.getPriceUsingFetch,
  refreshController.getPriceUsingPlaywright,
  refreshController.checkTargetPrice,
  refreshController.updateDatabase,
  (_req: Request, res: Response) => {
    res.end();
  }
);

export default router;
