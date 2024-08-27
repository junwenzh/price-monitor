import { userController } from '@/controllers/userController';
import { AuthenticatedRequest } from '@/controllers/userControllerTypes';
import express, { Response } from 'express';

const router = express.Router();

router.post(
  '/register',
  userController.createUser,
  userController.createJWT,
  (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
      message: 'Successfully created user',
      username: req.username,
      email: req.email,
    });
  }
);

router.post(
  '/login',
  userController.authenticateUser,
  userController.createJWT,
  (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
      message: 'Successfully logged in',
      username: req.username,
      email: req.email,
    });
  }
);

export default router;
