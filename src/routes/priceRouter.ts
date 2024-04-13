import express from 'express';
import { priceController } from '@/controllers/priceController';
const router = express.Router();
router.post(
  'confirmed',
  priceController.saveUrl,
  priceController.saveBaseUrl,
  priceController.savePrice,
  (req, res) => {
    res.json({ message: 'sent successfully' });
  }
);
