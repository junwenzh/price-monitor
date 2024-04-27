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

const userController = {
  async createUser(req: Request, res: Response, next: NextFunction) {
    const { username, email, password }: UserCredentials = req.body;

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

    if (result.error) {
      return next({
        log: `From userController.createUser. ${result.error}`,
        status: 500,
        message: 'Server error',
      });
    }

    res.cookie('username', username);

    return next();
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
    const { username, password }: UserCredentials = req.body;

    if (!username || !password) {
      return next({
        log: 'From userController.authenticateUser. Missing username or password',
        status: '400',
        message: 'Username or password not provided',
      });
    }

    const user = await userDb.getUser(username);

    if (user.error) {
      return next({
        log: `From userController.authenticateUser. ${user.error}`,
        status: 500,
        message: 'Error authenticating user',
      });
    }

    if (!user.username) {
      return next({
        log: 'From userController.authenticateUser. Username not found in the database',
        status: 400,
        message: 'User does not exist',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      return next({
        log: 'From userController.authenticateUser. Invalid password',
        status: 400,
        message: 'Incorrect password provided',
      });
    }

    req.body.username = user.username;
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
      return next({
        log: 'From userController.authenticateJWT. Invalid token',
        status: 403,
        message: 'Authentication failed: Invalid token',
      });
    }
  },
};

export { userController };

// async authenticateUser(req: Request, res: Response, next: NextFunction) {
//   const { username, password }: UserCredentials = req.body;

//   if (!username || !password) {
//     return next({
//       log: 'From userController.authenticateUser. Missing username or password',
//       status: '400',
//       message: 'Username or password not provided',
//     });
//   }

//   const user = await userDb.getUser(username);

//   if (user.error) {
//     return next({
//       log: `From userController.authenticateUser. ${user.error}`,
//       status: 500,
//       message: 'Error authenticating user',
//     });
//   }

//   if (!user.username) {
//     return next({
//       log: 'From userController.authenticateUser. Username not found in the database',
//       status: 400,
//       message: 'User does not exist',
//     });
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password!);

//   if (!isPasswordValid) {
//     return next({
//       log: 'From userController.authenticateUser. Invalid password',
//       status: 400,
//       message: 'Incorrect password provided',
//     });
//   }

//   return next();
// },
