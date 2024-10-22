import { userController } from '@/controllers/userController';
import { AuthenticatedRequest } from '@/controllers/userControllerTypes';
import express, { Response } from 'express';

const router = express.Router();

router.get(
  '/:username',
  userController.getUser,
  (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
      message: 'Successfully retrieved user',
      username: res.locals.username,
      email: res.locals.email,
    });
  }
);

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

router.put(
  '/',
  userController.updateUser,
  (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
      message: 'Successfully updated user',
    });
  }
);

export default router;
