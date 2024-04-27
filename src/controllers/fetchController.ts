import urldb from '@/database/urldb';
import { ErrorObject } from '@/server';
import { NextFunction, Request, Response } from 'express';
import jsdom from 'jsdom';
/*  Types of errors
1. Fail to fetch
- 
2. Successful fetch but failed status
3. Successful fetch but element not found
4. Element found but fail to extract price
*/

class FetchController {
  //convert fetchPrice to method and integrate into refreshcontroller
  async fetchPrice(req: Request, res: Response, next: NextFunction) {
    const url = res.locals.url as string;
    const selector = res.locals.selector as string;

    if (!url || !selector) {
      const err: ErrorObject = {
        log: 'From FetchController, fetchPrice',
        status: 400,
        message: 'Missing url or selector',
      };
      return next(err);
    }

    const price = getPriceFromSelector(url, selector);

    if (price === 'Connection error') {
      return next({ message: 'Connection error' });
    } else if (price === 'Element not found') {
      // redirect to playwright
    } else {
      res.locals.price = price;
      return next();
    }
  }

  async updateUseFetch(req: Request, res: Response, next: NextFunction) {
    const url = res.locals.url as string;
    const useFetch = (res.locals.useFetch as boolean) || false;

    if (!url) {
      const err: ErrorObject = {
        log: 'From FetchController, updateUseFetch',
        status: 400,
        message: 'Missing url',
      };
      return next(err);
    }

    const result = urldb.updateUseFetch(url, useFetch);

    if ('error' in result) {
      const err: ErrorObject = {
        log: 'From fetchController, updateUseFetch. Error updating database',
        status: 500,
        message: 'Server error accessing database',
      };

      return next(err);
    }

    return next();
  }
}

type Price = string | 'Connection error' | 'Element not found';

async function getPriceFromSelector(url: string, selector: string): Price {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return 'Connection error';
    }

    const { JSDOM } = jsdom;
    const html = await response.text();

    const dom = new JSDOM(html);
    const element = dom.window.document.querySelector(selector);

    if (element?.textContent) {
      const price = getPriceFromText(element.textContent);
      if (price !== 'No match') {
        return price;
      }
    }

    return 'Element not found';
  } catch (error) {
    console.error(error);
    return 'Connection error';
  }
}

function getPriceFromText(text: string): string {
  const regex = /^\$?\d+(?:\.\d{1,2})?$/;
  const match = text.match(regex);

  if (!match) {
    return 'No match';
  }

  const price = match[0];
  return price;
}

export default new FetchController();
