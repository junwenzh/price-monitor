import { priceController } from '@/controllers/priceController';
import express, { Request, Response } from 'express';
const router = express.Router();

// router.post(
//   ':/username',
//   priceController.getUserInfo,
//   (req: Request, res: Response) =

// )
router.post(
  '/confirmed',
  //priceController.saveBaseUrl,
  priceController.newTrackedItem,
  (req: Request, res: Response) => {
    res.json({ message: 'sent successfully' });
  }
);
export default router;
