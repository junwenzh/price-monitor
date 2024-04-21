import { priceController } from '@/controllers/priceController';
import express, { Request, Response } from 'express';
const router = express.Router();

router.get(
  '/:username',
  priceController.getProducts,
  (req: Request, res: Response) => {
    res.json({ message: 'Items loaded successfully', data: res.locals.data });
  }
);

router.post(
  '/confirmed',
  priceController.saveBaseUrl,
  priceController.newTrackedItem,
  (req: Request, res: Response) => {
    res.json({ message: 'sent successfully' });
  }
);
export default router;
