import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
//import { db, DB } from '@/database/db';
import { userDb } from '@/database/userdb';
import { getCrossOriginCookieOptions } from '@/utils/setCookie';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface AuthenticatedRequest extends Request {
  username?: string;
}

type UserCredentials = {
  username?: string;
  email?: string;
  password?: string;
};

type User = {
  username?: string;
  email?: string;
  password?: string;
};

const userController = {
  async createUser(req: Request, res: Response, next: NextFunction) {
    const { username, email, password }: User = req.body;

    if (!username || !email || !password) {
      return next({
        log: 'From userController.createUser. Missing username, email or password',
        status: 400,
        message: 'Username, email or password not provided',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    // error handling is built into the method
    const result = await userDb.createUser(username, hashedPassword, email);

    if ('code' in result) {
      return next({
        log: `From userController.createUser. ${result.message}`,
        status: 500,
        message: result.message,
      });
    }

    res.cookie('username', username);

    return next();
  },

  async updateUser(req: Request, res: Response, next: NextFunction) {
    const { username, password, email }: User = req.body;

    if (!username) {
      return next({
        log: 'From userController.updateUser. Missing username',
        status: 400,
        message: 'Username not provided.',
      });
    }

    const result = await userDb.updateUser(username, password, email);

    if ('code' in result) {
      return next({
        log: `From userController.updateUser. ${result.message}`,
        status: 500,
        message: result.message,
      });
    }

    return next();
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const username = req.params.username;

    if (!username) {
      return next({
        log: 'From userController.delete. Missing username',
        status: 400,
        message: 'Username not provided.',
      });
    }

    const result = await userDb.deleteUser(username);

    if (result.code === 200) {
      return next();
    } else {
      return next({
        log: `From userController.delete. ${result.message}`,
        status: 500,
        message: result.message,
      });
    }
  },

  async authenticateUser(req: Request, res: Response, next: NextFunction) {
    const { username, password }: UserCredentials = req.body;

    if (!username || !password) {
      return next({
        log: 'From userController.authenticateUser. Missing username or password',
        status: '400',
        message: 'Username or password not provided',
      });
    }

    const result = await userDb.getUser(username);

    if ('code' in result) {
      return next({
        log: `From userController.authenticateUser. ${result.message}`,
        status: 500,
        message: result.message,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, result.password);

    if (!isPasswordValid) {
      return next({
        log: 'From userController.authenticateUser. Invalid password',
        status: 400,
        message: 'Incorrect password provided',
      });
    }

    req.body.username = result.username;
    res.cookie('username', username);

    return next();
  },

  async createJWT(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username as string;

    if (!username) {
      return next({
        log: 'From userController.createJWT. No username from request body',
        status: 404,
        message: 'No username provided',
      });
    }

    try {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });
      const cookieOptions = getCrossOriginCookieOptions(
        60 * 60,
        process.env.NODE_ENV === 'development' ? true : false
      );
      res.cookie('token', token, cookieOptions);
      // res.json({ username, token });
      return next();
    } catch (error) {
      return next({
        log: `From userController.createJWT. ${error}`,
        status: '500',
        message: 'Failed to sign JWT',
      });
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
        log: 'From userController.authenticateJWT. No token provided.',
        status: 401,
        message: 'Authentication failed: No token provided',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {
        username: string;
      };
      req.username = decoded.username;
      next();
    } catch (error) {
      return next({
        log: 'From userController.authenticateJWT. Invalid token',
        status: 403,
        message: 'Authentication failed: Invalid token',
      });
    }
  },
};

export { userController };
