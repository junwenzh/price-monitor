import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
//import { db, DB } from '@/database/db';
import { userDb } from '@/database/userdb';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface AuthenticatedRequest extends Request {
  username?: string;
}

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
      const token = jwt.sign({ username: user.username }, JWT_SECRET, {
        expiresIn: '1h',
      });
      res.json({ token, username: user.username, email: user.email });
    } catch (error) {
      next(error);
    }
  },

  async authenticateJWT(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    const token = req.cookies.token;

    if (!token) {
      return next({
        status: 401,
        message: 'Authentication failed: No token provided',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {
        username: string;
      };
      req.username = decoded.username;
      console.log(decoded);
      next();
    } catch (error) {
      return next({
        status: 403,
        message: 'Authentication failed: Invalid token',
      });
    }
  },
};

export { userController };

///check user here
//    const userExists = await query('select * from users where email = ${email}', [email])
//if (userExists.rows) {
