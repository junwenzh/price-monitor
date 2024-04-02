import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
//import { db, DB } from '@/database/db';
import { userDb } from '@/database/userdb';

const JWT_SECRET = process.env.JWT_SECRET as string;

const userController = {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
      const result = await userDb.createUser(username, hashedPassword, email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      const { newPassword, newEmail } = req.body;
      const result = await userDb.updateUser(username, newPassword, newEmail);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async authenticateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const user = await userDb.getUser(username);
      if (user.error) {
        throw new Error('Database connection failed');
      }
      if (!user.username) {
        throw new Error('User not found');
      }
      if (user.password) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }
      }
      const token = jwt.sign({ username: user.username }, JWT_SECRET);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  },
};

export { userController };

///check user here
//    const userExists = await query('select * from users where email = ${email}', [email])
//if (userExists.rows) {
