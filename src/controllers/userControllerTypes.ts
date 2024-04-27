import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  username?: string;
  email?: string;
}

export type UserCredentials = {
  username?: string;
  email?: string;
  password?: string;
};
