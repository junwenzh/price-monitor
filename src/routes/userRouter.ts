import { userController } from '@/controllers/userController';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post(
  '/register',
  userController.createUser,
  userController.createJWT,
  (req: Request, res: Response) => {
    res.status(200).json({
      message: 'Successfully created user',
    });
  }
);

router.put('/users/:username', userController.updateUserInfo);

router.post(
  '/login',
  userController.authenticateUser,
  userController.createJWT,
  (req: Request, res: Response) => {
    res.status(200).json({
      message: 'Successfully logged in',
    });
  }
);

export default router;
