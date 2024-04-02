import express from 'express';
import { userController } from '@/controllers/userController';

const router = express.Router();

router.post('/register', userController.createUser);

router.put('/users/:username', userController.updateUserInfo);

router.post('/login', userController.authenticateUser);

export default router;
