import { CookieOptions } from 'express';

export function getCrossOriginCookieOptions(
  expiration: number,
  dev: boolean = false
): CookieOptions {
  return {
    sameSite: 'none',
    secure: dev ? false : true,
    maxAge: expiration * 1000,
  };
}
